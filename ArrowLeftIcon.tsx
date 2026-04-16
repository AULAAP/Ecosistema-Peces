
import React from 'react';
import PecesLogoIcon from './icons/PecesLogoIcon';

const AnimatedBackground: React.FC = () => {
  const fishCount = 20;
  const bubbleCount = 50;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Water Background (Blurred) */}
      <div className="water-background"></div>

      {/* Layer 2: Fish (Mixed Depths) */}
      <div className="absolute inset-0 w-full h-full">
        {Array.from({ length: fishCount }).map((_, i) => {
            // Logic: 50% Sharp (Evens), 50% Blur (Odds)
            const isSharp = i % 2 === 0;
            
            // Use distinct classes
            const fishClass = isSharp ? 'fish-sharp' : 'fish-blurring';
            
            // Z-index: Sharp fish (20) are visually closer than blurred fish (5)
            const zIndex = isSharp ? 20 : 5; 

            // Scale: Sharp fish are generally larger (foreground), blurred are smaller (background)
            // Adding some randomness to scale while maintaining hierarchy
            const scale = isSharp 
                ? 0.85 + ((i * 3) % 4) * 0.1  // 0.85 - 1.15
                : 0.6 + ((i * 3) % 4) * 0.1;  // 0.6 - 0.9

            return (
                <div 
                    key={`fish-${i}`} 
                    className="fish-container" 
                    style={{ zIndex }} // Inline style ensures correct stacking context
                >
                    <div style={{ transform: `scale(${scale})`, display: 'flex' }}>
                        <PecesLogoIcon className={`fish ${fishClass}`} />
                    </div>
                </div>
            );
        })}
      </div>

      {/* Layer 3: Bubbles */}
      <div className="bubbles">
        {Array.from({ length: bubbleCount }).map((_, i) => (
          <div key={`bubble-${i}`} className="bubble"></div>
        ))}
      </div>

      {/* Layer 4: Sea Foam (Surface) - highest z-index to cover top edge */}
      <div className="sea-foam"></div>
    </div>
  );
};

export default AnimatedBackground;
