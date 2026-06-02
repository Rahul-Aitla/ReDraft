"use client" 
 
 import { LayoutGroup, motion } from "framer-motion" 
 import { TextRotate } from "@/components/ui/text-rotate" 
 
 function LandingHero() { 
   return ( 
     <section 
       className="w-full h-screen overflow-hidden flex flex-col items-center justify-center relative" 
       style={{ background: 'radial-gradient(ellipse at top, #e8edf5 0%, #f5f5f5 100%)' }} 
     > 
       <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto"> 
         <motion.h1 
           className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight font-calendas tracking-tight space-y-1 md:space-y-4" 
           animate={{ opacity: 1, y: 0 }} 
           initial={{ opacity: 0, y: 20 }} 
           transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }} 
         > 
           <span>A CMS that remembers </span> 
           <LayoutGroup> 
             <motion.span layout className="flex whitespace-pre"> 
               <TextRotate 
                 texts={[ 
                   "everything.", 
                   "every edit.", 
                   "every version.", 
                   "every draft.", 
                   "every word.", 
                   "your history.", 
                 ]} 
                 mainClassName="overflow-hidden pr-3 text-[#1A365D] py-0 pb-2 md:pb-4 rounded-xl" 
                 staggerDuration={0.03} 
                 staggerFrom="last" 
                 rotationInterval={3000} 
                 transition={{ type: "spring", damping: 30, stiffness: 400 }} 
               /> 
             </motion.span> 
           </LayoutGroup> 
         </motion.h1> 
         <motion.p 
           className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center pt-4 sm:pt-8 md:pt-10 lg:pt-12 text-on-background/80" 
           animate={{ opacity: 1, y: 0 }} 
           initial={{ opacity: 0, y: 20 }} 
           transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }} 
         > 
           Write, version, and publish rich-text content. Every save is a snapshot. Nothing is ever lost. 
         </motion.p> 
 
         <div className="flex flex-row justify-center space-x-4 items-center mt-10 sm:mt-16 md:mt-20 text-xs"> 
           <motion.button 
             className="sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight text-white bg-[#1A365D] px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl cursor-pointer" 
             animate={{ opacity: 1, y: 0 }} 
             initial={{ opacity: 0, y: 20 }} 
             transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }} 
             whileHover={{ scale: 1.05, transition: { type: "spring", damping: 30, stiffness: 400 } }} 
             onClick={() => window.location.href = '/login'} 
           > 
             Get started <span className="ml-1">→</span> 
           </motion.button> 
           <motion.button 
             className="sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight text-[#1A365D] border border-[#1A365D] px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl cursor-pointer" 
             animate={{ opacity: 1, y: 0 }} 
             initial={{ opacity: 0, y: 20 }} 
             transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }} 
             whileHover={{ scale: 1.05, transition: { type: "spring", damping: 30, stiffness: 400 } }} 
             onClick={() => window.location.href = '/blog'} 
           > 
             Read the blog 
           </motion.button> 
         </div> 
       </div> 
     </section> 
   ) 
 } 
 
 export { LandingHero } 
