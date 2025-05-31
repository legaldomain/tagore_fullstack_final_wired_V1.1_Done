"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Book, Settings, Download } from "lucide-react"

interface BookCompilerProps {
  bookTitle: string
  currentChapter: string
}

export default function BookCompiler({ bookTitle, currentChapter }: BookCompilerProps) {
  const [title, setTitle] = useState(bookTitle)
  const [author, setAuthor] = useState("Your Name")
  const [description, setDescription] = useState("")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true)
  const [includeCoverPage, setIncludeCoverPage] = useState(true)
  const [fontStyle, setFontStyle] = useState("serif")
  const [fontSize, setFontSize] = useState("medium")
  const [isExporting, setIsExporting] = useState(false)

  // Mock chapters data
  const chapters = [
    { title: "Chapter 1: The Beginning", included: true, wordCount: 1532 },
    { title: "Chapter 2: Unexpected Turns", included: true, wordCount: 1248 },
    { title: "Chapter 3: A Whisper in the Wind", included: true, wordCount: 987 },
    { title: "Chapter 4: Shadows and Light", included: true, wordCount: 1105 },
    { title: "Chapter 5: The Revelation", included: true, wordCount: 1320 },
  ]

  const toggleChapterInclusion = (index: number) => {
    chapters[index].included = !chapters[index].included
    // In a real app, we would update state here
  }

  const exportBook = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      // In a real app, this would trigger a download
      alert(`Book "${title}" exported as ${exportFormat.toUpperCase()}`)
    }, 2000)
  }

  const totalWordCount = chapters.filter((ch) => ch.included).reduce((sum, ch) => sum + ch.wordCount, 0)

  return (
    <Tabs defaultValue="content">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">
          <Book className="mr-2 h-4 w-4" />
          Content
        </TabsTrigger>
        <TabsTrigger value="title-page">
          <FileText className="mr-2 h-4 w-4" />
          Title Page
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="mr-2 h-4 w-4" />
          Format
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Chapters to Include</h3>
          <span className="text-xs text-gray-500">{totalWordCount} words total</span>
        </div>

        <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border border-gray-200 p-2">
          {chapters.map((chapter, index) => (
            <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
              <div className="flex items-center">
                <Switch
                  id={`chapter-${index}`}
                  checked={chapter.included}
                  onCheckedChange={() => toggleChapterInclusion(index)}
                />
                <Label
                  htmlFor={`chapter-${index}`}
                  className={`ml-2 text-sm ${chapter.included ? "text-gray-800" : "text-gray-500"}`}
                >
                  {chapter.title}
                </Label>
              </div>
              <span className="text-xs text-gray-500">{chapter.wordCount} words</span>
            </div>
          ))}
        </div>

        <div className="rounded-md bg-gray-100 p-3">
          <h4 className="text-xs font-medium text-gray-700">Chapter Order</h4>
          <p className="mt-1 text-xs text-gray-600">
            Chapters will be compiled in the order shown above. To reorder chapters, use the Chapter Navigator (Ctrl+J)
            from the writing screen.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="title-page" className="space-y-4 py-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="book-title">Book Title</Label>
            <Input id="book-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author-name">Author Name</Label>
            <Input id="author-name" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-description">Book Description/Tagline (Optional)</Label>
            <Textarea
              id="book-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description or tagline for your book..."
              className="h-20"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="include-cover" checked={includeCoverPage} onCheckedChange={setIncludeCoverPage} />
            <Label htmlFor="include-cover">Include Cover Page</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="include-toc" checked={includeTableOfContents} onCheckedChange={setIncludeTableOfContents} />
            <Label htmlFor="include-toc">Include Table of Contents</Label>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4 py-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="epub">ePub (eBook)</SelectItem>
                <SelectItem value="docx">Word Document</SelectItem>
                <SelectItem value="txt">Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-style">Font Style</Label>
            <Select value={fontStyle} onValueChange={setFontStyle}>
              <SelectTrigger id="font-style">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serif">Serif (Traditional)</SelectItem>
                <SelectItem value="sans">Sans-serif (Modern)</SelectItem>
                <SelectItem value="mono">Monospace (Technical)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (10pt)</SelectItem>
                <SelectItem value="medium">Medium (12pt)</SelectItem>
                <SelectItem value="large">Large (14pt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Page Layout</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex cursor-pointer flex-col items-center rounded-md border border-gray-300 p-2 hover:bg-gray-50">
                <div className="h-16 w-12 rounded border border-gray-400"></div>
                <span className="mt-1 text-xs">Standard</span>
              </div>
              <div className="flex cursor-pointer flex-col items-center rounded-md border border-gray-300 p-2 hover:bg-gray-50">
                <div className="h-12 w-16 rounded border border-gray-400"></div>
                <span className="mt-1 text-xs">Landscape</span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <div className="mt-4 flex justify-end">
        <Button onClick={exportBook} disabled={isExporting} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : `Export as ${exportFormat.toUpperCase()}`}
        </Button>
      </div>
    </Tabs>
  )
}
