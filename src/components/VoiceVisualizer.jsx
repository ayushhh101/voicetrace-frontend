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

            pos[i * 3] = 0.5 * Math.cos(theta) * Math.sin(phi);
            pos[i * 3 + 1] = 0.5 * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = 0.5 * Math.cos(phi);
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
                // We amplify the volume for the physical surge
                const micBoost = volume * 1.5;

                // Your original Jitter Math
                const noise = Math.sin(x * 2 + time * 5) * Math.cos(y * 2 + time * 5) * 0.1;

                // High-volume "Burst": If volume is high, we add a tiny bit extra surge
                const burst = volume > 0.5 ? volume * 0.2 : 0;

                const pulse = 1 + micBoost + noise + burst;

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
        if (status === 'recording') return new THREE.Color('#10B981'); // Green dots for recording
        if (status === 'processing') return new THREE.Color('#6366f1'); // Indigo/Blue for thinking
        return new THREE.Color('#70734f'); // Dimmed for idle
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
                // Grow the dots slightly when speaking (from 0.02 to 0.04 max)
                size={0.02 + (status === 'recording' ? volume * 0.03 : 0)}
                color={sphereColor}
                transparent
                // Make dots more solid/bright based on volume
                opacity={status === 'recording' ? 0.6 + (volume * 0.4) : 0.7}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// const VoiceVisualizer = ({ status }) => {
//   // Mock volume logic: in a real app, pass actual mic stream frequency here
//   const [volume, setVolume] = React.useState(0);

//   React.useEffect(() => {
//     if (status === 'recording') {
//       const interval = setInterval(() => setVolume(Math.random() * 0.3), 100);
//       return () => clearInterval(interval);
//     } else {
//       setVolume(0);
//     }
//   }, [status]);

//   return (
//     <div className="w-full h-96 flex justify-center items-center overflow-hidden">
//       <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
//         <ParticleSphere status={status} volume={volume} />
//       </Canvas>
//     </div>
//   );
// };


const VoiceVisualizer = ({ status }) => {
  const [volume, setVolume] = React.useState(0);
  const analyserRef = React.useRef(null);
  const animationRef = React.useRef(null);

  React.useEffect(() => {
    if (status === 'recording') {
      let audioCtx;
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.smoothingTimeConstant = 0.7; // Smooths the blob/aura movement
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const update = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(avg / 255); // Values between 0 and 1
          animationRef.current = requestAnimationFrame(update);
        };
        update();
      });
      return () => {
        if (audioCtx) audioCtx.close();
        cancelAnimationFrame(animationRef.current);
      };
    } else {
      setVolume(0);
    }
  }, [status]);

  return (
    <div className="relative w-full h-96 flex justify-center items-center overflow-hidden">
      {/* STEP 3: THE AURA GLOW - Moves with your voice */}
      {status === 'recording' && (
        <div 
          className="absolute w-48 h-48 rounded-full blur-[100px] transition-all duration-75 ease-out"
          style={{ 
            backgroundColor: '#10B981', 
            opacity: 0.1 + (volume * 0.4), 
            transform: `scale(${1 + volume * 0.7})`,
            zIndex: 0
          }} 
        />
      )}

      {/* THE SPHERE */}
      <div className="relative z-10 w-full h-full">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ParticleSphere status={status} volume={volume} />
        </Canvas>
      </div>
    </div>
  );
};

export default VoiceVisualizer;