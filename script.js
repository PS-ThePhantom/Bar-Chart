document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      displayChart(data.data);
    })
    .catch((err) => {
      console.log("an error occured: ", err);
    });
});

const displayChart = (data) => {
  const formattedData = data.map((data) => {
    return {
      year: Number(data[0].split("-")[0]),
      month: Number(data[0].split("-")[1]),
      quarter: Math.floor((Number(data[0].split("-")[1]) / 12) * 4) + 1,
      value: data[1],
      date: data[0]
    };
  });

  const chartWidth = 1000;
  const chartHeight = 500;
  const chartPadding = 60;
  const tooltipWidth = 120;

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(formattedData, (d) => d.year),
      d3.max(formattedData, (d) => d.year + 1)
    ])
    .range([chartPadding, chartWidth - chartPadding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(formattedData, (d) => d.value)])
    .range([chartHeight - chartPadding, chartPadding]);

  const svg = d3
    .select("div")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .style("box-shadow", "0 0 10px 5px grey")
    .style("border-radius", "10px");

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", chartWidth / 2)
    .attr("y", chartPadding - 10)
    .attr("text-anchor", "middle")
    .text("United States GDP")
    .style("font-size", "30px")
    .style("font-weight", "bold");

  const tooltip = d3
    .select("div")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(250, 250, 250, 85%)")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("width", tooltipWidth + "px")
    .style("text-align", "center")
    .style("box-shadow", "0 0 5px 2px grey");

  svg
    .selectAll("rect")
    .data(formattedData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d.date)
    .attr("data-gdp", (d) => d.value)
    .attr("x", (d) => xScale(d.year + (d.quarter - 1) / 4))
    .attr("y", (d) => yScale(d.value))
    .attr("width", ((chartWidth - chartPadding * 2) / data.length) * 0.9)
    .attr("height", (d) => chartHeight - yScale(d.value) - chartPadding)
    .attr("fill", "rgb(220,100,100)")
    .on("mouseover", (event, d) => {
      const barX = xScale(d.year + (d.quarter - 1) / 4);
      const chartRightEdge = chartWidth + chartPadding * 2;
      const tooltipX =
        event.pageX + tooltipWidth > chartRightEdge
          ? event.pageX - tooltipWidth - 20
          : event.pageX + 20;

      tooltip
        .style("visibility", "visible")
        .attr("data-date", d.date)
        .html(d.date + "<br>$" + d.value + " billion")
        .style("left", tooltipX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (chartHeight - chartPadding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + chartPadding + ",0)")
    .call(yAxis);
};