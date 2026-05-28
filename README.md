# Design Rationale 

For this project, I created an interactive choropleth map visualization of life expectancy across counties in the United States. The primary goal of the visualization is to help users explore geographic differences in life expectancy and identify regional patterns across the country.

I chose a choropleth map because the dataset is inherently geographic. Since each data entry corresponds to either a state or county identified through FIPS-style location codes, a map-based visualization provides a natural way to encode and compare spatial variation in life expectancy. Counties are colored using varying shades of red, where lighter shades represent lower life expectancy and darker shades represent higher life expectancy. Counties with missing data are displayed in gray to clearly distinguish unavailable information from actual measured values.

I selected a sequential red color scale because it effectively communicates magnitude differences while remaining visually intuitive. I experimented with blue and multicolor palettes initially, but the red gradient produced stronger visual contrast and made regional differences easier to identify. I also manually defined the color scale ranges instead of using a purely automatic interpolation because the automatic scale compressed many values into similar shades, making meaningful differences difficult to perceive. Using fixed ranges created clearer distinctions between counties.

To improve readability, I rendered county borders with thin white outlines while emphasizing state borders with thicker dark outlines. This creates a clear visual hierarchy that helps users distinguish local county-level patterns while still understanding broader state boundaries.

The visualization includes several interactive features intended to support exploratory analysis. Users can zoom and pan across the map to investigate specific regions in more detail. Hover tooltips provide details-on-demand by displaying the county FIPS code and corresponding life expectancy value. I also included a reset zoom control so users can quickly return to the default national view after navigating the map. Finally, a legend explains the mapping between color and life expectancy ranges, helping users interpret the visualization more effectively.

I considered several alternative visualization designs during development. One possibility was a scatterplot comparing life expectancy to additional health variables such as diabetes prevalence or smoking prevalence. However, this approach made it more difficult to understand geographic patterns and regional clustering. I also considered implementing a coordinated multi-view dashboard with charts and filters, but ultimately decided to focus on a single polished interactive visualization because it provided a clearer and more cohesive user experience within the assignment scope.

# Inspiration and Reference Material

Observable examples and D3 choropleth map examples were used as references for interaction patterns, zooming behavior, and geographic rendering techniques.

# References:
1. US Atlas TopoJSON files: https://cdn.jsdelivr.net/npm/us-atlas@3/
2. Google Open Data COVID-19 and Health Dataset: https://health.google.com/covid-19/open-data/raw-data