import React from "react";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import T from "@/components/translations/translation";

const EmailButton = ({ participants, lang, org, isEnrollmentPhase, userId, selectedProcess }) => {
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	async function sendEmail(name, email, url, lang) {
		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, url, lang }),
			});

			return response;
		} catch (error) {
			console.error("Error:", error);
		}
	}

	const handleClick = async () => {
		let failedEmails = [];
		for (let participant of participants) {
			const { name, email } = participant;
			const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
			const questionnaireId = participant.questionnaire;
			const url = `${baseUrl}/questionnaire/${questionnaireId}/${lang}/${org}/${selectedProcess}/${userId}`;
			try {
				const response = await sendEmail(name, email, url, lang);
				if (!response.ok) {
					failedEmails.push(email);
				}
			} catch (error) {
				console.error(`Error:`, error);
			}
		}

		if (failedEmails.length === 0) {
			setSuccessMessage("success.participants.email.mass");
		} else {
			setErrorMessage("error.participants.email.mass");
			console.log("Failed emails:", failedEmails);
		}
	};

	if (isEnrollmentPhase) {
		return null;
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
			<Button
				className="md:w-1/5 w-full"
				variant="outline_blue"
				onClick={handleClick}
			>
				<T tkey="participants.buttons-section.buttons.sendAll" />
			</Button>
		</>
	);
};

export default EmailButton;
