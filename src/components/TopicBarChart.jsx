import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopicBarChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.length) return;

        // Count occurrences of each topic
        const topicCounts = data.reduce((acc, d) => {
            if (d.topic) acc[d.topic] = (acc[d.topic] || 0) + 1;
            return acc;
        }, {});

        // Aggregate topics by count
        const aggregatedTopics = Object.entries(topicCounts).reduce((acc, [topic, count]) => {
            if (!acc[count]) acc[count] = [];
            acc[count].push(topic);
            return acc;
        }, {});

        // Convert aggregated data to an array of objects
        const barData = Object.entries(aggregatedTopics).map(([count, topics]) => ({
            count: +count,
            topics: topics.join(', '), // Concatenating topics with the same count
        }));

        const svg = d3.select(svgRef.current);

        const margin = { top: 30, right: 80, bottom: 40, left: 90 };
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;

        const x = d3.scaleBand().domain(barData.map(d => d.topics)).range([0, width]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(barData, d => d.count)]).nice().range([height, 0]);

        svg.selectAll('*').remove(); // Clear existing content

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        g.selectAll('.bar')
            .data(barData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.topics))
            .attr('y', d => y(d.count))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.count))
            .attr('fill', 'steelblue');

        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        g.append('g').attr('class', 'y-axis').call(d3.axisLeft(y).ticks(5));
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

export default TopicBarChart;
