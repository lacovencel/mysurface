import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Invalid email address.",
	}),
});

export async function POST(request: Request) {
	const supabase = createServerComponentClient({ cookies });

	try {
		const body = await request.json();
		const data = formSchema.parse(body);

		const { error } = await supabase.from("participants").insert([data]);

		if (error) {
			throw error;
		}

		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.issues },
				{ status: 400, statusText: "Bad Request" }
			);
		}

		console.error("Error creating participant:", error);
		return NextResponse.json(
			{ error: "An error occurred while creating the participant" },
			{ status: 500, statusText: "Internal Server Error" }
		);
	}
}

export async function DELETE(request: Request) {
	const supabase = createServerComponentClient({ cookies });

	try {
		const body = await request.json();
		const { id } = body;

		// Get the participant
		const { data: participantData, error: getError } = await supabase
			.from("participants")
			.select("questionnaire")
			.eq("id", id);

		if (getError) {
			throw getError;
		}

		// Check if the participant exists
		if (!participantData || participantData.length === 0) {
			throw new Error(`Participant with id ${id} does not exist`);
		}

		const participant = participantData[0];

		// If the participant has a questionnaire, delete it
		if (participant.questionnaire) {
			const { error: deleteQuestionnaireError } = await supabase
				.from("questionnaires")
				.delete()
				.eq("id", participant.questionnaire);

			if (deleteQuestionnaireError) {
				throw deleteQuestionnaireError;
			}
		}

		// Delete the participant
		const { error: deleteParticipantError } = await supabase
			.from("participants")
			.delete()
			.eq("id", id);

		if (deleteParticipantError) {
			throw deleteParticipantError;
		}

		return NextResponse.json({
			message:
				"Participant and associated questionnaire deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting participant and questionnaire:", error);
		return NextResponse.json({
			error: "An error occurred while deleting the participant and questionnaire",
		});
	}
}
