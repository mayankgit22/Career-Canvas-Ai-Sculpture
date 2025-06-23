// import "./styles.css";
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const data = [
  {
    subject: "React",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "AI",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "nodjs",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Nextjs",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "ExpressJS",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "DSA",
    A: 95,
    B: 85,
    fullMark: 150,
  },
];
export  function RadarChart1() {
  return (
    <RadarChart
      cx={300}
      cy={250}
      outerRadius={150}
      width={500}
      height={500}
      data={data}
    
    className="text-black">
      <PolarGrid stroke="#111111" />
      <PolarAngleAxis dataKey="subject"  
  stroke="#000000" 
  />
      <PolarRadiusAxis domain={[0, 100]} />
      <Radar
        name="Mike"
        dataKey="A"
        stroke="#4caf50"     // dark green border
  fill="#81c784"
        fillOpacity={0.8}
      />
    </RadarChart>
  );
}
