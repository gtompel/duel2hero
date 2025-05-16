import React, { useEffect, useState } from 'react';

interface StatisticsProps {
  startTime: number | null;
  endTime: number | null;
  isRunning: boolean;
  collectedCount: number;
  queueSize: number;
  totalPossibleNumbers: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  startTime,
  endTime,
  isRunning,
  collectedCount,
  queueSize,
  totalPossibleNumbers,
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [previousCollected, setPreviousCollected] = useState<number>(0);
  const [previousTime, setPreviousTime] = useState<number>(Date.now());

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && startTime) {
      timer = setInterval(() => {
        const now = Date.now();
        setElapsedTime(now - startTime);
        
        if (now - previousTime >= 1000) {
          const timeDiff = (now - previousTime) / 1000;
          const numbersDiff = collectedCount - previousCollected;
          
          if (timeDiff > 0) {
            setRate(numbersDiff / timeDiff);
          }
          
          setPreviousCollected(collectedCount);
          setPreviousTime(now);
        }
      }, 100);
    } else if (!isRunning && startTime && endTime) {
      setElapsedTime(endTime - startTime);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, startTime, endTime, collectedCount, previousCollected, previousTime]);

  const formatElapsedTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = (minutes % 60).toString().padStart(2, '0');
    const formattedSeconds = (seconds % 60).toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const estimatedTimeRemaining = (): string => {
    if (rate <= 0 || collectedCount >= totalPossibleNumbers) return '--:--:--';
    
    const remainingNumbers = totalPossibleNumbers - collectedCount;
    const estimatedSeconds = remainingNumbers / rate;
    
    return formatElapsedTime(estimatedSeconds * 1000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Статистика</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">⏱</span>
            <div className="text-sm text-gray-600 dark:text-gray-400">Прошло времени</div>
          </div>
          <div className="mt-1 font-mono text-xl font-medium">
            {formatElapsedTime(elapsedTime)}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">📊</span>
            <div className="text-sm text-gray-600 dark:text-gray-400">Прогресс сбора</div>
          </div>
          <div className="mt-1 font-mono text-xl font-medium">
            {collectedCount} / {totalPossibleNumbers}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="flex items-center">
            <span className="text-amber-500 mr-2">⚡</span>
            <div className="text-sm text-gray-600 dark:text-gray-400">Скорость сбора</div>
          </div>
          <div className="mt-1 font-mono text-xl font-medium">
            {rate.toFixed(2)} /сек
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <div className="flex items-center">
            <span className="text-purple-500 mr-2">⏳</span>
            <div className="text-sm text-gray-600 dark:text-gray-400">Осталось времени</div>
          </div>
          <div className="mt-1 font-mono text-xl font-medium">
            {isRunning ? estimatedTimeRemaining() : '--:--:--'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;