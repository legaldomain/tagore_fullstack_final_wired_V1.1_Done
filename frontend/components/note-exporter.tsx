"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FileText, Download, Share2, Printer, FileUp, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface NoteExporterProps {
  title: string
  notebook: string
  tags: string[]
  content: string
  onClose: () => void
}

export default function NoteExporter({ title, notebook, tags, content, onClose }: NoteExporterProps) {
  const [exportFormat, setExportFormat] = useState("pdf")
  const [includeTags, setIncludeTags] = useState(true)
  const [includeNotebook, setIncludeNotebook] = useState(true)
  const [includeTimestamp, setIncludeTimestamp] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [filename, setFilename] = useState('')

  const handleExport = async () => {
    if (!filename) {
      toast({
        title: 'Error',
        description: 'Please enter a filename',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsExporting(true)
      const response = await fetch('http://localhost:8000/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: `${filename}.${exportFormat}`,
          content: content
        })
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const data = await response.json()
      toast({
        title: 'Success',
        description: `File exported as ${data.filename}`,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export file. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename without extension"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="txt">Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || !filename}>
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <FileUp className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
