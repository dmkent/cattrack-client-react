/**
 * Copyright (c) 2017, David M Kent.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// THEME SELECTION - uncomment ONE:
// import "bootstrap/dist/css/bootstrap.css";           // Default Bootstrap
// import "bootswatch/dist/cosmo/bootstrap.css"; //        Cosmo - bold, modern
import "bootswatch/dist/litera/bootstrap.css";       // Litera - light, elegant
import { createRoot } from "react-dom/client";

import { App } from "./components/App";
import "./styles/local.css";

// React query client
const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
