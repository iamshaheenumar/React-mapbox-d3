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

var windowWidth = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  ),
  windowHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
var circles;
var x = d3
  .scaleLinear()
  .rangeRound([0, windowWidth])
  .domain([0, 100]);
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
    var swarm = d3
      .beeswarm()
      .data(data.features) // set the data to arrange
      .distributeOn(function(d) {
        // set the value accessor to distribute on
        return x(d.properties.performance); // evaluated once on each element of data
      }) // when starting the arrangement
      .radius(7) // set the radius for overlapping detection
      .orientation("horizontal") // set the orientation of the arrangement
      // could also be 'vertical'
      .side("symetric") // set the side(s) available for accumulation
      // could also be 'positive' or 'negative'
      .arrange();
    drawData(swarm);
  });
});

// Project GeoJSON coordinate to the map's current state
function project(d) {
  return map.project(new mapboxgl.LngLat(+d[0], +d[1]));
}
// Draw GeoJSON data with d3

function drawData(data) {
  // Add circles
  circles = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 5)
    .on("click", function(d) {
      alert(d.datum.properties.name);
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
        return project(d.datum.geometry.coordinates).x;
      })
      .attr("cy", function(d) {
        return project(d.datum.geometry.coordinates).y;
      });
    // Grid view
  } else if (view === "grid") {
    // Check window with and height

    svg.selectAll("circle").each(function(d) {
      var circle = d3.select(this);
      circle
        .transition()
        .duration(transitionTime)
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y + windowHeight / 2;
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
