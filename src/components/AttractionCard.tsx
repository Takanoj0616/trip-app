'use client';

import { useState } from 'react';

interface AttractionCardProps {
  attraction: string;
  areaName: string;
  index: number;
}

export default function AttractionCard({ attraction, areaName, index }: AttractionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (index: number) => {
    const icons = ['🗼', '⛩️', '🏯', '🌸', '🏪', '🚶', '🌿', '🗾'];
    return icons[index % icons.length];
  };

  return (
    <div
      className="group cursor-pointer"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
        padding: '40px 30px',
        textAlign: 'center',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-12px) scale(1.03)' : 'translateY(0) scale(1)',
        borderColor: isHovered ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)',
        boxShadow: isHovered ? '0 25px 50px rgba(0, 0, 0, 0.3)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Gradient Overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 1
        }}
      />
      
      {/* Icon */}
      <div 
        style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 25px auto',
          fontSize: '36px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {getIcon(index)}
      </div>

      {/* Content */}
      <h3 
        className="text-2xl font-bold mb-3"
        style={{ 
          color: 'black',
          position: 'relative',
          zIndex: 2
        }}
      >
        {attraction}
      </h3>
      <p 
        className="text-base opacity-80"
        style={{ 
          color: 'black',
          position: 'relative',
          zIndex: 2
        }}
      >
        Popular attraction in {areaName}
      </p>

      {/* Visit Button */}
      <div 
        style={{
          marginTop: '25px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <LearnMoreButton />
      </div>
    </div>
  );
}

function LearnMoreButton() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <button 
      style={{
        background: isButtonHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '25px',
        padding: '12px 24px',
        color: 'black',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isButtonHovered ? 'translateY(-2px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
    >
      Learn More
    </button>
  );
}