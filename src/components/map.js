import "npm:d3-transition";
import {create, select, pointer} from "npm:d3-selection";
import {geoPath, geoAlbersUsa} from "npm:d3-geo";
import {scaleLinear} from "npm:d3-scale";
import {mean, min, max} from "npm:d3-array";

export function lifeExpectancyMap(health, counties, states) {
  const width = 975;
  const height = 610;

  const stateAbbrToFips = {
    AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08", CT: "09",
    DE: "10", DC: "11", FL: "12", GA: "13", HI: "15", ID: "16", IL: "17",
    IN: "18", IA: "19", KS: "20", KY: "21", LA: "22", ME: "23", MD: "24",
    MA: "25", MI: "26", MN: "27", MS: "28", MO: "29", MT: "30", NE: "31",
    NV: "32", NH: "33", NJ: "34", NM: "35", NY: "36", NC: "37", ND: "38",
    OH: "39", OK: "40", OR: "41", PA: "42", RI: "44", SC: "45", SD: "46",
    TN: "47", TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54",
    WI: "55", WY: "56"
  };

  const stateNameByFips = new Map(
    states.map(d => [String(d.id).padStart(2, "0"), d.properties?.name ?? "Unknown state"])
  );

  const countyLife = new Map();

  for (const d of health) {
    if (!d.location_key?.startsWith("US_")) continue;

    const parts = d.location_key.split("_");

    if (parts.length === 3 && Number.isFinite(+d.life_expectancy)) {
      countyLife.set(parts[2].trim(), +d.life_expectancy);
    }
  }

  // Reversed scale: darker red = lower life expectancy.
  function color(value) {
  if (!Number.isFinite(value)) return "#9e9e9e";

  if (value <= 70) return "#7f0000";
  if (value <= 74) return "#cc1f1f";
  if (value <= 78) return "#ff6666";
  if (value <= 82) return "#ffb3b3";

  return "#ffe5e5";
  }

  const container = create("div")
    .attr("class", "life-exp-app")
    .style("display", "grid")
    .style("grid-template-columns", "minmax(0, 1fr) 260px")
    .style("gap", "18px")
    .style("align-items", "start");

  const left = container.append("div");

  const controls = left.append("div")
    .style("display", "flex")
    .style("gap", "12px")
    .style("align-items", "center")
    .style("margin", "0 0 10px 0");

  controls.append("label")
    .attr("for", "state-select")
    .style("font-weight", "bold")
    .text("Drop down by state:");

  const selectBox = controls.append("select")
    .attr("id", "state-select")
    .style("padding", "6px")
    .style("border-radius", "6px");

  selectBox.append("option")
    .attr("value", "all")
    .text("National overview");

  const excludedTerritories = new Set([
  "60", // American Samoa
  "66", // Guam
  "69", // Northern Mariana Islands
  "72", // Puerto Rico
  "78"  // U.S. Virgin Islands
]);

  states
    .filter(s => !excludedTerritories.has(String(s.id).padStart(2, "0")))
    .sort((a, b) => (a.properties?.name ?? "").localeCompare(b.properties?.name ?? ""))
    .forEach(s => {
      const fips = String(s.id).padStart(2, "0");

      selectBox.append("option")
        .attr("value", fips)
        .text(s.properties?.name ?? fips);
    });

  const resetButton = controls.append("button")
    .style("padding", "6px 10px")
    .style("border-radius", "6px")
    .style("border", "1px solid #999")
    .style("cursor", "pointer")
    .text("Reset to overview");

  const svg = left.append("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("width", "100%")
    .style("height", "auto")
    .style("background", "#111")
    .style("border-radius", "8px");

  const countyLayer = svg.append("g");
  const stateLayer = svg.append("g");

  const tooltip = left.append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "white")
    .style("color", "#111")
    .style("border", "1px solid #999")
    .style("border-radius", "6px")
    .style("padding", "8px")
    .style("font-size", "13px")
    .style("pointer-events", "none")
    .style("box-shadow", "0 2px 8px rgba(0,0,0,0.25)");

  const side = container.append("aside")
    .style("background", "#f7f7f7")
    .style("color", "#111")
    .style("border", "1px solid #ddd")
    .style("border-radius", "8px")
    .style("padding", "14px")
    .style("font-family", "system-ui, sans-serif");

  const summary = side.append("div");

  side.append("h3")
    .style("margin-top", "18px")
    .text("Legend");

  const legendData = [
    {label: "≤ 70 years", color: "#7f0000"},
    {label: "70–74 years", color: "#cc1f1f"},
    {label: "74–78 years", color: "#ff6666"},
    {label: "78–82 years", color: "#ffb3b3"},
    {label: "82+ years", color: "#ffe5e5"},
    {label: "No data", color: "#9e9e9e"}
  ];

  const legend = side.append("div");

  legend.selectAll("div")
    .data(legendData)
    .join("div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "8px")
    .style("margin", "8px 0")
    .html(d => `
      <span style="
        display:inline-block;
        width:18px;
        height:18px;
        background:${d.color};
        border:1px solid #555;
      "></span>
      <span>${d.label}</span>
    `);

  side.append("p")
    .style("font-size", "13px")
    .style("line-height", "1.35")
    .style("margin-top", "16px")
    .text("Darker red represents shorter life expectancy. Select a state to move from the national overview into a more detailed county-level view.");

  let selectedState = "all";

  function countyFips(d) {
    return String(d.id).padStart(5, "0");
  }

  function stateFipsFromCounty(d) {
    return countyFips(d).slice(0, 2);
  }

  function countyName(d) {
    return d.properties?.name ?? "Unknown county";
  }

  function valueForCounty(d) {
    return countyLife.get(countyFips(d));
  }

  function featuresForSelection() {
    if (selectedState === "all") return counties;
    return counties.filter(d => stateFipsFromCounty(d) === selectedState);
  }

  function statesForSelection() {
    if (selectedState === "all") return states;
    return states.filter(d => String(d.id).padStart(2, "0") === selectedState);
  }

  function updateSummary(visibleCounties) {
    const values = visibleCounties
      .map(d => valueForCounty(d))
      .filter(Number.isFinite);

    const place = selectedState === "all"
      ? "United States"
      : stateNameByFips.get(selectedState);

    summary.html(`
      <h3 style="margin-top:0">${place}</h3>
      <p><strong>Counties shown:</strong> ${visibleCounties.length}</p>
      <p><strong>Counties with data:</strong> ${values.length}</p>
      <p><strong>Average life expectancy:</strong> ${
        values.length ? mean(values).toFixed(1) + " years" : "No data"
      }</p>
      <p><strong>Lowest:</strong> ${
        values.length ? min(values).toFixed(1) + " years" : "No data"
      }</p>
      <p><strong>Highest:</strong> ${
        values.length ? max(values).toFixed(1) + " years" : "No data"
      }</p>
    `);
  }

  function render() {
    const visibleCounties = featuresForSelection();
    const visibleStates = statesForSelection();

    const projection = geoAlbersUsa()
      .fitSize([width, height], {
        type: "FeatureCollection",
        features: selectedState === "all" ? counties : visibleStates
      });

    const path = geoPath(projection);

    countyLayer.selectAll("path")
      .data(visibleCounties, d => countyFips(d))
      .join(
        enter => enter.append("path")
          .attr("d", path)
          .attr("fill", d => {
              const value = valueForCounty(d);
              return color(value);
            })
          .attr("stroke", "#333")
          .attr("stroke-width", 0.18)
          .attr("cursor", "pointer")
          .on("mousemove", function(event, d) {
            const fips = countyFips(d);
            const stateFips = stateFipsFromCounty(d);
            const value = valueForCounty(d);
            const [x, y] = pointer(event, left.node());

            select(this)
              .attr("stroke", "#fff")
              .attr("stroke-width", 1.1);

            tooltip
              .style("visibility", "visible")
              .style("left", `${x + 16}px`)
              .style("top", `${y + 16}px`)
              .html(`
                <strong>${countyName(d)} County, ${stateNameByFips.get(stateFips)}</strong><br>
                Life expectancy: ${
                  Number.isFinite(value) ? value.toFixed(1) + " years" : "No data"
                }
              `);
          })
          .on("mouseout", function() {
            select(this)
              .attr("stroke", "#333")
              .attr("stroke-width", 0.18);

            tooltip.style("visibility", "hidden");
          })
          .on("click", function(event, d) {
            selectedState = stateFipsFromCounty(d);
            selectBox.property("value", selectedState);
            render();
          }),
        update => update
          .transition()
          .duration(500)
          .attr("d", path)
          .attr("fill", d => {
              const value = valueForCounty(d);
              return color(value);
            }),
        exit => exit.remove()
      );

    stateLayer.selectAll("path")
      .data(visibleStates, d => String(d.id).padStart(2, "0"))
      .join("path")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", selectedState === "all" ? 1.25 : 2)
      .attr("pointer-events", "none");

    updateSummary(visibleCounties);
  }

  selectBox.on("change", event => {
    selectedState = event.target.value;
    render();
  });

  resetButton.on("click", () => {
    selectedState = "all";
    selectBox.property("value", "all");
    render();
  });

  render();

  return container.node();
}