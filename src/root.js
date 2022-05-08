/**
 * Copyright (c) 2017, David M Kent.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { render } from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "react-dates/initialize";

import App from "./components/App";

import "bootstrap/dist/css/bootstrap.css";
import "./styles/local.css";
import "react-dates/lib/css/_datepicker.css";

// React query client
const queryClient = new QueryClient();

render(
  <QueryClientProvider client={queryClient}>
    <App/>
  </QueryClientProvider>,
  document.getElementById("root")
);
