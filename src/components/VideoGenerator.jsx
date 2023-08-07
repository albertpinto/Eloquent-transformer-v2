import React, { useState } from "react";
import { useEffect } from "react";

function VideoGenerator({ videoData }) {
  return (
    <div className="p-2 w-96 h-40 border-8 border-cyan-500 rounded-2xl shadow-2xl">
      <video id="video" width="320" height="240" controls src={videoData}
            type="video/mp4"/>
    </div>
  );
}

export default VideoGenerator;
