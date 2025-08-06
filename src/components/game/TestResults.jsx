// src/components/game/TestResults.jsx
import React from 'react';
import { Target, CheckCircle, XCircle } from 'lucide-react';

const TestResults = ({ results, show }) => {
  if (!show || !results.length) return null;

  return (
    <div className="mt-4 bg-gray-800/50 rounded-lg p-4 border border-gray-600">
      <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
        <Target className="w-4 h-4" />
        <span>Test Results</span>
      </h4>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded border-l-4 ${
              result.passed 
                ? 'bg-green-900/30 border-green-400 text-green-100' 
                : 'bg-red-900/30 border-red-400 text-red-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">{result.description}</span>
              {result.passed ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="text-sm opacity-80 space-y-1">
              <div>
                <span className="font-medium">Input:</span> {JSON.stringify(result.input)}
              </div>
              <div>
                <span className="font-medium">Expected:</span> {JSON.stringify(result.expected)}
              </div>
              <div>
                <span className="font-medium">Got:</span> {JSON.stringify(result.actual)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults;