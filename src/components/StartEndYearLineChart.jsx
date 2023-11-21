// StartEndYearBarChart.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const StartEndYearBarChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.length) return;

        // Count occurrences of start_year and end_year separately
        const startYearCounts = data.reduce((acc, d) => {
            if (d.start_year) acc[d.start_year] = (acc[d.start_year] || 0) + 1;
            return acc;
        }, {});

        const endYearCounts = data.reduce((acc, d) => {
            if (d.end_year) acc[d.end_year] = (acc[d.end_year] || 0) + 1;
            return acc;
        }, {});

        // Convert counts objects to arrays of objects
        const startYearData = Object.keys(startYearCounts).map(year => ({ year, count: startYearCounts[year], type: 'start' }));
        const endYearData = Object.keys(endYearCounts).map(year => ({ year, count: endYearCounts[year], type: 'end' }));

        const combinedData = [...startYearData, ...endYearData];

        const svg = d3.select(svgRef.current);

        const margin = { top: 30, right: 50, bottom: 40, left: 90 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3
            .scaleBand()
            .domain(combinedData.map(d => String(d.year)))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(combinedData, d => d.count)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll('.tick text')
            .style('text-anchor', 'mid')
            .attr('transform', 'rotate(0)')
            .attr('dx', '-0.4em')
            .attr('dy', '0.7em');

        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(5));

        svg.selectAll('.bar')
            .data(combinedData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(String(d.year)))
            .attr('y', d => y(d.count))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.bottom - y(d.count))
            .attr('fill', d => (d.type === 'start' ? 'red' : 'green'))
            .attr('key', (d, i) => i); // Remove this line as 'key' is not a valid attribute for SVG elements

    }, [data]);

    return (
        <div style={{ border: '10px solid black', borderRadius: '5px', width: '900px', height: '400px' }}>
            <svg ref={svgRef} width={880} height={380}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
    );
};

export default StartEndYearBarChart;
