"use client"

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

interface Node3D {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
}

function NetworkBackground({ intensity = 0 }: { intensity: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef  = useRef<THREE.LineSegments>(null)

  const NODE_COUNT = 60
  const CONNECTION_DIST = 3.5
  const MAX_LINES = NODE_COUNT * NODE_COUNT

  const [nodes] = React.useState(() => 
    Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 9,
      z: (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      vz: (Math.random() - 0.5) * 0.001,
    }))
  )

  const { pointPositions, linePositions } = React.useMemo(() => {
    const p = new Float32Array(NODE_COUNT * 3)
    const l = new Float32Array(MAX_LINES * 3 * 2)
    nodes.forEach((n, i) => {
      p[i * 3]     = n.x
      p[i * 3 + 1] = n.y
      p[i * 3 + 2] = n.z
    })
    return { pointPositions: p, linePositions: l }
  }, [nodes, NODE_COUNT, MAX_LINES])

  useFrame(() => {
    const baseSpeed = 0.15 + intensity * 0.6

    nodes.forEach(n => {
      n.x += n.vx * baseSpeed
      n.y += n.vy * baseSpeed
      n.z += n.vz * baseSpeed
      // Wrap
      if (Math.abs(n.x) > 8)  n.vx *= -1
      if (Math.abs(n.y) > 4.5) n.vy *= -1
      if (Math.abs(n.z) > 3)  n.vz *= -1
    })

    // Update point positions
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
      nodes.forEach((n, i) => {
        pos.setXYZ(i, n.x, n.y, n.z)
      })
      pos.needsUpdate = true
    }

    // Update line segments
    if (linesRef.current) {
      const pairs: number[] = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dz = nodes[i].z - nodes[j].z
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
          if (dist < CONNECTION_DIST) {
            pairs.push(nodes[i].x, nodes[i].y, nodes[i].z)
            pairs.push(nodes[j].x, nodes[j].y, nodes[j].z)
          }
        }
      }
      const linePos = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = linePos.array as Float32Array
      const maxPairs = Math.min(pairs.length, arr.length)
      for (let k = 0; k < maxPairs; k++) {
        arr[k] = pairs[k] ?? 0
      }
      // Zero out remaining
      for (let k = maxPairs; k < arr.length; k++) arr[k] = 0
      linePos.needsUpdate = true
    }
  })

  const lineOpacity = 0.06 + intensity * 0.14
  const dotOpacity  = 0.25 + intensity * 0.45

  return (
    <group>
      {/* Stars */}
      <Stars
        radius={100}
        depth={50}
        count={intensity > 0.5 ? 4000 : 2000}
        factor={2.5}
        saturation={intensity * 0.3}
        fade
        speed={0.3 + intensity}
      />

      {/* Network nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04 + intensity * 0.04}
          color="#E8440A"
          transparent
          opacity={dotOpacity}
          sizeAttenuation
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#E8440A"
          transparent
          opacity={lineOpacity}
        />
      </lineSegments>
    </group>
  )
}

export default function NetworkScene({ intensity = 0 }: { intensity: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
      <NetworkBackground intensity={intensity} />
    </Canvas>
  )
}
