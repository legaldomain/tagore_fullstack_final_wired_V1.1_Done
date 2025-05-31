'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function DistractionFree() {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/drafts/focus')
      .then(res => res.json())
      .then(data => setText(data.content || ''));
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      await fetch('http://localhost:8000/api/distraction-free/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'focus_mode.txt',
          content: text
        })
      });

      toast({
        title: 'Success',
        description: 'Content saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative h-screen">
      <textarea
        autoFocus
        style={{ width: '100%', height: '100vh', fontSize: '1.2rem', padding: 20, border: 'none', outline: 'none' }}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="absolute bottom-4 right-4">
        <Button onClick={save} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
