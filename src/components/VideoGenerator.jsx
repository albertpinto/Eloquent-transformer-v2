import React, { useState } from "react";
import { useEffect } from "react";

function VideoGenerator({ videoData }) {


  return (
    <div>
      <video id="video" width="320" height="240" controls src={videoData}
            type="video/mp4"/>
    </div>
  );
}

export default VideoGenerator;
