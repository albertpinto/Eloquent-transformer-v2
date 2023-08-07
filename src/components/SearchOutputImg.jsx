import React from "react";
import ReactMarkdown from "react-markdown";
function SearchOutputImg({ output }) {
  return (
    <div className="flex xs:flex-col sm:flex-row flex-wrap  gap-2">
      {output.map((item, index) => (
        <img
          className="w-56 h-56 border-8 border-cyan-400 rounded-2xl shadow-2xl
        hover:scale-75 hover:skew-y-12 hover:skew-x-12 hover:scale-75 hover:rotate-180"
          key={index}
          src={item}
          alt={`Image ${index}`}
        />
      ))}
    </div>
  );
}

export default SearchOutputImg;
