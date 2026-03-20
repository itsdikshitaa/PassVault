"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Group, Mesh } from "three"
import { cn } from "@/lib/utils"

function getStrengthColor(strength: number) {
  if (strength < 30) return "#b84232"
  if (strength < 60) return "#d59a2a"
  if (strength < 80) return "#54688f"
  return "#8a4931"
}

function CipherAssembly({ strength }: { strength: number }) {
  const groupRef = useRef<Group | null>(null)
  const ringRef = useRef<Mesh | null>(null)

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !ringRef.current) return

    groupRef.current.rotation.z += delta * 0.1
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.25) * 0.1
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.65) * 0.12
    ringRef.current.rotation.x += delta * 0.5
    ringRef.current.rotation.y += delta * 0.3
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.3]} rotation={[0.35, 0.25, 0]}>
        <boxGeometry args={[2.5, 1.2, 0.08]} />
        <meshStandardMaterial color="#2d3344" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh ref={ringRef} rotation={[1.05, 0.45, 0.15]}>
        <torusGeometry args={[0.95, 0.05, 16, 72]} />
        <meshStandardMaterial color={getStrengthColor(strength)} metalness={0.7} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.22]} rotation={[0.8, 0, 0.4]}>
        <torusGeometry args={[0.42, 0.03, 12, 60]} />
        <meshStandardMaterial color="#d3c2a2" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0.05, -0.58, 0.18]} rotation={[0.15, 0.05, 0.3]}>
        <boxGeometry args={[1.6, 0.08, 0.08]} />
        <meshStandardMaterial color={getStrengthColor(strength)} metalness={0.78} roughness={0.22} />
      </mesh>
    </group>
  )
}

export function PasswordScene({ strength, className }: { strength: number; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("fixed inset-0 h-full w-full", className)}>
      <Canvas camera={{ position: [0, 0, 4.8], fov: 56 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "low-power" }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.15} />
        <directionalLight position={[-4, -3, 2]} intensity={0.45} color="#f1dcc3" />
        <CipherAssembly strength={strength} />
      </Canvas>
    </div>
  )
}
