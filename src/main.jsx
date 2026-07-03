import "./setupPreline.js";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Buffer } from "buffer";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { HelpCenterProvider } from "./context/HelpCenterContext.jsx";

globalThis.Buffer = Buffer;

createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
      <HelpCenterProvider>
        <ToastContainer
          autoClose={1500}
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
        <App />
      </HelpCenterProvider>
    </AuthProvider>
  </Router>,
);
