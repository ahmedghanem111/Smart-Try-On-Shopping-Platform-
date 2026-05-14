'use client';

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import {
  computeGlassesTransform,
  computeShirtTransform,
} from '@/lib/landmarkUtils';

const FLASK_BASE        = 'http://localhost:5001';
const FRAME_INTERVAL_MS = 66;
const CAPTURE_QUALITY   = 0.7;

// ─── GlassesModel ─────────────────────────────────────────────────────────────
//
// Key design decisions:
//
// 1. naturalScale: computed once from the GLB bounding box.
//    Makes the model exactly 1 world unit wide regardless of export scale.
//    Then we multiply by the detected hinge-to-hinge distance to fit the face.
//
// 2. Bounding box center offset: the GLB's geometric center may not be at
//    the nose bridge. We compute the center of the bounding box and subtract
//    it from the position so the model's visual center aligns with the anchor.
//
// 3. group.visible controlled in useFrame — never unmount/remount the model.

function GlassesModel({ url, landmarkRef }) {
  const { scene }      = useGLTF(url);
  const groupRef       = useRef();
  const cloneRef       = useRef(null);
  const naturalScale   = useRef(null);   // 1 / modelWidth
  const centerOffset   = useRef({ x: 0, y: 0 });  // GLB center offset

  useEffect(() => {
    const clone = scene.clone();
    cloneRef.current = clone;

    // Compute bounding box to normalize the model size and center
    const box    = new Box3().setFromObject(clone);
    const size   = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Use the widest horizontal dimension as the reference width.
    // Most glasses GLBs are wider along X, but some are along Z.
    const modelWidth = Math.max(size.x, size.z, 0.001);
    naturalScale.current = 1 / modelWidth;

    // Store the center offset so we can subtract it from position.
    // This corrects for GLBs whose geometric center isn't at the nose bridge.
    centerOffset.current = { x: center.x, y: center.y };

    if (groupRef.current) groupRef.current.visible = false;

    return () => {
      clone.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      cloneRef.current   = null;
      naturalScale.current = null;
    };
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (!landmarkRef.current || naturalScale.current === null) {
      groupRef.current.visible = false;
      return;
    }

    const { position, scale, rotationZ, rotationY } = landmarkRef.current;

    if (!isFinite(position.x) || !isFinite(position.y) || !isFinite(scale)) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    // Apply position — the anchor is already the blended eye+nose_bridge point.
    // Subtract the model's own center offset (scaled) so the GLB center
    // aligns with the anchor rather than the GLB origin.
    const finalScale = naturalScale.current * scale;
    groupRef.current.position.set(
      position.x - centerOffset.current.x * finalScale,
      position.y - centerOffset.current.y * finalScale,
      0.05,  // slight Z push toward camera so model renders in front of video
    );

    groupRef.current.scale.setScalar(finalScale);

    // rotationY = head turn (Z depth), rotationZ = head tilt (face edge angle)
    groupRef.current.rotation.set(0, rotationY ?? 0, rotationZ ?? 0);
  });

  return (
    <group ref={groupRef}>
      {cloneRef.current && <primitive object={cloneRef.current} />}
    </group>
  );
}

// ─── ShirtModel ───────────────────────────────────────────────────────────────

function ShirtModel({ url, landmarkRef }) {
  const { scene }  = useGLTF(url);
  const groupRef   = useRef();
  const cloneRef   = useRef(null);

  useEffect(() => {
    const clone = scene.clone();
    cloneRef.current = clone;
    if (groupRef.current) groupRef.current.visible = false;
    return () => {
      clone.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      cloneRef.current = null;
    };
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;
    if (!landmarkRef.current) { groupRef.current.visible = false; return; }

    const { position, scaleX, scaleY, rotation } = landmarkRef.current;
    if (!isFinite(position.x) || !isFinite(scaleX)) { groupRef.current.visible = false; return; }

    groupRef.current.visible = true;
    groupRef.current.position.set(position.x, position.y - scaleY * 0.3, 0);
    groupRef.current.scale.set(scaleX * 1.1, scaleY * 1.1, scaleX * 1.1);
    groupRef.current.rotation.set(0, 0, rotation);
  });

  return (
    <group ref={groupRef}>
      {cloneRef.current && <primitive object={cloneRef.current} />}
    </group>
  );
}

// ─── ContextLostHandler ───────────────────────────────────────────────────────

function ContextLostHandler() {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const onLost      = () => console.warn('[TryOnCamera] WebGL context lost');
    const onRestored  = () => console.info('[TryOnCamera] WebGL context restored');
    canvas.addEventListener('webglcontextlost',      onLost);
    canvas.addEventListener('webglcontextrestored',  onRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost',     onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [gl]);
  return null;
}

// ─── TryOnCamera ─────────────────────────────────────────────────────────────

export default function TryOnCamera({ glbModel, category, onClose }) {
  const videoRef        = useRef(null);
  const captureCanvas   = useRef(null);
  const threeCanvasRef  = useRef(null);   // ref to the Three.js canvas DOM element
  const intervalRef     = useRef(null);
  const landmarkRef     = useRef(null);
  const isSending       = useRef(false);

  const [aiStatus,  setAiStatus]  = useState('checking');
  const [camStatus, setCamStatus] = useState('starting');
  const [detected,  setDetected]  = useState(false);
  const [fps,       setFps]       = useState(0);

  const isGlasses = category === 'Accessories';
  const endpoint  = isGlasses
    ? `${FLASK_BASE}/try-on/glasses/landmarks`
    : `${FLASK_BASE}/try-on/shirt/landmarks`;

  // ── Health check ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch(`${FLASK_BASE}/health`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setAiStatus(d.status === 'ok' ? 'ready' : 'error'); })
      .catch(() => { if (!cancelled) setAiStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  // ── Open webcam ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (aiStatus !== 'ready') return;
    let stream = null;

    navigator.mediaDevices
      .getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          return videoRef.current.play();
        }
      })
      .then(() => setCamStatus('active'))
      .catch(err => { console.error('Camera error:', err); setCamStatus('error'); });

    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [aiStatus]);

  // ── Frame loop ──────────────────────────────────────────────────────────────
  const sendFrame = useCallback(async () => {
    if (isSending.current) return;

    const video  = videoRef.current;
    const canvas = captureCanvas.current;
    if (!video || !canvas || video.readyState < 2) return;

    const ctx = canvas.getContext('2d');
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;

    // ── Mirror the frame before sending to Flask ──────────────────────────
    // The <video> is CSS-mirrored (scaleX(-1)) so the user sees a mirror image.
    // We mirror the capture canvas the same way so Flask detects landmarks
    // in the same coordinate space the user sees.
    // Without this, landmark X coords are flipped relative to the video display.
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const frameB64 = canvas.toDataURL('image/jpeg', CAPTURE_QUALITY);

    // ── Get Three.js canvas dimensions for world-space mapping ────────────
    // landmarkUtils needs the SCREEN canvas size (not the capture canvas size)
    // because the Three.js camera frustum is based on the screen aspect ratio.
    const threeCanvas = threeCanvasRef.current;
    const screenW = threeCanvas?.clientWidth  || window.innerWidth;
    const screenH = threeCanvas?.clientHeight || window.innerHeight;

    isSending.current = true;
    try {
      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ frame: frameB64 }),
      });
      if (!res.ok) return;

      const data = await res.json();
      if (!data.success) return;

      setDetected(data.detected);
      if (data.fps) setFps(data.fps);

      if (data.detected && data.landmarks) {
        if (isGlasses) {
          landmarkRef.current = computeGlassesTransform(
            data.landmarks,
            data.frame_width,
            data.frame_height,
            screenW,
            screenH,
          );
        } else {
          landmarkRef.current = computeShirtTransform(
            data.measurements,
            data.frame_width,
            data.frame_height,
            screenW,
            screenH,
          );
        }
      }
    } catch (err) {
      console.warn('Flask request failed:', err.message);
    } finally {
      isSending.current = false;
    }
  }, [endpoint, isGlasses]);

  useEffect(() => {
    if (camStatus !== 'active') return;
    intervalRef.current = setInterval(sendFrame, FRAME_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [camStatus, sendFrame]);

  // ── Reset Flask smoothers on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => { fetch(`${FLASK_BASE}/try-on/reset`, { method: 'POST' }).catch(() => {}); };
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm tracking-wide">Live Try-On</span>

          <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
            aiStatus === 'ready' ? 'bg-emerald-500/20 text-emerald-400' :
            aiStatus === 'error' ? 'bg-red-500/20 text-red-400' :
                                   'bg-yellow-500/20 text-yellow-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              aiStatus === 'ready' ? 'bg-emerald-400 animate-pulse' :
              aiStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
            }`} />
            {aiStatus === 'ready' ? 'AI Ready' : aiStatus === 'error' ? 'AI Offline' : 'Connecting...'}
          </span>

          {camStatus === 'active' && (
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
              detected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${detected ? 'bg-blue-400 animate-pulse' : 'bg-white/30'}`} />
              {detected ? (isGlasses ? 'Face detected' : 'Body detected') : 'No detection'}
            </span>
          )}

          {fps > 0 && <span className="text-xs text-white/30 font-mono">{fps} fps</span>}
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close try-on"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Camera + overlay */}
      <div className="relative flex-1 overflow-hidden">

        {aiStatus === 'checking' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Connecting to AI service...</p>
          </div>
        )}

        {aiStatus === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <p className="text-white font-medium text-sm">AI Service Unavailable</p>
            <p className="text-white/40 text-xs">Make sure the Flask server is running on port 5001</p>
            <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">Close</button>
          </div>
        )}

        {camStatus === 'error' && aiStatus === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <p className="text-white font-medium text-sm">Camera Access Denied</p>
            <p className="text-white/40 text-xs">Please allow camera access and try again</p>
            <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">Close</button>
          </div>
        )}

        {camStatus === 'starting' && aiStatus === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Starting camera...</p>
          </div>
        )}

        {/* Live video — CSS-mirrored so user sees a mirror image */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
          playsInline
          muted
          autoPlay
        />

        {/* Hidden canvas — used only for frame capture */}
        <canvas ref={captureCanvas} className="hidden" />

        {/*
          Three.js Canvas — mounted once, never conditionally unmounted.
          Unmounting/remounting creates new WebGL contexts → context loss.
          Model visibility is controlled inside useFrame via group.visible.
        */}
        {glbModel && (
          <Canvas
            ref={threeCanvasRef}
            className="absolute inset-0"
            style={{ background: 'transparent' }}
            gl={{
              alpha:            true,
              antialias:        true,
              powerPreference:  'high-performance',
              preserveDrawingBuffer: false,
            }}
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={[1, 1.5]}
          >
            <ContextLostHandler />
            <ambientLight intensity={1.2} />
            <directionalLight position={[0, 2, 3]} intensity={0.8} />

            <Suspense fallback={null}>
              {isGlasses
                ? <GlassesModel url={glbModel} landmarkRef={landmarkRef} />
                : <ShirtModel   url={glbModel} landmarkRef={landmarkRef} />
              }
            </Suspense>
          </Canvas>
        )}

        {camStatus === 'active' && !detected && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
              <p className="text-white/70 text-xs text-center">
                {isGlasses ? 'Point your face at the camera' : 'Step back so your upper body is visible'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
