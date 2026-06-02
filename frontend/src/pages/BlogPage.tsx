import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPublicPosts, searchPosts } from '../api/posts';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/Logo';

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const token = useAuthStore((s) => s.token);
  
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['publicPosts'],
    queryFn: fetchPublicPosts,
    enabled: searchQuery.length < 3,
  });

  const { data: searchResults, isLoading: isSearchLoading, isError: isSearchError } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchPosts(searchQuery),
    enabled: searchQuery.length >= 3,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const displayPosts = searchQuery.length >= 3 ? searchResults : posts;
  const isLoading = searchQuery.length >= 3 ? isSearchLoading : isPostsLoading;
  const isError = searchQuery.length >= 3 ? isSearchError : false;

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-hanken">
      {/* TopNavBar */}
      <nav className="bg-surface border-b border-outline-variant w-full h-16 z-50 sticky top-0">
        <div className="flex justify-between items-center w-full px-sm md:px-lg h-full max-w-7xl mx-auto">
          <div className="flex items-center gap-md">
            <Link to="/blog" className="flex items-center gap-xs text-2xl font-bold text-primary tracking-tight">
              <Logo className="size-6 text-primary" />
              <span>ReDraft</span>
            </Link>
            <div className="hidden md:flex gap-md items-center">
              <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold uppercase tracking-wider">Dashboard</Link>
              <Link to="/blog" className="text-primary font-bold border-b-2 border-primary pb-1 text-[13px] uppercase tracking-wider">Browse</Link>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input 
                className="pl-10 pr-4 py-1.5 bg-surface-container border border-outline-variant rounded-full text-base focus:ring-2 focus:ring-primary focus:border-primary w-64 outline-none transition-all" 
                type="text" 
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center gap-xs">
              <Link 
                to={token ? "/dashboard" : "/login"} 
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
                title={token ? "Go to Dashboard" : "Sign In"}
              >
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-lg pb-xl px-sm">
        <div className="max-w-[720px] mx-auto">
          {/* Search Results Header */}
          <header className="mb-lg">
            <p className="text-[13px] font-semibold text-secondary uppercase tracking-wider mb-xs">
              {searchQuery.length >= 3 ? 'Search Results' : 'The Editorial'}
            </p>
            <h1 className="text-[32px] font-bold tracking-tight text-primary leading-tight">
              {searchQuery.length >= 3 ? (
                <>Results for "<span className="italic">{searchQuery}</span>"</>
              ) : (
                'Latest Publications'
              )}
            </h1>
            {searchQuery.length >= 3 && (
              <p className="text-base text-on-surface-variant mt-2">
                {displayPosts?.length || 0} matches found.
              </p>
            )}
          </header>

          {/* Results List */}
          <div className="space-y-md">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm space-y-sm">
                  <div className="w-3/4 h-8 skeleton rounded"></div>
                  <div className="w-1/4 h-4 skeleton rounded"></div>
                  <div className="w-full h-20 skeleton rounded"></div>
                </div>
              ))
            ) : isError ? (
              <div className="mt-xl py-lg border-t border-error/20 flex flex-col items-center text-center bg-error-container/10 rounded-lg">
                <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-error text-[32px]">error</span>
                </div>
                <h3 className="text-base font-bold text-error">Search failed</h3>
                <p className="text-[13px] font-semibold text-on-surface-variant max-w-sm mx-auto mt-2">
                  There was an error connecting to the search service. Please try again later.
                </p>
              </div>
            ) : displayPosts && displayPosts.length > 0 ? (
              displayPosts.map((post: any) => (
                <article key={post.id} className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary transition-all group cursor-pointer shadow-sm relative overflow-hidden">
                  <Link to={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
                  <div className="flex flex-col gap-xs">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-primary group-hover:text-primary-container transition-colors leading-tight">
                        {searchQuery.length >= 3 ? (
                          <span dangerouslySetInnerHTML={{ 
                            __html: post.title.replace(
                              new RegExp(`(${searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split(/\s+/).join('|')})`, 'gi'), 
                              '<b>$1</b>'
                            ) 
                          }} />
                        ) : (
                          post.currentVersion?.title || post.title
                        )}
                      </h2>
                    </div>
                    <div className="flex items-center gap-xs text-[13px] font-semibold text-secondary">
                      <span>{post.author?.name || 'Author'}</span>
                      <span className="text-[8px]">•</span>
                      <span>
                        {new Date(post.createdAt || post.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        {' at '}
                        {new Date(post.createdAt || post.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="mt-sm text-[18px] leading-[28px] font-serif text-on-surface-variant line-clamp-3">
                      {searchQuery.length >= 3 ? (
                        <div dangerouslySetInnerHTML={{ __html: post.headline }} className="search-highlight" />
                      ) : (
                        post.currentVersion?.excerpt || post.excerpt
                      )}
                    </div>
                    <div className="mt-md flex items-center gap-xs text-primary font-bold text-[13px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Full Article
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="mt-xl py-lg border-t border-outline-variant flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px]">auto_stories</span>
                </div>
                <h3 className="text-base font-bold text-primary">No results found</h3>
                <p className="text-[13px] font-semibold text-on-surface-variant max-w-sm mx-auto mt-2">
                  Not finding what you're looking for? Try searching for different keywords or browse our archives.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-md px-md py-2 bg-primary text-on-primary rounded-full text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>

          {/* Empty State / Suggestion */}
          {!isLoading && displayPosts && displayPosts.length > 0 && (
            <div className="mt-xl py-lg border-t border-outline-variant flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-on-surface-variant text-[32px]">auto_stories</span>
              </div>
              <h3 className="text-base font-bold text-primary">Keep exploring the archive</h3>
              <p className="text-[13px] font-semibold text-on-surface-variant max-w-sm mx-auto mt-2">
                Discover more perspectives on design, technology, and the future of drafting.
              </p>
              <button className="mt-md px-md py-2 bg-primary text-on-primary rounded-full text-[13px] font-semibold hover:opacity-90 transition-opacity">
                View Full Archive
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full">
        <div className="w-full py-lg px-sm md:px-xl flex flex-col md:flex-row justify-between items-center gap-sm max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-xs">
            <div className="flex items-center gap-xs">
              <Logo className="size-4 text-primary" />
              <span className="text-[13px] font-bold text-primary uppercase tracking-tighter">ReDraft</span>
            </div>
            <p className="text-[13px] text-on-surface-variant">© 2024 ReDraft Publishing. Built for permanence.</p>
          </div>
          <div className="flex gap-md">
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold" to="#">Terms</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold" to="#">Privacy</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold" to="#">Changelog</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold" to="#">Support</Link>
          </div>
        </div>
      </footer>

      <style>{`
        .search-highlight b {
          background-color: var(--color-primary-fixed);
          color: var(--color-on-primary-fixed);
          padding: 0 2px;
          border-radius: 2px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;
