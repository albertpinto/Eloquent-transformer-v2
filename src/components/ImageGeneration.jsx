import React, { useState,useEffect } from "react";
import { Image } from "react-bootstrap";

const ImageGeneration = () => {
  const [image, setImage] = useState(null);
  const [query, setQuery] = useState("An image of a squirrel on the tree");
  let imageData = new Blob();
  const fetchImage = async () => {
    console.log(query)
    const response = await fetch(`http://127.0.0.1:5000/text_img2?query=${query}`, {
      method: "GET",
    });
    imageData = await response.blob();
    console.log(imageData)

    setImage(new Image({
      src: URL.createObjectURL(imageData),
    }));
  };

  useEffect(() => {
    fetchImage();
  }, [query]);

  if (!image) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Image src={URL.createObjectURL(imageData)} />
      <input
        type="text"
        placeholder="Query"
        onChange={event => setQuery(event.target.value)}
      />
    </div>
  );
};

export default ImageGeneration;