import React, { useState } from "react";
import BeeSwarmOverlay from "../BeeSwarmOverlay";

import Map from "../Map";
import "./App.css";

const App = () => {
  const [view, setView] = useState("MAP");

  const _handleViewSwitch = () => {
    if (view === "MAP") setView("VIZ");
    else setView("MAP");
  };

  return (
    <div className="App">
      <div className="ViewSwitcher" onClick={_handleViewSwitch}>
        Switch View
      </div>
      <Map view={view}>
        <BeeSwarmOverlay view={view} />
      </Map>
    </div>
  );
};

export default App;
