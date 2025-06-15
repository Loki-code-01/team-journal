// components/EditEntryDrawer.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createClient } from "@/lib/supabase/client";

interface EditEntryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: {
    id: number;
    title: string;
    content: string;
    image?: string;
  };
  refreshEntries: () => void;
}

export default function EditEntryDrawer({ isOpen, onClose, entry, refreshEntries }: EditEntryDrawerProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    }
  }, [entry]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = entry?.image || '';
    if (image) {
      const fileExt = image.name.split('.').pop();
      const filePath = `images/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('journal-images').upload(filePath, image, {
        upsert: true,
      });
      if (!uploadError) {
        const { data } = supabase.storage.from('journal-images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from('entries')
      .update({ title, content, image_url: imageUrl })
      .eq('id', entry?.id);

    if (!error) {
      refreshEntries();
      onClose();
    }

    setLoading(false);
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 bg-white shadow-lg transform transition-transform duration-300 w-full sm:w-96 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Edit Entry</h2>
        <button onClick={onClose} className="text-gray-600">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full border p-2 rounded h-32"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
