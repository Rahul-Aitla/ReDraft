import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchVersions, fetchDiff, restoreVersion, fetchVersion } from '../api/posts';
import type { PostVersion } from '../types';

interface HistoryPanelProps {
  postId: string;
  onRestore: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ postId, onRestore }) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [previewVersion, setPreviewVersion] = useState<PostVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: versions, isLoading } = useQuery({
    queryKey: ['versions', postId],
    queryFn: () => fetchVersions(postId),
  });

  const { data: diff, isLoading: isDiffLoading } = useQuery({
    queryKey: ['diff', postId, selectedVersions[0], selectedVersions[1]],
    queryFn: () => fetchDiff(postId, selectedVersions[0], selectedVersions[1]),
    enabled: selectedVersions.length === 2 && showDiff,
  });

  const restoreMutation = useMutation({
    mutationFn: (vId: string) => restoreVersion(postId, vId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['versions', postId] });
      onRestore();
      window.location.reload();
    },
  });

  const handleSelect = (id: string) => {
    if (selectedVersions.includes(id)) {
      setSelectedVersions(selectedVersions.filter(v => v !== id));
    } else {
      if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, id]);
      } else {
        setSelectedVersions([selectedVersions[1], id]);
      }
    }
  };

  const handlePreview = async (vId: string) => {
    const version = await fetchVersion(postId, vId);
    setPreviewVersion(version);
  };

  return (
    <div className="flex flex-col h-full bg-surface border-l border-outline-variant font-hanken">
      <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
        <h3 className="text-[13px] font-bold text-primary uppercase tracking-wider">Version History</h3>
        <button 
          onClick={() => {
            if (selectedVersions.length === 2) setShowDiff(!showDiff);
          }}
          disabled={selectedVersions.length < 2}
          className={`p-1 rounded-lg transition-colors group ${selectedVersions.length === 2 ? 'text-primary hover:bg-primary/10' : 'text-outline-variant cursor-not-allowed'}`}
          title="Compare Versions"
        >
          <span className="material-symbols-outlined">compare_arrows</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-md relative">
        {/* Timeline Spine */}
        <div className="absolute left-[25px] top-0 bottom-0 w-[2px] bg-outline-variant/30"></div>

        <div className="space-y-lg relative z-10">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-20 skeleton rounded-lg ml-8" />)
          ) : versions?.map((version, index) => (
            <div key={version.id} className="relative pl-8 group">
              {/* Dot on Spine */}
              <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-2 border-surface ring-2 ring-surface transition-all ${selectedVersions.includes(version.id) ? 'bg-primary scale-125' : 'bg-outline-variant group-hover:bg-primary'}`}></div>
              
              <div 
                className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedVersions.includes(version.id) ? 'bg-primary-container/10 border-primary/20 shadow-sm' : 'border-transparent hover:bg-surface-container-low hover:border-outline-variant'}`}
                onClick={() => handleSelect(version.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[13px] font-bold ${selectedVersions.includes(version.id) ? 'text-primary' : 'text-on-surface'}`}>
                    {index === 0 ? 'Current Session' : `Version ${versions.length - index}`}
                  </span>
                  {index === 0 && (
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 rounded uppercase tracking-wider">Latest</span>
                  )}
                </div>
                <p className="text-[11px] font-mono text-on-surface-variant">
                  {new Date(version.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(version.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </p>
                
                <div className="mt-2 flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePreview(version.id); }}
                    className="text-[10px] font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    Preview
                  </button>
                  {index !== 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); restoreMutation.mutate(version.id); }}
                      className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diff Overlay / Section */}
      {showDiff && selectedVersions.length === 2 && (
        <div className="p-md border-t border-outline-variant bg-surface-container-lowest animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[11px] font-bold text-secondary uppercase tracking-widest">Comparison Result</h4>
            <button onClick={() => setShowDiff(false)} className="text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-2 bg-surface rounded border border-outline-variant/30 text-xs font-mono leading-relaxed">
            {isDiffLoading ? (
              <div className="space-y-1">
                <div className="h-3 skeleton rounded w-full"></div>
                <div className="h-3 skeleton rounded w-5/6"></div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewVersion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-2xl max-h-[80vh] overflow-y-auto p-12 relative shadow-2xl border border-outline-variant rounded-xl">
            <button 
              onClick={() => setPreviewVersion(null)}
              className="absolute top-6 right-6 text-on-surface-variant hover:text-primary text-2xl"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-[32px] font-bold text-primary mb-2 tracking-tight leading-tight">{previewVersion.title}</h2>
            <p className="text-[11px] font-mono uppercase tracking-widest text-on-surface-variant mb-10 pb-4 border-b border-outline-variant">
              Version Snapshot — {new Date(previewVersion.createdAt).toLocaleString()}
            </p>
            <div className="prose prose-slate max-w-none text-[18px] leading-[32px] font-serif text-on-surface italic opacity-80">
              {previewVersion.contentText}
            </div>
          </div>
        </div>
      )}

      <div className="p-md border-t border-outline-variant bg-surface-container-low">
        <button 
          onClick={() => {
            if (selectedVersions.length === 2) {
              navigate(`/editor/${postId}/diff/${selectedVersions[0]}/${selectedVersions[1]}`);
            }
          }}
          disabled={selectedVersions.length < 2}
          className="w-full flex items-center justify-center gap-sm text-primary font-bold text-[13px] hover:underline py-2 transition-all disabled:opacity-30 disabled:no-underline"
        >
          <span className="material-symbols-outlined">compare</span>
          Full Comparison
        </button>
      </div>
    </div>
  );
};

export default HistoryPanel;
