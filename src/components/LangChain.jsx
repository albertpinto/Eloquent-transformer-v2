import React from "react";
function LangChain({ langchain }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-lg font-semibold mb-2">Output:</div>
        <div>{langchain}</div>
      </div>
    );
  }
  
  export default LangChain;
