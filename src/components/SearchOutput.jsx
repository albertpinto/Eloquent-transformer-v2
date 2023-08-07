import React from "react";
import ReactMarkdown from "react-markdown";
function SearchOutput({ searchResults, sentences }) {
  return (
    // <div className="bg-white w-200 p5 rounded-lg shadow-md">
    <div className="flex xs:flex-col sm:flex-row flex-wrap  gap-2">
      {searchResults.length > 0 &&
        searchResults[0].map((item, index) => (
          <div className="p-2 w-96 h-40  border-spacing-2 border-8 border-cyan-500 rounded-2xl shadow-2xl" key={index}>
            <p>
              <b>Search Rank:</b> {index}
            </p>
            <p>
              <b>Relevance score:</b> {item.score}
            </p>
            <p><b>Text:</b>{sentences[item.corpus_id]}</p>
          </div>
        ))}
    </div>
  );
}

export default SearchOutput;
