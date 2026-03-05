import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useBrainStore } from './store.js';

/**
 * Smoothly animates the camera toward `cameraTarget` from the store.
 * Auto-clears the target once the camera arrives so OrbitControls can resume.
 */
export function CameraController() {
  const cameraTarget = useBrainStore((s) => s.cameraTarget);
  const clearCameraTarget = useBrainStore((s) => s.clearCameraTarget);
  const { camera } = useThree();
  const lookAtRef = useRef(new Vector3(0, 0, 0));
  const targetPosRef = useRef(new Vector3());
  const targetLookRef = useRef(new Vector3());

  useFrame((_state, delta) => {
    if (!cameraTarget) return;

    targetPosRef.current.set(...cameraTarget.position);
    targetLookRef.current.set(...cameraTarget.lookAt);
    const lerpSpeed = Math.min(delta * 3, 1);

    camera.position.lerp(targetPosRef.current, lerpSpeed);
    lookAtRef.current.lerp(targetLookRef.current, lerpSpeed);
    camera.lookAt(lookAtRef.current);

    if (camera.position.distanceTo(targetPosRef.current) < 0.05) {
      clearCameraTarget();
    }
  });

  return null;
}
