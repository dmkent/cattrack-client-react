import "@testing-library/jest-dom";

// Mock canvas for plotly.js
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: new Array(4) }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
  }),
});

// Mock WebGL context
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: (contextType) => {
    if (contextType === "webgl" || contextType === "experimental-webgl") {
      return {};
    }
    return null;
  },
});

// Global URL for tests
global.URL = {
  createObjectURL: () => "mock-url",
  revokeObjectURL: () => {},
};

// Mock URL constructor for axios compatibility
global.URL = class URL {
  constructor(url, base) {
    this.href = url;
    this.origin = base || "http://localhost";
    this.protocol = "http:";
    this.hostname = "localhost";
    this.port = "";
    this.pathname = "/";
    this.search = "";
    this.hash = "";
  }

  static createObjectURL() {
    return "mock-url";
  }

  static revokeObjectURL() {}
};
