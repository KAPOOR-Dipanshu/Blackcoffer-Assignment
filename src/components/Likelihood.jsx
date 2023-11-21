// likelihood.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Likelihood = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data) return;

        const svg = d3.select(svgRef.current);

        const margin = { top: 30, right: 80, bottom: 40, left: 90 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        // Extracting distinct likelihood values
        const distinctIntensities = Array.from(new Set(data.map(d => d.likelihood)));

        // Creating a histogram to count occurrences of each likelihood
        const likelihoodHistogram = d3.histogram()
            .value(d => d.likelihood)
            .domain(d3.extent(data, d => d.likelihood))
            .thresholds(distinctIntensities.length)(data);

        // Filtering out bars with count 0
        const filteredHistogram = likelihoodHistogram.filter((d, i) => d.length !== 0 && i !== 0);

        const yMax = d3.max(filteredHistogram, d => d.length);

        const x = d3
            .scaleBand()
            .domain(filteredHistogram.map(d => String(d.x0)))
            .range([margin.left, width - margin.right])
            .paddingOuter(0.3)
            .paddingInner(0.3); // Adjust the gap between bars

        const y = d3
            .scaleLinear()
            .domain([0, yMax])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = d3.axisBottom(x).tickSizeOuter(0);
        const yAxis = d3.axisLeft(y).ticks(5);

        svg.select('.x-axis')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll('.tick text')
            .style('text-anchor', 'start')
            .attr('transform', 'rotate(0)')
            .attr('dx', '-0.4em')
            .attr('dy', '0.7em');

        svg.select('.y-axis')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis);

        svg.selectAll('.bar')
            .data(filteredHistogram)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => x(String(d.x0))) // Adjust bar position for gap
            .attr('y', d => y(d.length))
            .attr('width', x.bandwidth()) // Adjust bar width for gap
            .attr('height', d => height - margin.bottom - y(d.length))
            .attr('fill', 'green' );
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

export default Likelihood;