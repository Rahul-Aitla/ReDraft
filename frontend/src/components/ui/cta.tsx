"use client"; 
 
 import React from "react"; 
 import { Link } from "react-router-dom"; 
 import Balancer from "react-wrap-balancer"; 
 import { Button } from "@/components/ui/button"; 
 import { cn } from "@/lib/utils"; 
 
 type SectionProps = { 
   children: React.ReactNode; 
   className?: string; 
   id?: string; 
 }; 
 
 type ContainerProps = { 
   children: React.ReactNode; 
   className?: string; 
   id?: string; 
 }; 
 
 const Section = ({ children, className, id }: SectionProps) => ( 
   <section className={cn("py-8 md:py-12", className)} id={id}> 
     {children} 
   </section> 
 ); 
 
 const Container = ({ children, className, id }: ContainerProps) => ( 
   <div className={cn("mx-auto max-w-5xl p-6 sm:p-8", className)} id={id}> 
     {children} 
   </div> 
 ); 
 
 export function CTA() { 
   return ( 
     <Section className="px-4"> 
       <Container className="flex flex-col items-center gap-6 rounded-lg border border-zinc-200 bg-slate-100 p-6 text-center md:rounded-xl md:p-12 shadow-sm"> 
         <h2 className="!my-0 text-3xl font-bold">Ready to start writing?</h2> 
         <h3 className="!mb-0 text-muted-foreground text-xl"> 
           <Balancer> 
             Every word you write is versioned, searchable, and recoverable. Nothing gets lost. 
           </Balancer> 
         </h3> 
         <div className="not-prose mx-auto flex items-center gap-2"> 
           <Button className="w-fit bg-[#1A365D] hover:bg-[#1A365D]/90" asChild> 
             <Link to="/login">Get Started →</Link> 
           </Button> 
           <Button className="w-fit text-[#1A365D]" variant="link" asChild> 
             <Link to="/blog">Read the blog →</Link> 
           </Button> 
         </div> 
       </Container> 
     </Section> 
   ); 
 } 
