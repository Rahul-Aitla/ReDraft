import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyPosts, publishPost, unpublishPost } from '../api/posts';
import { useAuthStore } from '../store/authStore';

const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [search, setSearch] = useState('');
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchMyPosts,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const publishMutation = useMutation({
    mutationFn: publishPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const unpublishMutation = useMutation({
    mutationFn: unpublishPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredPosts = posts?.filter(post => {
    const matchesFilter = filter === 'all' || post.status === filter;
    const matchesSearch = post.currentVersion?.title?.toLowerCase().includes(search.toLowerCase()) || 
                          post.title?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: posts?.length || 0,
    published: posts?.filter(p => p.status === 'published').length || 0,
    drafts: posts?.filter(p => p.status === 'draft').length || 0,
    words: posts?.reduce((acc, p) => acc + (p.currentVersion?.content ? JSON.stringify(p.currentVersion.content).split(' ').length : 0), 0) || 0
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-hanken">
      {/* TopNavBar */}
      <header className="bg-surface border-b border-outline-variant fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex justify-between items-center w-full px-sm md:px-lg h-full max-w-7xl mx-auto">
          <div className="flex items-center gap-md">
            <Link to="/blog" className="text-2xl font-bold text-primary tracking-tight">EverDraft</Link>
            <nav className="hidden md:flex items-center gap-md ml-lg">
              <Link to="/dashboard" className="text-primary font-bold border-b-2 border-primary pb-1 text-[13px] uppercase tracking-wider">Dashboard</Link>
              <Link to="/editor/new" className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold uppercase tracking-wider">New Article</Link>
              <Link to="/blog" className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold uppercase tracking-wider">Browse</Link>
            </nav>
          </div>
          <div className="flex items-center gap-sm">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant scale-75">search</span>
              <input 
                className="bg-surface-container-low border border-outline-variant rounded-lg pl-9 pr-4 py-1.5 text-[13px] focus:outline-none focus:border-primary w-64 outline-none" 
                placeholder="Search articles..." 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-on-surface-variant hover:text-error transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
            <div className="flex items-center gap-2 px-2 py-1 bg-surface-container rounded-full border border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
              <span className="text-[13px] font-bold text-primary pr-2 hidden md:block">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* SideNavBar */}
        <aside className="hidden lg:flex flex-col h-[calc(100vh-64px)] py-md bg-surface-container-low border-r border-outline-variant fixed left-0 w-[280px]">
          <div className="px-md mb-lg">
            <div className="flex items-center gap-sm mb-xs">
              <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-primary">EverDraft Editor</h3>
                <p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">V2.4.0 Running</p>
              </div>
            </div>
          </div>
          <nav className="flex-grow space-y-1">
            <button onClick={() => setFilter('all')} className={`flex items-center gap-sm w-[calc(100%-16px)] mx-2 px-4 py-3 rounded-lg transition-all active:scale-95 ${filter === 'all' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-[13px] font-semibold">All Articles</span>
            </button>
            <button onClick={() => setFilter('published')} className={`flex items-center gap-sm w-[calc(100%-16px)] mx-2 px-4 py-3 rounded-lg transition-all active:scale-95 ${filter === 'published' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">verified</span>
              <span className="text-[13px] font-semibold">Published</span>
            </button>
            <button onClick={() => setFilter('draft')} className={`flex items-center gap-sm w-[calc(100%-16px)] mx-2 px-4 py-3 rounded-lg transition-all active:scale-95 ${filter === 'draft' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">edit_note</span>
              <span className="text-[13px] font-semibold">Drafts</span>
            </button>
          </nav>
          <div className="mt-auto px-2 space-y-1 border-t border-outline-variant pt-md">
            <Link to="/editor/new" className="w-full flex items-center justify-center gap-sm bg-primary text-on-primary py-3 rounded-lg text-[13px] font-bold mb-lg hover:opacity-90 transition-opacity">
              Publish Version
            </Link>
            <Link className="flex items-center gap-sm text-on-surface-variant px-4 py-3 hover:bg-surface-container-high transition-all rounded-lg" to="#">
              <span className="material-symbols-outlined">help</span>
              <span className="text-[13px] font-semibold">Help</span>
            </Link>
            <Link className="flex items-center gap-sm text-on-surface-variant px-4 py-3 hover:bg-surface-container-high transition-all rounded-lg" to="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-[13px] font-semibold">Settings</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow lg:ml-[280px] w-full">
          <div className="max-w-6xl mx-auto px-md py-lg lg:px-xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
              <div>
                <h1 className="text-[48px] font-bold tracking-tight text-primary mb-xs">Your Library</h1>
                <p className="text-on-surface-variant max-w-xl">
                  Manage your collective consciousness. Every draft, every revision, preserved with architectural permanence.
                </p>
              </div>
              <Link to="/editor/new" className="flex items-center justify-center gap-sm px-lg py-md bg-primary text-on-primary rounded-lg text-[13px] font-bold hover:opacity-90 transition-opacity shadow-sm">
                <span className="material-symbols-outlined">add</span>
                Create New Article
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm mb-lg border-b border-outline-variant pb-lg">
              <div className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg">
                <p className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider mb-xs">Total Articles</p>
                <p className="text-[32px] font-bold text-primary">{stats.total}</p>
              </div>
              <div className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg">
                <p className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider mb-xs">Published</p>
                <p className="text-[32px] font-bold text-primary">{stats.published}</p>
              </div>
              <div className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg">
                <p className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider mb-xs">Drafts</p>
                <p className="text-[32px] font-bold text-primary">{stats.drafts}</p>
              </div>
              <div className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg">
                <p className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider mb-xs">Words Written</p>
                <p className="text-[32px] font-bold text-primary">{Math.round(stats.words / 100) / 10}k</p>
              </div>
            </div>

            {/* Filter & Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,32,69,0.02)]">
              <div className="flex items-center px-lg py-md border-b border-outline-variant bg-surface-container-low">
                <div className="flex gap-md">
                  <button onClick={() => setFilter('all')} className={`text-[13px] font-bold uppercase tracking-wider transition-all ${filter === 'all' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>All Articles</button>
                  <button onClick={() => setFilter('published')} className={`text-[13px] font-bold uppercase tracking-wider transition-all ${filter === 'published' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Published</button>
                  <button onClick={() => setFilter('draft')} className={`text-[13px] font-bold uppercase tracking-wider transition-all ${filter === 'draft' ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>Drafts</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest border-b border-outline-variant">
                      <th className="px-lg py-md text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Article Title</th>
                      <th className="px-md py-md text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-md py-md text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Versions</th>
                      <th className="px-md py-md text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Last Edited</th>
                      <th className="px-lg py-md text-right text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {isLoading ? (
                      [1, 2, 3].map(i => (
                        <tr key={i}>
                          <td colSpan={5} className="px-lg py-8"><div className="w-full h-8 skeleton rounded"></div></td>
                        </tr>
                      ))
                    ) : filteredPosts && filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-surface-container-low transition-colors group">
                          <td className="px-lg py-lg">
                            <div className="flex items-center gap-md">
                              <div className="w-12 h-16 bg-surface-container-high rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden border border-outline-variant">
                                <span className="material-symbols-outlined text-outline-variant">description</span>
                              </div>
                              <div>
                                <Link to={`/editor/${post.id}`} className="text-base font-bold text-primary group-hover:underline">{post.currentVersion?.title || 'Untitled Article'}</Link>
                                <p className="text-[13px] text-on-surface-variant mt-1 italic line-clamp-1">{post.currentVersion?.excerpt || 'No excerpt...'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-md py-lg">
                            <span className={`px-3 py-1 rounded-full text-[13px] font-bold ${post.status === 'published' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-md py-lg">
                            <div className="flex items-center gap-xs">
                              <span className="material-symbols-outlined text-sm text-primary">history</span>
                              <span className="text-[12px] font-mono text-primary font-bold">v{post.currentVersion?.versionNumber || 1}</span>
                            </div>
                          </td>
                          <td className="px-md py-lg">
                            <p className="text-[12px] font-mono text-on-surface-variant uppercase">{new Date(post.updatedAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-lg py-lg text-right">
                            <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link to={`/editor/${post.id}`} className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors text-on-surface-variant" title="Edit">
                                <span className="material-symbols-outlined">edit</span>
                              </Link>
                              <button 
                                onClick={() => post.status === 'published' ? unpublishMutation.mutate(post.id) : publishMutation.mutate(post.id)}
                                className={`p-2 rounded-lg transition-colors ${post.status === 'published' ? 'text-secondary hover:bg-secondary/10' : 'text-primary hover:bg-primary/10'}`} 
                                title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                              >
                                <span className="material-symbols-outlined">{post.status === 'published' ? 'visibility_off' : 'publish'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-lg py-20 text-center italic text-on-surface-variant">
                          No articles found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-lg px-sm md:px-xl flex flex-col md:flex-row justify-between items-center gap-sm bg-surface-container-lowest border-t border-outline-variant mt-auto">
        <div className="flex flex-col md:flex-row items-center gap-md">
          <span className="text-[13px] font-bold text-primary">EverDraft</span>
          <span className="text-on-surface-variant text-[13px]">© 2024 EverDraft Publishing. Built for permanence.</span>
        </div>
        <div className="flex gap-md">
          <Link className="text-on-surface-variant hover:text-primary underline text-[13px]" to="#">Terms</Link>
          <Link className="text-on-surface-variant hover:text-primary underline text-[13px]" to="#">Privacy</Link>
          <Link className="text-on-surface-variant hover:text-primary underline text-[13px]" to="#">Changelog</Link>
          <Link className="text-on-surface-variant hover:text-primary underline text-[13px]" to="#">Support</Link>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
