import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { fetchPost, createPost, updatePost } from '../api/posts';
import HistoryPanel from '../components/HistoryPanel';
import debounce from 'lodash/debounce';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id!),
    enabled: !isNew,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start drafting your masterpiece...',
      }),
    ],
    content: post?.currentVersion?.content || '',
    onUpdate: () => {
      debouncedSave();
    },
  }, [post]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const content = editor?.getJSON();
      if (isNew) {
        const newPost = await createPost({ title, excerpt, content });
        navigate(`/editor/${newPost.id}`, { replace: true });
        return newPost;
      } else {
        return updatePost(id!, { title, excerpt, content });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsAutoSaving(false);
    },
  });

  const debouncedSave = useMemo(
    () => debounce(() => {
      if (title.trim()) {
        setIsAutoSaving(true);
        saveMutation.mutate();
      }
    }, 2000),
    [title, saveMutation]
  );

  useEffect(() => {
    if (post) {
      setTitle(prev => prev || post.currentVersion?.title || post.title || '');
      setExcerpt(prev => prev || post.currentVersion?.excerpt || post.excerpt || '');
    }
  }, [post]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedSave();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-md">
          <span className="material-symbols-outlined animate-spin text-primary text-[48px]">progress_activity</span>
          <p className="font-mono text-[13px] text-on-surface-variant uppercase tracking-widest">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-surface font-hanken">
      {/* Editor Header */}
      <header className="h-16 border-b border-outline-variant bg-surface flex items-center justify-between px-md shrink-0">
        <div className="flex items-center gap-md">
          <Link to="/dashboard" className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="h-6 w-[1px] bg-outline-variant"></div>
          <div className="flex items-center gap-xs">
            <span className="text-[13px] font-bold text-primary uppercase tracking-tight">EverDraft Editor</span>
            <span className="text-[10px] font-mono text-on-surface-variant uppercase bg-surface-container px-1.5 rounded tracking-widest">
              {isNew ? 'New Draft' : `v${post?.currentVersion?.versionNumber || '1.0'}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-md">
          <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant uppercase tracking-widest mr-md">
            {isAutoSaving ? (
              <>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Saving Draft...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[14px]">cloud_done</span>
                <span>All Changes Saved</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-sm">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-xs px-md py-2 rounded-lg text-[13px] font-bold transition-all ${showHistory ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span className="hidden sm:inline">Timeline</span>
            </button>
            <button className="flex items-center gap-xs px-md py-2 bg-primary-container text-on-primary-container rounded-lg text-[13px] font-bold hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-[20px]">publish</span>
              <span className="hidden sm:inline">Publish</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-[11px] font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-16 border-r border-outline-variant bg-surface-container-low flex flex-col items-center py-md gap-lg shrink-0">
          <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all" title="Text Formatting">
            <span className="material-symbols-outlined">format_size</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all" title="Insert Media">
            <span className="material-symbols-outlined">image</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all" title="Citations">
            <span className="material-symbols-outlined">format_quote</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all" title="Collaboration">
            <span className="material-symbols-outlined">group</span>
          </button>
          <div className="mt-auto flex flex-col items-center gap-lg">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all" title="Settings">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </aside>

        {/* Writing Canvas */}
        <main className="flex-1 overflow-y-auto bg-surface p-md md:p-xl custom-scrollbar relative">
          <div className="max-w-[720px] mx-auto bg-surface-container-lowest shadow-[0_40px_100px_-20px_rgba(0,32,69,0.02)] border border-outline-variant rounded-xl min-h-[calc(100vh-160px)] flex flex-col">
            <div className="p-8 md:p-12 pb-0 flex-shrink-0">
              <input 
                className="w-full text-[48px] font-bold tracking-tight text-primary placeholder:text-outline-variant focus:outline-none bg-transparent mb-6 border-none ring-0" 
                placeholder="The Architectural Permanence..." 
                type="text"
                value={title}
                onChange={handleTitleChange}
              />
              <textarea 
                className="w-full text-[24px] font-semibold text-on-surface-variant placeholder:text-outline-variant focus:outline-none bg-transparent resize-none h-auto border-none ring-0 min-h-[60px]" 
                placeholder="An inquiry into the longevity of digital drafts and the philosophy of version control."
                value={excerpt}
                onChange={(e) => { setExcerpt(e.target.value); debouncedSave(); }}
              />
              <div className="h-1 w-12 bg-outline-variant my-8"></div>
            </div>

            <div className="p-8 md:p-12 pt-0 flex-grow">
              <EditorContent editor={editor} className="editor-surface text-[20px] leading-[32px] font-serif text-on-surface outline-none min-h-[400px]" />
            </div>

            <footer className="px-12 py-6 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-low/30 rounded-b-xl">
              <div className="flex gap-md text-[11px] font-mono text-on-surface-variant uppercase tracking-widest">
                <span>Words: {editor?.storage.characterCount?.words() || 0}</span>
                <span>Reading Time: {Math.ceil((editor?.storage.characterCount?.words() || 0) / 200)}m</span>
              </div>
              <div className="text-[11px] font-mono text-on-surface-variant uppercase tracking-widest">
                Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </footer>
          </div>
        </main>

        {/* History Panel (Conditional) */}
        {showHistory && !isNew && (
          <aside className="w-[320px] shrink-0 animate-in slide-in-from-right duration-300">
            <HistoryPanel postId={id!} onRestore={() => {}} />
          </aside>
        )}
      </div>

      <style>{`
        .editor-surface .ProseMirror:focus {
          outline: none;
        }
        .editor-surface .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--color-outline-variant);
          pointer-events: none;
          height: 0;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-outline-variant);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-outline);
        }
      `}</style>
    </div>
  );
};

export default EditorPage;
