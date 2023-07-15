import React from 'react'
import SearchOutput from './SearchOutput'
import { useState, useEffect } from 'react';
import Spinner from './shared/Spinner';
import SearchOutputImg from './SearchOutputImg';
function EnterpriseSearch() {
    const tasks = ["Text to Text","Text to Image"];
    const [selectedTask, setSelectedTask] = useState("");
    const [inputText, setInputText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [output, setOutput] = useState("");
    const [imageOutput, setImageOutput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [sentences, setSentences] = useState([]);
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
      setSearchResults([])
      setSentences([])
      setImageOutput("");
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
        case "Text to Text":
          sTask ="text_txt"
          break;
        case "Text to Image":
          sTask ="text_image"
          break;
      }
      console.log(sTask)
      const url= `http://127.0.0.1:5000/${sTask}?query=${inputText}`;
      console.log(url)
      const response= await fetch(url);
      const data = await response.json();
      setSearchResults(data[0])
      setSentences(data[1])
      setOutput(data[0])
      setImageOutput(data)
      console.log("Here is the data")

      //setIsLoading(false);
     
    };
    const cleanData = () => {
      setOutput("");
      setSearchResults([])
      setSentences([])
      setImageOutput("")
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
              className="btn btn bg-gradient-to-r from-cyan-500 to-blue-300"
              type="submit"
              style={{ width: "100px", marginTop: "20px" }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          {submitted && selectedTask ==="Text to Text" && output==="" ?<Spinner/>:submitted && selectedTask ==="Text to Text" && (<SearchOutput searchResults ={searchResults} sentences={sentences}/>)}
          {submitted && selectedTask ==="Text to Image" && imageOutput==="" ?<Spinner/>:submitted && selectedTask ==="Text to Image" && (<SearchOutputImg output={imageOutput}/>)}
        </>
      );
    }

export default EnterpriseSearch
