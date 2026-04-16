
import React from 'react';

const PecesLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 40 20" 
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <path 
      d="M0 10 C 10 0, 25 0, 32 7 L 40 0 L 32 10 L 40 20 L 32 13 C 25 20, 10 20, 0 10 Z"
    />
  </svg>
);

export default PecesLogoIcon;