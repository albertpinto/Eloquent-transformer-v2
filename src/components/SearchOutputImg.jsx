import React from "react";
import ReactMarkdown from "react-markdown";
function SearchOutputImg({ output }) {
  return (
    <div className="bg-white w-200 m-3 p5 rounded-lg shadow-md">
      {output.map((item, index) => (
        <img
          width="150"
          height="200"
          key={index}
          src={item}
          alt={`Image ${index}`}
        />
      ))}
    </div>
  );
}

export default SearchOutputImg;
