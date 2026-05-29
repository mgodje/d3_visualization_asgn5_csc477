# Design Rationale 

For this project, I created an interactive choropleth map visualization of life expectancy across counties in the United States during the COVID-19 pandemic. The primary goal of the visualization is to help users explore geographic differences in life expectancy and potentially identify regional patterns across the country.

I chose a choropleth map because the dataset is geographic in nature. Since each data entry corresponds to either a state or county identified through FIPS-style location codes, a map-based visualization was the natural way to encode and compare spatial variation in life expectancy. Counties are colored using varying shades of red, with lighter shades representing lower life expectancy and darker shades representing higher life expectancy. Counties with missing data are displayed in grey to clearly distinguish unavailable information.

I selected a sequential red color scale because it effectively communicates magnitude differences whilst remaining visually intuitive. I experimented with different colors and a multicolor palette initially, but the red gradient produced stronger visual contrast and made regional differences easier to identify. (After today's lesson on accessibility, however, I can see how red may not be the best choice for red color blindness.) I also manually defined the color scale ranges instead of using a purely automatic interpolation because the automatic scale compressed many values into similar shades, making meaningful differences difficult to perceive. Using fixed ranges created clearer distinctions between counties. I decided to divide the data into 5 categories so the contrast in the overall map was more apparent instead of lumping the data into 3 or 4 categories. 

To improve readability, I rendered county borders with thin white outlines while emphasizing state borders with thicker black outlines. This creates a clear visual hierarchy that helps users distinguish local county-level patterns while still understanding broader state boundaries.

The visualization includes several interactive features, including a zoom feature and panning abilities across the map to investigate specific regions in more detail. Hover tooltips have also been implemented and provide details such as the county FIPS code and corresponding life expectancy value. Additionally, I included a reset zoom control that smoothly zooms out to the initial state so users can quickly return to the default national view post navigating the map. Finally, a legend appears to explain the mapping between color and life expectancy ranges, helping users interpret the visualization more effectively.

I considered several alternative visualization designs during development. One possibility was a scatterplot comparing life expectancy to additional health variables such as diabetes prevalence or smoking prevalence. However, the dataset did not include data on these factors for the U.S., and I wanted to only focus on the U.S. for simplicity reasons. I also considered implementing a coordinated multi-view dashboard with charts and filters, but ultimately decided to focus on a single polished interactive visualization because it provided a clearer and more cohesive user experience.

# Inspiration and Reference Material

Observable examples and D3 choropleth map examples were used as references for interaction patterns, zooming behavior, and geographic rendering techniques.

# Datasets Used:
1. US Atlas TopoJSON files (state- and county-wide): https://cdn.jsdelivr.net/npm/us-atlas@3/
2. Google Open Data COVID-19 and Health Dataset: https://health.google.com/covid-19/open-data/raw-data