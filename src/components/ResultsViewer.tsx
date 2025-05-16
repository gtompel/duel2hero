import React, { useState, useEffect } from 'react';

interface ResultsViewerProps {
  collectedNumbers: Map<number, string>;
  startTime: number | null;
  endTime: number | null;
}

const ResultsViewer: React.FC<ResultsViewerProps> = ({ 
  collectedNumbers,
  startTime,
  endTime
}) => {
  const [jsonPreview, setJsonPreview] = useState('');
  const [sortAscending, setSortAscending] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (collectedNumbers.size > 0) {
      let numbersArray = Array.from(collectedNumbers.entries()).map(([value, date]) => ({
        value,
        date,
      }));
      
      numbersArray.sort((a, b) => 
        sortAscending ? a.value - b.value : b.value - a.value
      );
      
      const results = {
        timeSpent: endTime && startTime ? endTime - startTime : 0,
        numbersGenerated: numbersArray,
      };
      
      setJsonPreview(JSON.stringify(results, null, 2));
    } else {
      setJsonPreview('');
    }
  }, [collectedNumbers, sortAscending, startTime, endTime]);

  const toggleSort = () => {
    setSortAscending(!sortAscending);
    setActivePage(1);
  };

  const numbersArray = Array.from(collectedNumbers.entries())
    .map(([value, date]) => ({ value, date }))
    .sort((a, b) => sortAscending ? a.value - b.value : b.value - a.value);
    
  const totalPages = Math.ceil(numbersArray.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedNumbers = numbersArray.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 dark:text-white flex items-center">
          <span className="mr-2 text-blue-500">📄</span>
          Предпросмотр результатов
        </h3>
        
        <button
          onClick={toggleSort}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          title={sortAscending ? "Сортировать по убыванию" : "Сортировать по возрастанию"}
        >
          {sortAscending ? "↑" : "↓"}
        </button>
      </div>
      
      {collectedNumbers.size > 0 ? (
        <>
          <div className="mb-4 overflow-auto max-h-80 bg-gray-50 dark:bg-gray-700 rounded-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Число
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Время получения
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {paginatedNumbers.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-650">
                    <td className="px-4 py-2 whitespace-nowrap font-mono">
                      {item.value}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 pb-1">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Показано {startIndex + 1}-{Math.min(startIndex + itemsPerPage, numbersArray.length)} из {numbersArray.length} чисел
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setActivePage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md
                                ${activePage === pageNum 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <button
                    onClick={() => setActivePage(Math.min(activePage + 1, totalPages))}
                    disabled={activePage === totalPages}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50"
                  >
                    Далее
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Всего уникальных чисел: {collectedNumbers.size} | 
            Затраченное время: {endTime && startTime ? `${((endTime - startTime) / 1000).toFixed(2)} секунд` : 'В процессе...'}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Данные еще не собраны. Запустите процесс сбора, чтобы увидеть результаты.
        </div>
      )}
    </div>
  );
};

export default ResultsViewer;