import React from 'react'
import ReactMarkdown from 'react-markdown'

function TextGenerator({output}) {
  return (
    <div className="p-2 w-96 h-96 border-8 border-cyan-500 rounded-2xl shadow-2xl">
        <div className="text-lg font-semibold mb-2">{output===""?"":"Output:"  }</div>
        <div className= "text-lg">
        {output.map((item, index) => (
        <ReactMarkdown key={index}>{item.generated_text}</ReactMarkdown>
        ))}
        </div>
      </div>
  )
}

export default TextGenerator
