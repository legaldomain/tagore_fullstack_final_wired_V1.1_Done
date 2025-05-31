"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BootScreen() {
  const [opacity, setOpacity] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Fade in the logo
    setOpacity(1)

    // After 3 seconds, fade out and redirect
    const timer = setTimeout(() => {
      setOpacity(0)
      setTimeout(() => {
        router.push("/unlock")
      }, 1000)
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center transition-opacity duration-1000" style={{ opacity }}>
        <h1 className="font-mono text-5xl font-light tracking-wider text-gray-800">Tagore </h1>
        <p className="mt-2 text-sm text-gray-600">Project by Sonzaikan</p>
      </div>
    </div>
  )
}
