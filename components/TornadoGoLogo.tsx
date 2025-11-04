import React from 'react';

const TornadoGoLogo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="relative mb-4">
        <div className="grid grid-cols-3 w-80 md:w-96 max-w-full" style={{ filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.5))' }}>
          <div className="aspect-square bg-black"></div>
          <div className="aspect-square bg-white"></div>
          <div className="aspect-square bg-black"></div>
          <div className="aspect-square bg-white"></div>
          <div className="aspect-square bg-black"></div>
          <div className="aspect-square bg-white"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.7)' }}>
            <span className="text-secondary-light">Tornado</span><span className="text-secondary">GO</span>
          </h1>
        </div>
      </div>
      <p className="text-base md:text-lg tracking-[0.4em] md:tracking-[0.5em] text-gray-200 font-light">YOUR RIDE AWAITS</p>
    </div>
  );
};

export default TornadoGoLogo;
