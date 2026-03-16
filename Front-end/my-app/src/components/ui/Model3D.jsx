'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone();
  return <primitive object={clonedScene} />;
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#94a3b8" wireframe />
    </mesh>
  );
}

export default function Model3D({ modelPath, className = '' }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <Suspense fallback={<Loader />}>
          <Stage
            environment="studio"
            intensity={0.5}
            adjustCamera={1.2}
            shadows={false}
          >
            <Model url={modelPath} />
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
