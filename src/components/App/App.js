import React from "react";
import BeeSwarmOverlay from "../BeeSwarmOverlay";

import Map from "../Map";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Map>
        <BeeSwarmOverlay />
      </Map>
    </div>
  );
}

export default App;
