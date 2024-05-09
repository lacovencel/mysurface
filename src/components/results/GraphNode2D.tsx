"use client";
import dynamic from "next/dynamic";
import * as THREE from "three";
//import { ForceGraph2D } from "react-force-graph"
import React, { useEffect, useRef, useState } from "react";
import ColorLegend from "./ColorLegend";
import { get } from "http";

interface GraphNode2DProps {
	graphData: any;
}

const ForceGraph2D = dynamic(
	() => import("react-force-graph").then((mod) => mod.ForceGraph2D),
	{ ssr: false }
);

export default function GraphNode2D({ graphData }: GraphNode2DProps) {
	const forceGraphRef = useRef(null);

	const [dimensions, setDimensions] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});

	useEffect(() => {
		const resizeGraph = () => {
			const width =
				window.innerWidth < 768
					? window.innerWidth - 20
					: window.innerWidth - 230;
			setDimensions({
				width,
				height: window.innerHeight - 135,
			});
		};
		resizeGraph();
		window.addEventListener("resize", resizeGraph);
		return () => {
			window.removeEventListener("resize", resizeGraph);
		};
	}, []);

	useEffect(() => {
		const forceGraphInstance = forceGraphRef.current;
		if (forceGraphInstance) {
			const linkForce = forceGraphInstance.d3Force("link");
			if (linkForce) {
				linkForce.distance((link) => link.length || 100);
				forceGraphInstance.d3ReheatSimulation();
			}
		}
	}, []);

	const maxSize = Math.max(...graphData.nodes.map((node) => node.val));
	const minSize = Math.min(...graphData.nodes.map((node) => node.val));
	const hue = 272 / 360;
	const saturation = 0.6;
	const baseLightness = 0.2;

	// 	hsl(272, 45%, 15%) dark purple
	const getNodeColor = (node) => {
		const normalizedSize = (node.val - minSize) / (maxSize - minSize);
		const lightness = baseLightness + normalizedSize * 0.5; // Bigger = light
		const color = new THREE.Color().setHSL(hue, saturation, lightness);
		return color.getStyle();
	};

	return (
		<div className="bg-black w-full">
			<ForceGraph2D
				ref={forceGraphRef}
				graphData={graphData}
				width={dimensions.width}
				height={dimensions.height}
				nodeVal={(node) => node.val}
				nodeLabel="name"
				linkWidth={0.3}
				nodeColor={getNodeColor}
				backgroundColor="#000000"
				linkAutoColorBy="#ffffff"
			/>
			<ColorLegend
				minVal={minSize}
				maxVal={maxSize}
				hue={hue}
				saturation={saturation}
				baseLightness={baseLightness}
			/>
		</div>
	);
}
