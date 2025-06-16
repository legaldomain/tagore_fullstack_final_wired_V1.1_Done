'use client';
import { useEffect, useState } from 'react';
import NovelSidebar from '@/components/novel-sidebar';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PremiumSidebar from '@/components/PremiumSidebar';

export default function NovelPage() {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentChapter, setCurrentChapter] = useState('Chapter 1: The Beginning');
  const [autoSave, setAutoSave] = useState(false);
  const [lastSavedText, setLastSavedText] = useState('');

  useEffect(() => {
    loadChapter();
  }, [currentChapter]);

  useEffect(() => {
    if (!autoSave || text === lastSavedText) return;

    const saveTimeout = setTimeout(() => {
      save();
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [text, autoSave]);

  const loadChapter = async () => {
    try {
      setLoading(true);
      const filename = currentChapter;
      console.log('Loading file:', filename);
      
      const res = await fetch(`http://localhost:8000/api/file/${encodeURIComponent(filename)}`);
      if (!res.ok) {
        if (res.status === 404) {
          setText('');
          setLastSavedText('');
          return;
        }
        throw new Error('Failed to load chapter');
      }
      
      const data = await res.json();
      console.log('Loaded content length:', data.content?.length || 0);
      setText(data.content || '');
      setLastSavedText(data.content || '');
    } catch (error) {
      console.error('Load error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chapter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: `${currentChapter}.pdf`,
          content: text
        })
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentChapter}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: 'File exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const save = async () => {
    if (!text.trim()) {
      toast({
        title: 'Warning',
        description: 'Cannot save empty chapter content.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      const filename = currentChapter;
      console.log('Saving file:', filename);
      console.log('Content length:', text.length);
      
      const response = await fetch(`http://localhost:8000/api/file/${encodeURIComponent(filename)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const result = await response.json();
      setLastSavedText(text);
      console.log('Save response:', result);

      toast({
        title: 'Success',
        description: 'Chapter saved successfully',
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save chapter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSelectChapter = (chapter: string) => {
    setCurrentChapter(chapter);
  };

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <NovelSidebar
          onClose={() => setShowSidebar(false)}
          onSelectChapter={handleSelectChapter}
          currentChapter={currentChapter}
        />
      )}
      
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-serif text-2xl font-medium text-gray-800">{currentChapter}</h1>
            <div className="flex items-center space-x-4">
              {!showSidebar && (
                <Button variant="outline" onClick={() => setShowSidebar(true)}>
                  Show Chapters
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="autosave"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
                <Label htmlFor="autosave">Autosave</Label>
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 resize-none rounded-lg border border-gray-200 p-4 font-serif text-lg leading-relaxed text-gray-800 focus:border-gray-300 focus:outline-none focus:ring-0"
              placeholder="Start writing your story..."
            />
          )}
        </div>
      </div>
      <PremiumSidebar />
    </div>
  );
}
