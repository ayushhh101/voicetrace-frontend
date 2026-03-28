import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSphere = ({ status, volume = 0 }) => {
  const points = useRef();
  const count = 4000; // Optimal for performance and density

  // Generate initial spherical coordinates
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      pos[i * 3] = 1.5 * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = 1.5 * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = 1.5 * Math.cos(phi);
    }
    return [pos, new Float32Array(pos)];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const posAttr = points.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Base coordinates
      const x = initialPositions[ix];
      const y = initialPositions[iy];
      const z = initialPositions[iz];

      if (status === 'recording') {
        // PER-PARTICLE JITTER: Each dot moves based on its position + volume
        const noise = Math.sin(x * 2 + time * 5) * Math.cos(y * 2 + time * 5) * 0.1;
        const pulse = 1 + (volume * 0.5) + noise;
        
        posAttr.array[ix] = x * pulse;
        posAttr.array[iy] = y * pulse;
        posAttr.array[iz] = z * pulse;
      } else if (status === 'processing') {
        // SWIRL ANIMATION: Sphere "spins" into a vortex while thinking
        const angle = time * 2;
        const s = Math.sin(angle + x) * 0.1;
        posAttr.array[ix] = x * (1 + s);
        posAttr.array[iy] = y * (1 + s);
        posAttr.array[iz] = z * (1 + s);
      } else {
        // IDLE: Subtle breathing effect
        const breath = 1 + Math.sin(time * 1.5) * 0.03;
        posAttr.array[ix] = x * breath;
        posAttr.array[iy] = y * breath;
        posAttr.array[iz] = z * breath;
      }
    }

    posAttr.needsUpdate = true;
    points.current.rotation.y += 0.002;
  });

  // Dynamic colors based on status
  const sphereColor = useMemo(() => {
    if (status === 'recording') return new THREE.Color('#ffffff'); // White dots for Siri-look
    if (status === 'processing') return new THREE.Color('#6366f1'); // Indigo/Blue for thinking
    return new THREE.Color('#444444'); // Dimmed for idle
  }, [status]);

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={sphereColor}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending} // Makes dots "glow" when overlapping
      />
    </points>
  );
};

const VoiceVisualizer = ({ status }) => {
  // Mock volume logic: in a real app, pass actual mic stream frequency here
  const [volume, setVolume] = React.useState(0);

  React.useEffect(() => {
    if (status === 'recording') {
      const interval = setInterval(() => setVolume(Math.random() * 0.3), 100);
      return () => clearInterval(interval);
    } else {
      setVolume(0);
    }
  }, [status]);

  return (
    <div className="w-full h-96 flex justify-center items-center overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ParticleSphere status={status} volume={volume} />
      </Canvas>
    </div>
  );
};

export default VoiceVisualizer;