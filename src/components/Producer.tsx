import React, { useEffect, useState, useRef } from 'react';

interface ProducerProps {
  id: number;
  isRunning: boolean;
  minNumber: number;
  maxNumber: number;
  onProduceNumber: (number: number) => void;
}

const Producer: React.FC<ProducerProps> = ({ id, isRunning, minNumber, maxNumber, onProduceNumber }) => {
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
        setLastNumber(randomNumber);
        setGeneratedCount(prev => prev + 1);
        onProduceNumber(randomNumber);
        
        setIsAnimating(true);
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
        animationRef.current = setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 500 + Math.random() * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isRunning, minNumber, maxNumber, onProduceNumber]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-800 dark:text-white">Производитель #{id}</h3>
        <div 
          className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`}
          title={isRunning ? 'Работает' : 'Остановлен'}
        ></div>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">Сгенерировано:</div>
        <div className="font-mono font-medium">{generatedCount}</div>
      </div>
      
      <div className="flex items-center justify-center space-x-2 h-12 overflow-hidden">
        <span className="text-blue-500">→</span>
        
        <div 
          className={`px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-md font-mono text-lg transition-all
                    ${isAnimating ? 'transform translate-x-1' : ''}`}
        >
          {lastNumber !== null ? lastNumber : '-'}
        </div>
      </div>
    </div>
  );
};

export default Producer;