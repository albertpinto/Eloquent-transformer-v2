import React from 'react'

function Wikipedia({wikipedia}) {
    return (
        <div className="space-y-4">
          {wikipedia.map((item, index) => (
            <div key={index} className="bg-white p-4 border-8 border-cyan-500 rounded-2xl shadow-2xl">
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>
      );
}

export default Wikipedia





