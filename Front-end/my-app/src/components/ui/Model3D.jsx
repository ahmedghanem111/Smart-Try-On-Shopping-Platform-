'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { Suspense, useMemo, useState } from 'react';

function Model({ url, onLoaded }) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => {
    onLoaded?.();
    return scene.clone();
  }, [scene]);
  return <primitive object={clonedScene} />;
}

export default function Model3D({ modelPath, className = '' }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-slate-800 dark:border-t-white animate-spin" />
          </div>
          <span className="text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500">
            Loading model
          </span>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Stage
            environment="studio"
            intensity={0.5}
            adjustCamera={1.2}
            shadows={false}
          >
            <Model url={modelPath} onLoaded={() => setLoaded(true)} />
          </Stage>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={0.5}
            maxDistance={10}
            autoRotate={true}
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
