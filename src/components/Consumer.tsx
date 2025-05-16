import React, { useState, useEffect } from 'react';
import { NumberRecord } from '../types';

interface ConsumerProps {
  queue: number[];
  collectedNumbers: Map<number, string>;
  isRunning: boolean;
  totalPossibleNumbers: number;
}

const Consumer: React.FC<ConsumerProps> = ({ 
  queue, 
  collectedNumbers, 
  isRunning,
  totalPossibleNumbers
}) => {
  const [lastProcessed, setLastProcessed] = useState<NumberRecord | null>(null);
  const [isNewNumber, setIsNewNumber] = useState(false);
  const [animateQueue, setAnimateQueue] = useState(false);

  const recentNumbers = Array.from(collectedNumbers.entries())
    .map(([value, date]) => ({ value, date }))
    .slice(-5)
    .reverse();

  useEffect(() => {
    if (queue.length > 0) {
      setAnimateQueue(true);
      const timer = setTimeout(() => {
        setAnimateQueue(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [queue.length]);

  useEffect(() => {
    if (collectedNumbers.size > 0) {
      const entries = Array.from(collectedNumbers.entries());
      const lastEntry = entries[entries.length - 1];
      
      setLastProcessed({
        value: lastEntry[0],
        date: lastEntry[1]
      });
      
      setIsNewNumber(true);
      const timer = setTimeout(() => {
        setIsNewNumber(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [collectedNumbers.size]);

  const percentComplete = (collectedNumbers.size / totalPossibleNumbers) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 dark:text-white">Потребитель</h3>
        <div 
          className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`}
          title={isRunning ? 'Работает' : 'Остановлен'}
        ></div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-400">
          <span>Состояние очереди:</span>
          <span>{queue.length} элементов</span>
        </div>
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full bg-blue-400 dark:bg-blue-500 transition-all
                      ${animateQueue ? 'opacity-70' : 'opacity-40'}`}
            style={{ width: `${Math.min(100, queue.length * 5)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="p-3 mb-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">Последнее обработанное:</div>
          {lastProcessed && (
            <div className={`font-mono font-medium transition-all ${isNewNumber ? 'text-green-500 dark:text-green-400' : ''}`}>
              {lastProcessed.value}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-orange-500">→</span>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {lastProcessed ? (isNewNumber ? 'Уникальное! Добавлено в коллекцию' : 'Уже собрано, пропущено') : 'Ожидание данных...'}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-400">
          <span>Прогресс сбора:</span>
          <span>{collectedNumbers.size} / {totalPossibleNumbers} чисел</span>
        </div>
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-green-400 dark:bg-green-500 transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Недавно собранные:</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {recentNumbers.length > 0 ? (
            recentNumbers.map((item, index) => (
              <div key={index} className="flex items-center py-1 px-2 rounded-md bg-gray-50 dark:bg-gray-700">
                <span className="text-green-500 mr-2">✓</span>
                <span className="font-mono text-sm mr-2">{item.value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.date).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">Числа еще не собраны</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consumer;