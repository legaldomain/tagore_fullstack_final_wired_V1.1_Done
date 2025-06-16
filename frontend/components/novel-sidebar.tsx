"use client"

import { useState, useEffect } from "react"
import { X, Plus, ChevronUp, ChevronDown, Edit, Copy, Trash, Merge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface NovelSidebarProps {
  onClose: () => void
  onSelectChapter: (chapter: string) => void
  currentChapter: string
}

export default function NovelSidebar({ onClose, onSelectChapter, currentChapter }: NovelSidebarProps) {
  const [chapters, setChapters] = useState<string[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [editingChapter, setEditingChapter] = useState({ index: -1, title: "" })
  const [mergingChapters, setMergingChapters] = useState({ source: -1, target: -1 })

  // Load chapters from backend
  const loadChapters = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/novel/chapters')
      if (!response.ok) {
        throw new Error('Failed to load chapters')
      }
      const data = await response.json()
      setChapters(data.chapters)
    } catch (error) {
      console.error('Error loading chapters:', error)
      toast({
        title: 'Error',
        description: 'Failed to load chapters. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Load chapters on component mount and when currentChapter changes
  useEffect(() => {
    loadChapters()
  }, [currentChapter])

  const moveChapter = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === chapters.length - 1)) {
      return
    }

    const newChapters = [...chapters]
    const newIndex = direction === "up" ? index - 1 : index + 1
    ;[newChapters[index], newChapters[newIndex]] = [newChapters[newIndex], newChapters[index]]
    setChapters(newChapters)
  }

  const addChapter = () => {
    setEditingChapter({ index: -1, title: `Chapter ${chapters.length + 1}: New Chapter` })
    setShowEditDialog(true)
  }

  const editChapter = (index: number) => {
    setEditingChapter({ index, title: chapters[index] })
    setShowEditDialog(true)
  }

  const saveChapterEdit = async () => {
    try {
      if (editingChapter.index === -1) {
        // Adding new chapter
        const response = await fetch(`http://localhost:8000/api/file/${encodeURIComponent(editingChapter.title)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: '' })
        })

        if (!response.ok) {
          throw new Error('Failed to create chapter')
        }

        await loadChapters() // Reload chapters after adding new one
        onSelectChapter(editingChapter.title) // Select the new chapter
      } else {
        // Editing existing chapter
        const oldTitle = chapters[editingChapter.index]
        const newTitle = editingChapter.title

        // Rename the file
        const response = await fetch(`http://localhost:8000/api/file/rename`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldName: oldTitle,
            newName: newTitle
          })
        })

        if (!response.ok) {
          throw new Error('Failed to rename chapter')
        }

        await loadChapters() // Reload chapters after renaming
        if (currentChapter === oldTitle) {
          onSelectChapter(newTitle) // Update current chapter if it was renamed
        }
      }
    } catch (error) {
      console.error('Error saving chapter:', error)
      toast({
        title: 'Error',
        description: 'Failed to save chapter changes. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setShowEditDialog(false)
    }
  }

  const duplicateChapter = async (index: number) => {
    try {
      const originalTitle = chapters[index]
      const newTitle = `${originalTitle} (Copy)`
      
      // Get the content of the original chapter
      const response = await fetch(`http://localhost:8000/api/file/${encodeURIComponent(originalTitle)}`)
      if (!response.ok) {
        throw new Error('Failed to load original chapter')
      }
      const data = await response.json()
      
      // Create the new chapter with the same content
      const saveResponse = await fetch(`http://localhost:8000/api/file/${encodeURIComponent(newTitle)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: data.content })
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to create chapter copy')
      }

      await loadChapters() // Reload chapters after duplicating
    } catch (error) {
      console.error('Error duplicating chapter:', error)
      toast({
        title: 'Error',
        description: 'Failed to duplicate chapter. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const deleteChapter = async (index: number) => {
    if (chapters.length <= 1) return

    try {
      const chapterToDelete = chapters[index]
      const response = await fetch(`http://localhost:8000/api/file/${encodeURIComponent(chapterToDelete)}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete chapter')
      }

      await loadChapters() // Reload chapters after deleting
      
      // If the deleted chapter was the current one, select the first available chapter
      if (currentChapter === chapterToDelete && chapters.length > 0) {
        onSelectChapter(chapters[0])
      }
    } catch (error) {
      console.error('Error deleting chapter:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete chapter. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const openMergeDialog = (sourceIndex: number) => {
    setMergingChapters({ source: sourceIndex, target: -1 })
    setShowMergeDialog(true)
  }

  const mergeChapters = () => {
    if (mergingChapters.target === -1 || mergingChapters.source === mergingChapters.target) {
      setShowMergeDialog(false)
      return
    }

    const newChapters = [...chapters]
    const mergedTitle = `${chapters[mergingChapters.target]} + ${chapters[mergingChapters.source].split(":")[1]}`
    newChapters[mergingChapters.target] = mergedTitle

    // Remove the source chapter
    newChapters.splice(mergingChapters.source, 1)

    setChapters(newChapters)
    setShowMergeDialog(false)
  }

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-medium text-gray-800">Chapters</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {chapters.map((chapter, index) => (
          <div
            key={index}
            className={`group flex items-center justify-between rounded-md p-2 ${
              chapter === currentChapter ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <button className="flex-1 text-left text-sm text-gray-700" onClick={() => onSelectChapter(chapter)}>
              {chapter}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                  <Edit className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => editChapter(index)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => moveChapter(index, "up")} disabled={index === 0}>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  <span>Move Up</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => moveChapter(index, "down")} disabled={index === chapters.length - 1}>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  <span>Move Down</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateChapter(index)}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openMergeDialog(index)}>
                  <Merge className="mr-2 h-4 w-4" />
                  <span>Merge With...</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteChapter(index)}
                  disabled={chapters.length <= 1}
                  className="text-gray-700"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={addChapter}>
        <Plus className="mr-1 h-3 w-3" />
        Add Chapter
      </Button>

      {/* Edit Chapter Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingChapter.index === -1 ? "Add New Chapter" : "Edit Chapter"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="chapter-title">Chapter Title</Label>
            <Input
              id="chapter-title"
              value={editingChapter.title}
              onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveChapterEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Chapters Dialog */}
      <Dialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Merge Chapters</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-sm text-gray-600">
              Select a chapter to merge "{chapters[mergingChapters.source]}" with:
            </p>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {chapters.map(
                (chapter, index) =>
                  index !== mergingChapters.source && (
                    <div
                      key={index}
                      onClick={() => setMergingChapters({ ...mergingChapters, target: index })}
                      className={`cursor-pointer rounded-md p-2 text-sm ${
                        index === mergingChapters.target ? "bg-gray-200" : "hover:bg-gray-100"
                      }`}
                    >
                      {chapter}
                    </div>
                  ),
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMergeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={mergeChapters} disabled={mergingChapters.target === -1}>
              Merge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
