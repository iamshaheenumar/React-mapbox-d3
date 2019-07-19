import React, { useRef, useEffect, useState } from "react";
import { SVGOverlay } from "react-map-gl";
import * as d3 from "d3";
import { beeswarm } from "d3-beeswarm";

import locations from "./data.json";

const BeeSwarmOverlay = ({ view }) => {
  let circles = null,
    data = [];
  useEffect(() => {
    // Prepare data for beeSwarm
    let x = d3
      .scaleLinear()
      .rangeRound([0, window.innerWidth])
      .domain([0, 100]);

    data = beeswarm()
      .data(locations)
      .distributeOn(function(d) {
        return x(d.properties.performance);
      })
      .radius(7)
      .orientation("horizontal")
      .side("symetric")
      .arrange();
  });

  const svgRef = useRef(null);

  const _redraw = ({ width, height, isDragging, project, unproject }) => {
    let svg = d3.select("svg");

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return project(d.datum.geometry.coordinates)[0];
      })
      .attr("cy", function(d) {
        return project(d.datum.geometry.coordinates)[1];
      })
      .attr("r", 5)
      .attr("fill", "red");

    if (view === "MAP" && !isDragging) {
      svg
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) {
          return project(d.datum.geometry.coordinates)[0];
        })
        .attr("cy", function(d) {
          return project(d.datum.geometry.coordinates)[1];
        })
        .attr("r", 5)
        .attr("fill", "red");
    } else if (view === "VIZ") {
      circles = svg
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y + window.innerHeight / 2;
        });
    }
  };
  return <SVGOverlay ref={svgRef} redraw={_redraw} />;
};

export default BeeSwarmOverlay;
