"use client";
import React, { useState } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import T from "@/components/translations/translation";
import Papa from "papaparse";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { SuccessMessage } from "@/components/ui/msg/success_msg";

function FormAddParticipant({ onParticipantAdded, isEnrollmentPhase }) {
	const [file, setFile] = useState(null);
	const supabase = createClientComponentClient();
	const [fileName, setFileName] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);
	const [successMessage, setSuccessMessage] = useState<string | undefined>(
		undefined
	);

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
		setFileName(event.target.files[0].name);
	};

	const addParticipantToDatabase = async (participant) => {
		const { data: insertedParticipant, error } = await supabase.rpc(
			"insert_participant_and_return",
			{ new_email: participant.email, new_name: participant.name }
		);

		if (error) {
			console.error(
				"Error adding participant in addParticipantToDatabase:",
				error
			);
			return;
		}

		return insertedParticipant[0];
	};

	const handleFileUpload = async () => {
		if (!file) return;

		Papa.parse(file, {
			header: true,
			complete: async (results) => {
				const fileExtension = file.name.split(".").pop();
				if (fileExtension !== "csv") {
					setErrorMessage(
						"error.participants.participant.csv.invalid"
					);
					return;
				}

				const maxRows = 200;
				if (results.data.length > maxRows) {
					setErrorMessage("error.participants.participant.csv.rows");
					return;
				}
				for (let row of results.data) {
					const newParticipant = { name: row.name, email: row.email };

					if (!newParticipant.name || !newParticipant.email) {
						setErrorMessage(
							"error.participants.participant.missing-fields"
						);
						continue;
					}

					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(newParticipant.email)) {
						setErrorMessage("error.participants.participant.email");
						continue;
					}

					const insertedParticipant = await addParticipantToDatabase(
						newParticipant
					);
					newParticipant.id = insertedParticipant.participant_id;
					onParticipantAdded(newParticipant);
				}
			},
		});
	};

	const formSchema = z.object({
		name: z.string().min(2, {
			message: "Name must be at least 2 characters.",
		}),
		email: z.string().email({
			message: "Invalid email address.",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		let newParticipant = { name: data.name, email: data.email };
		const insertedParticipant = await addParticipantToDatabase(
			newParticipant
		);

		if (insertedParticipant) {
			newParticipant.id = insertedParticipant.participant_id;
			onParticipantAdded(newParticipant);
			form.reset();
			setSuccessMessage("success.participants.participant.add");
		} else {
			setErrorMessage("error.participants.participant.add");
			console.error(
				"Error adding participant onSubmit:",
				insertedParticipant
			);
		}
	};

	if (!isEnrollmentPhase) {
		return null;
	}

	return (
		<>
			{successMessage && (
				<SuccessMessage
					successMessage={successMessage}
					setSuccessMessage={setSuccessMessage}
				/>
			)}
			{errorMessage && (
				<ErrorMessage
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
			)}
			<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="font-semibold text-lg  border-l-4 border-mid_blue pl-2">
					<T tkey="participants.titles.add-form" />
				</h2>
				<div className="w-full my-2">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex md:space-x-4 gap-y-2 md:items-end md:flex-row flex-col items-start w-full md:w-auto"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="md:w-2/5 w-full">
										<FormLabel>
											<T tkey="participants.form.labels.name" />
										</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												className=" dark:bg-mid_blue w-full"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="md:w-2/5 w-full">
										<FormLabel>
											<T tkey="participants.form.labels.email" />
										</FormLabel>
										<FormControl>
											<Input
												placeholder="john@example.com"
												className=" dark:bg-mid_blue"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								id="addParticipantBtn"
								className="md:w-1/5 w-full"
								disabled={!isEnrollmentPhase}
							>
								<T tkey="participants.form.buttons.add" />
							</Button>
						</form>
					</Form>
				</div>
			</div>
			<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="font-semibold text-lg  border-l-4 border-mid_blue pl-2">
					<T tkey="participants.titles.add-csv" />
				</h2>
				<div className="mt-4 w-full flex flex-col md:flex-row md:space-x-8 justify-between gap-y-2 md:gap-y-0">
					<div className="md:w-4/5">
						<input
							type="file"
							accept=".csv"
							id="fileUpload"
							onChange={handleFileChange}
							className="hidden"
						/>
						<label
							htmlFor="fileUpload"
							className="cursor-pointer text-sm border border-accent_color hover:bg-accent_light py-2 px-4 rounded inline-block transition-all duration-300 ease-in-out font-medium dark:text-white dark:hover:bg-gray-800"
						>
							<T tkey="participants.form.labels.select" />
						</label>
						{fileName && (
							<span className="ms-2 text-sm text-darkest_gray">
								{fileName}
							</span>
						)}
					</div>
					<Button
						type="submit"
						id="uploadCsvBtn"
						className="w-full md:w-1/5"
						disabled={!isEnrollmentPhase}
						onClick={handleFileUpload}
					>
						<T tkey="participants.form.buttons.csv" />
					</Button>
				</div>
				<p className="italic text-sm py-1 text-darkest_gray">
					<T tkey="participants.form.link.text" />{" "}
					<Link
						href={{
							pathname: "/home/faq",
							query: { defaultItem: "csv_item" },
						}}
						className="font-semibold text-accent_color hover:text-accent_hover underline hover:underline-offset-4 underline-offset-2 transition-all duration-200 ease-linear"
					>
						<T tkey="participants.form.link.here" />.
					</Link>
				</p>
			</div>
		</>
	);
}

export default FormAddParticipant;
