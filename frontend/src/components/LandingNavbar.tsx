import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';

export const LandingNavbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[100] px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/30 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="size-6 text-[#1A365D]" />
            <span className="text-xl font-bold text-[#1A365D] tracking-tight font-calendas">ReDraft</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-[13px] font-bold text-[#1A365D] hover:text-[#1A365D]/80 transition-colors uppercase tracking-wider"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-[#1A365D] text-white px-5 py-2 rounded-full text-[13px] font-bold hover:bg-[#1A365D]/90 transition-all shadow-md shadow-[#1A365D]/10 uppercase tracking-wider"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
