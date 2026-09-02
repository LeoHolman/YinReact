import React, { useEffect } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

function PitchChart({ dataset }) {
  function drawPitchChart(divID, width, height) {
    d3.select(`#${divID}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "#eeeeee")
      .style("border", "3px solid #9A2D04");
    let y = 2;
    let i;
    for (i = 0; i < 5; i++) {
      d3.select(`#${divID} svg`)
        .append("line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", width)
        .attr("y2", y)
        .style("stroke", "#babbbc")
        .style("stroke-width", "3px");
      if (i === 3) {
        y -= 4;
      }
      y += height / 4;
    }
  }

  // TODO add baseline, standardDeviation back to drawPitchCurve
  // baseline = height / 2,
  // standardDeviation = 0,
  function drawPitchCurve(
    rawDataset,
    width,
    height,
    { color = "red", chartID = "__visualization" } = {}
  ) {
    const parsedData = d3.tsvParse(rawDataset);
    const points = parsedData
      .map((row) => ({
        time: Number(row.time),
        frequency: Number(row.frequency),
      }))
      .filter(
        (point) => Number.isFinite(point.time) && Number.isFinite(point.frequency)
      );

    if (points.length === 0) {
      return;
    }

    const [minTime, maxTime] = d3.extent(points, (point) => point.time);
    const xScale =
      minTime === maxTime
        ? () => width / 2
        : d3.scaleLinear().domain([minTime, maxTime]).range([10, width - 10]);

    points.forEach((point) => {
      const x = xScale(point.time);
      const y = height - (height / 2 + (point.frequency - height / 2));
      d3.select(`#${chartID} svg`)
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 5)
        .classed("userPitch", true)
        .style("fill", color);
    });
  }

  useEffect(() => {
    d3.selectAll("svg").remove();
    drawPitchChart("__visualization", 1100, 500);
    dataset.map((curve) => {
      return drawPitchCurve(curve[0], 1100, 500, { color: curve[1] });
    });
  }, [dataset]);

  return <div id="__visualization" />;
}

PitchChart.propTypes = {
  dataset: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default PitchChart;
