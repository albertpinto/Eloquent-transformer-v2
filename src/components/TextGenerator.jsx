import React from 'react'
import ReactMarkdown from 'react-markdown'

function TextGenerator({output}) {
  return (
    <div className="bg-white w-200 m-3 p5 rounded-lg shadow-md">
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
