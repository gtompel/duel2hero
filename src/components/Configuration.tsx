import React, { useState } from 'react';

interface ConfigurationProps {
  onConfigure: (producerCount: number, minNumber: number, maxNumber: number) => void;
  isRunning: boolean;
  currentProducerCount: number;
  currentMinNumber: number;
  currentMaxNumber: number;
}

const Configuration: React.FC<ConfigurationProps> = ({
  onConfigure,
  isRunning,
  currentProducerCount,
  currentMinNumber,
  currentMaxNumber,
}) => {
  const [producerCount, setProducerCount] = useState(currentProducerCount);
  const [minNumber, setMinNumber] = useState(currentMinNumber);
  const [maxNumber, setMaxNumber] = useState(currentMaxNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigure(producerCount, minNumber, maxNumber);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Настройки</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="producerCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Количество производителей
            </label>
            <input
              type="number"
              id="producerCount"
              min="1"
              max="10"
              value={producerCount}
              onChange={(e) => setProducerCount(parseInt(e.target.value))}
              disabled={isRunning}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400
                      disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Минимальное число
              </label>
              <input
                type="number"
                id="minNumber"
                min="0"
                max={maxNumber - 1}
                value={minNumber}
                onChange={(e) => setMinNumber(parseInt(e.target.value))}
                disabled={isRunning}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400
                        disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label htmlFor="maxNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Максимальное число
              </label>
              <input
                type="number"
                id="maxNumber"
                min={minNumber + 1}
                value={maxNumber}
                onChange={(e) => setMaxNumber(parseInt(e.target.value))}
                disabled={isRunning}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-400
                        disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isRunning}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm
                      font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                      focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600
                      disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Применить настройки
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Configuration;