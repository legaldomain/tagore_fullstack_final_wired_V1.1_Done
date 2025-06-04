'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Plus, Calendar, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function Journal() {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [entries, setEntries] = useState<{ [key: string]: JournalEntry[] }>({});
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Generate days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    // Set today as the selected day by default
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setSelectedDay(today);
    
    // Load entries for the selected day
    loadEntries(today);
  }, []);

  const loadEntries = async (day: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/journal/${day}`);
      const data = await response.json();
      setEntries(prev => ({
        ...prev,
        [day]: data.entries || []
      }));
    } catch (error) {
      console.error('Error loading entries:', error);
      setEntries(prev => ({
        ...prev,
        [day]: []
      }));
    }
  };

  const createNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: `Entry ${entries[selectedDay]?.length + 1 || 1}`,
      content: '',
      date: new Date().toISOString()
    };

    setEntries(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newEntry]
    }));
    setCurrentEntry(newEntry);
  };

  const saveEntry = async () => {
    if (!currentEntry) return;

    try {
      setSaving(true);
      await fetch('http://localhost:8000/api/journal/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: `${selectedDay.toLowerCase()}/${currentEntry.title}.txt`,
          content: currentEntry.content
        })
      });

      toast({
        title: 'Success',
        description: 'Journal entry saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save journal entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (entry: JournalEntry) => {
    try {
      await fetch(`http://localhost:8000/api/journal/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: `${selectedDay.toLowerCase()}/${entry.title}.txt`
        })
      });

      setEntries(prev => ({
        ...prev,
        [selectedDay]: prev[selectedDay].filter(e => e.id !== entry.id)
      }));

      if (currentEntry?.id === entry.id) {
        setCurrentEntry(null);
      }

      toast({
        title: 'Success',
        description: 'Entry deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete entry. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const startEditingTitle = () => {
    if (currentEntry) {
      setNewTitle(currentEntry.title);
      setEditingTitle(true);
    }
  };

  const saveNewTitle = async () => {
    if (!currentEntry || !newTitle.trim()) return;

    try {
      // Delete old file
      await fetch(`http://localhost:8000/api/journal/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: `${selectedDay.toLowerCase()}/${currentEntry.title}.txt`
        })
      });

      // Save with new title
      await fetch('http://localhost:8000/api/journal/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: `${selectedDay.toLowerCase()}/${newTitle}.txt`,
          content: currentEntry.content
        })
      });

      // Update local state
      const updatedEntry = { ...currentEntry, title: newTitle };
      setCurrentEntry(updatedEntry);
      setEntries(prev => ({
        ...prev,
        [selectedDay]: prev[selectedDay].map(e => 
          e.id === currentEntry.id ? updatedEntry : e
        )
      }));

      toast({
        title: 'Success',
        description: 'Entry renamed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to rename entry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setEditingTitle(false);
    }
  };

  const cancelEditingTitle = () => {
    setEditingTitle(false);
    setNewTitle('');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Weekly Journal</h2>
          <Calendar className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          {daysOfWeek.map((day) => (
            <div key={day} className="mb-4">
              <div 
                className={`mb-2 cursor-pointer rounded-lg p-2 ${
                  selectedDay === day ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  setSelectedDay(day);
                  loadEntries(day);
                }}
              >
                <h3 className="font-medium">{day}</h3>
              </div>
              
              {entries[day]?.map((entry) => (
                <div
                  key={entry.id}
                  className={`ml-4 cursor-pointer rounded-lg p-2 ${
                    currentEntry?.id === entry.id ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentEntry(entry)}
                >
                  <div className="flex items-center justify-between">
                    <span>{entry.title}</span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentEntry(entry);
                          startEditingTitle();
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEntry(entry);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 mt-1 w-full justify-start"
                onClick={createNewEntry}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentEntry ? (
          <>
            <div className="border-b border-gray-200 p-4">
              {editingTitle ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 text-xl font-semibold bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                    placeholder="Entry Title"
                    autoFocus
                  />
                  <Button size="sm" onClick={saveNewTitle}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEditingTitle}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                    className="w-full text-xl font-semibold bg-transparent border-none focus:outline-none"
                    placeholder="Entry Title"
                  />
                  <Button variant="ghost" size="sm" onClick={startEditingTitle}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={currentEntry.content}
                onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                className="w-full h-full resize-none bg-transparent border-none focus:outline-none"
                placeholder="Write your journal entry here..."
              />
            </div>
            <div className="border-t border-gray-200 p-4">
              <Button onClick={saveEntry} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select or create a journal entry to begin writing
          </div>
        )}
      </div>
    </div>
  );
} 