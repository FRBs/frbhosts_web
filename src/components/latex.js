import React, { useEffect } from "react";

var Latex = require("react-latex");

const LatexComponent = (props) => {
  //   const text = `$M_*$ ($\rm M_{\\odot}$)`;
  return (
    <div>
      <Latex>{props.text}</Latex>
    </div>
  );
};

export default LatexComponent;
