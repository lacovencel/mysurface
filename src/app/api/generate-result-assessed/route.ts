import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
	const supabase = createServerComponentClient({ cookies });
	const user = await supabase.auth.getUser();

	try {
		// Fetch app_settings
		const { data: appSettings, error: appSettingsError } = await supabase
			.from("app_settings")
			.select("*")
			.eq("user_id", user.data.user?.id)
			.single();

		if (appSettingsError) {
			console.log("Error fetching app settings", appSettingsError);
			throw appSettingsError;
		}

		// Fetch questions
		const { data: questions, error: questionsError } = await supabase
			.from("questions")
			.select("*")
			.eq("language_id", appSettings.language_id)
			.eq("organization_id", appSettings.organization_id)
			.eq("process_id", appSettings.process_id);

		if (questionsError) {
			console.log("Error fetching questions", questionsError);
			throw questionsError;
		}

		// Fetch participants
		const { data: participants, error: fetchParticipantError } =
			await supabase
				.from("participants")
				.select("id, name, questionnaire")
				.eq("user_id", user.data.user?.id);

		if (fetchParticipantError) {
			console.log("Error fetching participants", fetchParticipantError);
			throw fetchParticipantError;
		}

		// Fetch assesseds
		const { data: assesseds, error: fetchAssessedsError } = await supabase
			.from("assessed")
			.select("id, name, description")
			.eq("user_id", user.data.user?.id)
			.eq("type", appSettings.process_id == 2 ? "leader" : "product");

		if (fetchAssessedsError) {
			console.log("Error fetching assesseds", fetchAssessedsError);
			throw fetchAssessedsError;
		}

		// Fetch questionnaires
		const { data: questionnaires, error: fetchQuestionnaireError } =
			await supabase.from("questionnaires").select("*");

		if (fetchQuestionnaireError) {
			console.log(
				"Error fetching questionnaires",
				fetchQuestionnaireError
			);
			throw fetchQuestionnaireError;
		}

		// Map participants to their respective questionnaires
		const participantsData = participants.map((participant) => {
			const questionnaire = questionnaires.find(
				(q) => q.id === participant.questionnaire
			);

			let data;
			if (questionnaire && !questionnaire.completed) {
				data = assesseds.map((a) => ({
					participantId: a.id,
					participantName: a.name,
					answers: questions.map((question) => ({
						rating: 0,
						weight: question.weight,
					})),
					interactionGrade: 0,
					influenceGrade: 0,
				}));
				questionnaire.data = data;
			}

			return {
				participantName: participant.name,
				data: questionnaire ? questionnaire.data : [],
			};
		});

		const assessedData = assesseds.map((assessed) => {
			let data;
			data = participants.map((p) => ({
				participantId: p.id,
				participantName: p.name,
				answers: questions.map((question) => ({
					rating: 0,
					weight: question.weight,
				})),
				interactionGrade: 0,
				influenceGrade: 0,
			}));

			return {
				participantName: assessed.name,
				data: data ? data : [],
			};
		});

		// Combine participants and assessed data
		const combinedData = [...participantsData, ...assessedData];

		// Insert the participants data into the results table
		const { data: insertedResult, error: insertError } = await supabase
			.from("results")
			.insert([
				{
					id: Date.now().toString(),
					created_at: new Date().toISOString(),
					result: JSON.stringify(combinedData),
					report_name: "Participants Data",
                    process_id: appSettings.process_id,
				},
			])
			.select("*")
			.single();

		if (insertError) {
			console.log("Error inserting result", insertError);
			throw insertError;
		}

		// DELETE RECORDS FROM QUESTIONNAIRES AND PARTICIPANTS
		// Get questionnaire IDs for the logged in user
		const { data: questionnaireData, error: questionnaireError } =
			await supabase
				.from("participants")
				.select("questionnaire")
				.eq("user_id", user.data.user?.id);

		if (questionnaireError) {
			console.error("Error getting questionnaires:", questionnaireError);
		} else {
			const questionnaireIds = questionnaireData.map(
				(q) => q.questionnaire
			);

			// Delete all records from questionnaires
			const { error: deleteError } = await supabase
				.from("questionnaires")
				.delete()
				.in("id", questionnaireIds);

			if (deleteError) {
				console.error("Error deleting questionnaires:", deleteError);
			}

			// Delete all records from participants
			if (user.data.user) {
				const { error: deleteParticipantsError } = await supabase
					.from("participants")
					.delete()
					.eq("user_id", user.data.user.id);

				if (deleteParticipantsError) {
					console.error(
						"Error deleting participants:",
						deleteParticipantsError
					);
				}
			}

			// Delete all records from assesseds
			if (user.data.user) {
				const { error: deleteAssessedsError } = await supabase
					.from("assessed")
					.delete()
					.eq("user_id", user.data.user.id);

				if (deleteAssessedsError) {
					console.error(
						"Error deleting assesseds:",
						deleteAssessedsError
					);
				}
			}
		}

		return NextResponse.json({
			message: "Result generated successfully",
			resultId: insertedResult.id,
		});
	} catch (error) {
		console.error("Error generating result:", error);
		return NextResponse.json(
			{ error: "An error occurred while generating the result" },
			{ status: 500 }
		);
	}
}
