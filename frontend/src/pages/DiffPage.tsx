import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchVersions, fetchVersion, fetchDiff } from '../api/posts';

const DiffPage: React.FC = () => {
  const { id, v1, v2 } = useParams<{ id: string; v1: string; v2: string }>();
  const navigate = useNavigate();
  
  const leftCanvasRef = useRef<HTMLDivElement>(null);
  const rightCanvasRef = useRef<HTMLDivElement>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: versions } = useQuery({
    queryKey: ['versions', id],
    queryFn: () => fetchVersions(id!),
  });

  const { data: version1 } = useQuery({
    queryKey: ['version', id, v1],
    queryFn: () => fetchVersion(id!, v1!),
  });

  const { data: version2 } = useQuery({
    queryKey: ['version', id, v2],
    queryFn: () => fetchVersion(id!, v2!),
  });

  const { data: diff } = useQuery({
    queryKey: ['diff', id, v1, v2],
    queryFn: () => fetchDiff(id!, v1!, v2!),
    enabled: !!v1 && !!v2,
  });

  const syncScroll = (side: 'left' | 'right') => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    if (side === 'left' && leftCanvasRef.current && rightCanvasRef.current) {
      rightCanvasRef.current.scrollTop = leftCanvasRef.current.scrollTop;
    } else if (side === 'right' && leftCanvasRef.current && rightCanvasRef.current) {
      leftCanvasRef.current.scrollTop = rightCanvasRef.current.scrollTop;
    }
    
    setTimeout(() => setIsSyncing(false), 50);
  };

  const stats = useMemo(() => {
    if (!diff) return { additions: 0, deletions: 0 };
    return diff.reduce((acc, segment) => {
      if (segment.type === 'insert') acc.additions += segment.text.split(' ').length;
      if (segment.type === 'delete') acc.deletions += segment.text.split(' ').length;
      return acc;
    }, { additions: 0, deletions: 0 });
  }, [diff]);

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col font-hanken overflow-hidden">
      {/* TopNavBar */}
      <nav className="bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg h-16 shrink-0 z-50">
        <div className="flex items-center gap-md">
          <Link to="/blog" className="text-2xl font-bold text-primary tracking-tight">EverDraft</Link>
          <div className="hidden md:flex gap-md items-center h-full ml-lg">
            <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold uppercase tracking-wider">Dashboard</Link>
            <Link to={`/editor/${id}`} className="text-on-surface-variant hover:text-primary transition-colors text-[13px] font-semibold uppercase tracking-wider">Editor</Link>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
            JD
          </div>
        </div>
      </nav>

      {/* Sub-Header: Comparison Stats & Actions */}
      <header className="bg-surface-container-low border-b border-outline-variant px-lg py-sm flex justify-between items-center shrink-0">
        <div className="flex items-center gap-md">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Comparing Versions</span>
            <div className="flex items-center gap-xs mt-1">
              <span className="font-mono text-[11px] px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded">V{versions?.find(v => v.id === v1)?.versionNumber || '?'}</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">arrow_forward</span>
              <span className="font-mono text-[11px] px-2 py-0.5 bg-primary-container text-on-primary-container rounded">V{versions?.find(v => v.id === v2)?.versionNumber || '?'}</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-outline-variant mx-sm hidden md:block"></div>
          <div className="flex gap-md text-[13px] font-semibold">
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              <span className="text-on-surface-variant">{stats.additions} additions</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span className="text-on-surface-variant">{stats.deletions} deletions</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => navigate(`/editor/${id}`)}
            className="px-md py-2 border border-outline text-primary text-[13px] font-bold rounded hover:bg-surface-container-high transition-all"
          >
            Cancel Comparison
          </button>
          <button className="px-md py-2 bg-primary text-on-primary text-[13px] font-bold rounded hover:opacity-90 transition-all shadow-sm">
            Restore Selected
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Diff Content */}
        <main className="flex-1 flex overflow-hidden bg-white">
          {/* Left Side: Version 1 */}
          <section className="flex-1 flex flex-col border-r border-outline-variant overflow-hidden">
            <div className="p-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center shrink-0">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                Version {versions?.find(v => v.id === v1)?.versionNumber} — {new Date(version1?.createdAt || '').toLocaleDateString()}
              </span>
            </div>
            <div 
              ref={leftCanvasRef}
              onScroll={() => syncScroll('left')}
              className="flex-1 overflow-y-auto p-lg md:p-xl custom-scrollbar"
            >
              <div className="max-w-[720px] mx-auto">
                <h1 className="text-[32px] font-bold text-primary mb-lg tracking-tight">{version1?.title}</h1>
                <div className="text-[20px] leading-[32px] font-serif text-on-surface space-y-md">
                  <div className="whitespace-pre-wrap">
                    {version1?.contentText}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Side: Version 2 (The Diff) */}
          <section className="flex-1 flex flex-col overflow-hidden">
            <div className="p-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center shrink-0">
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                Version {versions?.find(v => v.id === v2)?.versionNumber} (Comparison)
              </span>
              <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">Active</span>
            </div>
            <div 
              ref={rightCanvasRef}
              onScroll={() => syncScroll('right')}
              className="flex-1 overflow-y-auto p-lg md:p-xl custom-scrollbar"
            >
              <div className="max-w-[720px] mx-auto">
                <h1 className="text-[32px] font-bold text-primary mb-lg tracking-tight">{version2?.title}</h1>
                <div className="text-[20px] leading-[32px] font-serif text-on-surface space-y-md">
                  <div className="whitespace-pre-wrap">
                    {diff?.map((segment, i) => (
                      <span 
                        key={i}
                        className={`${
                          segment.type === 'insert' ? 'bg-green-100 text-green-800' :
                          segment.type === 'delete' ? 'bg-red-100 text-red-800 line-through' :
                          'text-on-surface'
                        }`}
                      >
                        {segment.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Timeline Sidebar */}
        <aside className="hidden xl:flex flex-col h-full bg-surface-container-low border-l border-outline-variant w-[320px] shrink-0">
          <div className="p-md border-b border-outline-variant">
            <h3 className="text-[13px] font-bold text-on-surface uppercase tracking-widest">Revision Timeline</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-md relative">
            <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-outline-variant"></div>
            <div className="space-y-lg relative">
              {versions?.map((v) => (
                <div key={v.id} className="flex items-start gap-md group">
                  <div className={`w-8 h-8 rounded-full border-4 border-surface flex items-center justify-center shrink-0 z-10 transition-colors ${v.id === v2 ? 'bg-primary' : v.id === v1 ? 'bg-secondary' : 'bg-outline-variant'}`}>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div className="flex-1 cursor-pointer">
                    <p className={`text-[13px] font-bold ${v.id === v2 ? 'text-primary' : 'text-on-surface'}`}>Version {v.versionNumber}</p>
                    <p className="text-[11px] text-on-surface-variant">{new Date(v.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-outline-variant);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default DiffPage;
