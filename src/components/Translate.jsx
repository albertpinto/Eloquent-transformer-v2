import React from 'react';

function Translate({ translate }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-lg font-semibold mb-2">Translation:</div>
      <div>{translate}</div>
    </div>
  );
}

export default Translate;

