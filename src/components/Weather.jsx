import React from "react";

function Weather({ weather }) {
  const addSuffix = (key, value) => {
    if (key === "temperature") {
      return `${value} \u00B0C`; // Use the unicode character for the Celsius symbol
    } else if (key === "humidity") {
      return `${value}%`;
    }
    return value;
  };

  return (
    <div className="w-80 h-52 p-2 border-8 border-cyan-500 rounded-2xl shadow-2xl">
      <div className="font-bold text-xl">Weather Details:</div>
      {Object.entries(weather).map(([key, value]) => (
        <React.Fragment key={key}>
          <div className="py-1">{key.charAt(0).toUpperCase() + key.slice(1)}: {addSuffix(key, value)}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Weather;
