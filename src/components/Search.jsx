import React, { useState, useEffect } from "react";
import Weather from "./Weather";
import Arxiv from "./Arxiv";
import Translate from "./Translate";
import Wikipedia from "./Wikipedia";
import ScrapeHackerNews from "./ScrapeHackerNews";

function Search() {
  const tasks = ["wikipedia", "weather", "arxiv", "translate", "scrape"];
  const [selectedTask, setSelectedTask] = useState("");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [output, setOutput] = useState({});
  const [publication, setPublication] = useState([]);
  const [translate, setTranslate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wikipedia, setWikipedia] = useState([]);
  //const [scrape, setScrape] = useState([]);

  const cleanData = () => {
    setPublication([]);
    setTranslate("");
    setOutput({});
    setWikipedia([]);
  };

  const handleTaskChange = (e) => {
    setSelectedTask(e.target.value);
    setInputText("");
    setSubmitted(false);
    setPublication([]);
    setTranslate("");
    setOutput({});
    setWikipedia([]);
  };

  const fetchData = async () => {
    const url= `http://127.0.0.1:5000/${selectedTask}?query=${inputText}`;
    console.log(url)
    const response= await fetch(url);
    const data = await response.json();
    console.log(data);
    cleanData(); 
    setIsLoading(false);
    switch (selectedTask) {
      case "weather":
        setOutput(data);
        break;
      case "wikipedia":
        setWikipedia(data);
        break;
      case "arxiv":
        setPublication(data);
        break;
      case "translate":
        setTranslate(data);
        break;
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      fetchData();
    }
  }, [submitted, selectedTask, inputText,isLoading]);

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
          className="btn btn btn-accent"
          type="submit"
          style={{ width: "100px", marginTop: "20px" }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {submitted && selectedTask === "weather" && (
      <Weather weather={output} /> 
      )}
      {submitted && selectedTask === "arxiv" && (
        <Arxiv publications={publication} />
      )}
      {submitted && selectedTask === "translate" && (
        <Translate translate={translate} />
      )}
      {submitted && selectedTask === "wikipedia" && (
        <Wikipedia wikipedia={wikipedia} />
      )}
      
    </>
  );
}

export default Search;
