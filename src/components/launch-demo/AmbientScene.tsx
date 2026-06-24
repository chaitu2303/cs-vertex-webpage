'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

interface Node { x: number; y: number; z: number; vx: number; vy: number; vz: number }

function Network({ tension }: { tension: number }) {
  const pts   = useRef<THREE.Points>(null)
  const lines = useRef<THREE.LineSegments>(null)
  const nodes = useRef<Node[]>([])
  const init  = useRef(false)
  const N     = 55
  const DIST  = 3.8

  if (!init.current) {
    init.current = true
    nodes.current = Array.from({ length: N }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 7,
      vx: (Math.random() - 0.5) * 0.0018,
      vy: (Math.random() - 0.5) * 0.0018,
      vz: (Math.random() - 0.5) * 0.001,
    }))
  }

  const pPos = new Float32Array(N * 3)
  const lPos = new Float32Array(N * N * 3 * 2)

  nodes.current.forEach((n, i) => {
    pPos[i*3] = n.x; pPos[i*3+1] = n.y; pPos[i*3+2] = n.z
  })

  useFrame(() => {
    const spd = 0.14 + tension * 0.7
    nodes.current.forEach(n => {
      n.x += n.vx * spd; n.y += n.vy * spd; n.z += n.vz * spd
      if (Math.abs(n.x) > 9) n.vx *= -1
      if (Math.abs(n.y) > 5) n.vy *= -1
      if (Math.abs(n.z) > 3.5) n.vz *= -1
    })

    if (pts.current) {
      const pa = pts.current.geometry.attributes.position as THREE.BufferAttribute
      nodes.current.forEach((n, i) => pa.setXYZ(i, n.x, n.y, n.z))
      pa.needsUpdate = true
    }

    if (lines.current) {
      const la  = lines.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = la.array as Float32Array
      let idx   = 0
      for (let i = 0; i < nodes.current.length; i++) {
        for (let j = i + 1; j < nodes.current.length; j++) {
          const dx = nodes.current[i].x - nodes.current[j].x
          const dy = nodes.current[i].y - nodes.current[j].y
          const dz = nodes.current[i].z - nodes.current[j].z
          if (Math.sqrt(dx*dx+dy*dy+dz*dz) < DIST && idx + 5 < arr.length) {
            arr[idx++] = nodes.current[i].x; arr[idx++] = nodes.current[i].y; arr[idx++] = nodes.current[i].z
            arr[idx++] = nodes.current[j].x; arr[idx++] = nodes.current[j].y; arr[idx++] = nodes.current[j].z
          }
        }
      }
      for (; idx < arr.length; idx++) arr[idx] = 0
      la.needsUpdate = true
    }
  })

  const lineAlpha = 0.05 + tension * 0.16
  const dotAlpha  = 0.22 + tension * 0.48

  return (
    <group>
      <Stars radius={100} depth={55} count={tension > 0.5 ? 5000 : 2500} factor={2.8} saturation={tension * 0.4} fade speed={0.25 + tension * 0.8} />
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035 + tension * 0.045} color="#E8440A" transparent opacity={dotAlpha} sizeAttenuation />
      </points>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lPos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#E8440A" transparent opacity={lineAlpha} />
      </lineSegments>
    </group>
  )
}

export default function AmbientScene({ tension }: { tension: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 7.5], fov: 58 }} style={{ position: 'absolute', inset: 0 }}>
      <Network tension={tension} />
    </Canvas>
  )
}
