'use client';

import BootScreen from "@/components/boot-screen"
import { useEffect, useState } from "react"

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const modes = ["Novel Mode", "Note Mode", "Journal Mode"] // Example modes

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : modes.length - 1))
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < modes.length - 1 ? prev + 1 : 0))
      } else if (e.key === "Enter") {
        console.log(`Selected mode: ${modes[selectedIndex]}`) // Replace with navigation logic
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, modes])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <BootScreen />
      <div className="mt-4 text-center">
        {modes.map((mode, index) => (
          <div
            key={index}
            className={`p-2 ${index === selectedIndex ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
          >
            {mode}
          </div>
        ))}
      </div>
    </main>
  )
}
