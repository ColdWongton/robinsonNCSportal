import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function BarPlot({ data }) {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 400, height: 250 });

    // Track container size
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current) {
            d3.select(svgRef.current).selectAll("*").remove();
            return;
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const { width, height } = dimensions;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };

        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) || 100]) // Use 100 as default max if data is empty/zero
            .range([height - margin.bottom, margin.top]);

        // Axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).ticks(5); // Adjust tick count as needed

        // Draw Axes
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text") // Optional: rotate x-axis labels if long
        // .attr("transform", "rotate(-45)")
        // .style("text-anchor", "end");

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

        // Draw Bars with updated styling and animation
        // Color Scale
        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.label))
            .range(d3.schemePaired); // More appealing color scheme

        svg.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.label))
            .attr("y", height - margin.bottom) // Start from bottom for animation
            .attr("width", xScale.bandwidth())
            .attr("height", 0) // Start height at 0
            .attr("fill", d => colorScale(d.label))
            .attr("rx", 4) // Rounded corners
            .attr("ry", 4)
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.7)
                    .attr("y", yScale(d.value) - 5) // Slight pop up effect
                    .attr("height", height - margin.bottom - yScale(d.value) + 5);
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("y", yScale(d.value))
                    .attr("height", height - margin.bottom - yScale(d.value));
            })
            .transition() // Animate bars
            .duration(800)
            .ease(d3.easeCubicOut)
            .attr("y", d => yScale(d.value))
            .attr("height", d => height - margin.bottom - yScale(d.value));

        // Add value labels on top of bars
        svg.selectAll(".label")
            .data(data)
            .join("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", d => xScale(d.label) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.value) - 5)
            .style("font-size", "12px")
            .style("fill", "#666")
            .text(d => d.value)
            .style("opacity", 0)
            .transition()
            .delay(600)
            .duration(400)
            .style("opacity", 1);

        // --- End D3 Plot Setup ---

    }, [data, dimensions]);

    return (
        <div ref={containerRef} style={{ width: '100%', flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
        </div>
    );
}

export default BarPlot;