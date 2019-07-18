import React, { useRef, useEffect } from "react";
import { SVGOverlay } from "react-map-gl";
import * as d3 from "d3";
import d3BeeSwarm from "d3-beeswarm";

import locations from "./data.json";

const BeeSwarmOverlay = props => {
  useEffect(() => {
    let svg = d3.select("svg");
    svg
      .append("circle")
      .attr("cx", window.innerWidth / 2)
      .attr("cy", window.innerHeight / 2)
      .attr("r", 10)
      .attr("fill", "red");
  });

  const svgRef = useRef(null);
  const _redraw = ({ width, height, isDragging, project, unproject }) => {
    if (!isDragging) {
      //   let svg = d3.select("svg");
      //   svg
      //     .append("circle")
      //     .attr("cx", width / 2)
      //     .attr("cy", height / 2)
      //     .attr("r", 10)
      //     .attr("fill", "red");
    }
  };
  return <SVGOverlay className="svg" ref={svgRef} redraw={_redraw} />;
};

export default BeeSwarmOverlay;
