import React from 'react';
import { Mail, Phone, MapPin, Globe, GraduationCap, Briefcase, Award, Code } from 'lucide-react';

interface ResumeRendererProps {
  content: string;
}

const ResumeRenderer: React.FC<ResumeRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split by headers
  const sections = content.split(/(?=^##\s)/m).filter(s => s.trim().length > 0);

  return (
    <div className="bg-white p-12 shadow-inner min-h-[1000px] font-serif text-slate-800">
      <div className="max-w-4xl mx-auto space-y-10">
        {sections.map((section, idx) => {
          const lines = section.trim().split('\n');
          const headerMatch = lines[0].match(/^##\s+(.*)/);
          const title = headerMatch ? headerMatch[1].trim() : "Section";
          const body = headerMatch ? lines.slice(1).join('\n').trim() : section.trim();

          // Header / Contact Info
          if (title.toLowerCase().includes('contact') || idx === 0) {
              const nameLine = body.split('\n')[0] || '';
              const rest = body.split('\n').slice(1).join(' ');
              
              return (
                <div key={idx} className="text-center border-b pb-6 border-slate-200">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-3 uppercase">
                        {nameLine.replace(/User:\s*/i, '').trim() || "Resume"}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
                        {body.includes('@') && (
                            <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                <Mail className="w-3 h-3" /> {body.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || 'Email'}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 italic">
                            {rest.length > 50 ? rest.substring(0, 50) + '...' : rest}
                        </span>
                    </div>
                </div>
              );
          }

          // Summary
          if (title.toLowerCase().includes('summary')) {
              return (
                <div key={idx} className="space-y-3">
                    <h2 className="text-xs font-bold border-b border-slate-900 pb-1 uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed text-slate-700 italic">
                        {body}
                    </p>
                </div>
              );
          }

          // Academic
          if (title.toLowerCase().includes('academic') || title.toLowerCase().includes('education')) {
              return (
                <div key={idx} className="space-y-3">
                    <h2 className="text-xs font-bold border-b border-slate-900 pb-1 uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                        Academic Background
                    </h2>
                    <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap pl-2 font-medium">
                        {body}
                    </div>
                </div>
              );
          }

          // Skills / Competencies
          if (title.toLowerCase().includes('skills') || title.toLowerCase().includes('competencies') || title.toLowerCase().includes('expertise')) {
              const skillList = body.split(',').map(s => s.trim());
              return (
                <div key={idx} className="space-y-3">
                    <h2 className="text-xs font-bold border-b border-slate-900 pb-1 uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-blue-600" />
                        Technical Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skillList.map((skill, sIdx) => (
                            <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 uppercase tracking-tighter hover:bg-slate-200 transition-colors">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
              );
          }

          // Experience/Projects
          if (title.toLowerCase().includes('experience') || title.toLowerCase().includes('projects')) {
              return (
                <div key={idx} className="space-y-4">
                    <h2 className="text-xs font-bold border-b border-slate-900 pb-1 uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        Professional Showcase
                    </h2>
                    <div className="space-y-4 pl-2">
                        {body.split('\n-').map((exp, eIdx) => {
                            if (!exp.trim()) return null;
                            return (
                                <div key={eIdx} className="relative pl-4 border-l border-slate-200 hover:border-blue-400 transition-colors group">
                                    <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors" />
                                    <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                                        {exp.startsWith('-') ? exp : '- ' + exp}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
              );
          }

          // Achievements or Extra-curricular
          const isAchievement = title.toLowerCase().includes('achieve') || title.toLowerCase().includes('award');
          const isExtra = title.toLowerCase().includes('extra') || title.toLowerCase().includes('curricular');
          
          if (isAchievement || isExtra) {
              const Icon = isAchievement ? Award : Globe;
              return (
                <div key={idx} className="space-y-3">
                    <h2 className="text-xs font-bold border-b border-slate-900 pb-1 uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                        {title}
                    </h2>
                    <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap pl-2">
                        {body}
                    </div>
                </div>
              );
          }

          // Default
          return (
            <div key={idx} className="space-y-4">
                <h2 className="text-sm font-bold border-b-2 border-slate-900 pb-1 uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    {title}
                </h2>
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap pl-2">
                    {body}
                </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 pt-8 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">
            Official Career Canvas Executive Document
        </p>
      </div>
    </div>
  );
};

export default ResumeRenderer;
