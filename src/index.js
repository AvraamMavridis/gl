import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.setVertexCoords = this.setVertexCoords.bind(this);
  }

  createShaderProgram() {
    const ctx = this.canvas.getContext("webgl");
    const fragmentShader = this.getColorFragmentShader();
    const vertexShader = this.getVertexShader();

    const shaderProgram = ctx.createProgram();
    ctx.attachShader(shaderProgram, vertexShader);
    ctx.attachShader(shaderProgram, fragmentShader);
    ctx.linkProgram(shaderProgram);
    ctx.useProgram(shaderProgram);
    return shaderProgram;
  }

  getColorFragmentShader() {
    const ctx = this.canvas.getContext("webgl");
    var fs = `
      void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 0.5, 1.0);
      }
    `;

    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);
    ctx.shaderSource(fragmentShader, fs);
    ctx.compileShader(fragmentShader);
    return fragmentShader;
  }

  getVertexShader() {
    const ctx = this.canvas.getContext("webgl");

    const vs = `
      attribute vec4 coords;

      void main(void) {
          gl_Position = coords;
          gl_PointSize = 100.0;
      }
    `;

    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
    ctx.shaderSource(vertexShader, vs);
    ctx.compileShader(vertexShader);
    return vertexShader;
  }

  setVertexCoords(x, y, z) {
    const ctx = this.canvas.getContext("webgl");
    const shaderProgram = this.createShaderProgram();
    var coords = ctx.getAttribLocation(shaderProgram, "coords");
    ctx.vertexAttrib3f(coords, x, y, z);
  }

  componentDidMount() {
    const ctx = this.canvas.getContext("webgl");
    ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    ctx.clearColor(0.813, 0.231, 0.23, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    this.createShaderProgram();

    this.setVertexCoords(Math.random(), Math.random(), Math.random());
    ctx.drawArrays(ctx.POINTS, 0, 1);
  }

  render() {
    return (
      <canvas ref={canvas => (this.canvas = canvas)} width={300} height={300} />
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Canvas />, rootElement);
