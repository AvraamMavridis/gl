import React from "react";
import ReactDOM from "react-dom";

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

  getRandomCoord() {
    const sign = Math.random();
    const value = Math.random();
    return sign > 0.5 ? value : -value;
  }

  getShaderProgram() {
    this.shaderProgram = this.shaderProgram || this.createShaderProgram();
    return this.shaderProgram;
  }

  getColorFragmentShader() {
    const ctx = this.canvas.getContext("webgl");
    var fs = `
      precision mediump float;
      uniform vec4 color;
        
      void main(void) {
        gl_FragColor = color;
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
      uniform float size;

      void main(void) {
          gl_Position = coords;
          gl_PointSize = size;
      }
    `;

    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
    ctx.shaderSource(vertexShader, vs);
    ctx.compileShader(vertexShader);
    return vertexShader;
  }

  setVertexCoords() {
    if (!this.canvas) return;
    const vertices = Array.apply(Array, { length: 10000 }).map(
      this.getRandomCoord
    );
    const ctx = this.canvas.getContext("webgl");
    var buffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
    ctx.bufferData(
      ctx.ARRAY_BUFFER,
      new Float32Array(vertices),
      ctx.STATIC_DRAW
    );

    const shaderProgram = this.getShaderProgram();
    const coords = ctx.getAttribLocation(shaderProgram, "coords");
    const size = ctx.getUniformLocation(shaderProgram, "size");
    ctx.vertexAttribPointer(coords, 3, ctx.FLOAT, false, 0, 0);
    ctx.enableVertexAttribArray(coords);
    ctx.uniform1f(size, Math.random() * 10);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
  }

  setColor(r, g, b, a) {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("webgl");
    const shaderProgram = this.getShaderProgram();
    var color = ctx.getUniformLocation(shaderProgram, "color");
    ctx.uniform4f(color, r, g, b, a);
  }

  drawScene() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("webgl");
    ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
    ctx.clearColor(Math.random(), Math.random(), Math.random(), 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    this.setColor(Math.random(), Math.random(), Math.random(), 1.0);
    this.setVertexCoords();
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    ctx.drawArrays(ctx.POINTS, 0, 1000);
    requestAnimationFrame(() => this.drawScene());
  }

  componentDidMount() {
    if (!this.canvas) return;
    this.drawScene();
  }

  render() {
    return (
      <canvas ref={canvas => (this.canvas = canvas)} width={300} height={300} />
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Canvas />, rootElement);
