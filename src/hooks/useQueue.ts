import { useState, useEffect } from 'react';
import { queueService } from '../services/queueService';
import { QueueState } from '../types';

export function useQueue() {
  // Состояние очереди
  const [state, setState] = useState<QueueState>({
    queue: [],
    collectedNumbers: new Map(),
    running: false,
    startTime: null,
    endTime: null,
    producerCount: 3,
    minNumber: 1,
    maxNumber: 100,
    completionPercentage: 0,
  });

  useEffect(() => {
    // Подписка на сервис очереди
    const unsubscribe = queueService.subscribe(newState => {
      setState(newState);
    });

    // Очистка при размонтировании
    return unsubscribe;
  }, []);

  // Методы управления очередью
  const start = () => queueService.start();
  const stop = () => queueService.stop();
  const reset = () => queueService.reset();
  const configure = (producerCount: number, minNumber: number, maxNumber: number) => 
    queueService.configure(producerCount, minNumber, maxNumber);
  const saveResults = () => queueService.saveResults();
  const getResults = () => queueService.getResults();
  const exportResults = () => queueService.exportResults();

  return {
    state,
    start,
    stop,
    reset,
    configure,
    saveResults,
    getResults,
    exportResults,
  };
}