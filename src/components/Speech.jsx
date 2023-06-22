import React, { useState, useEffect } from 'react';
import mic_on from './images/mic_on.png';
import mic_off from './images/mic-off.png'

const Speech = (props) => {
  const [word, setWord] = useState('');
  const [micImg, setMicImg] = useState(mic_on);
  const { setSelectedElement, selectedElement } = props;
  const [mic, setMic] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMicImg(mic_on)
    }, 3000);
    return () => clearTimeout(timer);
  }, [micImg]);

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.continuous = true;
    if (!mic){
      recognition.start()
    }
    else {
      recognition.stop()
    }

    recognition.addEventListener('result', (e) => {
      let word = e.results[0][0].transcript
      word = word.charAt(0).toUpperCase() + word.slice(1);
      setMicImg(mic_off);
      console.log(word);
      setWord(word);
    });
  }
  const handleClick = () => {
    setMic(!mic)
    startSpeechRecognition() 
  }
  let buttontext = mic ? "Speech Off" : "Speech On"
  return (
    <>
    <button onClick={handleClick}>{buttontext}</button>
    <label>{word}</label>
    </>
  )


  


}

export default Speech;