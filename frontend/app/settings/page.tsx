"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SettingsScreen() {
  const [fontStyle, setFontStyle] = useState("serif")
  const [fontSize, setFontSize] = useState("medium")
  const [aiMode, setAIMode] = useState("local")
  const [syncMode, setSyncMode] = useState("usb")
  const [fontFamily, setFontFamily] = useState("font-mono")
  const router = useRouter()

  const handleFontChange = (event) => {
    const selectedFont = event.target.value
    setFontFamily(selectedFont)
    document.documentElement.style.setProperty("--font-family", selectedFont)
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-100">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/home")} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-serif text-xl font-medium text-gray-800">Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Font Settings */}
          <div className="space-y-4">
            <h2 className="font-medium text-gray-800">Typography</h2>

            <div className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="font-style">Font Style</Label>
                <Select value={fontStyle} onValueChange={setFontStyle}>
                  <SelectTrigger id="font-style" className="w-32">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="sans">Sans-serif</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="font-size">Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger id="font-size" className="w-32">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label htmlFor="font-family" className="block text-sm font-medium text-gray-700">
                  Select Font Family
                </label>
                <select
                  id="font-family"
                  value={fontFamily}
                  onChange={handleFontChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="font-mono">Monospace</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-sans">Sans-serif</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="space-y-4">
            <h2 className="font-medium text-gray-800">AI Features</h2>

            <div className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ai-mode">AI Processing</Label>
                <Select value={aiMode} onValueChange={setAIMode}>
                  <SelectTrigger id="ai-mode" className="w-32">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Only</SelectItem>
                    <SelectItem value="cloud">Cloud (Online)</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="grammar-check">Grammar Check</Label>
                  <p className="text-xs text-gray-500">Highlight grammar issues while typing</p>
                </div>
                <Switch id="grammar-check" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="suggestions">Writing Suggestions</Label>
                  <p className="text-xs text-gray-500">Show AI-powered writing suggestions</p>
                </div>
                <Switch id="suggestions" />
              </div>
            </div>
          </div>

          {/* Sync Settings */}
          <div className="space-y-4">
            <h2 className="font-medium text-gray-800">Sync & Backup</h2>

            <div className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-mode">Sync Method</Label>
                <Select value={syncMode} onValueChange={setSyncMode}>
                  <SelectTrigger id="sync-mode" className="w-32">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usb">USB Only</SelectItem>
                    <SelectItem value="cloud">Cloud Sync</SelectItem>
                    <SelectItem value="local">Local Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <p className="text-xs text-gray-500">Create backups every 30 minutes</p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>

              <Button variant="outline" size="sm" className="mt-2">
                Backup Now
              </Button>
            </div>
          </div>

          {/* Export Settings */}
          <div className="space-y-4">
            <h2 className="font-medium text-gray-800">Export Preferences</h2>

            <div className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="default-pdf">Default to PDF</Label>
                  <p className="text-xs text-gray-500">Use PDF as default export format</p>
                </div>
                <Switch id="default-pdf" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-metadata">Include Metadata</Label>
                  <p className="text-xs text-gray-500">Add creation date and tags to exports</p>
                </div>
                <Switch id="include-metadata" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
