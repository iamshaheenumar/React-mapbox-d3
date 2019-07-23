import React, { useRef, useEffect, useState } from "react";
import { SVGOverlay } from "react-map-gl";
import * as d3 from "d3";
import { beeswarm } from "d3-beeswarm";
import { Animate } from "react-move";
import { easeExpOut } from "d3-ease";

import usePrevious from "../../hooks/usePrevious";
import locations from "./data.json";

const BeeSwarmOverlay = ({ view }) => {
  const prevView = usePrevious(view);

  let circles = null;
  let data = [];
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
    circles = data.map(
      (location, i) =>
        !isDragging && (
          <Animate
            key={i}
            start={() => ({
              x:
                view === "MAP"
                  ? project(location.datum.geometry.coordinates)[0]
                  : location.x,
              y:
                view === "MAP"
                  ? project(location.datum.geometry.coordinates)[1]
                  : location.y + window.innerHeight / 2
            })}
            enter={() => ({
              x: [
                view === "MAP"
                  ? location.x
                  : project(location.datum.geometry.coordinates)[0]
              ],
              y: [
                view === "MAP"
                  ? location.y + window.innerHeight / 2
                  : project(location.datum.geometry.coordinates)[1]
              ],
              timing: { duration: 1000, ease: easeExpOut }
            })}
            update={() => ({
              x: [
                view === "MAP"
                  ? project(location.datum.geometry.coordinates)[0]
                  : location.x
              ],
              y: [
                view === "MAP"
                  ? project(location.datum.geometry.coordinates)[1]
                  : location.y + window.innerHeight / 2
              ],
              timing: { duration: 1000, ease: easeExpOut }
            })}
          >
            {state => {
              return <circle r={5} fill="#E26A71" cx={state.x} cy={state.y} />;
            }}
          </Animate>
        )
    );

    return circles;
  };
  return <SVGOverlay ref={svgRef} redraw={_redraw} />;
};

export default BeeSwarmOverlay;
