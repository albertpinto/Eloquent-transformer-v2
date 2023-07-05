import React, { useEffect, useState } from 'react';

function ImageSequence({ imageData }) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % imageData.length);
    }, 250); // Adjust speed here, currently 4 FPS

    return () => clearInterval(interval);
  }, [imageData]);

  return (
    <img style={{ width: "320px",height: "320px"}} src={`data:image/jpeg;base64,${imageData[imageIndex]}`} alt="Generated" />
  );
}

export default ImageSequence;
