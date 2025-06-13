'use client';
import { useEffect, useState } from 'react';
import NotebookSelector from '@/components/notebook-selector';
import NoteExporter from '@/components/note-exporter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, FileUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import PremiumSidebar from '@/components/PremiumSidebar';

interface Note {
  filename: string;
  content: string;
  notebook: string;
  tags: string[];
}

export default function NotePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentNotebook, setCurrentNotebook] = useState('Physics');
  const [showExporter, setShowExporter] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, [currentNotebook]);

  useEffect(() => {
    if (!autoSave || !currentNote || currentNote.content === lastSavedContent) return;

    const saveTimeout = setTimeout(() => {
      saveNote();
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [currentNote?.content, autoSave]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/files');
      const data = await res.json();
      
      // Filter notes by current notebook
      const notesData = await Promise.all(
        data.files
          .filter((f: string) => f.startsWith(currentNotebook))
          .map(async (filename: string) => {
            const noteRes = await fetch(`http://localhost:8000/api/file/${filename}`);
            const noteData = await noteRes.json();
            return {
              filename,
              content: noteData.content,
              notebook: currentNotebook,
              tags: ['math', 'physics'] // TODO: Implement tags
            };
          })
      );
      
      setNotes(notesData);
      if (notesData.length > 0 && !currentNote) {
        setCurrentNote(notesData[0]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!currentNote) return;
    
    try {
      setSaving(true);
      await fetch(`http://localhost:8000/api/file/${currentNote.filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: currentNote.content }),
      });

      setLastSavedContent(currentNote.content);
      toast({
        title: 'Success',
        description: 'Note saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const createNewNote = async () => {
    const newNote: Note = {
      filename: `${currentNotebook}/note_${Date.now()}.txt`,
      content: '',
      notebook: currentNotebook,
      tags: [],
    };

    try {
      await fetch(`http://localhost:8000/api/file/${newNote.filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: '' }),
      });

      setNotes([...notes, newNote]);
      setCurrentNote(newNote);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create new note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
        <NotebookSelector
          currentNotebook={currentNotebook}
          onSelectNotebook={setCurrentNotebook}
        />
        
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Notes</h3>
          <div className="space-y-2">
            {notes.map((note) => (
              <button
                key={note.filename}
                onClick={() => setCurrentNote(note)}
                className={`w-full rounded-md p-2 text-left text-sm ${
                  currentNote?.filename === note.filename
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                {note.filename.split('/').pop()?.replace('.txt', '')}
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={createNewNote}
          >
            New Note
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col p-6">
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : currentNote ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <Input
                  value={currentNote.filename.split('/').pop()?.replace('.txt', '') || ''}
                  onChange={(e) => {
                    if (currentNote) {
                      setCurrentNote({
                        ...currentNote,
                        filename: `${currentNotebook}/${e.target.value}.txt`,
                      });
                    }
                  }}
                  className="w-64"
                />
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autosave"
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    />
                    <Label htmlFor="autosave">Autosave</Label>
                  </div>
                  <Button variant="outline" onClick={() => setShowExporter(true)}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={saveNote} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>

              <textarea
                value={currentNote.content}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, content: e.target.value })
                }
                className="flex-1 resize-none rounded-lg border border-gray-200 p-4 font-mono text-lg leading-relaxed text-gray-800 focus:border-gray-300 focus:outline-none focus:ring-0"
                placeholder="Start taking notes..."
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-gray-500">Select or create a note to begin</p>
            </div>
          )}
        </div>
      </div>
      <PremiumSidebar />
      {showExporter && currentNote && (
        <NoteExporter
          title={currentNote.filename.split('/').pop()?.replace('.txt', '') || ''}
          notebook={currentNote.notebook}
          tags={currentNote.tags}
          content={currentNote.content}
          onClose={() => setShowExporter(false)}
        />
      )}
    </div>
  );
}
