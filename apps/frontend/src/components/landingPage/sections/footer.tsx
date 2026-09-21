"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#fafbfc] dark:bg-transparent border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-8 overflow-hidden">
      
      {/* Background subtleties */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 tracking-tight">
                YojanaConnect
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Empowering Indian citizens by bridging the gap between them and the government schemes they genuinely deserve through advanced AI resolution.
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:font-bold transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:font-bold transition-colors">How it Works</Link></li>
              <li><Link href="#ai-section" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:font-bold transition-colors">AI Engine</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:font-bold transition-colors">Support & Q&A</Link></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:font-bold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:font-bold transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact / Developer Col */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Developed By</h4>
            <div className="bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/60 rounded-xl p-4 transition-all hover:border-indigo-500/30 dark:hover:border-indigo-500/30 group">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Chaitanya Rankhamb
              </p>
              <div className="mt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  +91-9860358059
                </p>
                <p className="leading-relaxed">
                  Vishwakarma Institute of Technology, <br/> Pune, Maharashtra
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800/80 gap-4">
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            © {new Date().getFullYear()} YojanaConnect. All rights reserved.
          </p>

          <button 
            onClick={scrollToTop}
            className="group flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-full shadow-sm hover:shadow transition-all text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Back to top
            <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
