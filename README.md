# Design Rationale

For this project, I created an interactive choropleth map visualization of life expectancy across counties in the United States between January 202 and September 2022, AKA the COVID-19 pandemic. The primary goal of the visualization is to help users explore geographic differences in life expectancy and identify regional patterns across the country during the COVID-19 pandemic.

I chose a choropleth map because the dataset is geographic in nature. Since each data entry corresponds to either a state or county identified through FIPS-style location codes, a map-based visualization was the natural way to encode and compare spatial variation in life expectancy. Counties are colored using varying shades of red, with darker shades representing lower life expectancy and lighter shades representing higher life expectancy. Counties with missing data are displayed in grey to clearly distinguish unavailable information.

I selected a sequential red color scale because it effectively communicates magnitude differences whilst remaining visually intuitive. I experimented with different colors and a multicolor palette initially, but the red gradient produced stronger visual contrast and made regional differences easier to identify. I also manually defined the color scale ranges instead of using a purely automatic interpolation because the automatic scale compressed many values into similar shades, making meaningful differences difficult to perceive. Using fixed ranges created clearer distinctions between counties. I decided to divide the data into five categories so the contrast in the overall map was more apparent instead of lumping the data into three or four categories.

To improve readability, I rendered county borders with thin outlines while emphasizing state borders with thicker black outlines. This creates a clear visual hierarchy that helps users distinguish local county-level patterns while still understanding broader state boundaries.

After receiving feedback on the initial version of the project, I redesigned the interactions to follow an overview-then-details approach. Rather than relying primarily on zooming and panning, users now begin with a national overview and can select into individual states using a dropdown menu or by clicking on the counties directly. This makes the interface easier to use and prevents users from getting lost while navigating the map. I also replaced FIPS codes in the tooltips with county names and state names, making the information more meaningful and easier to interpret.

The visualization now includes several interactive features. Hover tooltips display county names and life expectancy values, users can drop down into individual states from the national overview, and a reset control allows users to quickly return to the full U.S. view. In addition, a summary panel updates based on the current selection and provides information such as the number of counties displayed, average life expectancy, and minimum and maximum life expectancy values. This coordinated view provides additional context without requiring users to leave the map.

I considered several alternative visualization designs during development. One possibility was a scatterplot comparing life expectancy to additional health variables such as diabetes prevalence or smoking prevalence. However, the dataset did not include data on these factors for the U.S., and I wanted to focus specifically on U.S. counties for simplicity. I also considered implementing a larger dashboard with multiple coordinated charts and filters, but ultimately chose to focus on a map-centered design because geography is the most important aspect of the dataset and because it provided a clearer and more cohesive user experience.

# Inspiration and Reference Material

Observable examples and D3 choropleth map examples were used as references for interaction patterns, state drill-down interactions, and geographic rendering techniques.

# Datasets Used

1. US Atlas TopoJSON files (state and county boundaries): https://cdn.jsdelivr.net/npm/us-atlas@3/
2. Google Open Data COVID-19 and Health Dataset: https://health.google.com/covid-19/open-data/raw-data
3. Observable Framework documentation: https://observablehq.com/framework/
4. D3.js documentation: https://d3js.org/
