import React from "react";
import ReactMarkdown from "react-markdown";
function SearchOutputImg({ output }) {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      {output.map((item, index) => (
        // img classname=w-24 h-24
        <img className="w-60 h-60 mb-2 border-8 rounded border-cyan-500"
          // width="150"
          // height="200"
          key={index}
          src={item}
          alt={`Image ${index}`}
        />
      ))}
    </div>
    //  <img className="w-screen"
    // <img className="h-48 w-48 rounded-lg shadow-md"
  );
}

export default SearchOutputImg;
