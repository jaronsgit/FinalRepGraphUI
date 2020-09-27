import React, { useContext } from "react";
import "./styles.css";
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";

import { AppContext } from "./Store/AppContextProvider.js";

//import { AppContext } from "./Store/AppContext.js";

export default function App() {
  const context = useContext(AppContext);

  return (
    <Router>
      <Routes />
    </Router>
  );
}
