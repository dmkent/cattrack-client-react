const Plotly = require("plotly.js/lib/core");

// Load in the trace types for pie, and bar
Plotly.register([require("plotly.js/lib/pie"), require("plotly.js/lib/bar")]);

module.exports = Plotly;
