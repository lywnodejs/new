import React from "react";
import "./index.css";


interface RippleProps{
    style?: object
}
export const Ripple: React.FC<RippleProps> = ({style}) => {
  return (
    <div className="ripple" style={style}>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      {/* <div className="circle"></div> */}
    </div>
  );
};
