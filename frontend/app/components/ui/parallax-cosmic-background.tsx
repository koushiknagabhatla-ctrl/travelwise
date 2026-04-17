"use client";

import React, { useEffect, useState } from 'react';

interface CosmicParallaxBgProps {
  /**
   * Main heading text (displayed large in the center)
   */
  head: string;
  
  /**
   * Subtitle text (displayed below the heading)
   * Comma-separated string that will be split into animated parts
   */
  text: string;
  
  /**
   * Whether the text animations should loop
   * @default true
   */
  loop?: boolean;
  
  /**
   * Custom class name for additional styling
   */
  className?: string;
}

/**
 * A cosmic parallax background component with animated stars and text
 */
const CosmicParallaxBg: React.FC<CosmicParallaxBgProps> = ({
  head,
  text,
  loop = true,
  className = '',
}) => {
  const [smallStars, setSmallStars] = useState<string>('');
  const [mediumStars, setMediumStars] = useState<string>('');
  const [bigStars, setBigStars] = useState<string>('');
  
  // Split the text by commas and trim whitespace
  const textParts = text.split(',').map(part => part.trim());
  
  // Generate random star positions
  const generateStarBoxShadow = (count: number): string => {
    let shadows = [];
    
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);
      // Let's use a cyan/indigo hue for stars to match the theme instead of pure white #FFF
      const colors = ['#FFF', '#06d6a0', '#7c3aed', '#e2e8f0'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      shadows.push(`${x}px ${y}px ${color}`);
    }
    
    return shadows.join(', ');
  };
  
  useEffect(() => {
    // Generate star shadows when component mounts
    setSmallStars(generateStarBoxShadow(700));
    setMediumStars(generateStarBoxShadow(200));
    setBigStars(generateStarBoxShadow(100));
    
    // Set animation iteration based on loop prop
    document.documentElement.style.setProperty(
      '--animation-iteration', 
      loop ? 'infinite' : '1'
    );
  }, [loop]);
  
  return (
    <div className={`cosmic-parallax-container absolute inset-0 overflow-hidden bg-void ${className}`}>
      {/* Ambient gradient to match dark theme */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gradient-to-bl from-cyan-glow/10 via-transparent to-transparent rounded-full blur-3xl z-[-1]" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-gradient-to-tr from-indigo-glow/10 via-transparent to-transparent rounded-full blur-3xl z-[-1]" />
      
      {/* Stars layers */}
      <div 
        id="stars" 
        style={{ boxShadow: smallStars }}
        className="cosmic-stars opacity-50"
      ></div>
      <div 
        id="stars2" 
        style={{ boxShadow: mediumStars }}
        className="cosmic-stars-medium opacity-70"
      ></div>
      <div 
        id="stars3" 
        style={{ boxShadow: bigStars }}
        className="cosmic-stars-large opacity-90"
      ></div>
      
      {/* Horizon and Earth */}
      <div id="horizon">
        <div className="glow"></div>
      </div>
      <div id="earth"></div>
      
      {/* Title and subtitle */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <div id="title" className="text-5xl md:text-8xl font-black font-display gradient-text-frost tracking-tighter mb-4">
          {head.toUpperCase()}
        </div>
        <div id="subtitle" className="flex gap-4 md:gap-8 justify-center items-center text-lg md:text-2xl font-bold tracking-[0.2em] text-silver uppercase">
          {textParts.map((part, index) => (
            <React.Fragment key={index}>
              <span className={`subtitle-part-${(index % 4) + 1} text-cyan-glow drop-shadow-[0_0_8px_rgba(6,214,160,0.5)]`}>
                {part.toUpperCase()}
              </span>
              {index < textParts.length - 1 && <span className="opacity-40">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export { CosmicParallaxBg }
