import "@testing-library/jest-dom";

// Suppress JSDOM AggregateError messages from network requests
const originalConsoleError = console.error;
const originalStderrWrite = process.stderr.write;

console.error = (...args) => {
  // Filter out AggregateError stack traces from JSDOM
  const stringified = args[0]?.toString() || "";
  if (
    stringified.includes("AggregateError") ||
    stringified.includes("xhr-utils.js") ||
    stringified.includes("XMLHttpRequest-impl.js")
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

// Suppress stderr output for JSDOM AggregateErrors
process.stderr.write = function (chunk, encoding, callback) {
  const str = chunk.toString();
  if (
    str.includes("AggregateError") ||
    str.includes("xhr-utils.js") ||
    str.includes("XMLHttpRequest-impl.js") ||
    str.includes("at Object.dispatchError")
  ) {
    if (typeof encoding === "function") {
      encoding();
    } else if (callback) {
      callback();
    }
    return true;
  }
  return originalStderrWrite.apply(process.stderr, arguments);
};

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
