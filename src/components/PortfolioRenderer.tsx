import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Layout, Palette, Sparkles } from "lucide-react";

interface PortfolioRendererProps {
  content: string;
}

const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({ content }) => {
  if (!content) return null;

  // Robust parsing: search for any level of headers or distinctive lines
  const sections = content.split(/(?=^#{1,3}\s)/m).filter(s => s.trim().length > 0);

  if (sections.length <= 1 && !content.includes('#')) {
    // Fallback if no markdown headers found
    return (
      <div className="prose prose-slate max-w-none p-6 bg-white rounded-xl shadow-inner border">
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-4">
      {sections.map((section, idx) => {
        const lines = section.trim().split('\n');
        const headerMatch = lines[0].match(/^#{1,3}\s+(.*)/);
        const title = headerMatch ? headerMatch[1].trim() : "Section";
        const bodyContent = headerMatch ? lines.slice(1).join('\n').trim() : section.trim();

        // High-impact Hero Section rendering
        if (title.toLowerCase().includes('hero') || idx === 0) {
          return (
            <div key={idx} className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-20 text-center shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
              <div className="relative z-10">
                <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Generated Concept
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                  {bodyContent.split('\n')[0] || title}
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">
                  {bodyContent.split('\n').slice(1).join(' ').replace(/\*\*/g, '').trim()}
                </p>
              </div>
            </div>
          );
        }

        return (
          <div key={idx} className="group relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-slate-200" />
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 italic">
                {title}
              </h3>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-900 px-4">
               <div className="whitespace-pre-wrap leading-relaxed">
                {bodyContent}
               </div>
            </div>
          </div>
        );
      })}

      <div className="pt-16 mt-16 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
          Powered by Career Canvas AI Showcaster
        </p>
      </div>
    </div>
  );
};

export default PortfolioRenderer;
