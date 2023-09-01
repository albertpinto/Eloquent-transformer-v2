import React, {useState,useEffect} from 'react'
import LangChain from './LangChain';
import Spinner from './shared/Spinner';

function AdvancedSearch() {
    const tasks = ["Langchain-Prompt","Langchain-Text","Langchain-Tools"];
    const [selectedTask, setSelectedTask] = useState("");
    const [inputText, setInputText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const handleInputChange = (e) => {
      setInputText(e.target.value);
      setSubmitted(false);
      console.log(e.target.value)
    };
    const handleSubmit = () => {
      setSubmitted(true);
    };

    const handleTaskChange = (e) => {
      setSelectedTask(e.target.value);     
      setInputText("");
      setSubmitted(false);
      setOutput("");
      console.log(e.target.value)
    };
    useEffect(() => {
      if (submitted) {
        fetchData();
      }
    }, [submitted, selectedTask, inputText]);
    const fetchData = async () => {
      let sTask;
      cleanData(); 
      switch (selectedTask) {
        case "Langchain-Text":
          sTask ="lc_text"
          //sTask ="langchain_text"
          break;
        case "Langchain-Prompt":
          sTask ="lc_prompt"
          break;
        case "Langchain-Tools":
          sTask ="lc_tools"
        break;  
      }
      const url= `http://127.0.0.1:5000/${sTask}?query=${inputText}`;
      console.log(url)
      const response= await fetch(url);
      const data = await response.json();
  
      console.log(data);
      setOutput(data)
      //setIsLoading(false);
     
    };
    const cleanData = () => {
      setOutput("");
    };
  return (
        <>
          <label className="label">
            <span className="label-text">Task</span>
          </label>
          <select
            className="select select-bordered select-info w-full max-w-xs"
            value={selectedTask}
            onChange={handleTaskChange}
          >
            <option disabled value="">
              Choose your Task
            </option>
            {tasks.map((task, index) => (
              <option key={index} value={task}>
                {task}
              </option>
            ))}
          </select>
          <div
            className="form-control"
            style={{ marginTop: "20px", width: "320px", marginBottom: "20px" }}
          >
            <label className="label">
              <span className="label-text">Input</span>
            </label>
            <textarea
              className="textarea textarea-info"
              style={{ width: "320px" }}
              placeholder="Enter Input"
              value={inputText}
              onChange={handleInputChange}
            ></textarea>
            <button
              className="rounded-full btn btn  bg-cyan-500 shadow-lg shadow-cyan-500/50"
              style={{ width: "100px", marginTop: "20px" }}
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </button>
    
{/*             <button
              className="btn btn btn-accent"
              type="submit"
              style={{ width: "100px", marginTop: "20px" }}
              onClick={handleSubmit}
            >
              Submit
            </button> */}

          </div>
          {submitted && output ==="" ?<Spinner/>:(<LangChain langchain={output} />)}
        </>
      );
    }
export default AdvancedSearch
