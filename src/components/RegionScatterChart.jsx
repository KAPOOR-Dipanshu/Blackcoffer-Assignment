import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RegionScatterChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.length) return;

        const filteredData = data.filter(d => d.region !== null && d.region !== "");

        const regionCounts = filteredData.reduce((acc, d) => {
            acc[d.region] = (acc[d.region] || 0) + 1;
            return acc;
        }, {});

        const regionData = Object.keys(regionCounts).map(region => ({ region, count: regionCounts[region] }));

        const svg = d3.select(svgRef.current);

        const margin = { top: 20, right: 20, bottom: 70, left: 70 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        svg.selectAll('*').remove(); // Clear existing content

        const x = d3
            .scaleBand()
            .domain(regionData.map(d => d.region))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(regionData, d => d.count)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll('.tick text')
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-45)')
            .attr('dx', '-0.5em')
            .attr('dy', '0.5em');

        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(5));

        svg.selectAll('.point')
            .data(regionData)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('cx', d => x(d.region) + x.bandwidth() / 2)
            .attr('cy', d => y(d.count))
            .attr('r', 5)
            .attr('fill', 'purple');

        svg.selectAll('.line')
            .data(regionData.slice(0, -1))
            .enter()
            .append('line')
            .attr('class', 'line')
            .attr('x1', (_, i) => x(regionData[i].region) + x.bandwidth() / 2)
            .attr('y1', (_, i) => y(regionData[i].count))
            .attr('x2', (_, i) => x(regionData[i + 1].region) + x.bandwidth() / 2)
            .attr('y2', (_, i) => y(regionData[i + 1].count))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5 5');

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

export default RegionScatterChart;
