 import { Card, CardContent } from '@/components/ui/card' 
 import { History, GitCompare, Search, RotateCcw, Globe } from 'lucide-react' 
 
 export function Features() { 
     return ( 
         <section className="py-16 md:py-32 dark:bg-transparent"> 
             <div className="mx-auto max-w-3xl lg:max-w-5xl px-6"> 
                 <div className="relative"> 
                     <div className="relative z-10 grid grid-cols-6 gap-3"> 
 
                         {/* Card 1 — Versioning (top-left, col-span-2) */}
                         <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 bg-white border-zinc-200 shadow-sm"> 
                             <CardContent className="relative m-auto size-fit pt-6"> 
                                 <div className="relative flex h-20 w-56 items-center justify-center"> 
                                     <div className="absolute inset-0 m-auto size-16 bg-zinc-50 rounded-full border border-zinc-100" /> 
                                     <History className="text-[#1A365D] size-8 relative z-10" strokeWidth={1.5} /> 
                                 </div> 
                                 <div className="relative z-10 mt-4 space-y-2 text-center"> 
                                     <h2 className="text-lg font-medium">Immutable Versioning</h2> 
                                     <p className="text-foreground text-sm">Every save creates a full snapshot. History is never overwritten — only appended.</p> 
                                 </div> 
                             </CardContent> 
                         </Card> 
 
                         {/* Card 2 — Visual Diff (top-center, col-span-2) */}
                         <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-white border-zinc-200 shadow-sm"> 
                             <CardContent className="pt-6"> 
                                 <div className="relative mx-auto flex size-20 rounded-full border border-zinc-200 bg-zinc-50 items-center justify-center"> 
                                     <GitCompare className="m-auto size-8 text-[#1A365D]" strokeWidth={1.5} /> 
                                 </div> 
                                 <div className="relative z-10 mt-4 space-y-2 text-center"> 
                                     <h2 className="text-lg font-medium">Visual Diff</h2> 
                                     <p className="text-foreground text-sm">Pick any two versions and see exactly what changed — insertions in green, deletions in red.</p> 
                                 </div> 
                             </CardContent> 
                         </Card> 
 
                         {/* Card 3 — Full-text Search (top-right, col-span-2) */}
                         <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-white border-zinc-200 shadow-sm"> 
                             <CardContent className="pt-6"> 
                                 <div className="relative mx-auto flex size-20 rounded-full border border-zinc-200 bg-zinc-50 items-center justify-center"> 
                                     <Search className="size-8 text-[#1A365D]" strokeWidth={1.5} /> 
                                 </div> 
                                 <div className="relative z-10 mt-4 space-y-2 text-center"> 
                                     <h2 className="text-lg font-medium transition">Full-text Search</h2> 
                                     <p className="text-foreground text-sm">PostgreSQL-powered search across all published posts, ranked by relevance with highlighted matched terms.</p> 
                                 </div> 
                             </CardContent> 
                         </Card> 
 
                         {/* Card 4 — Version Restore (bottom-left, col-span-3) */}
                         <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-white border-zinc-200 shadow-sm"> 
                             <CardContent className="grid pt-6 sm:grid-cols-2"> 
                                 <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6"> 
                                     <div className="relative flex size-12 rounded-full border border-zinc-200 bg-zinc-50 items-center justify-center"> 
                                         <RotateCcw className="m-auto size-5 text-[#1A365D]" strokeWidth={1.5} /> 
                                     </div> 
                                     <div className="space-y-2"> 
                                         <h2 className="text-lg font-medium text-zinc-800">Version Restore</h2> 
                                         <p className="text-foreground text-sm">Roll back to any earlier version. Restoring creates a new version — nothing in between is ever erased.</p> 
                                     </div> 
                                 </div> 
                                 <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 h-fit border-l border-t border-zinc-200 p-6 py-6 sm:ml-6 bg-zinc-50/50 overflow-hidden"> 
                                     <div className="absolute left-3 top-2 flex gap-1"> 
                                         <span className="block size-2 rounded-full border border-zinc-200 bg-white"></span> 
                                         <span className="block size-2 rounded-full border border-zinc-200 bg-white"></span> 
                                         <span className="block size-2 rounded-full border border-zinc-200 bg-white"></span> 
                                     </div> 
                                     <div className="pt-4 space-y-2 font-mono text-xs text-muted-foreground whitespace-nowrap"> 
                                         <div className="flex items-center gap-2"><span className="text-green-500">+</span><span className="line-through opacity-40">v3 — Draft update</span></div> 
                                         <div className="flex items-center gap-2"><span className="text-blue-500">↺</span><span>Restored from v1</span></div> 
                                         <div className="flex items-center gap-2"><span className="text-green-500">+</span><span>v4 — Auto snapshot</span></div> 
                                         <div className="flex items-center gap-2 opacity-50"><span>·</span><span>v2 — Minor edit</span></div> 
                                         <div className="flex items-center gap-2 opacity-30"><span>·</span><span>v1 — Initial draft</span></div> 
                                     </div> 
                                 </div> 
                             </CardContent> 
                         </Card> 
 
                         {/* Card 5 — Public Blog (bottom-right, col-span-3) */}
                         <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-white border-zinc-200 shadow-sm"> 
                             <CardContent className="grid h-full pt-6 sm:grid-cols-2"> 
                                 <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6"> 
                                     <div className="relative flex size-12 rounded-full border border-zinc-200 bg-zinc-50 items-center justify-center"> 
                                         <Globe className="m-auto size-6 text-[#1A365D]" strokeWidth={1.5} /> 
                                     </div> 
                                     <div className="space-y-2"> 
                                         <h2 className="text-lg font-medium">Public Blog</h2> 
                                         <p className="text-foreground text-sm">Published posts are instantly live at /blog/:slug — readable by anyone, no login required.</p> 
                                     </div> 
                                 </div> 
                                 <div className="relative mt-6 border-l border-zinc-200 sm:-my-6 sm:-mr-6 bg-zinc-50/50 overflow-hidden"> 
                                     <div className="relative flex h-full flex-col justify-center space-y-6 py-6 px-4 whitespace-nowrap"> 
                                         <div className="relative flex w-full items-center justify-end gap-2"> 
                                             <span className="block h-fit rounded border border-zinc-200 bg-white px-2 py-1 text-[10px] shadow-sm font-mono text-zinc-600">/blog/typescript-tips</span> 
                                         </div> 
                                         <div className="relative flex w-full items-center justify-center gap-2"> 
                                             <span className="block h-fit rounded border border-zinc-200 bg-white px-2 py-1 text-[10px] shadow-sm font-mono text-zinc-600">/blog/postgres-tricks</span> 
                                         </div> 
                                         <div className="relative flex w-full items-center justify-start gap-2"> 
                                             <span className="block h-fit rounded border border-zinc-200 bg-white px-2 py-1 text-[10px] shadow-sm font-mono text-zinc-600">/blog/rest-api-guide</span> 
                                         </div> 
                                     </div> 
                                 </div> 
                             </CardContent> 
                         </Card> 
 
                     </div> 
                 </div> 
             </div> 
         </section> 
     ) 
 } 
