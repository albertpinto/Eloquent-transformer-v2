import React from "react";
import ReactMarkdown from "react-markdown";
function SearchOutput({searchResults,sentences }) {
  return (
    <div className="bg-white w-200 p5 rounded-lg shadow-md">
    {searchResults.length > 0 && searchResults[0].map((item, index) => (
        <div className= "text-lg" key={index}>
            <p>-----------------------------------</p>
            <p>Search Rank: {index}, Relevance score: {item.score}</p>
            <p>{sentences[item.corpus_id]}</p>
        </div>
    ))}
  </div>
);
}

export default SearchOutput;
