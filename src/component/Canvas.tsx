import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import * as d3 from "d3";
import { scaleLinear, svg, line, scaleBand, curveCardinal } from "d3";
import { select, Selection } from "d3-selection";
import { scaleTime } from "d3";
import { max } from "d3-array";

interface CanvasFace {
	prevData: {
		BlackScr: number;
		CO2air: number;
		EC_drain_PC: number;
		EC_slab1: number;
		EC_slab2: number;
		EnScr: number;
		HumDef: number;
		Iglob: number;
		PipeGrow: number;
		PipeLow: number;
		RadSum: number;
		Rhair: number;
		Tair: number;
		Tout: number;
		WC_slab1: number;
		WC_slab2: number;
		time: string;
	}[];
}

const canvas = {
	width: 1200,
	height: 500,
	chartWidth: 1150,
	chartHeight: 400,
	marginLeft: 100,
};

function Canvas({ prevData }: CanvasFace) {
	const [selectList, setList] = useState(prevData);
	const ref = useRef(null);
	const [selection, setSelection] = useState<null | Selection<
		null,
		unknown,
		null,
		undefined
	>>(null);

	const timeScaleParse = d3.timeParse("%Y.%m.%d %H:%M");

	let xScale = scaleTime()
		.domain([
			timeScaleParse("2020.5.3 0:00")!,
			timeScaleParse("2020.5.19 11:45")!,
		])
		.range([0, canvas.chartWidth]);

	let yScale = scaleLinear()
		.domain([0, d3.max(selectList, (d) => d.BlackScr)! + 30])
		.range([canvas.chartHeight, 0]);

	const xAxisBot = d3.axisBottom(xScale);
	const yAxisRight = d3.axisRight(yScale);

	useEffect(() => {
		setList(prevData);
	}, selectList);

	useEffect(() => {
		if (!selection) {
			setSelection(select(ref.current));
		} else {
			const line = d3.line();

			const pathOfLine = line(
				selectList.map((d) => [
					xScale(timeScaleParse(d.time)!)!,
					yScale(d.BlackScr),
				])
			);

			const xAxisGroup = selection
				.append("g")
				.attr("font-weight", "bold")
				.attr("transform", `translate(0,${canvas.chartHeight})`)
				.attr("class", "xAxis")
				.call(xAxisBot);

			const yAxisGroup = selection
				.append("g")
				.attr("transform", `translate(${canvas.chartWidth},0)`)
				.call(yAxisRight);

			selection
				.append("path")
				.attr("d", pathOfLine!)
				.attr("stroke", "black")
				.attr("fill", "none");

			// selection
			// 	.selectAll("rect")
			// 	.data(selectList)
			// 	.enter()
			// 	.append("rect")
			// 	.attr("fill", "blue")
			// 	.attr("width", 1)
			// 	.attr("x", (d) => xScale(timeScaleParse(d.time)!)!)
			// 	.attr("height", (d) => canvas.chartHeight - yScale(d.BlackScr)!)
			// 	.attr("y", (d) => yScale(d.BlackScr)!);
		}
	}, [selection]);

	return (
		<div>
			<svg ref={ref} width={canvas.width} height={canvas.height}></svg>
		</div>
	);
}

export default Canvas;
