'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { Suspense, useMemo, useState, useEffect } from 'react';

function Model({ url, onLoaded, color }) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    onLoaded?.();
    return scene.clone();
  }, [scene, onLoaded]);

  useEffect(() => {
    if (color === null) {
      clonedScene.traverse((child) => {
        if (child.isMesh && child.material) {
          const restore = (mat) => {
            if (mat?.color && mat?.userData?.originalColor) {
              mat.color.copy(mat.userData.originalColor);
            }
          };

          if (Array.isArray(child.material)) {
            child.material.forEach(restore);
          } else {
            restore(child.material);
          }
        }
      });
      return;
    }

    // أول مرة نحفظ اللون الأصلي
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        const apply = (mat) => {
          if (!mat.userData.originalColor) {
            mat.userData.originalColor = mat.color.clone();
          }
          mat.color.set(color);
        };

        if (Array.isArray(child.material)) {
          child.material.forEach(apply);
        } else {
          apply(child.material);
        }
      }
    });
  }, [color, clonedScene]);

  return <primitive object={clonedScene} />;
}

export default function Model3D({ modelPath, color = null, className = '' }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [modelPath]);

  return (
    <div className={`relative w-full h-full ${className}`}>

      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-t-black rounded-full animate-spin" />
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="studio" intensity={0.5}>
            <Model
              key={modelPath}
              url={modelPath}
              color={color}
              onLoaded={() => setLoaded(true)}
            />
          </Stage>

          <OrbitControls enableZoom enablePan={false} autoRotate />
        </Suspense>
      </Canvas>
    </div>
  );
}