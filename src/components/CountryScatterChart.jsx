import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CountryScatterChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.length) return;

        const filteredData = data.filter(d => d.country !== null && d.country !== "");

        const countryCounts = filteredData.reduce((acc, d) => {
            acc[d.country] = (acc[d.country] || 0) + 1;
            return acc;
        }, {});

        const countryData = Object.keys(countryCounts).map(country => ({ country, count: countryCounts[country] }));

        const svg = d3.select(svgRef.current);

        const margin = { top: 20, right: 20, bottom: 70, left: 70 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        svg.selectAll('*').remove(); // Clear existing content

        const x = d3
            .scaleBand()
            .domain(countryData.map(d => d.country))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(countryData, d => d.count)])
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

        const lineGenerator = d3.line()
            .x(d => x(d.country) + x.bandwidth() / 2)
            .y(d => y(d.count))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(countryData)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('d', lineGenerator);

        svg.selectAll('.point')
            .data(countryData)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('cx', d => x(d.country) + x.bandwidth() / 2)
            .attr('cy', d => y(d.count))
            .attr('r', 4)
            .attr('fill', 'green');

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

export default CountryScatterChart;
