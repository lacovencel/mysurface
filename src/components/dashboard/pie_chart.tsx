"use client";
import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import T from "@/components/translations/translation";

ChartJS.register(ArcElement, Tooltip, Legend);

async function getCompletionPercentage(participants) {
	const supabase = createClientComponentClient();

	// Get questionnaires for those participants
	const questionnaireIds = participants.map((p) => p.questionnaire);
	const { data: questionnaires, error: questionnairesError } = await supabase
		.from("questionnaires")
		.select("completed")
		.in("id", questionnaireIds);

	if (questionnairesError) {
		console.error("Error fetching questionnaires:", questionnairesError);
		return null;
	}

	if (questionnaires.length === 0) {
		return null;
	}

	const completedCount = questionnaires.filter((q) => q.completed).length;
	const totalCount = questionnaires.length;

	return (completedCount / totalCount) * 100;
}

const DashboardPieChart = ({ participants }) => {
	const [completedPercentage, setCompletedPercentage] = useState<
		number | null
	>(null);

	useEffect(() => {
		const fetchData = async () => {
			const percentage = await getCompletionPercentage(participants);
			setCompletedPercentage(percentage);
		};

		fetchData();
	}, []);

	if (completedPercentage === null) {
		return (
			<p className="text-sm italic text-center">
				<T tkey="dashboard.piechart.nodata" />
			</p>
		);
	}

	const notCompletedPercentage = 100 - completedPercentage;

	const data = {
		labels: ["Completed", "Uncompleted"],
		datasets: [
			{
				data: [completedPercentage, notCompletedPercentage],
				backgroundColor: [
					"rgba(75, 192, 192, 0.2)",
					"rgba(255, 206, 86, 0.2)",
				],
				borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)"],
				borderWidth: 1,
			},
		],
	};

	const options = {
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					font: {
						size: 12,
					},
					padding: 20,
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const dataset = context.dataset;
						const currentValue = dataset.data[context.dataIndex];
						return `${currentValue}%`;
					},
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="max-w-full max-h-full xl:min-h-48">
			<Pie data={data} options={options} />
		</div>
	);
};

export { DashboardPieChart };
