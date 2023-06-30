import React from "react";
function LangChain({ langchain }) {
    return (
      <div className="bg-white w-80 m-3 p5 rounded-lg shadow-md">
        <div className="text-lg font-semibold mb-2">{langchain===""?"":"Output:"  }</div>
        <div className= "text-lg">{langchain}</div>
      </div>
    );
  }
  
  export default LangChain;
