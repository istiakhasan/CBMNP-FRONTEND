import React from "react";

function randomColor() {
  // Generate a random hex color
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

const CircleChar = ({ text }:{text:string}) => {
  const firstChar = text ? text.charAt(0).toUpperCase() : '?';
  const bgColor = React.useMemo(() => randomColor(), []); // color changes only when text changes

  const circleStyle:any = {
    backgroundColor: bgColor,
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    userSelect: 'none',
  };

  return <div style={circleStyle}>{firstChar}</div>;
};

export default CircleChar;
