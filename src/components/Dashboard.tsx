import React from 'react';
import Configuration from './Configuration';
import Producer from './Producer';
import Consumer from './Consumer';
import Statistics from './Statistics';
import { useQueue } from '../hooks/useQueue';
import ResultsViewer from './ResultsViewer';

const Dashboard: React.FC = () => {
  const {
    state,
    start,
    stop,
    reset,
    configure,
    saveResults,
  } = useQueue();

  const totalPossibleNumbers = state.maxNumber - state.minNumber + 1;
  const isComplete = state.collectedNumbers.size === totalPossibleNumbers;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Сборщик уникальных чисел
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Симуляция работы нескольких производителей, генерирующих случайные числа, и потребителя, собирающего уникальные значения
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <Configuration
              onConfigure={configure}
              isRunning={state.running}
              currentProducerCount={state.producerCount}
              currentMinNumber={state.minNumber}
              currentMaxNumber={state.maxNumber}
            />
          </div>
          
          <div className="md:col-span-2">
            <Statistics
              startTime={state.startTime}
              endTime={state.endTime}
              isRunning={state.running}
              collectedCount={state.collectedNumbers.size}
              queueSize={state.queue.length}
              totalPossibleNumbers={totalPossibleNumbers}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={state.running ? stop : start}
            disabled={isComplete}
            className={`inline-flex items-center px-4 py-2 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${state.running 
                        ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500' 
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {state.running ? (
              <>
                <span className="mr-2">⏸</span> Приостановить
              </>
            ) : (
              <>
                <span className="mr-2">▶</span> Запустить
              </>
            )}
          </button>
          
          <button
            onClick={reset}
            disabled={state.running}
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">↻</span> Сбросить
          </button>
          
          <button
            onClick={saveResults}
            disabled={state.collectedNumbers.size === 0}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">⤓</span> Сохранить результаты
          </button>
        </div>

        {isComplete && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 rounded-md text-green-800 dark:text-green-200 flex items-center">
            <div className="mr-2">✅</div>
            <div>
              <span className="font-bold">Сбор завершен!</span> Все {totalPossibleNumbers} уникальных чисел собраны.
              Теперь вы можете сохранить результаты в JSON файл.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: state.producerCount }).map((_, index) => (
            <div key={index}>
              <Producer
                id={index + 1}
                isRunning={state.running}
                minNumber={state.minNumber}
                maxNumber={state.maxNumber}
                onProduceNumber={() => {}}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <Consumer
              queue={state.queue}
              collectedNumbers={state.collectedNumbers}
              isRunning={state.running}
              totalPossibleNumbers={totalPossibleNumbers}
            />
          </div>
          
          <div className="md:col-span-2">
            <ResultsViewer 
              collectedNumbers={state.collectedNumbers} 
              startTime={state.startTime}
              endTime={state.endTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;