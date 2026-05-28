import * as d3 from "d3"

export async function lifeExpectancyMap() {

  const data = await d3.csv("/data/health.csv", d => ({
    location: d[0],
    life_expectancy: +d[1]
  }))

  console.log(data)

  const width = 960
  const height = 600

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)

  svg.append("text")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", 24)
    .text(`Loaded ${data.length} rows`)

  return svg.node()
}