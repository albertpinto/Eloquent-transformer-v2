import React from 'react';

function Translate({ translate }) {
  return (
    <div className="w-80 h-52 p-2 border-8 border-cyan-500 rounded-2xl shadow-2xl">
      <div className="text-lg font-semibold mb-2">Translation:</div>
      <div>{translate}</div>
    </div>
  );
}

export default Translate;

