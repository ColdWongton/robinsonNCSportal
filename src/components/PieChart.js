import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function PieChart({ data }) {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 350, height: 300 });

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
        const margin = 20;
        const radius = Math.min(width, height) / 2 - margin;

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Color Scale
        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.label))
            .range(d3.schemeSet3); // More appealing color scheme

        // Compute the position of each group on the pie
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        const dataReady = pie(data);

        // Shape helper to build arcs
        const arcGenerator = d3.arc()
            .innerRadius(radius * 0.4) // Donut chart style
            .outerRadius(radius);

        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        // Build the pie chart
        const paths = g.selectAll('allSlices')
            .data(dataReady)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', d => color(d.data.label))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.85);

        // Add animations
        paths.transition()
            .duration(1000)
            .attrTween("d", function (d) {
                const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function (t) { return arcGenerator(i(t)); };
            });

        // Hover effects
        paths.on('mouseover', function (e, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 1)
                .attr('transform', 'scale(1.05)');
        })
            .on('mouseout', function (e, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.85)
                    .attr('transform', 'scale(1)');
            });

        // Add labels
        g.selectAll('allPolyLines')
            .data(dataReady)
            .enter()
            .append('polyline')
            .attr("stroke", "#ccc")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function (d) {
                const posA = arcGenerator.centroid(d);
                const posB = outerArc.centroid(d);
                const posC = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
                return [posA, posB, posC];
            });

        g.selectAll('allLabels')
            .data(dataReady)
            .enter()
            .append('text')
            .text(d => d.data.label)
            .attr('transform', function (d) {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style('text-anchor', function (d) {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return (midangle < Math.PI ? 'start' : 'end');
            })
            .style("font-size", "12px")
            .style("fill", "#444");

    }, [data, dimensions]);

    return (
        <div ref={containerRef} style={{ width: '100%', flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
        </div>
    );
}

export default PieChart;
