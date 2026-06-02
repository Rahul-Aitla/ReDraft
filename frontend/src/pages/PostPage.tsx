import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicPostBySlug } from '../api/posts';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['publicPost', slug],
    queryFn: () => fetchPublicPostBySlug(slug!),
    enabled: !!slug,
    retry: false,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: post?.currentVersion?.content || '',
    editable: false,
  }, [post]);

  if (isLoading) {
    return (
      <div className="bg-background text-on-background font-hanken min-h-screen">
        {/* TopNavBar Skeleton */}
        <header className="bg-surface border-b border-outline-variant fixed top-0 w-full z-50 h-16">
          <div className="flex justify-between items-center w-full px-sm md:px-lg h-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-md">
              <span className="text-2xl font-bold text-primary tracking-tight">EverDraft</span>
              <nav className="hidden md:flex gap-sm items-center">
                <div className="w-20 h-4 skeleton rounded"></div>
                <div className="w-24 h-4 skeleton rounded"></div>
                <div className="w-16 h-4 skeleton rounded"></div>
              </nav>
            </div>
          </div>
        </header>

        <main className="pt-24 min-h-screen pb-20">
          <div className="max-w-[1000px] mx-auto px-sm md:px-lg flex flex-col md:flex-row gap-lg">
            <div className="flex-1 max-w-[720px] mx-auto">
              <div className="flex items-center gap-xs mb-lg">
                <div className="w-4 h-4 skeleton rounded-full"></div>
                <div className="w-24 h-4 skeleton rounded"></div>
              </div>
              <header className="mb-xl">
                <div className="w-full h-12 skeleton rounded mb-sm"></div>
                <div className="w-3/4 h-12 skeleton rounded mb-lg"></div>
                <div className="flex items-center gap-md border-y border-outline-variant/30 py-md">
                  <div className="w-10 h-10 skeleton rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 skeleton rounded"></div>
                    <div className="flex gap-sm">
                      <div className="w-20 h-3 skeleton rounded"></div>
                      <div className="w-16 h-3 skeleton rounded"></div>
                    </div>
                  </div>
                </div>
              </header>
              <div className="w-full aspect-video skeleton rounded-xl mb-xl"></div>
              <article className="space-y-lg">
                <div className="space-y-xs">
                  <div className="w-full h-4 skeleton rounded"></div>
                  <div className="w-full h-4 skeleton rounded"></div>
                  <div className="w-full h-4 skeleton rounded"></div>
                  <div className="w-5/6 h-4 skeleton rounded"></div>
                </div>
              </article>
            </div>
            <aside className="hidden xl:block w-48 sticky top-24 h-fit">
              <div className="w-32 h-4 skeleton rounded mb-md"></div>
              <div className="space-y-sm">
                <div className="w-full h-3 skeleton rounded"></div>
                <div className="w-10/12 h-3 skeleton rounded"></div>
                <div className="w-11/12 h-3 skeleton rounded"></div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="font-hanken text-on-surface bg-background min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant h-16">
          <div className="flex justify-between items-center w-full px-sm md:px-lg h-16 max-w-7xl mx-auto">
            <Link to="/blog" className="text-2xl font-bold text-primary tracking-tight">EverDraft</Link>
          </div>
        </header>
        <main className="flex-1 p-md md:p-xl flex items-center justify-center pt-16">
          <div className="max-w-[720px] w-full text-center">
            <div className="relative mb-lg flex justify-center">
              <div className="relative w-64 h-64 bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-outline-variant text-[120px]">description</span>
                <div className="absolute -bottom-4 -right-4 bg-error-container p-sm rounded-full border border-error">
                  <span className="material-symbols-outlined text-error text-[32px]">error</span>
                </div>
              </div>
            </div>
            <div className="space-y-sm">
              <h1 className="text-3xl font-bold text-primary tracking-tight">Article Not Found</h1>
              <div className="h-1 w-12 bg-outline-variant mx-auto my-md"></div>
              <p className="text-[20px] leading-[32px] font-serif text-on-surface-variant max-w-md mx-auto">
                The document you are looking for has been moved, unpublished, or the link may be broken. Our editorial records indicate this archive is no longer at this address.
              </p>
            </div>
            <div className="mt-xl flex flex-col md:flex-row gap-sm justify-center items-center">
              <Link to="/blog" className="px-lg py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-xs">
                <span className="material-symbols-outlined">arrow_back</span>
                Return to Browse
              </Link>
              <Link to="#" className="px-lg py-3 border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-container transition-all flex items-center gap-xs">
                <span className="material-symbols-outlined">contact_support</span>
                Contact Support
              </Link>
            </div>
            <div className="mt-xl pt-lg border-t border-outline-variant/30">
              <p className="font-mono text-[12px] text-on-surface-variant/50 uppercase tracking-widest">
                Ref Code: ED-404-UNPUBLISHED
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-hanken antialiased min-h-screen flex flex-col">
      {/* Minimal Back Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <Link className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors text-[13px] font-semibold uppercase tracking-wider" to="/blog">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Editorial</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-mono text-on-surface-variant uppercase tracking-widest">EverDraft // V2.4.1</span>
            <div className="h-4 w-[1px] bg-outline-variant"></div>
            <button className="bg-primary text-on-primary px-4 py-1.5 rounded text-[13px] font-semibold hover:bg-primary-container transition-all uppercase tracking-wider">
              Follow Series
            </button>
          </div>
        </div>
      </nav>

      <main className="relative flex flex-col items-center pt-xl pb-xl px-4 flex-grow">
        {/* Floating Table of Contents */}
        <aside className="hidden xl:block fixed left-[calc(50%-600px)] top-40 w-[280px]">
          <div className="flex flex-col gap-6">
            <h4 className="text-[13px] font-semibold text-on-surface-variant uppercase tracking-widest">In this article</h4>
            <nav className="flex flex-col border-l border-outline-variant">
              <a className="pl-4 py-2 text-sm transition-all hover:bg-surface-container text-primary font-bold border-l-2 border-primary" href="#">Introduction</a>
              <a className="pl-4 py-2 text-sm text-on-surface-variant transition-all hover:bg-surface-container border-l-2 border-transparent" href="#">The Aesthetic Turn</a>
              <a className="pl-4 py-2 text-sm text-on-surface-variant transition-all hover:bg-surface-container border-l-2 border-transparent" href="#">Cognitive Load</a>
            </nav>
            <div className="mt-8 p-4 bg-surface-container-low rounded-lg border border-outline-variant">
              <p className="text-[13px] font-semibold text-primary mb-2 uppercase tracking-wider">Reading Time</p>
              <p className="font-mono text-lg">8 MINS</p>
            </div>
          </div>
        </aside>

        {/* Main Article Container */}
        <article className="max-w-[720px] w-full bg-surface-container-lowest shadow-[0_40px_100px_-20px_rgba(0,32,69,0.02)] border border-outline-variant rounded-xl overflow-hidden">
          {/* Hero Header */}
          <header className="p-8 md:p-12 border-b border-outline-variant bg-surface-bright">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[11px] font-bold rounded uppercase tracking-tighter">Editorial</span>
              <span className="text-[12px] font-mono text-on-surface-variant">
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
              </span>
            </div>
            <h1 className="text-[48px] font-bold leading-tight tracking-tight text-primary mb-6">
              {post.currentVersion?.title || post.title}
            </h1>
            <p className="text-[24px] font-semibold text-on-surface-variant mb-8 leading-relaxed font-hanken">
              {post.currentVersion?.excerpt || post.excerpt}
            </p>
            <div className="flex items-center justify-between pt-8 border-t border-outline-variant">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="font-bold text-primary">{post.author?.name || 'Author'}</p>
                  <p className="text-[11px] text-on-surface-variant uppercase tracking-wider">Contributor</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant">bookmark</span>
                </button>
                <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant">share</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-8 md:p-12 prose prose-slate max-w-none">
            <EditorContent editor={editor} className="text-[20px] leading-[32px] font-serif text-on-surface" />
          </div>

          {/* Article Footer */}
          <footer className="p-8 md:p-12 bg-surface-container-low border-t border-outline-variant">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-white border border-outline px-6 py-2 rounded text-primary hover:bg-primary hover:text-white transition-all font-bold">
                  <span className="material-symbols-outlined">thumb_up</span>
                  <span>APPRAISE</span>
                </button>
                <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">chat_bubble</span>
                  <span>JOIN DISCUSSION</span>
                </button>
              </div>
              <div className="flex gap-4">
                <Link className="text-on-surface-variant hover:text-primary transition-colors font-mono text-[12px]" to="#">TWITTER</Link>
                <Link className="text-on-surface-variant hover:text-primary transition-colors font-mono text-[12px]" to="#">LINKEDIN</Link>
              </div>
            </div>
          </footer>
        </article>

        {/* Newsletter Section */}
        <section className="max-w-[720px] w-full mt-12 bg-primary-container text-on-primary p-8 md:p-12 rounded-xl border border-primary">
          <h3 className="text-2xl font-bold mb-4">Stay Refined</h3>
          <p className="text-on-primary-container mb-8 max-w-md">Get our weekly dispatch on the philosophy of design, delivered in plain text for maximum readability.</p>
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input className="flex-1 bg-white/10 border-white/20 rounded px-4 py-3 text-white focus:ring-2 focus:ring-inverse-primary outline-none transition-all placeholder:text-on-primary/40" placeholder="email@address.com" type="email" />
            <button className="bg-primary text-on-primary px-8 py-3 rounded font-bold hover:bg-white hover:text-primary transition-all">SUBSCRIBE</button>
          </form>
        </section>

        {/* Back Link Bottom */}
        <div className="mt-12 text-center">
          <Link className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors py-4" to="/blog">
            <span className="material-symbols-outlined">west</span>
            <span className="text-[13px] font-semibold uppercase tracking-widest">Return to Index</span>
          </Link>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="w-full bg-surface-container-high py-12 px-6 mt-auto">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">EverDraft Premium</h2>
          </div>
          <div className="flex gap-8 text-sm text-on-surface-variant font-semibold uppercase tracking-wider">
            <Link className="hover:text-primary transition-colors" to="#">Archive</Link>
            <Link className="hover:text-primary transition-colors" to="#">Ethos</Link>
            <Link className="hover:text-primary transition-colors" to="#">Submissions</Link>
          </div>
          <p className="text-[12px] font-mono text-on-surface-variant opacity-60 uppercase">© 2024 EVERDRAFT EDITORIAL. BUILT FOR FOCUS.</p>
        </div>
      </footer>
    </div>
  );
};

export default PostPage;
