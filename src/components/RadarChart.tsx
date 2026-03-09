import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface RadarChart1Props {
  skills?: string[];
}


function getSkillScore(skill: string): number {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = skill.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 70 + Math.abs(hash % 71);
}

const defaultData = [
  { subject: "React", A: 120, fullMark: 150 },
  { subject: "AI", A: 98, fullMark: 150 },
  { subject: "NodeJS", A: 86, fullMark: 150 },
  { subject: "NextJS", A: 99, fullMark: 150 },
  { subject: "ExpressJS", A: 85, fullMark: 150 },
  { subject: "DSA", A: 95, fullMark: 150 },
];

export function RadarChart1({ skills }: RadarChart1Props) {
  const chartData = React.useMemo(() => {
    if (!skills || skills.length === 0) return defaultData;


    return skills.slice(0, 8).map((skill) => ({
      subject: skill.length > 12 ? skill.substring(0, 10) + "…" : skill,
      A: getSkillScore(skill),
      fullMark: 150,
    }));
  }, [skills]);

  return (
    <div className="radar-container">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="subject" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 150]} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
