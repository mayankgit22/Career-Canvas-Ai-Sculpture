"use client"
import { TypeAnimation } from 'react-type-animation';

export  function Hero() {
  return (
    <TypeAnimation
      sequence={[
       "Your AI Career",1500,
       "Your AI Resume",1000,
       "Your AI Job",1000
       
      ]}
      wrapper="span"
      speed={200}
      style={{ fontSize: '1em', display: 'block' }}
      repeat={Infinity}
    />
  );
}
