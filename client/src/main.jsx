import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = "dev-y7ddnmgfc1bsutnu.us.auth0.com"; // Replace with Auth0 domain
const clientId = "QHs7sFpLrvDX70kXA16GcTpU0EWwLE5w"; // Replace with Auth0 Client ID


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
    <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: "http://localhost:5173/",
    }}
  >
    <App />
  </Auth0Provider>
    </StoreContextProvider>
  </BrowserRouter>
);
