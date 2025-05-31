"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, FileText, Book, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getHistory } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface HistoryEntry {
  id: number
  date: string
  type: string
  title: string
  wordCount: number
  content: string
}

export default function HistoryScreen() {
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null)
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await getHistory()
      setHistoryEntries(response.data.history)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "novel":
        return <Book className="h-4 w-4" />
      case "note":
        return <FileText className="h-4 w-4" />
      case "free":
        return <Pencil className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/home")} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-serif text-xl font-medium text-gray-800">History & Archive</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* History List */}
        <div className="w-full overflow-y-auto p-4 md:w-1/2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {historyEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`cursor-pointer rounded-md border p-3 transition-colors ${
                    selectedEntry === entry.id
                      ? "border-gray-400 bg-gray-200"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedEntry(entry.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(entry.type)}
                      <span className="font-medium text-gray-800">{entry.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">{entry.date}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <span>{entry.wordCount} words</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>10:42 AM</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {selectedEntry && (
          <div className="hidden border-l border-gray-200 bg-white p-6 md:block md:w-1/2">
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-medium text-gray-800">
                {historyEntries.find((e) => e.id === selectedEntry)?.title}
              </h2>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{historyEntries.find((e) => e.id === selectedEntry)?.date}</span>
                <span>{historyEntries.find((e) => e.id === selectedEntry)?.wordCount} words</span>
              </div>

              <div className="rounded-md bg-gray-50 p-4 font-serif text-gray-800">
                {historyEntries.find((e) => e.id === selectedEntry)?.content}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={loadHistory}>
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
