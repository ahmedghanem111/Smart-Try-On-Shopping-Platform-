// 'use client';

// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
// import { Suspense } from 'react';

// function Model({ url }) {
//   const { scene } = useGLTF(url);
//   return <primitive object={scene} />;
// }

// function Loader() {
//   return (
//     <mesh>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color="#888" wireframe />
//     </mesh>
//   );
// }

// export default function Model3D({ modelPath, className = '' }) {
//   return (
//     <div className={`w-full h-64 ${className}`}>
//       <Canvas
//         camera={{ position: [0, 0, 5], fov: 50 }}
//         style={{ background: 'transparent' }}
//       >
//         <Suspense fallback={<Loader />}>
//           <Stage environment="city" intensity={0.6}>
//             <Model url={modelPath} />
//           </Stage>
//           <OrbitControls
//             enableZoom={true}
//             enablePan={false}
//             minDistance={2}
//             maxDistance={10}
//             autoRotate
//             autoRotateSpeed={2}
//           />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }
