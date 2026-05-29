# U.S. Life Expectancy by County During the COVID-19 Pandemic

```js
import { lifeExpectancyMap } from "./components/map.js"
import { feature } from "npm:topojson-client"
```

```js
const health = await FileAttachment("data/health.csv").csv({typed: true})
const topo = await FileAttachment("data/counties-10m.json").json()
const counties = feature(topo, topo.objects.counties).features
const states = feature(topo, topo.objects.states).features

display(lifeExpectancyMap(health, counties, states))
```