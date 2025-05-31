"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  FileText,
  Minimize2,
  Clock,
  HistoryIcon,
  Sliders,
  Star,
  ChevronRight,
  User,
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import UserIcon from "@/components/ui/user-icon";

const modes = [
  {
    id: "novel",
    name: "Novel Mode",
    path: "/novel",
    icon: <BookOpen className="h-10 w-10 text-gray-700" />,
    description: "For writing long-form fiction with chapter management and creative tools.",
    features: ["Chapter organization", "AI writing assistance", "Character development"],
    lastUsed: "2 hours ago",
    isFavorite: true,
    color: "bg-gray-50",
  },
  {
    id: "note",
    name: "Note Mode",
    path: "/note",
    icon: <FileText className="h-10 w-10 text-gray-700" />,
    description: "For academic notes with mathematical symbols and study tools.",
    features: ["Symbol insertion", "Formula support", "AI study assistance"],
    lastUsed: "Yesterday",
    isFavorite: true,
    color: "bg-gray-50",
  },
  {
    id: "distraction-free",
    name: "Distraction-Free Mode",
    path: "/distraction-free",
    icon: <Minimize2 className="h-10 w-10 text-gray-700" />,
    description: "Minimal interface for focused writing without distractions.",
    features: ["Hidden controls", "Focus timer", "Minimal UI"],
    lastUsed: "3 days ago",
    isFavorite: false,
    color: "bg-gray-50",
  },
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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<string[]>(["novel", "note"])
  const router = useRouter()

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault();
        router.back(); // Navigate back to the previous page
      }

      const cols = 3; // Adjust based on the grid layout
      const rows = Math.ceil(modes.length / cols);
      const currentRow = Math.floor(selectedIndex / cols);
      const currentCol = selectedIndex % cols;

      switch (e.key) {
        case "ArrowUp":
          if (currentRow > 0) {
            setSelectedIndex((prev) => prev - cols);
          }
          break;
        case "ArrowDown":
          if (currentRow < rows - 1 && selectedIndex + cols < modes.length) {
            setSelectedIndex((prev) => prev + cols);
          }
          break;
        case "ArrowLeft":
          if (currentCol > 0) {
            setSelectedIndex((prev) => prev - 1);
          }
          break;
        case "ArrowRight":
          if (currentCol < cols - 1 && selectedIndex + 1 < modes.length) {
            setSelectedIndex((prev) => prev + 1);
          }
          break;
        case "Enter":
          router.push(modes[selectedIndex].path);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, router]);

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
            <h1 className="text-3xl font-mono font-bold text-gray-900 border-b border-gray-400 inline-block pb-2">Choose Your Writing Mode</h1>
            <p className="mt-4 text-sm font-mono text-gray-700">"The art of writing is the art of discovering what you believe."</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map((mode, index) => (
              <div
                key={mode.id}
                className={`relative flex flex-col items-center rounded border border-gray-400 bg-gray-50 p-6 shadow-sm transition-transform transform ${
                  index === selectedIndex ? "scale-105 ring-1 ring-gray-500" : "hover:scale-105"
                }`}
                tabIndex={0}
                onClick={() => router.push(mode.path)}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded bg-gray-200">
                  {mode.icon}
                </div>
                <h2 className="text-lg font-bold text-gray-900">{mode.name}</h2>
                <p className="mt-2 text-sm text-gray-700 text-center">{mode.description}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {mode.features.map((feature, i) => (
                    <span key={i} className="rounded border border-gray-400 px-3 py-1 text-xs text-gray-800">
                      {feature}
                    </span>
                  ))}
                </div>
                <button
                  className="mt-6 rounded border border-gray-400 px-6 py-2 text-sm font-bold text-gray-800 hover:bg-gray-200"
                  onClick={() => router.push(mode.path)}
                >
                  Select Mode
                </button>
              </div>
            ))}
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
