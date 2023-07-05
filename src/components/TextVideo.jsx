import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const TextVideo = () => {
  const [prompt, setPrompt] = useState("");
  const [video, setVideo] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.get("http://127.0.0.1:5000/text_video", {
      params: {
        query: prompt,
      },
    }).then((response) => {

        const data = response.data; // Base64 string
        const decodedString = atob(data); // Decode Base64 string
        const arrayBuffer = new ArrayBuffer(decodedString.length);
        const uintArray = new Uint8Array(arrayBuffer);
    
        for (let i = 0; i < decodedString.length; i++) {
          uintArray[i] = decodedString.charCodeAt(i);
        }
    
        const blob = new Blob([arrayBuffer], { type: "video/mp4" }); // Create Blob object
        const video = URL.createObjectURL(blob);  
        console.log(video); 
        setVideo(video);
    });
  };

  return (
    <div>
      <input
        type="text"
        className="textarea textarea-info"
        placeholder="Enter a prompt"
        onChange={(event) => setPrompt(event.target.value)}
      />
      
      <video
        src={video}
        controls
        autoPlay
        width="500"
        height="300"
      />
      <button className="btn btn bg-gradient-to-r from-cyan-500 to-blue-300" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TextVideo;