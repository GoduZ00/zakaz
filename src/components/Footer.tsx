import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterSection {
  id: number;
  title: string;
  links: FooterLink[];
  sort_order: number;
}

export default function Footer() {
  const [sections, setSections] = useState<FooterSection[]>([]);

  useEffect(() => {
    supabase.from('footer_sections').select('*').order('sort_order').then(({ data }) => {
      if (data) setSections(data);
    });
  }, []);

  return (
    <footer className="bg-[#333333] text-gray-300 pt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {sections.map((section) => (
            <div key={section.id}>
              <h4 className="text-white text-[11px] font-bold uppercase tracking-widest mb-6">{section.title}</h4>
              <ul className="space-y-3 text-[13px] text-gray-400">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col relative bg-[#3a3a3a] p-5 rounded-sm">
            <ul className="space-y-4 text-[13px]">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <div className="flex flex-col">
                  <a href="tel:87013099969" className="font-bold text-white text-base hover:text-[#ef7d00] transition-colors leading-none mb-1">8-701-309-9969</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-white leading-tight">Алматы қ. Асыл-Арман 20</span>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-[#4a4a4a] flex items-center gap-2 text-white text-[11px]">
              <div className="flex gap-0.5 items-center">
                 <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
              </div>
              <span className="font-bold">5,0</span>
              <div className="flex gap-0.5 ml-1">
                {[1,2,3,4,5].map(i => <svg key={i} className="w-3 h-3 text-[#e5c05c] fill-[#e5c05c]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
              </div>
            </div>
            <div className="text-[9px] text-gray-500 mt-1">Рейтинг организации в Яндексе</div>

            <button className="absolute -right-4 -top-4 w-10 h-10 bg-[#ef7d00] rounded-full flex items-center justify-center text-white hover:bg-[#d66f00] transition-colors shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
