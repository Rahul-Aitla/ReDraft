import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { fetchPost, createPost, updatePost, publishPost, unpublishPost, restoreVersion } from '../api/posts';
import HistoryPanel from '../components/HistoryPanel';
import debounce from 'lodash/debounce';
import type { Post, PostVersion } from '../types';
import Logo from '../components/Logo';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isAutosaveEnabled, setIsAutosaveEnabled] = useState(false);
  const isAutosaveEnabledRef = useRef(isAutosaveEnabled);

  useEffect(() => {
    isAutosaveEnabledRef.current = isAutosaveEnabled;
  }, [isAutosaveEnabled]);
  
  // Custom UX states
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving' | 'error'>('saved');
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [previewVersion, setPreviewVersion] = useState<PostVersion | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id!),
    enabled: !isNew,
  });

  const publishMutation = useMutation({
    mutationFn: () => publishPost(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showToast('Post published successfully!');
    },
    onError: () => {
      showToast('Failed to publish post.');
    }
  });

  const unpublishMutation = useMutation({
    mutationFn: () => unpublishPost(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      showToast('Post unpublished successfully!');
    },
    onError: () => {
      showToast('Failed to unpublish post.');
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start drafting your masterpiece...',
      }),
    ],
    content: '',
    onUpdate: () => {
      if (!isReadOnly && !previewVersion) {
        setSaveStatus('unsaved');
        if (isAutosaveEnabledRef.current) {
          debouncedSave();
        }
      }
    },
  });

  // Keep a stable ref of the latest save data to avoid rebuilding the debounced function
  const saveDataRef = useRef({ title, excerpt, isNew, id });
  useEffect(() => {
    saveDataRef.current = { title, excerpt, isNew, id };
  }, [title, excerpt, isNew, id]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const content = editor?.getJSON();
      const currentData = saveDataRef.current;
      if (currentData.isNew) {
        const result = await createPost({
          title: currentData.title,
          excerpt: currentData.excerpt,
          content: content || { type: 'doc', content: [] }
        });
        navigate(`/editor/${result.post.id}`, { replace: true });
        return result.post;
      } else {
        const result = await updatePost(currentData.id!, {
          title: currentData.title,
          excerpt: currentData.excerpt,
          content: content || { type: 'doc', content: [] }
        });
        return result.post;
      }
    },
    onMutate: () => {
      setSaveStatus('saving');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setSaveStatus('saved');
    },
    onError: () => {
      setSaveStatus('error');
    },
  });

  const debouncedSave = useMemo(
    () => debounce(() => {
      const currentData = saveDataRef.current;
      if (currentData.title.trim()) {
        saveMutation.mutate();
      }
    }, 2000),
    [saveMutation]
  );

  useEffect(() => {
    if (isAutosaveEnabled && saveStatus === 'unsaved') {
      debouncedSave();
    }
  }, [isAutosaveEnabled, saveStatus, debouncedSave]);

  const handleManualSave = () => {
    debouncedSave.cancel();
    const currentData = saveDataRef.current;
    if (currentData.title.trim()) {
      saveMutation.mutate();
    } else {
      showToast('Title is required to save.');
    }
  };

  const restoreMutation = useMutation({
    mutationFn: (versionId: string) => restoreVersion(id!, versionId),
    onSuccess: (restoredPost: Post) => {
      handleRestore(restoredPost);
      showToast(`Successfully restored to Version ${restoredPost.currentVersion?.versionNumber}!`);
    },
    onError: () => {
      showToast('Failed to restore version.');
    }
  });

  const handleRestore = (restoredPost: Post) => {
    queryClient.setQueryData(['post', id], restoredPost);
    queryClient.invalidateQueries({ queryKey: ['versions', id] });
    setTitle(restoredPost.currentVersion?.title || '');
    setExcerpt(restoredPost.currentVersion?.excerpt || '');
    if (editor && restoredPost.currentVersion?.content) {
      editor.commands.setContent(restoredPost.currentVersion.content);
    }
    setPreviewVersion(null);
    setIsReadOnly(false);
    setSaveStatus('saved');
  };

  const handleSelectPreview = (version: PostVersion) => {
    setPreviewVersion(version);
    setTitle(version.title);
    setExcerpt(version.excerpt || '');
    if (editor) {
      editor.commands.setContent(version.content);
    }
    setActiveTab('visual');
  };

  const handleExitPreview = () => {
    setPreviewVersion(null);
    if (post) {
      setTitle(post.currentVersion?.title || post.title || '');
      setExcerpt(post.currentVersion?.excerpt || post.excerpt || '');
      if (editor && post.currentVersion?.content) {
        editor.commands.setContent(post.currentVersion.content);
      }
    }
  };

  const handleRestorePreview = () => {
    if (previewVersion) {
      restoreMutation.mutate(previewVersion.id);
    }
  };

  // Synchronize read-only status in the editor
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isReadOnly && !previewVersion);
    }
  }, [editor, isReadOnly, previewVersion]);

  // Reset initialization ref if post ID changes
  useEffect(() => {
    isContentInitialized.current = false;
  }, [id]);

  // Set initial content and keep it clean
  const isContentInitialized = useRef(false);
  useEffect(() => {
    if (post && editor && !isContentInitialized.current) {
      if (post.currentVersion?.content) {
        editor.commands.setContent(post.currentVersion.content);
        isContentInitialized.current = true;
      }
    }
  }, [post, editor]);

  // Populate title & excerpt state
  useEffect(() => {
    if (post && !previewVersion) {
      setTitle(prev => prev || post.currentVersion?.title || post.title || '');
      setExcerpt(prev => prev || post.currentVersion?.excerpt || post.excerpt || '');
    }
  }, [post, previewVersion]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isReadOnly && !previewVersion) {
      setTitle(e.target.value);
      setSaveStatus('unsaved');
      if (isAutosaveEnabled) {
        debouncedSave();
      }
    }
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isReadOnly && !previewVersion) {
      setExcerpt(e.target.value);
      setSaveStatus('unsaved');
      if (isAutosaveEnabled) {
        debouncedSave();
      }
    }
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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[110] bg-primary text-on-primary px-md py-3 rounded-xl shadow-lg flex items-center gap-sm text-[13px] font-semibold animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[20px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Editor Header */}
      <header className="h-16 border-b border-outline-variant bg-surface flex items-center justify-between px-2 sm:px-md shrink-0">
        <div className="flex items-center gap-1 sm:gap-md">
          <Link to="/dashboard" className="p-2 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="h-6 w-[1px] bg-outline-variant hidden xs:block"></div>
          <div className="flex items-center gap-xs">
            <Logo className="size-4 text-primary mr-1 hidden xs:block" />
            <span className="text-[13px] font-bold text-primary uppercase tracking-tight hidden sm:block">ReDraft Editor</span>
            <span className="text-[10px] font-mono text-on-surface-variant uppercase bg-surface-container px-1.5 rounded tracking-widest">
              {isNew ? 'New Draft' : `v${post?.currentVersion?.versionNumber || '1.0'}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-md">
          {/* Save & Autosave Controls */}
          <div className="flex items-center gap-1 sm:gap-sm mr-1 sm:mr-md border-r border-outline-variant/60 pr-1 sm:pr-md">
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-on-surface-variant uppercase tracking-widest mr-xs select-none">
              {saveStatus === 'saving' && (
                <>
                  <span className="material-symbols-outlined animate-spin text-primary text-[14px]">progress_activity</span>
                  <span className="hidden lg:inline">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <span className="material-symbols-outlined text-[14px] text-green-600">cloud_done</span>
                  <span className="hidden lg:inline">Saved</span>
                </>
              )}
              {saveStatus === 'unsaved' && (
                <>
                  <span className="material-symbols-outlined text-[14px] text-amber-600">pending</span>
                  <span className="hidden lg:inline">Unsaved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <span className="material-symbols-outlined text-[14px] text-red-600">error</span>
                  <span className="hidden lg:inline">Failed</span>
                </>
              )}
            </div>

            {/* Autosave Toggle */}
            <button
              onClick={() => setIsAutosaveEnabled(!isAutosaveEnabled)}
              disabled={!!previewVersion}
              className={`flex items-center gap-xs px-2 py-1.5 rounded-lg text-[12px] font-semibold transition-all border select-none cursor-pointer ${
                isAutosaveEnabled 
                  ? 'bg-green-600/10 text-green-600 border-green-600/30' 
                  : 'text-on-surface-variant hover:bg-surface-container border-outline-variant/60'
              }`}
              title={isAutosaveEnabled ? "Disable automatic saving" : "Enable automatic saving"}
            >
              <span className="material-symbols-outlined text-[18px] leading-none">
                {isAutosaveEnabled ? 'toggle_on' : 'toggle_off'}
              </span>
              <span className="hidden md:inline">Autosave</span>
            </button>

            {/* Manual Save Button */}
            <button
              onClick={handleManualSave}
              disabled={saveStatus === 'saving' || !!previewVersion || saveStatus === 'saved'}
              className="flex items-center gap-xs px-2 sm:px-3 py-1.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold hover:bg-primary/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              title="Save current draft"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span className="hidden xs:inline">Save</span>
            </button>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-sm">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-xs px-2 sm:px-md py-2 rounded-lg text-[13px] font-bold transition-all ${showHistory ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span className="hidden lg:inline">Timeline</span>
            </button>
            <button 
              onClick={() => post?.status === 'published' ? unpublishMutation.mutate() : publishMutation.mutate()}
              disabled={isNew || publishMutation.isPending || unpublishMutation.isPending || !!previewVersion}
              className={`flex items-center gap-xs px-2 sm:px-md py-2 rounded-lg text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-50 ${
                post?.status === 'published' 
                  ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80' 
                  : 'bg-primary-container text-on-primary-container hover:bg-primary-container/80'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {publishMutation.isPending || unpublishMutation.isPending 
                  ? 'progress_activity' 
                  : post?.status === 'published' 
                    ? 'visibility_off' 
                    : 'publish'}
              </span>
              <span className="hidden lg:inline">
                {publishMutation.isPending 
                  ? 'Publishing...' 
                  : unpublishMutation.isPending 
                    ? 'Unpublishing...' 
                    : post?.status === 'published' 
                      ? 'Unpublish' 
                      : 'Publish'}
              </span>
            </button>
            <div className="h-8 w-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-[11px] font-bold hidden sm:flex">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Writing Canvas */}
        <main className="flex-1 overflow-y-auto bg-surface p-md md:p-xl custom-scrollbar relative">
          <div className="max-w-[720px] mx-auto bg-surface-container-lowest shadow-[0_40px_100px_-20px_rgba(0,32,69,0.02)] border border-outline-variant rounded-xl min-h-[calc(100vh-160px)] flex flex-col">
            
            {/* Sticky Formatting Toolbar / Notice Banner */}
            <div className="sticky top-0 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/50 z-30 rounded-t-xl">
              {previewVersion ? (
                <div className="w-full bg-primary/10 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                    <span className="text-[12px] font-semibold text-primary">
                      Viewing Version {previewVersion.versionNumber}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-mono hidden md:inline ml-2">
                      ({new Date(previewVersion.createdAt).toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <button 
                      onClick={handleRestorePreview}
                      disabled={restoreMutation.isPending}
                      className="px-3 py-1 bg-primary text-on-primary hover:opacity-90 rounded-md text-[11px] font-bold shadow-sm transition-all disabled:opacity-50"
                    >
                      {restoreMutation.isPending ? 'Restoring...' : 'Restore'}
                    </button>
                    <button 
                      onClick={handleExitPreview}
                      className="px-3 py-1 border border-outline text-primary hover:bg-surface-container-low rounded-md text-[11px] font-bold transition-all bg-transparent"
                    >
                      Exit Preview
                    </button>
                  </div>
                </div>
              ) : isReadOnly ? (
                <div className="w-full bg-secondary-container/20 px-4 sm:px-6 py-3 flex items-center justify-between animate-in fade-in duration-200">
                  <div className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-secondary text-[18px]">visibility</span>
                    <span className="text-[12px] font-semibold text-secondary">
                      Read-Only Mode Active
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsReadOnly(false)}
                    className="px-3 py-1 bg-primary text-on-primary hover:opacity-95 rounded-md text-[11px] font-bold transition-all"
                  >
                    Switch to Edit
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-surface-container-lowest overflow-x-auto custom-scrollbar no-scrollbar">
                  {/* Formatting Buttons */}
                  <div className="flex items-center gap-0.5 flex-nowrap sm:flex-wrap">
                    <button
                      onClick={() => editor?.chain().focus().setParagraph().run()}
                      className={`p-1.5 rounded transition-all shrink-0 ${editor?.isActive('paragraph') ? 'bg-primary/10 text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                      title="Paragraph"
                    >
                      <span className="material-symbols-outlined text-[18px]">format_paragraph</span>
                    </button>

                    <div className="h-4 w-[1px] bg-outline-variant/60 mx-1 shrink-0"></div>

                    <button
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={`px-2 py-1 text-[11px] font-bold rounded transition-all shrink-0 ${editor?.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`px-2 py-1 text-[11px] font-bold rounded transition-all shrink-0 ${editor?.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`px-2 py-1 text-[11px] font-bold rounded transition-all shrink-0 ${editor?.isActive('heading', { level: 3 }) ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                      title="Heading 3"
                    >
                      H3
                    </button>

                    <div className="h-4 w-[1px] bg-outline-variant/60 mx-1 shrink-0"></div>

                    <button
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-1.5 rounded transition-all shrink-0 ${editor?.isActive('bold') ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                      title="Bold"
                    >
                      <span className="material-symbols-outlined text-[18px]">format_bold</span>
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-1.5 rounded transition-all shrink-0 ${editor?.isActive('italic') ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                      title="Italic"
                    >
                      <span className="material-symbols-outlined text-[18px]">format_italic</span>
                    </button>

                    <div className="h-4 w-[1px] bg-outline-variant/60 mx-1 shrink-0"></div>

                    <button
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`p-1.5 rounded transition-all shrink-0 ${editor?.isActive('bulletList') ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                      title="Bullet List"
                    >
                      <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                    </button>
                    <button
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={`p-1.5 rounded transition-all shrink-0 ${editor?.isActive('orderedList') ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'}`}
                      title="Numbered List"
                    >
                      <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                    </button>
                  </div>

                  {/* Right-aligned Toolbar Controls */}
                  <div className="flex items-center gap-sm ml-2">
                    <button 
                      onClick={() => setIsReadOnly(true)}
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded transition-all shrink-0"
                      title="Enter Read-Only Mode"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    <div className="h-4 w-[1px] bg-outline-variant/60 shrink-0"></div>
                    <div className="flex bg-surface-container-low p-0.5 rounded-lg text-xs font-bold shrink-0">
                      <button 
                        onClick={() => setActiveTab('visual')}
                        className={`px-2 py-1 sm:px-2.5 rounded-md transition-all ${activeTab === 'visual' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                      >
                        Visual
                      </button>
                      <button 
                        onClick={() => setActiveTab('json')}
                        className={`px-2 py-1 sm:px-2.5 rounded-md transition-all ${activeTab === 'json' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                      >
                        JSON
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Document Header (Title & Excerpt) */}
            <div className="p-6 sm:p-8 md:p-12 pb-0 flex-shrink-0">
              <input 
                className="w-full text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-tight text-primary placeholder:text-outline-variant focus:outline-none bg-transparent mb-4 sm:mb-6 border-none ring-0 disabled:opacity-70" 
                placeholder="The Architectural Permanence..." 
                type="text"
                value={title}
                onChange={handleTitleChange}
                disabled={isReadOnly || !!previewVersion}
              />
              <textarea 
                className="w-full text-[18px] sm:text-[20px] md:text-[24px] font-semibold text-on-surface-variant placeholder:text-outline-variant focus:outline-none bg-transparent resize-none h-auto border-none ring-0 min-h-[60px] disabled:opacity-70" 
                placeholder="An inquiry into the longevity of digital drafts and the philosophy of version control."
                value={excerpt}
                onChange={handleExcerptChange}
                disabled={isReadOnly || !!previewVersion}
              />
              <div className="h-1 w-12 bg-outline-variant my-6 sm:my-8"></div>
            </div>

            {/* Document Content View */}
            {activeTab === 'visual' ? (
              <div className="p-6 sm:p-8 md:p-12 pt-0 flex-grow">
                <EditorContent 
                  editor={editor} 
                  className={`editor-surface text-[18px] sm:text-[20px] leading-[28px] sm:leading-[32px] font-serif text-on-surface outline-none min-h-[400px] ${isReadOnly || !!previewVersion ? 'opacity-85' : ''}`} 
                />
              </div>
            ) : (
              <div className="px-6 sm:px-8 md:px-12 pb-12 flex-grow flex flex-col">
                <div className="bg-tertiary-container text-on-tertiary-container rounded-xl p-4 sm:p-6 font-mono text-[13px] relative overflow-hidden flex flex-col flex-1 border border-outline-variant/20 min-h-[400px]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-on-tertiary-container/60">TipTap JSON Output</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(editor?.getJSON(), null, 2));
                        showToast('JSON copied to clipboard!');
                      }}
                      className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container-high text-primary rounded-md text-[11px] font-bold transition-all shadow flex items-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      <span className="hidden xs:inline">Copy JSON</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre overflow-auto max-h-[500px] flex-1 leading-relaxed custom-scrollbar text-on-tertiary-container/90">
                    {editor ? JSON.stringify(editor.getJSON(), null, 2) : '{}'}
                  </pre>
                </div>
              </div>
            )}

            {/* Document Footer */}
            <footer className="px-6 sm:px-12 py-6 border-t border-outline-variant/30 flex flex-col sm:row justify-between items-center gap-4 bg-surface-container-low/30 rounded-b-xl">
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
          <>
            {/* Mobile Overlay Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[90] lg:hidden"
              onClick={() => setShowHistory(false)}
            />
            <aside className="fixed lg:relative right-0 top-0 bottom-0 w-[300px] sm:w-[320px] bg-surface z-[100] lg:z-0 shadow-2xl lg:shadow-none border-l border-outline-variant shrink-0 animate-in slide-in-from-right duration-300">
              <HistoryPanel 
                postId={id!} 
                onRestore={handleRestore} 
                onSelectPreview={handleSelectPreview}
                onClose={() => setShowHistory(false)}
              />
            </aside>
          </>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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
          height: 6px;
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
