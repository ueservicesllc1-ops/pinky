import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function VelaModeloSimple() {
  const velaRef = useRef<THREE.Group>(null);
  const mechaRef = useRef<THREE.Mesh>(null);

  // Animación sutil de la mecha
  useFrame((state) => {
    if (mechaRef.current) {
      mechaRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={velaRef} position={[0, -1, 0]}>
      {/* Cuerpo principal de la vela */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.9, 2.5, 32]} />
        <meshStandardMaterial 
          color="#f4e4bc"
          roughness={0.7}
          metalness={0.1}
          normalScale={[0.3, 0.3]}
        />
      </mesh>

      {/* Base de la vela */}
      <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.0, 0.1, 32]} />
        <meshStandardMaterial 
          color="#e6d7a3"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Parte superior (donde va la mecha) */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.8, 0.05, 32]} />
        <meshStandardMaterial 
          color="#f0e6c7"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Mecha */}
      <mesh ref={mechaRef} position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
        <meshStandardMaterial 
          color="#2d1810"
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>

      {/* Llama de la vela */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color="#ff6b35"
          emissive="#ff4500"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Brillo de la llama */}
      <pointLight 
        position={[0, 1.6, 0]} 
        color="#ff6b35" 
        intensity={0.5} 
        distance={3}
        decay={2}
      />

      {/* Textura de cera derretida */}
      <mesh position={[0.3, 0.8, 0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color="#f0e6c7"
          roughness={0.9}
          metalness={0.0}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh position={[-0.2, 0.9, -0.4]} castShadow receiveShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#f0e6c7"
          roughness={0.9}
          metalness={0.0}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
