"use client";
import React, { useRef, useEffect, useState } from "react";
import ColorLegend from "./ColorLegend";
import { scalePow } from "d3";
import { createGroups, getNodeGroup } from "./grouping";
import NodeInfo from "./NodeInfo";

interface GraphNode3DProps {
	graphData: any;
}

const GraphNode3D: React.FC<GraphNode3DProps> = ({ graphData }) => {
	const fgRef = useRef();
	const [ForceGraph3D, setForceGraph3D] = useState(null);
	const groups = createGroups(graphData.nodes);
	const [currentNode, setCurrentNode] = useState(null);

	useEffect(() => {
		import("react-force-graph")
			.then((mod) => {
				setForceGraph3D(mod.ForceGraph3D);
			})
			.catch((error) => {
				console.error("Error loading ForceGraph3D:", error);
			});
	}, []);

	const [dimensions, setDimensions] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});

	useEffect(() => {
		const resizeGraph = () => {
			const width =
				window.innerWidth < 768
					? window.innerWidth - 20
					: window.innerWidth - 210;
			const height =
				window.innerWidth < 768
					? window.innerHeight - 100
					: window.innerHeight - 140;
			setDimensions({
				width,
				height,
			});
		};

		resizeGraph();
		window.addEventListener("resize", resizeGraph);
		return () => {
			window.removeEventListener("resize", resizeGraph);
		};
	}, []);

	useEffect(() => {
		if (fgRef.current) {
			fgRef.current
				.d3Force("link")
				.distance((link) => link.value * 20)
				.strength((link) => link.value * 0.04);
		}
	}, [fgRef.current, dimensions, ForceGraph3D]);

	const maxSize = Math.max(...graphData.nodes.map((node) => node.val));
	const minSize = Math.min(...graphData.nodes.map((node) => node.val));

	// hsl(29, 100%, 47%) accent color orange
	const ranges = [
		"hsl(20, 100%, 40%)",
		"hsl(40, 100%, 70%)",
		"hsl(60, 100%, 100%)",
	];
	const colorScale = scalePow()
		.exponent(3)
		.domain([minSize, (minSize + maxSize) / 2, maxSize])
		.range(ranges);

	const getNodeColor = (node) => {
		return colorScale(node.val);
	};

	if (!ForceGraph3D) {
		return null;
	}

	return (
		<div className="bg-graph_bg w-full relative">
			{currentNode && <NodeInfo currentNode={currentNode} />}
			<ForceGraph3D
				ref={fgRef}
				backgroundColor="#000000"
				graphData={graphData}
				nodeLabel={(node) => {
					return `${node.name} (${node.val.toFixed(2)})`;
				}}
				onNodeHover={(node) => {
					if (node) {
						document.body.style.cursor = "grab";
						const group = getNodeGroup(node.val, groups);
						setCurrentNode({
							name: node.name,
							value: node.val.toFixed(2),
							group: group.group,
							action: group.action,
						});
					} else {
						document.body.style.cursor = "default";
						setCurrentNode(null);
					}
				}}
				nodeColor={getNodeColor}
				width={dimensions.width}
				height={dimensions.height}
				nodeResolution={50}
				linkWidth={0.2}
				linkColor={() => "#ffffff"}
				showNavInfo={false}
			/>
			<ColorLegend minSize={minSize} maxSize={maxSize} ranges={ranges} />
		</div>
	);
};

export default GraphNode3D;
