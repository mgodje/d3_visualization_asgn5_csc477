import {create} from "../../_npm/d3-selection@3.0.0/4d94e5b7.js";
import {geoPath, geoAlbersUsa} from "../../_npm/d3-geo@3.1.1/40599fb3.js";
import {scaleLinear} from "../../_npm/d3-scale@4.0.2/720b7f0a.js";
import {extent} from "../../_npm/d3-array@3.2.4/e93ca09f.js";
import {zoom, zoomIdentity} from "../../_npm/d3-zoom@3.0.0/b5786b3f.js";

export function lifeExpectancyMap(health, counties, states) {
  const width = 975;
  const height = 610;

  const countyLife = new Map();

  for (const d of health) {
    if (!d.location_key?.startsWith("US_")) continue;

    const parts = d.location_key.split("_");

    if (parts.length === 3 && Number.isFinite(+d.life_expectancy)) {
      const fips = parts[2].trim();
      countyLife.set(fips, +d.life_expectancy);
    }
  }

  const matchedCount = counties.filter(d => {
    const fips = String(d.id).padStart(5, "0");
    return countyLife.has(fips);
  }).length;

  const values = [...countyLife.values()];
  const color = scaleLinear()
  .domain([65, 70, 74, 78, 82])
  .range([
    "#ffe5e5",
    "#ffb3b3",
    "#ff6666",
    "#cc1f1f",
    "#7f0000"
  ])
  .clamp(true);

  const projection = geoAlbersUsa()
    .fitSize([width, height], {
      type: "FeatureCollection",
      features: counties
    });

  const path = geoPath(projection);

  const svg = create("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("width", "100%")
    .style("height", "auto")
    .style("background", "#111");

  const g = svg.append("g");

  g.selectAll("path")
    .data(counties)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const fips = String(d.id).padStart(5, "0");
      const value = countyLife.get(fips);

      return Number.isFinite(value)
        ? color(value)
        : "#9e9e9e";
    })
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.15)
    .append("title")
    .text(d => {
      const fips = String(d.id).padStart(5, "0");
      const value = countyLife.get(fips);

      return `County FIPS: ${fips}
Life expectancy: ${
        Number.isFinite(value)
          ? value.toFixed(1) + " years"
          : "No data"
      }`;
    });

  g.append("g")
    .selectAll("path")
    .data(states)
    .join("path")
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.4)
    .attr("pointer-events", "none");

  const zoomBehavior = zoom()
  .scaleExtent([1, 8])
  .on("zoom", event => {
    g.attr("transform", event.transform);
  });

svg.call(zoomBehavior);

svg.append("text")
  .attr("x", width - 110)
  .attr("y", 30)
  .attr("fill", "white")
  .attr("font-size", 14)
  .attr("cursor", "pointer")
  .text("Reset zoom")
  .on("click", () => {
  svg.transition()
    .duration(750)
    .call(zoomBehavior.transform, zoomIdentity);
});

  const legend = svg.append("g")
  .attr("transform", "translate(20, 50)");

const legendData = [
  {label: "65–70 years", color: "#ffe5e5"},
  {label: "70–74 years", color: "#ffb3b3"},
  {label: "74–78 years", color: "#ff6666"},
  {label: "78–82 years", color: "#cc1f1f"},
  {label: "82+ years", color: "#7f0000"},
  {label: "No data", color: "#9e9e9e"}
];

legend.append("text")
  .attr("x", 0)
  .attr("y", -10)
  .attr("fill", "white")
  .attr("font-size", 14)
  .attr("font-weight", "bold")
  .text("Life Expectancy");

legend.selectAll("rect")
  .data(legendData)
  .join("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * 24)
  .attr("width", 18)
  .attr("height", 18)
  .attr("fill", d => d.color);

legend.selectAll("text.label")
  .data(legendData)
  .join("text")
  .attr("class", "label")
  .attr("x", 28)
  .attr("y", (d, i) => i * 24 + 14)
  .attr("fill", "white")
  .attr("font-size", 13)
  .text(d => d.label);

  return svg.node();
}