let globalData;
d3.select(window).on("load", function() {
  d3.json("data.json", function(err, data) {
    var height = 100,
      width = window.innerWidth,
      radius = 3,
      padding = 1.5,
      margin = { top: 20, right: 20, bottom: 30, left: 20 };

    var x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.value))
      .range([margin.left, width - margin.right]);

    drawGraph(data);

    function drawGraph(data) {
      var svg = d3.select("svg");

      svg
        .append("g")
        .attr(
          "translate",
          "transform(" + margin.left + "," + (margin.top + height) + ")"
        )
        .selectAll("circle")
        .data(dodge(data, radius * 2 + padding))
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => height - margin.bottom - radius - padding - d.y)
        .attr("r", radius)
        .append("title")
        .text(d => d.data.name);
    }

    function dodge(data, radius) {
      const radius2 = radius ** 2;
      const circles = data
        .map(d => ({ x: x(d.value), data: d }))
        .sort((a, b) => a.x - b.x);
      const epsilon = 1e-3;
      let head = null,
        tail = null;

      // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
      function intersects(x, y) {
        let a = head;
        while (a) {
          if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
            return true;
          }
          a = a.next;
        }
        return false;
      }

      // Place each circle sequentially.
      for (const b of circles) {
        // Remove circles from the queue that can’t intersect the new circle b.
        while (head && head.x < b.x - radius2) head = head.next;

        // Choose the minimum non-intersecting tangent.
        if (intersects(b.x, (b.y = 0))) {
          let a = head;
          b.y = Infinity;
          do {
            let y = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
            if (y < b.y && !intersects(b.x, y)) b.y = y;
            a = a.next;
          } while (a);
        }

        // Add b to the queue.
        b.next = null;
        if (head === null) head = tail = b;
        else tail = tail.next = b;
      }

      return circles;
    }
  });
});
