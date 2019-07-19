import React, { useState, useEffect } from "react";
import ReactMapGL from "react-map-gl";

const Map = ({ children, view }) => {
  useEffect(() => {
    setViewport();
  }, [view]);

  const mapStyle = "mapbox://styles/shaheenumar/cjy8nf9ok11u91clhex1fbloy";
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 25.00957,
    longitude: 55.125615,
    zoom: 10.2,
    minZoom: 10.2,
    maxZoom: 15
  });

  useEffect(() => {
    if (view === "MAP") setViewport({ ...viewport, dragPan: true });
    else setViewport({ ...viewport, dragPan: false });
  }, [view]);

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={viewport => setViewport(viewport)}
      mapStyle={mapStyle}
    >
      {children}
    </ReactMapGL>
  );
};

export default Map;
