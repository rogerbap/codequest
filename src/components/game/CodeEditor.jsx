// src/components/game/CodeEditor.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

const CodeEditor = ({ code, onChange, readOnly = false, errors = [] }) => {
  const handleChange = (e) => {
    if (!readOnly && onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-400 text-sm ml-4">debug.js</span>
          {errors.length > 0 && (
            <span className="text-red-400 text-sm ml-2 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.length} error(s)</span>
            </span>
          )}
        </div>
      </div>
      <div className="relative flex">
        <div className="w-12 bg-gray-800 border-r border-gray-700 flex flex-col text-gray-500 text-xs pt-4 flex-shrink-0">
          {code.split('\n').map((_, index) => (
            <div key={index} className="h-6 flex items-center justify-center">
              {index + 1}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={handleChange}
          readOnly={readOnly}
          className="flex-1 h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 pl-4 resize-none focus:outline-none leading-6"
          style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace' }}
          spellCheck={false}
          placeholder={readOnly ? '' : 'Write your code here...'}
        />
      </div>
    </div>
  );
};

export default CodeEditor;