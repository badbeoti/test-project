import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import styled from "styled-components";
import * as d3 from "d3";
import { scaleLinear } from "d3";
import { select, Selection } from "d3-selection";
import { scaleTime } from "d3";
import { max } from "d3-array";
import { zoom, zoomTransform } from "d3-zoom";
import { transform } from "typescript";

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
	>>();
	const [currentZoomState, setCurrentZoomState] = useState(d3.zoomIdentity);

	const timeScaleParse = d3.timeParse("%Y.%m.%d %H:%M");

	let xScale = scaleTime()
		.domain([
			timeScaleParse(`${selectList[0].time}`)!,
			timeScaleParse(`${selectList[selectList.length - 1].time}`)!,
		])
		.range([0, canvas.chartWidth]);

	let yScale = scaleLinear()
		.domain([0, d3.max(selectList, (d) => d.BlackScr)! + 10])
		.range([canvas.chartHeight, 0]);

	useEffect(() => {
		setList(prevData);
	}, [selectList]);

	const line = d3.line();

	useEffect(() => {
		if (!selection) {
			setSelection(select(ref.current));
		} else {
			if (currentZoomState.x === 0) {
				let pathOfLine = line(
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
					.call(d3.axisBottom(xScale));

				const yAxisGroup = selection
					.append("g")
					.attr("transform", `translate(${canvas.chartWidth},0)`)
					.call(d3.axisRight(yScale));

				console.log(currentZoomState);

				const zoomSection = zoom()
					.scaleExtent([0.5, 5])
					.translateExtent([
						[0, 0],
						[canvas.chartWidth, canvas.chartHeight],
					])
					.on("zoom", () => {
						const zoomState = zoomTransform(selection.node()!);
						setCurrentZoomState(zoomState);
					});

				zoomSection(d3.select("svg"));

				selection
					.append("path")
					.attr("d", pathOfLine!)
					.attr("stroke", "black")
					.attr("fill", "none");

				selection
					.selectAll(".myDot")
					.data(selectList)
					.join("circle")
					.attr("class", "myDot")
					.attr("r", 1)
					.attr("fill", "orange")
					.attr("cx", (d) => xScale(timeScaleParse(d.time)!)!)
					.attr("cy", (d) => yScale(d.BlackScr));
			}
		}
	}, [selection]);

	useEffect(() => {
		if (selection && currentZoomState.x !== 0) {
			console.log("done");
			const newXScale = currentZoomState.rescaleX(xScale);
			xScale.domain(newXScale.domain());

			selection.select("path").style("d", "");

			const pathOfLine = line(
				selectList.map((d) => [
					xScale(timeScaleParse(d.time)!)!,
					yScale(d.BlackScr),
				])
			);

			selection.selectAll(".xAxis").style("transform", "");

			selection
				.append("g")
				.attr("font-weight", "bold")
				.attr("transform", `translate(0,${canvas.chartHeight})`)
				.attr("class", "xAxis")
				.call(d3.axisBottom(xScale));

			selection
				.append("path")
				.attr("d", pathOfLine!)
				.attr("stroke", "black")
				.attr("fill", "none");

			selection.selectAll(".myDot").exit().remove();

			selection
				.selectAll(".myDot")
				.data(selectList)
				.join("circle")
				.attr("class", "myDot")
				.attr("r", 1)
				.attr("fill", "orange")
				.attr("cx", (d) => xScale(timeScaleParse(d.time)!)!)
				.attr("cy", (d) => yScale(d.BlackScr));
		}
	}, [currentZoomState]);

	return (
		<div>
			<svg ref={ref} width={canvas.width} height={canvas.height}></svg>
		</div>
	);
}

export default Canvas;
