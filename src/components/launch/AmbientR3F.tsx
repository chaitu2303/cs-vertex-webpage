'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

interface R3FProps {
  tension: number
  phase: string
  logoProgress: number
  logoEmissive: number
  logoWireframe: number
  logoMetal: number
  cameraOrbit: number
  cameraTravel: number
  coreScale: number
  gateOpen: number
  logoElevate: number
  countdownValue: number
  clothProgress?: number
  lightLeak?: number
  ringProgress?: number
  spotlightIntensity?: number
  onReady?: () => void
}


/* ─────────────────────────────────────────────────────────
   OFFICIAL CS VERTEX LOGO GEOMETRY DEFINITIONS
   ───────────────────────────────────────────────────────── */
const createCLogoShape = () => {
  const shape = new THREE.Shape()
  shape.moveTo(0.85, 0.65)
  shape.lineTo(-0.7, 0.65)
  shape.quadraticCurveTo(-1.8, 0.65, -1.8, 0)
  shape.quadraticCurveTo(-1.8, -0.65, -0.7, -0.65)
  shape.lineTo(0.5, -0.65)
  shape.lineTo(0.5, -0.2)
  shape.lineTo(-0.7, -0.2)
  shape.quadraticCurveTo(-1.25, -0.2, -1.25, 0)
  shape.quadraticCurveTo(-1.25, 0.2, -0.7, 0.2)
  shape.lineTo(0.85, 0.2)
  shape.closePath()
  return shape
}

const createSLogoShape = () => {
  const shape = new THREE.Shape()
  shape.moveTo(0.8, 0.12)
  shape.lineTo(0.2, 0.12)
  shape.bezierCurveTo(-0.15, 0.12, -0.15, -0.02, 0.2, -0.02)
  shape.lineTo(0.5, -0.02)
  shape.bezierCurveTo(0.85, -0.02, 0.85, -0.16, 0.5, -0.16)
  shape.lineTo(-0.1, -0.16)
  shape.lineTo(-0.1, -0.08)
  shape.lineTo(0.5, -0.08)
  shape.bezierCurveTo(0.62, -0.08, 0.62, -0.06, 0.5, -0.06)
  shape.lineTo(0.2, -0.06)
  shape.bezierCurveTo(0.08, -0.06, 0.08, 0.04, 0.2, 0.04)
  shape.lineTo(0.8, 0.04)
  shape.closePath()
  return shape
}

const extrudeSettings = {
  depth: 0.35,
  bevelEnabled: true,
  bevelSegments: 4,
  steps: 1,
  bevelSize: 0.04,
  bevelThickness: 0.04,
}

const targetCubeOffsets = [
  new THREE.Vector3(0.95, 0.16, 0),
  new THREE.Vector3(1.15, 0.16, 0),
  new THREE.Vector3(1.05, 0.26, 0),
  new THREE.Vector3(1.25, 0.06, 0)
]

const startPositions = {
  C: new THREE.Vector3(-14, 6, -16),
  S: new THREE.Vector3(14, -5, -8),
  cubes: [
    new THREE.Vector3(-6, -8, -12),
    new THREE.Vector3(8, 9, -15),
    new THREE.Vector3(-4, 10, -6),
    new THREE.Vector3(11, 3, -13)
  ]
}

const startRotations = {
  C: new THREE.Euler(1.5, -0.9, 0.4),
  S: new THREE.Euler(-0.8, 1.2, -0.5),
  cubes: [
    new THREE.Euler(1, 2, 3),
    new THREE.Euler(3, 1, 2),
    new THREE.Euler(2, 3, 1),
    new THREE.Euler(1, 1, 1)
  ]
}

/* ─────────────────────────────────────────────────────────
   STAGE 1 — BACKGROUND wait elements
   ───────────────────────────────────────────────────────── */
function ParticleField({ tension }: { tension: number }) {
  const ref = useRef<THREE.Points>(null!)
  const N = 1800

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const vel = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const orange = new THREE.Color('#E8440A')
    const white  = new THREE.Color('#ffffff')
    const gold   = new THREE.Color('#FF9800')

    for (let i = 0; i < N; i++) {
      const r = 5 + Math.random() * 14
      const θ = Math.random() * Math.PI * 2
      const φ = Math.acos(Math.random() * 2 - 1)
      pos[i*3]   = r * Math.sin(φ) * Math.cos(θ)
      pos[i*3+1] = r * Math.sin(φ) * Math.sin(θ)
      pos[i*3+2] = r * Math.cos(φ)
      vel[i*3]   = (Math.random() - 0.5) * 0.004
      vel[i*3+1] = (Math.random() - 0.5) * 0.004
      vel[i*3+2] = (Math.random() - 0.5) * 0.002

      const t = Math.random()
      const c = t < 0.42 ? orange : t < 0.72 ? gold : white
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b
    }
    return { positions: pos, velocities: vel, colors: col }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const spd = 0.12 + tension * 0.95

    for (let i = 0; i < N; i++) {
      arr[i*3]   += velocities[i*3]   * spd
      arr[i*3+1] += velocities[i*3+1] * spd
      arr[i*3+2] += velocities[i*3+2] * spd

      const dx = arr[i*3], dy = arr[i*3+1], dz = arr[i*3+2]
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
      if (dist > 19) {
        arr[i*3]   = -arr[i*3]   * 0.6
        arr[i*3+1] = -arr[i*3+1] * 0.6
        arr[i*3+2] = -arr[i*3+2] * 0.6
      }
    }
    pos.needsUpdate = true
    ref.current.rotation.y += 0.0012 * (1 + tension * 1.5)
    ref.current.rotation.x += 0.0004 * (1 + tension * 0.8)
  })

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    g.setAttribute('color',    new THREE.BufferAttribute(colors.slice(), 3))
    return g
  }, [positions, colors])

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.028 + tension * 0.042}
        vertexColors
        transparent
        opacity={0.18 + tension * 0.52}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function EnergyRings({ tension }: { tension: number }) {
  const ringsRef = useRef<THREE.Group>(null!)
  const progRef  = useRef([0, 0.33, 0.66])

  useFrame((_, dt) => {
    if (!ringsRef.current) return
    const speed = 0.08 + tension * 0.22
    progRef.current = progRef.current.map(p => (p + dt * speed) % 1)

    ringsRef.current.children.forEach((ring, i) => {
      const p   = progRef.current[i]
      const scl = 0.5 + p * 14
      ring.scale.setScalar(scl)
      const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial
      mat.opacity = (1 - p) * (0.07 + tension * 0.18)
    })
  })

  return (
    <group ref={ringsRef}>
      {[0,1,2].map(i => (
        <mesh key={i} rotation={[-Math.PI/2, 0, 0]}>
          <torusGeometry args={[1, 0.008, 8, 80]}/>
          <meshBasicMaterial
            color="#E8440A"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

interface Node { x:number; y:number; z:number; vx:number; vy:number; vz:number }

function NodeNetwork({ tension }: { tension: number }) {
  const ptsRef  = useRef<THREE.Points>(null!)
  const lnRef   = useRef<THREE.LineSegments>(null!)
  const nodes   = useRef<Node[]>([])
  const init    = useRef(false)
  const N       = 48
  const CONNECT = 4.2

  if (!init.current) {
    init.current = true
    nodes.current = Array.from({length: N}, () => ({
      x: (Math.random()-0.5)*20, y: (Math.random()-0.5)*12, z: (Math.random()-0.5)*8,
      vx: (Math.random()-0.5)*0.002, vy: (Math.random()-0.5)*0.002, vz: (Math.random()-0.5)*0.0015,
    }))
  }

  const pPos = useMemo(() => new Float32Array(N * 3), [])
  const lPos = useMemo(() => new Float32Array(N * N * 6), [])

  useFrame(() => {
    const spd = 0.1 + tension * 0.75
    nodes.current.forEach(n => {
      n.x += n.vx * spd; n.y += n.vy * spd; n.z += n.vz * spd
      if (Math.abs(n.x) > 10) n.vx *= -1
      if (Math.abs(n.y) > 6)  n.vy *= -1
      if (Math.abs(n.z) > 4)  n.vz *= -1
    })
    if (ptsRef.current) {
      const pa = ptsRef.current.geometry.attributes.position as THREE.BufferAttribute
      nodes.current.forEach((n,i) => pa.setXYZ(i, n.x, n.y, n.z))
      pa.needsUpdate = true
    }
    if (lnRef.current) {
      const la  = lnRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = la.array as Float32Array
      let idx = 0
      for (let i = 0; i < nodes.current.length; i++) {
        for (let j = i+1; j < nodes.current.length; j++) {
          const dx = nodes.current[i].x - nodes.current[j].x
          const dy = nodes.current[i].y - nodes.current[j].y
          const dz = nodes.current[i].z - nodes.current[j].z
          if (Math.sqrt(dx*dx+dy*dy+dz*dz) < CONNECT && idx+5 < arr.length) {
            arr[idx++]=nodes.current[i].x; arr[idx++]=nodes.current[i].y; arr[idx++]=nodes.current[i].z
            arr[idx++]=nodes.current[j].x; arr[idx++]=nodes.current[j].y; arr[idx++]=nodes.current[j].z
          }
        }
      }
      for (; idx < arr.length; idx++) arr[idx] = 0
      la.needsUpdate = true
    }
  })

  return (
    <group>
      <points ref={ptsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pPos, 3]}/>
        </bufferGeometry>
        <pointsMaterial
          size={0.04 + tension*0.06} color="#E8440A"
          transparent opacity={0.2 + tension*0.5} sizeAttenuation
        />
      </points>
      <lineSegments ref={lnRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lPos, 3]}/>
        </bufferGeometry>
        <lineBasicMaterial color="#E8440A" transparent opacity={0.04 + tension*0.16}/>
      </lineSegments>
    </group>
  )
}

function PulseSphere({ tension }: { tension: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (!ref.current) return
    const s = 1 + Math.sin(state.clock.elapsedTime * (0.4 + tension * 0.9)) * (0.02 + tension * 0.04)
    ref.current.scale.setScalar(s)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.02 + tension * 0.06
    ref.current.rotation.y += 0.003 * (1 + tension)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[7, 24, 16]}/>
      <meshBasicMaterial color="#E8440A" wireframe transparent opacity={0.03}/>
    </mesh>
  )
}

// Legacy components (EnergyCore, ExplosionParticles, GateParticles, EnergyGates) removed for strict launch sequence.

/* ─────────────────────────────────────────────────────────
   ACT 6 — CS VERTEX LOGO REVEAL
   ───────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────
   ACT 5.5 — ROTATING CLOTH SPHERE & ENERGY RINGS
   ───────────────────────────────────────────────────────── */
function VelvetWrappedCloth({
  phase,
  clothProgress,
  lightLeak,
  ringProgress
}: {
  phase: string
  clothProgress: number
  lightLeak: number
  ringProgress: number
}) {
  const panelRefs = [
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!)
  ]
  const ringsRef = useRef<THREE.Group>(null!)

  const show = phase === 'LOGO_REVEAL' || phase === 'MYSTERY' || phase === 'AWAKENING' || phase === 'RELEASE'

  useFrame((state) => {
    if (!show) return
    const t = state.clock.getElapsedTime()

    // 1. Slow overall rotation (Mystery Phase)
    const baseRotationY = t * 0.22
    const baseRotationX = Math.sin(t * 0.3) * 0.08

    panelRefs.forEach((ref, idx) => {
      const mesh = ref.current
      if (!mesh) return

      // Calculate unwrapping offsets based on clothProgress (0 -> 1)
      const p = clothProgress
      
      // Wind builds up based on light leak and progress
      const windForce = lightLeak + p * 2.0
      const flutterSpeed = 8.0 + windForce * 15.0
      const flutterAmp = 0.05 + windForce * 0.4
      const flutterX = Math.sin(t * flutterSpeed + idx) * flutterAmp
      const flutterY = Math.cos(t * (flutterSpeed * 1.2) + idx) * flutterAmp
      const flutterZ = Math.sin(t * (flutterSpeed * 0.8) + idx) * flutterAmp

      // Directions for 4 segments (Front-Left, Front-Right, Back-Right, Back-Left)
      const phiStart = (idx * Math.PI) / 2
      const dirX = Math.cos(phiStart + Math.PI / 4)
      const dirZ = Math.sin(phiStart + Math.PI / 4)

      const pExp = Math.pow(p, 1.8) // Accelerates aggressively away

      // Air blown outward and high upward
      mesh.position.x = dirX * pExp * 10.0 + flutterX
      mesh.position.y = pExp * 8.0 + flutterY
      mesh.position.z = dirZ * pExp * 10.0 + flutterZ

      // Chaotic flutter rotation from wind
      mesh.rotation.y = baseRotationY + phiStart + pExp * dirX * 4.0 + flutterX
      mesh.rotation.x = baseRotationX + pExp * dirZ * 3.0 + flutterY
      mesh.rotation.z = pExp * 3.0 * (idx % 2 === 0 ? 1 : -1) + flutterZ

      // Fly out of frame rather than just shrinking completely
      const scaleVal = Math.max(0.001, (1 - p * 0.4))
      mesh.scale.set(scaleVal, scaleVal, scaleVal)

      // Material properties
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (mat) {
        mat.opacity = Math.max(0, 1 - p * 1.1)
        mat.emissiveIntensity = lightLeak * 3.5 + Math.sin(t * 8.0) * 0.5 * lightLeak
      }
    })

    // Orbiting energy rings (active in AWAKENING and RELEASE)
    if (ringsRef.current) {
      const active = ['AWAKENING', 'RELEASE'].includes(phase)
      ringsRef.current.children.forEach((ring, index) => {
        const speed = 2.0 + index * 0.6
        ring.rotation.x = t * speed
        ring.rotation.y = t * speed * 0.5
        
        const mat = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial
        if (active) {
          const fade = phase === 'RELEASE' ? (1 - clothProgress) : 1
          mat.opacity = (0.65 + Math.sin(t * 5 + index) * 0.15) * fade * (phase === 'AWAKENING' ? lightLeak : 1)
        } else {
          mat.opacity = 0
        }
      })
    }
  })

  if (!show) return null

  return (
    <group position={[0, 0, 0]}>
      {/* 4 velvet wrapped cloth panels forming a shell */}
      {panelRefs.map((ref, idx) => {
        const phiStart = (idx * Math.PI) / 2
        return (
          <mesh key={idx} ref={ref}>
            <sphereGeometry args={[1.7, 24, 24, phiStart, Math.PI / 2, 0, Math.PI]} />
            <meshStandardMaterial
              color="#540007"
              roughness={0.92}
              metalness={0.08}
              transparent
              side={THREE.DoubleSide}
              emissive="#FF4500"
              emissiveIntensity={0}
              depthWrite={true}
            />
          </mesh>
        )
      })}

      {/* Orbiting glowing rings */}
      <group ref={ringsRef}>
        <mesh rotation={[0.4, 0.4, 0]}>
          <torusGeometry args={[2.1, 0.02, 8, 48]} />
          <meshBasicMaterial color="#FF6A00" transparent opacity={0} />
        </mesh>
        <mesh rotation={[-0.6, 1.0, 0.4]}>
          <torusGeometry args={[2.3, 0.02, 8, 48]} />
          <meshBasicMaterial color="#FF3A00" transparent opacity={0} />
        </mesh>
      </group>
    </group>
  )
}

function LogoResurrection({
  phase,
  logoProgress,
  logoEmissive,
  logoWireframe,
  logoMetal,
  logoElevate
}: {
  phase: string
  logoProgress: number
  logoEmissive: number
  logoWireframe: number
  logoMetal: number
  logoElevate: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const particlesRef = useRef<THREE.Points>(null!)
  const lightRef = useRef<THREE.SpotLight>(null!)
  const sweepLightRef = useRef<THREE.DirectionalLight>(null!)
  const forgeStartTimeRef = useRef<number | null>(null)
  
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null)
  const [sampledPoints, setSampledPoints] = useState<THREE.Vector3[]>([])
  
  const numSlices = 28
  const depth = 0.45
  
  const slices = useMemo(() => {
    const arr = []
    for (let i = 0; i < numSlices; i++) {
      const z = -depth / 2 + (i / (numSlices - 1)) * depth
      arr.push({ z, index: i })
    }
    return arr
  }, [])
  
  // Load official high-res logo
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load('/assets/logo/csvertex-logo.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      setLogoTexture(tex)
    })
  }, [])

  useEffect(() => {
    if (phase !== 'LOGO_REVEAL' && !['RELEASE', 'HERO', 'ENTRY'].includes(phase)) {
      forgeStartTimeRef.current = null
    }
  }, [phase])
  
  // Trace logo points from transparent logo PNG, sampling the full image height for the complete logo (Row 10 to 118 in 128x128)
  useEffect(() => {
    const img = new Image()
    img.src = '/assets/logo/csvertex-logo.png'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      ctx.drawImage(img, 0, 0, 128, 128)
      const imgData = ctx.getImageData(0, 0, 128, 128)
      const pixels: { x: number; y: number }[] = []
      
      // Sample the entire non-transparent logo area (Row 10 to 118 in 128x128)
      for (let y = 10; y < 118; y += 1) {
        for (let x = 0; x < 128; x += 1) {
          const idx = (y * 128 + x) * 4
          if (imgData.data[idx + 3] > 80) {
            pixels.push({
              x: (x - 64) / 22,
              y: (64 - y) / 22
            })
          }
        }
      }
      
      const count = 1800
      const points: THREE.Vector3[] = []
      for (let i = 0; i < count; i++) {
        if (pixels.length === 0) {
          points.push(new THREE.Vector3())
        } else {
          const p = pixels[i % pixels.length]
          const z = (Math.random() - 0.5) * 0.15
          points.push(new THREE.Vector3(p.x, p.y, z))
        }
      }
      setSampledPoints(points)
    }
  }, [])
  
  const scatterPositions = useMemo(() => {
    const arr = new Float32Array(1800 * 3)
    for (let i = 0; i < 1800; i++) {
      arr[i*3] = (Math.random() - 0.5) * 15
      arr[i*3+1] = (Math.random() - 0.5) * 15
      arr[i*3+2] = -12 + (Math.random() - 0.5) * 8
    }
    return arr
  }, [])
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    if (['RELEASE', 'LOGO_REVEAL', 'HERO', 'ENTRY'].includes(phase)) {
      if (forgeStartTimeRef.current === null) {
        forgeStartTimeRef.current = state.clock.getElapsedTime()
      }
    }
    const tLocal = forgeStartTimeRef.current !== null 
      ? state.clock.getElapsedTime() - forgeStartTimeRef.current 
      : 0
    
    if (['RELEASE', 'LOGO_REVEAL', 'HERO', 'ENTRY'].includes(phase)) {
      groupRef.current.rotation.y = tLocal * 0.28
      const yOffset = logoElevate * 0.65
      groupRef.current.position.y = yOffset + Math.sin(tLocal * 1.5) * 0.18
    } else {
      groupRef.current.rotation.y = 0
      groupRef.current.position.y = 0
    }
    
    if (particlesRef.current && sampledPoints.length > 0) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      const p = logoProgress
      
      for (let i = 0; i < 1800; i++) {
        const startX = scatterPositions[i*3]
        const startY = scatterPositions[i*3+1]
        const startZ = scatterPositions[i*3+2]
        const target = sampledPoints[i % sampledPoints.length]
        
        const curX = THREE.MathUtils.lerp(startX, target.x, p)
        const curY = THREE.MathUtils.lerp(startY, target.y, p)
        const curZ = THREE.MathUtils.lerp(startZ, target.z, p)
        
        const jitter = Math.sin(tLocal * 15 + i) * 0.25 * (1 - p)
        
        arr[i*3] = curX + jitter
        arr[i*3+1] = curY + jitter
        arr[i*3+2] = curZ
      }
      posAttr.needsUpdate = true
      
      const mat = particlesRef.current.material as THREE.PointsMaterial
      mat.opacity = logoProgress * 0.9 * (1.2 - logoMetal * 0.7)
    }
    
    if (groupRef.current && logoTexture) {
      let meshIdx = 0
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial
          if (mat) {
            mat.opacity = logoMetal
            const isOuter = meshIdx === 0 || meshIdx === numSlices - 1
            const isFront = meshIdx === numSlices - 1
            mat.metalness = isOuter ? 0.98 : 0.88
            mat.roughness = isOuter ? 0.08 : 0.28
            
            mat.emissiveMap = logoTexture
            mat.emissive = new THREE.Color('#ffffff')
            mat.emissiveIntensity = Math.max(0, logoEmissive - 1.0) * (isFront ? 0.80 : isOuter ? 0.35 : 1.2)
          }
          meshIdx++
        }
      })
    }
    
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(tLocal * 1.5) * 4
      lightRef.current.intensity = logoMetal * 5
    }

    if (sweepLightRef.current) {
      const sweepX = Math.sin(tLocal * 1.8) * 8
      sweepLightRef.current.position.set(sweepX, 1, 3)
      sweepLightRef.current.intensity = logoMetal * 8
    }
  })
  
  const show = ['RELEASE', 'LOGO_REVEAL', 'HERO', 'ENTRY'].includes(phase)
  if (!show) return null
  
  return (
    <group ref={groupRef}>
      {logoTexture && slices.map(({ z, index }) => (
        <mesh 
          key={index} 
          position={[0, 0, z]} 
          scale={[4.2, 4.2, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            map={logoTexture}
            transparent={true}
            alphaTest={0.05}
            opacity={0}
            metalness={0.92}
            roughness={0.08}
            side={THREE.DoubleSide}
            depthWrite={true}
            depthTest={true}
          />
        </mesh>
      ))}
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[scatterPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#FF7A30"
          transparent={true}
          opacity={0}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>
      
      <spotLight
        ref={lightRef}
        position={[0, 2, 4]}
        color="#ffffff"
        intensity={0}
        distance={15}
        angle={0.6}
        penumbra={1}
      />

      <directionalLight
        ref={sweepLightRef}
        position={[-8, 1, 3]}
        color="#ff9a5c"
        intensity={0}
      />
      
      {/* High-intensity Front Keylight to prevent logo from appearing dark */}
      <directionalLight
        position={[0, 0, 8]}
        color="#ffffff"
        intensity={logoMetal * 4.5}
      />
    </group>
  )
}

// Legacy HelixSparks and CountdownParticles removed for strict launch sequence.

/* ─────────────────────────────────────────────────────────
   CHOREOGRAPHED CAMERA CONTROLLER
   ───────────────────────────────────────────────────────── */
function CameraController({
  phase,
  cameraOrbit,
  cameraTravel,
  tension,
  gateOpen,
  countdownValue
}: {
  phase: string
  cameraOrbit: number
  cameraTravel: number
  tension: number
  gateOpen: number
  countdownValue: number
}) {
  const mouse = useRef({ x: 0, y: 0 })
  const finalCountdownStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (phase !== 'FINAL_COUNTDOWN') {
      finalCountdownStartTimeRef.current = null
    }
  }, [phase])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX - innerWidth / 2) / (innerWidth / 2)
      mouse.current.y = (e.clientY - innerHeight / 2) / (innerHeight / 2)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame((state) => {
    const cam = state.camera

    const isCountdown = ['SILENCE', 'ENERGY', 'INITIATE'].includes(phase)
    const isDedicatedCountdown = phase === 'FINAL_COUNTDOWN'

    let tFinal = 0
    if (phase === 'FINAL_COUNTDOWN') {
      if (finalCountdownStartTimeRef.current === null) {
        finalCountdownStartTimeRef.current = state.clock.getElapsedTime()
      }
      tFinal = state.clock.getElapsedTime() - finalCountdownStartTimeRef.current
    }

    if (isCountdown) {
      const targetX = mouse.current.x * 0.95
      const targetY = mouse.current.y * 0.65
      const baseZ = 9.0 - tension * 0.5
      
      cam.position.x += (targetX - cam.position.x) * 0.05
      cam.position.y += (-targetY - cam.position.y) * 0.05
      cam.position.z += (baseZ - cam.position.z) * 0.05
      cam.lookAt(0, 0, 0)
    } else if (isDedicatedCountdown) {
      const driftX = Math.sin(tFinal * 0.5) * 0.3
      const driftY = Math.cos(tFinal * 0.4) * 0.2
      const targetZ = 11.5 - (10 - countdownValue) * 0.35
      
      cam.position.x += (driftX - cam.position.x) * 0.05
      cam.position.y += (driftY - cam.position.y) * 0.05
      cam.position.z += (targetZ - cam.position.z) * 0.05
      cam.lookAt(0, 0, 0)
    } else if (['MYSTERY', 'AWAKENING', 'RELEASE', 'LOGO_REVEAL'].includes(phase)) {
      cam.position.set(0, 0, 8.5)
      cam.lookAt(0, 0, 0)
    } else if (phase === 'HERO') {
      // Slow camera push-in during Phase 5 (Hero Moment) from Z=8.5 to Z=7.0
      const targetZ = 8.5 - cameraTravel * 1.5
      cam.position.set(0, 0, targetZ)
      cam.lookAt(0, 0, 0)
    } else if (phase === 'ENTRY') {
      // Keep push-in depth stable during transition
      cam.position.set(0, 0, 7.0)
      cam.lookAt(0, 0, 0)
    }
  })

  return null
}

/* ─────────────────────────────────────────────────────────
   SCENE WRAPPER
   ───────────────────────────────────────────────────────── */
function Scene({
  tension,
  phase,
  logoProgress,
  logoEmissive,
  logoWireframe,
  logoMetal,
  cameraOrbit,
  cameraTravel,
  coreScale,
  gateOpen,
  logoElevate,
  countdownValue,
  clothProgress = 0,
  lightLeak = 0,
  ringProgress = 0,
  spotlightIntensity = 0
}: R3FProps) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!groupRef.current) return
    const isWait = ['SILENCE', 'ENERGY'].includes(phase)
    if (isWait) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.12
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.06
    } else {
      groupRef.current.rotation.set(0,0,0)
    }
  })

  const isWait = ['SILENCE', 'ENERGY'].includes(phase)
  const isReveal = ['MYSTERY', 'AWAKENING', 'RELEASE', 'LOGO_REVEAL', 'HERO', 'ENTRY'].includes(phase)
  const starCount = tension > 0.5 ? 4500 : 2800

  const intensityMultiplier = phase === 'FINAL_COUNTDOWN' ? 1.0 + (10 - countdownValue) * 0.45 : 1.0;

  return (
    <group ref={groupRef}>
      {isReveal ? (
        // Dark luxury keynote lighting: Single spotlight from above + dim fill
        <>
          <ambientLight intensity={0.02} />
          <directionalLight position={[0, -2, -6]} intensity={0.5} color="#FF6A00" />
          
          <spotLight
            position={[0, 7.5, 0]}
            angle={0.35}
            penumbra={0.9}
            intensity={spotlightIntensity * 14}
            color="#ffffff"
          />

          {/* Volumetric spotlight light cone */}
          {spotlightIntensity > 0 && (
            <mesh position={[0, 3.5, 0]}>
              <cylinderGeometry args={[0.05, 2.3, 7.0, 32, 1, true]} />
              <meshBasicMaterial
                color="#ff7a30"
                transparent
                opacity={spotlightIntensity * 0.12}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}

          {/* High-intensity Front Keylight to light up metallic surfaces in logo reveal */}
          {['RELEASE', 'LOGO_REVEAL', 'HERO', 'ENTRY'].includes(phase) && (
            <directionalLight
              position={[0, 1, 6]}
              intensity={logoMetal * 4.5}
              color="#ffffff"
            />
          )}

          {/* Volumetric Keynote Backlight pointing towards camera in Hero stage */}
          {phase === 'HERO' && (
            <directionalLight
              position={[0, 0, -3]}
              intensity={ringProgress * 15}
              color="#ff7a30"
            />
          )}
        </>
      ) : (
        // Standard countdown stage lighting
        <>
          <ambientLight intensity={0.15 * intensityMultiplier} />
          <directionalLight position={[5, 5, 4]} intensity={2.8 * intensityMultiplier} color="#FF7A30" />
          <directionalLight position={[-5, 5, 2]} intensity={1.2 * intensityMultiplier} color="#ffffff" />
          <directionalLight position={[0, -2, -6]} intensity={3.5 * intensityMultiplier} color="#FF8C00" />
          <spotLight position={[0, 8, 4]} angle={0.4} penumbra={1} intensity={2.0 * intensityMultiplier} color="#ffffff" />
        </>
      )}

      {(isWait || ['INITIATE', 'FINAL_COUNTDOWN'].includes(phase)) && (
        <Stars
          radius={110} depth={60} count={starCount}
          factor={2.6} saturation={tension * 0.5} fade
          speed={0.18 + tension * 1.0}
        />
      )}

      {isWait && <ParticleField tension={tension}/>}
      {isWait && <EnergyRings tension={tension}/>}
      {isWait && <NodeNetwork tension={tension}/>}
      {isWait && <PulseSphere tension={tension}/>}

      {/* Velvet wrapped cloth, light leaks, and rings */}
      <VelvetWrappedCloth
        phase={phase}
        clothProgress={clothProgress}
        lightLeak={lightLeak}
        ringProgress={ringProgress}
      />

      <LogoResurrection
        phase={phase}
        logoProgress={logoProgress}
        logoEmissive={logoEmissive}
        logoWireframe={logoWireframe}
        logoMetal={logoMetal}
        logoElevate={logoElevate}
      />

      {/* Ignite rear energy ring during Hero Moment */}
      {ringProgress > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.6]}>
          <torusGeometry args={[2.0 + ringProgress * 0.5, 0.03, 16, 80]} />
          <meshBasicMaterial
            color="#FF6A00"
            transparent
            opacity={Math.sin(ringProgress * Math.PI) * 0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      <CameraController
        phase={phase}
        cameraOrbit={cameraOrbit}
        cameraTravel={cameraTravel}
        tension={tension}
        gateOpen={gateOpen}
        countdownValue={countdownValue}
      />
    </group>
  )
}

function CanvasReadyNotifier({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    if (onReady) {
      requestAnimationFrame(() => {
        onReady()
      })
    }
  }, [onReady])
  return null
}

export default function AmbientR3F({
  tension,
  phase,
  logoProgress,
  logoEmissive,
  logoWireframe,
  logoMetal,
  cameraOrbit,
  cameraTravel,
  coreScale,
  gateOpen,
  logoElevate,
  countdownValue,
  clothProgress,
  lightLeak,
  ringProgress,
  spotlightIntensity,
  onReady
}: R3FProps) {
  return (
    <Canvas
      fallback={null}
      camera={{ position: [0, 0, 9], fov: 58 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CanvasReadyNotifier onReady={onReady} />
      <Scene
        tension={tension}
        phase={phase}
        logoProgress={logoProgress}
        logoEmissive={logoEmissive}
        logoWireframe={logoWireframe}
        logoMetal={logoMetal}
        cameraOrbit={cameraOrbit}
        cameraTravel={cameraTravel}
        coreScale={coreScale}
        gateOpen={gateOpen}
        logoElevate={logoElevate}
        countdownValue={countdownValue}
        clothProgress={clothProgress}
        lightLeak={lightLeak}
        ringProgress={ringProgress}
        spotlightIntensity={spotlightIntensity}
      />
    </Canvas>
  )
}
