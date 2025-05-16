import { QueueState, NumberRecord, Results } from '../types';

class QueueService {
  // Инициализация начального состояния
  private state: QueueState = {
    queue: [],
    collectedNumbers: new Map<number, string>(),
    running: false,
    startTime: null,
    endTime: null,
    producerCount: 3,
    minNumber: 1,
    maxNumber: 100,
    completionPercentage: 0,
  };
  
  private listeners: ((state: QueueState) => void)[] = [];
  private producerIntervals: NodeJS.Timeout[] = [];
  private consumerInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.reset();
  }

  // Подписка на изменения состояния
  public subscribe(listener: (state: QueueState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Уведомление всех слушателей об изменении состояния
  private notifyListeners(): void {
    const totalPossibleNumbers = this.state.maxNumber - this.state.minNumber + 1;
    this.state.completionPercentage = (this.state.collectedNumbers.size / totalPossibleNumbers) * 100;
    
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  // Добавление числа в очередь
  public enqueue(value: number): void {
    this.state.queue.push(value);
    this.notifyListeners();
  }

  // Извлечение числа из очереди
  public dequeue(): number | undefined {
    const value = this.state.queue.shift();
    this.notifyListeners();
    return value;
  }

  // Запуск системы
  public start(): void {
    if (this.state.running) return;
    
    this.state.running = true;
    this.state.startTime = Date.now();
    this.state.endTime = null;
    
    // Запуск производителей
    for (let i = 0; i < this.state.producerCount; i++) {
      const interval = setInterval(() => {
        if (!this.state.running) return;
        
        const randomNumber = Math.floor(
          Math.random() * (this.state.maxNumber - this.state.minNumber + 1) + this.state.minNumber
        );
        
        this.enqueue(randomNumber);
      }, 100 + Math.random() * 200); // Случайная задержка для каждого производителя
      
      this.producerIntervals.push(interval);
    }
    
    // Запуск потребителя
    this.consumerInterval = setInterval(() => {
      if (!this.state.running) return;
      
      const number = this.dequeue();
      
      if (number !== undefined) {
        // Проверка на уникальность числа
        if (!this.state.collectedNumbers.has(number)) {
          // Сохранение числа с текущей меткой времени
          this.state.collectedNumbers.set(number, new Date().toISOString());
          
          // Проверка завершения сбора всех чисел
          const totalPossibleNumbers = this.state.maxNumber - this.state.minNumber + 1;
          if (this.state.collectedNumbers.size === totalPossibleNumbers) {
            this.stop();
          }
        }
      }
      
      this.notifyListeners();
    }, 50);
    
    this.notifyListeners();
  }

  // Остановка системы
  public stop(): void {
    if (!this.state.running) return;
    
    this.state.running = false;
    this.state.endTime = Date.now();
    
    // Остановка всех производителей
    this.producerIntervals.forEach(interval => clearInterval(interval));
    this.producerIntervals = [];
    
    // Остановка потребителя
    if (this.consumerInterval) {
      clearInterval(this.consumerInterval);
      this.consumerInterval = null;
    }
    
    this.notifyListeners();
  }

  // Сброс состояния системы
  public reset(): void {
    this.stop();
    
    this.state = {
      queue: [],
      collectedNumbers: new Map<number, string>(),
      running: false,
      startTime: null,
      endTime: null,
      producerCount: this.state.producerCount,
      minNumber: this.state.minNumber,
      maxNumber: this.state.maxNumber,
      completionPercentage: 0,
    };
    
    this.notifyListeners();
  }

  // Настройка параметров системы
  public configure(producerCount: number, minNumber: number, maxNumber: number): void {
    if (this.state.running) {
      this.stop();
    }
    
    this.state.producerCount = producerCount;
    this.state.minNumber = minNumber;
    this.state.maxNumber = maxNumber;
    
    this.reset();
  }

  // Получение результатов
  public getResults(): Results {
    const timeSpent = this.state.endTime && this.state.startTime 
      ? this.state.endTime - this.state.startTime 
      : 0;
    
    const numbersGenerated: NumberRecord[] = [];
    this.state.collectedNumbers.forEach((date, value) => {
      numbersGenerated.push({ value, date });
    });
    
    return {
      timeSpent,
      numbersGenerated,
    };
  }

  // Экспорт результатов в JSON формат
  public exportResults(): string {
    const results = this.getResults();
    return JSON.stringify(results, null, 2);
  }

  // Сохранение результатов в файл
  public saveResults(): void {
    const results = this.exportResults();
    const blob = new Blob([results], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `результаты-сбора-чисел-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Единственный экземпляр сервиса
export const queueService = new QueueService();