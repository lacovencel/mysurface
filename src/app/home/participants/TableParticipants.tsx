import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import T from "@/components/translations/translation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	THeadRow,
	TBodyRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";

function TableParticipants({
	participants,
	setParticipants,
	isEnrollmentPhase,
	lang,
	org,
	selectedProcess,
	userId,
}) {
	const headers_T = [
		"participants.table.headers.name",
		"participants.table.headers.email",
		"participants.table.headers.status",
		"participants.table.headers.questionnaire",
		"participants.table.headers.link",
		"participants.table.headers.delete",
	];
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const deleteParticipant = async (participantId) => {
		console.log("participantId", participantId);
		const response = await fetch("/api/participants", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: participantId }),
		});

		if (response.ok) {
			const updatedParticipants = participants.filter(
				(participant) => participant.id != participantId
			);
			setParticipants(updatedParticipants);
			setSuccessMessage("success.participants.participant.delete");
		} else {
			setErrorMessage("error.participants.participant.delete");
			console.error("Error deleting participant:", response.statusText);
		}
	};

	const renderQuestionnaireStatus = (status) => {
		let color;
		let tkey;

		switch (status) {
			case "completed":
				color = "bg-green-500";
				tkey = "participants.table.status.completed";
				break;
			case "tocomplete":
				color = "bg-yellow-500";
				tkey = "participants.table.status.tocomplete";
				break;
			default:
				color = "bg-gray-300";
				tkey = "participants.table.status.undefined";
				break;
		}

		return (
			<div className={`${color} text-white px-2 py-2 rounded`}>
				<T tkey={tkey} />
			</div>
		);
	};

	async function sendEmail(name, email, url, lang) {
		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, url, lang }),
			});

			if (!response.ok) {
				setErrorMessage("error.participants.email.individual");
				console.log("Response", response);
			} else {
				setSuccessMessage("success.participants.email.individual");
			}
		} catch (error) {
			setErrorMessage("error.participants.email.individual");
			console.error(`Error sending email to ${email}: ${error}`);
		}
	}

	return (
		<>
			<ErrorMessage
				errorMessage={errorMessage}
				setErrorMessage={setErrorMessage}
			/>
			<SuccessMessage
				successMessage={successMessage}
				setSuccessMessage={setSuccessMessage}
			/>
			<div className="overflow-auto w-full hidden md:block p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-4 font-semibold text-lg dark:text-white text-black border-l-4 border-mid_blue pl-2">
					<T tkey="participants.titles.participants.subtitle" />
				</h2>
				<Table className="w-full">
					<TableHeader>
						<THeadRow>
							{headers_T.map((header, index) => {
								return (
									<TableHead key={index}>
										<T tkey={header} />
									</TableHead>
								);
							})}
						</THeadRow>
					</TableHeader>
					<TableBody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-500">
						{participants.length ? (
							participants.map((participant) => {
								if (participant) {
									const questionnaireId =
										participant.questionnaire;
									const baseUrl =
										process.env.NEXT_PUBLIC_BASE_URL;
									const url = `${baseUrl}/questionnaire/${questionnaireId}/${lang}/${org}/${selectedProcess}/${userId}`;
									return (
										<TBodyRow key={participant.id}>
											<TableCell className="px-6 py-4 whitespace-nowrap hidden">
												{participant.id}
											</TableCell>
											<TableCell className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="inline-block mr-5">
														<div className="border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br from-accent_color to-accent_hover">
															<FontAwesomeIcon
																icon={faYinYang}
																className="w-5 h-5 text-white"
															/>
														</div>
													</div>
													<div className="ml-4">
														<div className="evaluator-name text-sm font-medium text-gray-900 dark:text-white">
															{participant.name}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-500">
													{participant.email}
												</div>
											</TableCell>
											<TableCell className="px-6 py-4 whitespace-nowrap">
												{renderQuestionnaireStatus(
													participant.questionnaireStatus
												)}
											</TableCell>
											<TableCell className="px-6 py-4 whitespace-nowrap">
												{(() => {
													return questionnaireId ? (
														<Button
															onClick={(
																event
															) => {
																event.preventDefault();
																sendEmail(
																	participant.name,
																	participant.email,
																	url,
																	lang
																);
															}}
															className="linkToQuestionnaire"
															variant="blue"
														>
															<T tkey="participants.table.buttons.send" />
														</Button>
													) : null;
												})()}
											</TableCell>
											<TableCell className="px-6 py-4 whitespace-nowrap">
												{(() => {
													return questionnaireId ? (
														<Button
															onClick={(
																event
															) => {
																event.preventDefault();
																navigator.clipboard.writeText(
																	url
																);
															}}
															className="linkToQuestionnaire"
															variant="outline_blue"
														>
															<T tkey="participants.table.buttons.copy" />
														</Button>
													) : null;
												})()}
											</TableCell>
											<TableCell className="px-6 py-4 text-sm text-left whitespace-nowrap">
												<Button
													disabled={
														!isEnrollmentPhase
													}
													variant="delete"
													onClick={() =>
														deleteParticipant(
															participant.id
														)
													}
												>
													<T tkey="participants.table.buttons.delete" />
												</Button>
											</TableCell>
										</TBodyRow>
									);
								}
								return null;
							})
						) : (
							<TBodyRow>
								<TableCell
									colSpan={headers_T.length}
									className="px-6 py-4 whitespace-nowrap text-center"
								>
									<T tkey="participants.table.nodata" />
								</TableCell>
							</TBodyRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="overflow-auto w-full block md:hidden p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="mb-4 font-semibold text-lg  text-black dark:text-white border-l-4 border-mid_blue pl-2">
					<T tkey="participants.titles.participants.title" />
				</h2>
				{participants.length
					? participants.map((participant) => {
							if (participant) {
								const questionnaireId =
									participant.questionnaire;
								const baseUrl =
									process.env.NEXT_PUBLIC_BASE_URL;
								const url = `${baseUrl}/questionnaire/${questionnaireId}/${lang}/${org}/${selectedProcess}/${userId}`;

								return (
									<div
										key={participant.id}
										className="md:hidden rounded-md border shadow-md bg-white dark:bg-black p-3 mb-4 flex flex-col gap-y-2"
									>
										<p className="hidden">
											{participant.id}
										</p>
										<p>
											<strong>
												<T tkey={headers_T[0]} />:{" "}
											</strong>
											{participant.name}
										</p>
										<p>
											<strong>
												<T tkey={headers_T[1]} />:{" "}
											</strong>
											{participant.email}
										</p>
										<p>
											<strong>
												<T tkey={headers_T[2]} />:{" "}
											</strong>
											{renderQuestionnaireStatus(
												participant.questionnaireStatus
											)}
										</p>
										{(() => {
											return questionnaireId ? (
												<Button
													onClick={(event) => {
														event.preventDefault();
														sendEmail(
															participant.name,
															participant.email,
															url,
															lang
														);
													}}
													className="linkToQuestionnaire"
													variant="blue"
												>
													<T tkey="participants.table.buttons.send" />
												</Button>
											) : null;
										})()}
										{(() => {
											return questionnaireId ? (
												<Button
													onClick={(event) => {
														event.preventDefault();
														navigator.clipboard.writeText(
															url
														);
													}}
													className="linkToQuestionnaire"
													variant="outline_blue"
												>
													<T tkey="participants.table.buttons.copy" />
												</Button>
											) : null;
										})()}
										<Button
											className="w-full"
											disabled={!isEnrollmentPhase}
											variant="delete"
											onClick={() =>
												deleteParticipant(
													participant.id
												)
											}
										>
											<T tkey={headers_T[5]} />
										</Button>
									</div>
								);
							}
							return null;
					  })
					: null}
			</div>
		</>
	);
}

export default TableParticipants;
