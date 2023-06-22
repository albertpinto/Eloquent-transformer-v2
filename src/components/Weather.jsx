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
    <div className="grid grid-cols-4 gap-4 pt-4">
      <div className="col-span-4 font-bold text-xl">Weather Details:</div>
      {Object.entries(weather).map(([key, value]) => (
        <React.Fragment key={key}>
          <div className="col-span-2 font-semibold py-1">{key}:</div>
          <div className="col-span-2 py-1">{addSuffix(key, value)}</div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Weather;
