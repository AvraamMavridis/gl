import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Canvas extends React.Component {
  componentDidMount() {
    const ctx = this.canvas.getContext("webgl");
    ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    ctx.clearColor(0.813, 0.231, 0.23, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
  }

  render() {
    return (
      <canvas ref={canvas => (this.canvas = canvas)} width={300} height={300} />
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Canvas />, rootElement);
