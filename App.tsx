import React from 'react';
import { Background } from './components/Background';
import { ConverterCard } from './components/ConverterCard';

const App: React.FC = () => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative">
      <Background />
      
      <div className="z-10 w-full">
        <ConverterCard />
      </div>

      <footer className="absolute bottom-4 text-center w-full z-10 opacity-40">
        <p className="text-[10px] text-lux-silver uppercase tracking-[0.2em]">
          Designed for Global Citizens
        </p>
      </footer>
    </main>
  );
};

export default App;