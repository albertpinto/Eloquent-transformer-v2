import React, {useState,useEffect} from 'react'
import Spinner from './shared/Spinner';
import ImageGeneration from './ImageGeneration';
import TextGenerator from './TextGenerator';
import VideoGenerator from './VideoGenerator';
import ImageSequence from './ImageSequence';
import TextVideo from './TextVideo';
const SearchGenerator = () => {
  const tasks = ["Generate-Image", "Generate-Text", "Generate-Video"];
  const [selectedTask, setSelectedTask] = useState("");
  const [inputText, setInputText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState("");
  const [videoData, setVideoData] = useState(null);
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
    setVideoData(null);
    console.log(e.target.value)
  };
  const cleanData = () => {
    setImage("");
    setOutput("");
    setVideoData(null);
    
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
          case "Generate-Video":
            Task = "text_video";
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
      } 
      else if (!response.ok && selectedTask==="Generate-Image") {
        console.error("Failed to fetch image.");
      }
      if (response.ok && selectedTask==="Generate-Text"){
        const data = await response.json();
        setOutput(data)

      }
      else if (!response.ok && selectedTask==="Generate-Text") {
        console.error("Failed to fetch Text.");
      }
      if (response.ok && selectedTask==="Generate-Video"){
        const data = await response.json(); // Base64 string
        const decodedString = atob(data); // Decode Base64 string
        const arrayBuffer = new ArrayBuffer(decodedString.length);
        const uintArray = new Uint8Array(arrayBuffer);
    
        for (let i = 0; i < decodedString.length; i++) {
          uintArray[i] = decodedString.charCodeAt(i);
        }
    
        const blob = new Blob([arrayBuffer], { type: "video/mp4" }); // Create Blob object
        const video = URL.createObjectURL(blob);  
        console.log(video); 
        setVideoData(video);


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
          {submitted && selectedTask ==="Generate-Text" && output===""?<Spinner/>:submitted && selectedTask ==="Generate-Text" && (<TextGenerator output={output}/>)}
          {/* {submitted && selectedTask ==="Generate-Video" 
          && videoData===null?<Spinner/>:submitted 
          && selectedTask ==="Generate-Video" 
          && 
          (<div><video type="video/mp4" 
          src={`data:video/mp4;base64,${videoData.data}`} 
          controls style={{ width: "320px",height: "320px"}}/>
          </div>)} */}
       {submitted && selectedTask ==="Generate-Video" && videoData===null?<Spinner/>:submitted && selectedTask ==="Generate-Video" && (<VideoGenerator videoData={videoData}/>)}
        </>
    </div>
  )
}

export default SearchGenerator
