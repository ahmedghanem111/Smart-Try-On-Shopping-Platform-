'use client';

/**
 * TryOnCamera.jsx
 *
 * Real-time 3D try-on component.
 *
 * How it works:
 *   1. Opens the user's webcam via getUserMedia
 *   2. Every ~66ms (≈15fps) captures a frame from the video element
 *      by drawing it onto a hidden <canvas> and calling toDataURL
 *   3. POSTs the base64 frame to the Flask AI service (localhost:5001)
 *      - category === 'Accessories' → /try-on/glasses/landmarks
 *      - category === 'Clothes'     → /try-on/shirt/landmarks
 *   4. Flask returns landmark pixel coordinates (already smoothed)
 *   5. We convert those pixel coords to Three.js world-space using landmarkUtils
 *   6. A Three.js <Canvas> sits absolutely on top of the live video feed
 *      with a transparent background — no orbit controls, no Stage, no auto-rotate
 *   7. The GLB model (from Cloudinary via product.glbModel) is positioned,
 *      scaled, and rotated every frame using the landmark data
 *   8. On close → calls POST /try-on/reset to clear Flask smoother buffers
 *
 * Props:
 *   glbModel   {string}   Cloudinary URL of the .glb model file
 *   category   {string}   Product category — 'Accessories' or 'Clothes'
 *   onClose    {function} Called when the user closes the camera view
 */

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  computeGlassesTransform,
  computeShirtTransform,
} from '@/lib/landmarkUtils';

// ─── Constants ────────────────────────────────────────────────────────────────

const FLASK_BASE = 'http://localhost:5001';

// How often to send a frame to Flask (milliseconds).
// 66ms ≈ 15fps — fast enough for smooth tracking, light enough on the CPU.
const FRAME_INTERVAL_MS = 66;

// JPEG quality for the frame sent to Flask.
// 0.7 = good enough for landmark detection, small enough to send quickly.
const CAPTURE_QUALITY = 0.7;

// ─── GLB Model component (rendered inside the Three.js Canvas) ────────────────

/**
 * GlassesModel
 *
 * Renders the GLB and updates its transform every frame using the latest
 * landmark data stored in the landmarkRef.
 *
 * Why a ref instead of state?
 *   State updates trigger React re-renders. At 15fps that would cause
 *   constant re-renders of the whole component tree. A ref lets us update
 *   the Three.js object directly inside useFrame without touching React state.
 *
 * @param {string}  url          Cloudinary URL of the .glb file
 * @param {object}  landmarkRef  React ref holding the latest { position, scale, rotation }
 */
function GlassesModel({ url, landmarkRef }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  // Clone the scene once so we don't mutate the cached original
  const clonedScene = useRef(scene.clone());

  useFrame(() => {
    if (!groupRef.current || !landmarkRef.current) return;

    const { position, scale, rotation } = landmarkRef.current;

    // Position: nose bridge in world space
    groupRef.current.position.set(position.x, position.y, 0);

    // Scale: face-edge-to-face-edge distance drives the X scale.
    // We use the same value for Y to keep the model's aspect ratio.
    // Tune the multiplier if the glasses look too big or too small.
    groupRef.current.scale.setScalar(scale * 0.9);

    // Rotation: Z axis only — head tilt
    groupRef.current.rotation.set(0, 0, rotation);
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene.current} />
    </group>
  );
}

/**
 * ShirtModel
 *
 * Same pattern as GlassesModel but uses shoulder_mid as position anchor
 * and scales independently on X (shoulder width) and Y (torso height).
 *
 * @param {string}  url          Cloudinary URL of the .glb file
 * @param {object}  landmarkRef  React ref holding { position, scaleX, scaleY, rotation }
 */
function ShirtModel({ url, landmarkRef }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  const clonedScene = useRef(scene.clone());

  useFrame(() => {
    if (!groupRef.current || !landmarkRef.current) return;

    const { position, scaleX, scaleY, rotation } = landmarkRef.current;

    // Center on shoulder midpoint, shifted down slightly so the collar
    // sits at the shoulders rather than the model center being at the shoulders.
    groupRef.current.position.set(position.x, position.y - scaleY * 0.3, 0);

    // Scale X by shoulder width, Y by torso height.
    // The 1.1 multiplier gives a little extra room so the shirt doesn't look tight.
    groupRef.current.scale.set(scaleX * 1.1, scaleY * 1.1, scaleX * 1.1);

    // Z rotation for body tilt
    groupRef.current.rotation.set(0, 0, rotation);
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene.current} />
    </group>
  );
}

// ─── Main TryOnCamera component ───────────────────────────────────────────────

export default function TryOnCamera({ glbModel, category, onClose }) {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const videoRef      = useRef(null);   // <video> element showing the webcam
  const captureCanvas = useRef(null);   // hidden <canvas> used to grab frames
  const intervalRef   = useRef(null);   // setInterval handle for the frame loop
  const landmarkRef   = useRef(null);   // latest transform data for the 3D model
  const isSending     = useRef(false);  // prevents overlapping Flask requests

  // ── State ─────────────────────────────────────────────────────────────────
  const [aiStatus, setAiStatus]     = useState('checking'); // 'checking' | 'ready' | 'error'
  const [camStatus, setCamStatus]   = useState('starting'); // 'starting' | 'active' | 'error'
  const [detected, setDetected]     = useState(false);      // is body/face currently detected?
  const [fps, setFps]               = useState(0);          // FPS reported by Flask

  // Determine which Flask endpoint and which 3D model component to use
  // based on the product category passed in as a prop.
  const isGlasses = category === 'Accessories';
  const endpoint  = isGlasses
    ? `${FLASK_BASE}/try-on/glasses/landmarks`
    : `${FLASK_BASE}/try-on/shirt/landmarks`;

  // ── Step 1: Check Flask health ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        const res = await fetch(`${FLASK_BASE}/health`);
        const data = await res.json();
        if (!cancelled) {
          setAiStatus(data.status === 'ok' ? 'ready' : 'error');
        }
      } catch {
        if (!cancelled) setAiStatus('error');
      }
    }

    checkHealth();
    return () => { cancelled = true; };
  }, []);

  // ── Step 2: Open webcam once Flask is confirmed ready ─────────────────────
  useEffect(() => {
    if (aiStatus !== 'ready') return;

    let stream = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCamStatus('active');
        }
      } catch (err) {
        console.error('Camera error:', err);
        setCamStatus('error');
      }
    }

    startCamera();

    // Cleanup: stop all tracks when component unmounts
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [aiStatus]);

  // ── Step 3: Frame capture loop ────────────────────────────────────────────
  // Starts once the camera is active. Captures a frame every FRAME_INTERVAL_MS,
  // sends it to Flask, and stores the returned landmark transform in landmarkRef.
  const sendFrame = useCallback(async () => {
    // Skip if a request is already in flight — prevents queue buildup
    if (isSending.current) return;

    const video  = videoRef.current;
    const canvas = captureCanvas.current;
    if (!video || !canvas || video.readyState < 2) return;

    // Draw the current video frame onto the hidden canvas
    const ctx = canvas.getContext('2d');
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;

    // Draw the raw video frame (no mirroring here).
    // The <video> element is CSS-mirrored (scaleX(-1)) for the user.
    // landmarkUtils.js negates x to align 3D model with the mirrored video.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frameB64 = canvas.toDataURL('image/jpeg', CAPTURE_QUALITY);

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
        // Convert Flask pixel coords → Three.js world-space transform
        if (isGlasses) {
          landmarkRef.current = computeGlassesTransform(
            data.landmarks,
            data.frame_width,
            data.frame_height,
            canvas.width,
            canvas.height,
          );
        } else {
          // Shirt endpoint returns both landmarks and measurements
          landmarkRef.current = computeShirtTransform(
            data.measurements,
            data.frame_width,
            data.frame_height,
            canvas.width,
            canvas.height,
          );
        }
      } else {
        // No detection — keep last known position so model doesn't snap away
        // (Flask smoother already handles this on its side, but just in case)
      }
    } catch (err) {
      // Network error — silently skip this frame
      console.warn('Flask request failed:', err.message);
    } finally {
      isSending.current = false;
    }
  }, [endpoint, isGlasses]);

  useEffect(() => {
    if (camStatus !== 'active') return;

    intervalRef.current = setInterval(sendFrame, FRAME_INTERVAL_MS);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [camStatus, sendFrame]);

  // ── Step 4: Reset Flask smoothers on unmount ──────────────────────────────
  useEffect(() => {
    return () => {
      // Fire-and-forget — we don't need to await this
      fetch(`${FLASK_BASE}/try-on/reset`, { method: 'POST' }).catch(() => {});
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm tracking-wide">
            Live Try-On
          </span>
          {/* AI status indicator */}
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
            aiStatus === 'ready'    ? 'bg-emerald-500/20 text-emerald-400' :
            aiStatus === 'error'    ? 'bg-red-500/20 text-red-400' :
                                      'bg-yellow-500/20 text-yellow-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              aiStatus === 'ready'  ? 'bg-emerald-400 animate-pulse' :
              aiStatus === 'error'  ? 'bg-red-400' :
                                      'bg-yellow-400 animate-pulse'
            }`} />
            {aiStatus === 'ready'   ? 'AI Ready' :
             aiStatus === 'error'   ? 'AI Offline' :
                                      'Connecting...'}
          </span>
          {/* Detection indicator — only shown when camera is active */}
          {camStatus === 'active' && (
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
              detected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                detected ? 'bg-blue-400 animate-pulse' : 'bg-white/30'
              }`} />
              {detected ? (isGlasses ? 'Face detected' : 'Body detected') : 'No detection'}
            </span>
          )}
          {/* FPS counter */}
          {fps > 0 && (
            <span className="text-xs text-white/30 font-mono">
              {fps} fps
            </span>
          )}
        </div>

        {/* Close button */}
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

      {/* ── Camera + 3D overlay area ── */}
      <div className="relative flex-1 overflow-hidden">

        {/* ── Status overlays (shown before camera is active) ── */}
        {aiStatus === 'checking' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Connecting to AI service...</p>
          </div>
        )}

        {aiStatus === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm">AI Service Unavailable</p>
              <p className="text-white/40 text-xs mt-1">Make sure the Flask server is running on port 5001</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {camStatus === 'error' && aiStatus === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm">Camera Access Denied</p>
              <p className="text-white/40 text-xs mt-1">Please allow camera access and try again</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {camStatus === 'starting' && aiStatus === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black z-20">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Starting camera...</p>
          </div>
        )}

        {/* ── Live video feed (bottom layer) ── */}
        {/* Mirror the video so it feels like a mirror to the user */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
          playsInline
          muted
          autoPlay
        />

        {/* ── Hidden canvas used only for frame capture (not visible) ── */}
        <canvas ref={captureCanvas} className="hidden" />

        {/* ── Three.js canvas (top layer, transparent background) ── */}
        {/* Only rendered once the camera is active and a GLB URL is provided */}
        {camStatus === 'active' && glbModel && (
          <Canvas
            className="absolute inset-0"
            style={{ background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={[1, 1.5]}
          >
            {/* Ambient light so the model is visible */}
            <ambientLight intensity={1.2} />
            {/* Directional light from slightly above-front to give depth */}
            <directionalLight position={[0, 2, 3]} intensity={0.8} />

            <Suspense fallback={null}>
              {isGlasses ? (
                <GlassesModel url={glbModel} landmarkRef={landmarkRef} />
              ) : (
                <ShirtModel url={glbModel} landmarkRef={landmarkRef} />
              )}
            </Suspense>
          </Canvas>
        )}

        {/* ── "Point your face/body at the camera" hint ── */}
        {camStatus === 'active' && !detected && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
              <p className="text-white/70 text-xs text-center">
                {isGlasses
                  ? 'Point your face at the camera'
                  : 'Step back so your upper body is visible'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}