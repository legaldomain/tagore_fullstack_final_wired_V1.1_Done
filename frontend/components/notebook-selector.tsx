"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, FolderPlus, Edit, Trash } from "lucide-react"

interface NotebookSelectorProps {
  currentNotebook: string
  onSelectNotebook: (notebook: string) => void
}

export default function NotebookSelector({ currentNotebook, onSelectNotebook }: NotebookSelectorProps) {
  const [notebooks, setNotebooks] = useState([
    "Physics",
    "Mathematics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Literature",
    "History",
  ])
  const [showNewNotebookInput, setShowNewNotebookInput] = useState(false)
  const [newNotebookName, setNewNotebookName] = useState("")
  const [editingNotebook, setEditingNotebook] = useState({ index: -1, name: "" })

  const addNotebook = () => {
    if (newNotebookName.trim()) {
      setNotebooks([...notebooks, newNotebookName.trim()])
      setNewNotebookName("")
      setShowNewNotebookInput(false)
    }
  }

  const startEditingNotebook = (index: number) => {
    setEditingNotebook({ index, name: notebooks[index] })
  }

  const saveEditedNotebook = () => {
    if (editingNotebook.name.trim()) {
      const newNotebooks = [...notebooks]
      newNotebooks[editingNotebook.index] = editingNotebook.name.trim()
      setNotebooks(newNotebooks)
      setEditingNotebook({ index: -1, name: "" })
    }
  }

  const deleteNotebook = (index: number) => {
    const newNotebooks = [...notebooks]
    newNotebooks.splice(index, 1)
    setNotebooks(newNotebooks)
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        {notebooks.map((notebook, index) => (
          <div
            key={index}
            className={`group flex items-center justify-between rounded-md p-2 ${
              notebook === currentNotebook ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            {editingNotebook.index === index ? (
              <div className="flex w-full items-center">
                <Input
                  value={editingNotebook.name}
                  onChange={(e) => setEditingNotebook({ ...editingNotebook, name: e.target.value })}
                  className="h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditedNotebook()
                    if (e.key === "Escape") setEditingNotebook({ index: -1, name: "" })
                  }}
                />
                <Button variant="ghost" size="sm" onClick={saveEditedNotebook} className="ml-2">
                  Save
                </Button>
              </div>
            ) : (
              <>
                <button className="flex flex-1 items-center text-left" onClick={() => onSelectNotebook(notebook)}>
                  <Folder className="mr-2 h-4 w-4 text-gray-600" />
                  <span className="text-gray-800">{notebook}</span>
                </button>
                <div className="hidden space-x-1 group-hover:flex">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => startEditingNotebook(index)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => deleteNotebook(index)}
                    disabled={notebooks.length <= 1}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showNewNotebookInput ? (
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Notebook name"
            value={newNotebookName}
            onChange={(e) => setNewNotebookName(e.target.value)}
            className="h-8"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") addNotebook()
              if (e.key === "Escape") setShowNewNotebookInput(false)
            }}
          />
          <Button variant="outline" size="sm" onClick={addNotebook}>
            Add
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="w-full" onClick={() => setShowNewNotebookInput(true)}>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Notebook
        </Button>
      )}
    </div>
  )
}
