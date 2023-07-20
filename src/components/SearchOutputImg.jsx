import React from "react";
import ReactMarkdown from "react-markdown";
function SearchOutputImg({ output }) {
  return (
    <div className="bg-white w-200 p5 rounded-lg shadow-md">
      {output.map((item, index) => (
        <img className="h-48 w-48 mt-2 rounded-xl shadow-md border-8 rounded border-cyan-500"
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
