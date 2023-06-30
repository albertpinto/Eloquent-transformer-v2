import React, {useState,useEffect} from 'react'
import Spinner from './shared/Spinner';
import ImageGeneration from './ImageGeneration';
import TextGenerator from './TextGenerator';
const SearchGenerator = () => {
  const tasks = ["Generate-Image", "Generate-Text", "Generate-Video"];
  const [selectedTask, setSelectedTask] = useState("");
  const [inputText, setInputText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState("");
  //const [query, setQuery] = useState("An image of a squirrel on the tree");
  //let imageData = new Blob();
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
    setImage("");
    setOutput("");
    console.log(e.target.value)
  };
  const cleanData = () => {
    setImage("");
    setOutput("");
    
  };
    const fetchData = async () => {
      let Task;
      cleanData(); 
      switch (selectedTask) {
        case "Generate-Image":
          Task = "text_img";
          break;
          case "Generate-Text":
            Task = "text_text";
          break;
        default:
          return;
      }

      console.log(inputText)
      console.log(`http://127.0.0.1:5000/${Task}?query=${inputText}`)
      const response = await fetch(`http://127.0.0.1:5000/${Task}?query=${inputText}`, {
        method: "GET",
      });
      if (response.ok && selectedTask==="Generate-Image") {
        const data = await response.json();
        const decodedString = atob(data); // Decode Base64 string
        const arrayBuffer = new ArrayBuffer(decodedString.length);
        const uintArray = new Uint8Array(arrayBuffer);
    
        for (let i = 0; i < decodedString.length; i++) {
          uintArray[i] = decodedString.charCodeAt(i);
        }
    
        const blob = new Blob([arrayBuffer], { type: "image/png" }); // Create Blob object
        const imageURL = URL.createObjectURL(blob);
        setImage(imageURL);
      } else {
        console.error("Failed to fetch image.");
      }
      if (response.ok && selectedTask==="Generate-Text"){
        const data = await response.json();
        console.log(data);
        setOutput(data)

      }
    };

  
    useEffect(() => {
      cleanData();
      if (submitted) {
        fetchData();
      }
    }, [submitted,selectedTask, inputText]);

  return (
    <div>
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
          {submitted && selectedTask ==="Generate-Image" && image===""?<Spinner/>:submitted && selectedTask ==="Generate-Image" && (<div><img src={image} style={{ width: "320px",height: "320px"}}/></div>)}
          {submitted && selectedTask ==="Generate-Text" && output===""?<Spinner/>:submitted && selectedTask ==="Generate-Text" && (<TextGenerator output={output} />)}
        </>
    </div>
  )
}

export default SearchGenerator
