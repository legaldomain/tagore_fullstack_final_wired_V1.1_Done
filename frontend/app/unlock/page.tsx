"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnlockScreen() {
  const [pin, setPin] = useState(["", "", "", ""])
  const [showPinInput, setShowPinInput] = useState(false)
  const [authError, setAuthError] = useState(false)
  const router = useRouter()

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    // Check if PIN is complete
    if (index === 3 && value) {
      // In a real app, we would validate the PIN
      // For demo purposes, any complete PIN works
      if (newPin.every((digit) => digit !== "")) {
        setTimeout(() => {
          router.push("/home")
        }, 500)
      }
    }
  }

  const handleFingerprint = () => {
    // Simulate fingerprint authentication
    setTimeout(() => {
      router.push("/home")
    }, 1000)
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div className="space-y-2 font-mono">
          <h1 className="text-2xl font-medium text-gray-800">Unlock Device</h1>
          <p className="text-sm text-gray-600">Touch fingerprint sensor or enter PIN</p>
        </div>

        {!showPinInput ? (
          <div className="flex flex-col items-center space-y-6 font-mono">
            <button
              onClick={handleFingerprint}
              className="group flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300 transition-all hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <Fingerprint className="h-16 w-16 text-gray-700" />
            </button>
            <Button variant="outline" onClick={() => setShowPinInput(true)} className="mt-4 text-gray-600">
              Use PIN instead
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center space-x-4">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  className="h-12 w-12 rounded-md border border-gray-300 bg-white text-center text-xl focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              ))}
            </div>
            {authError && <p className="text-sm text-gray-700">Incorrect PIN. Please try again.</p>}
            <Button variant="outline" onClick={() => setShowPinInput(false)} className="text-gray-600">
              Use fingerprint instead
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
