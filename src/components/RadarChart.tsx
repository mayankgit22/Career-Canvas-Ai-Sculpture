import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "React", A: 120, B: 110, fullMark: 150 },
  { subject: "AI", A: 98, B: 130, fullMark: 150 },
  { subject: "NodeJS", A: 86, B: 130, fullMark: 150 },
  { subject: "NextJS", A: 99, B: 100, fullMark: 150 },
  { subject: "ExpressJS", A: 85, B: 90, fullMark: 150 },
  { subject: "DSA", A: 95, B: 85, fullMark: 150 },
];

export function RadarChart1() {
  return (
    <div className="radar-container">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#111111" />
          <PolarAngleAxis dataKey="subject" stroke="#000000" />
          <PolarRadiusAxis domain={[0, 150]} />
          <Radar
            name="Mike"
            dataKey="A"
            stroke="#4caf50"
            fill="#81c784"
            fillOpacity={0.8}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

