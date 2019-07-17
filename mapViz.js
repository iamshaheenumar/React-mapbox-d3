var view = "map";
//////////////////
// Mapbox stuff
//////////////////
// Set-up map
mapboxgl.accessToken =
  "pk.eyJ1IjoicGl4b25hbCIsImEiOiJjanBlM3RsZ3IwNHcxM3dxMWh3Y3hwaWppIn0.u6Js9pqrpVzXz5Fu1l0HBQ"; // Set your mapbox token here
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/pixonal/cjvhw6h7p0xi31cs0py26cge7",
  zoom: 10.2,
  center: [55.125615, 25.00957]
});
//////////////////////////
// Mapbox+D3 Connection
//////////////////////////
// Get Mapbox map canvas container
var canvas = map.getCanvasContainer();
// Overlay d3 on the map
var svg = d3.select(canvas).append("svg");
// Load map and dataset
map.on("load", function() {
  d3.json("data.json", function(err, data) {
    drawData(data);
  });
});
// Project GeoJSON coordinate to the map's current state
function project(d) {
  return map.project(new mapboxgl.LngLat(+d[0], +d[1]));
}
//////////////
// D3 stuff
//////////////
// Draw GeoJSON data with d3
var circles;
function drawData(data) {
  var margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var cell = g
    .append("g")
    .attr("class", "cells")
    .selectAll("g")
    .data(
      d3
        .voronoi()
        .extent([
          [-margin.left, -margin.top],
          [width + margin.right, height + margin.top]
        ])
        .x(function(d) {
          return d.x;
        })
        .y(function(d) {
          return d.y;
        })
        .polygons(data.features)
    )
    .enter()
    .append("g");

  // Add circles
  // circles = cell
  //   .selectAll("circle")
  //   .data(data.features)
  //   .enter()
  //   .append("circle")
  //   .attr("r", 5)
  //   .on("click", function(d) {
  //     alert(d.properties.name + ":" + d.properties.performance);
  //   });

  cell
    .append("circle")
    .attr("r", 5)
    .attr("cx", function(d) {
      console.log(d);
      return d.data.x;
    })
    .attr("cy", function(d) {
      return d.data.y;
    });

  cell.append("path").attr("d", function(d) {
    return "M" + d.join("L") + "Z";
  });
  // Call the update function
  update();
  // Update on map interaction
  map.on("viewreset", function() {
    update(0);
  });
  map.on("move", function() {
    update(0);
  });
  map.on("moveend", function() {
    update(0);
  });
}
// Update function
function update(transitionTime) {
  // Default value = 0
  transitionTime = typeof transitionTime !== "undefined" ? transitionTime : 0;
  // Map view
  if (view === "map") {
    svg
      .selectAll("circle")
      .transition()
      .duration(transitionTime)
      .attr("cx", function(d) {
        return project(d.geometry.coordinates).x;
      })
      .attr("cy", function(d) {
        return project(d.geometry.coordinates).y;
      });
    // Grid view
  } else if (view === "grid") {
    // Check window with and height
    var windowWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      ),
      windowHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
    var x = d3
      .scaleLinear()
      .rangeRound([0, windowWidth])
      .domain([0, 100]);

    svg.selectAll("circle").each(function(d) {
      var circle = d3.select(this);
      circle
        .transition()
        .duration(transitionTime)
        .attr("cx", function(d) {
          return x(d.properties.performance);
        })
        .attr("cy", function(d) {
          return windowHeight / 2;
        });
    });
  }
}
function setMapOpacity(value) {
  d3.selectAll(".mapboxgl-canvas")
    .transition()
    .duration(500)
    .style("opacity", value);
  d3.selectAll(".mapboxgl-control-container")
    .transition()
    .duration(500)
    .style("opacity", value);
}
function showMap() {
  setMapOpacity(1);
  // Enable map interaction
  map.doubleClickZoom.enable();
  map.scrollZoom.enable();
  map.dragPan.enable();
}
function hideMap() {
  // Disable map interaction
  map.doubleClickZoom.disable();
  map.scrollZoom.disable();
  map.dragPan.disable();
}
////////////
// Toggle
////////////
function toggleViews() {
  // Toggle active view
  if (view == "map") {
    view = "grid";
    hideMap();
  } else if (view == "grid") {
    view = "map";
    showMap();
  }
  update(500);
}
