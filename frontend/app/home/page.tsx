"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Clock,
  HistoryIcon,
  Sliders,
  User,
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import UserIcon from "@/components/ui/user-icon";

const modes = [
  { id: "novel", label: "Novel", path: "/novel" },
  { id: "note", label: "Note", path: "/note" },
  { id: "journal", label: "Journal", path: "/journal" },
]

function CurrentClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="absolute top-4 right-4 text-sm font-mono font-bold text-gray-500">
      <div>{formattedTime}</div>
      <div>{formattedDate}</div>
    </div>
  )
}

export default function HomeScreen() {
  const [selectedMode, setSelectedMode] = useState<string | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault();
        router.back(); // Navigate back to the previous page
      }
    };

    // Attach the event listener to the document to ensure it captures globally
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center">
          <h1 className="font-mono text-2xl font-bold text-gray-900">Tagore</h1>
          <UserIcon />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 px-8 py-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-mono font-bold text-gray-900 border-b border-gray-400 inline-block pb-2">
              What do you want to write?
            </h1>
            <p className="mt-4 text-sm font-mono text-gray-700">"The art of writing is the art of discovering what you believe."</p>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="w-full max-w-xl rounded border border-gray-300 bg-white px-10 py-12 shadow-sm">
              <h2 className="mb-6 text-center text-2xl font-mono font-bold text-gray-900">
                Start Writing
              </h2>

              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <Select
                    value={selectedMode}
                    onValueChange={(value) => {
                      setSelectedMode(value)
                      const mode = modes.find((m) => m.id === value)
                      if (mode) {
                        router.push(mode.path)
                      }
                    }}
                  >
                    <SelectTrigger className="w-64 justify-between rounded border border-gray-400 bg-gray-50 font-mono">
                      <SelectValue placeholder="Choose what to write" />
                    </SelectTrigger>
                    <SelectContent className="font-mono">
                      {modes.map((mode) => (
                        <SelectItem key={mode.id} value={mode.id}>
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs font-mono text-gray-700">
                <span className="rounded-full border border-gray-300 px-4 py-1">
                  Chapter organization
                </span>
                <span className="rounded-full border border-gray-300 px-4 py-1">
                  AI writing assistance
                </span>
                <span className="rounded-full border border-gray-300 px-4 py-1">
                  Character arcs
                </span>
                <span className="rounded-full border border-gray-300 px-4 py-1">
                  AI study assistance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col items-center space-y-4 border-l border-gray-200 bg-white px-4 py-6">
          <Button variant="ghost" size="sm" onClick={() => router.push('/history')} className="flex items-center">
            <HistoryIcon className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/settings')} className="flex items-center">
            <Sliders className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/device-settings')} className="flex items-center">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/notifications')} className="flex items-center">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/profile')} className="flex items-center">
            <User className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/help')} className="flex items-center">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 px-6 py-4 text-center text-sm text-gray-700">
        <div className="mb-4 text-xs font-mono text-gray-600">
          <h3 className="text-sm font-bold text-gray-900">Tip of the Day</h3>
          <p className="mt-2 font-bold">"Write with the door closed, rewrite with the door open." - Stephen King</p>
        </div>
        <CurrentClock />
      </div>
    </div>
  )
}
