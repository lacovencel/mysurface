"use client";
import React, { useEffect, useState } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import T from "@/components/translations/translation";

const formSchema = z.object({
	process_id: z.number(),
});

export default function SelectProcess({
	userId,
	process,
	setProcess,
	isEnrollmentPhase,
}) {
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			process_id: process,
		},
	});

	const { setValue, watch } = form;

	const handleSelectChange = (event) => {
		const newSelectedProcess = parseInt(event.target.value, 10);
		setValue("process_id", newSelectedProcess);
	};

	const handleChangeProcess = async (data: z.infer<typeof formSchema>) => {
		const { process_id } = data;

		const { error: updateError } = await supabase
			.from("app_settings")
			.update({ process_id: process_id })
			.eq("user_id", userId);

		if (updateError) {
			console.log(updateError);
			setErrorMessage("error.participants.process");
		} else {
			setSuccessMessage("success.participants.process");
			setProcess(process_id);
		}
	};

	const processId = watch("process_id");

	let processName;
	if (processId == 1) {
		processName = "participants.select-process.options.influence";
	} else if (processId == 2) {
		processName = "participants.select-process.options.leaders";
	} else if (processId == 3) {
		processName = "participants.select-process.options.products";
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
			{isEnrollmentPhase ? (
				<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<h2 className="font-semibold text-lg mb-2  border-l-4 border-mid_blue pl-2">
						<T tkey="participants.titles.set-process.subtitle" />
					</h2>
					<div>
						{processId == 1 && (
							<p className="text-darkest_gray italic text-sm">
								<span className="font-semibold">
									<T tkey="participants.select-process.options.influence" />
									:{" "}
								</span>
								<T tkey="participants.select-process.explanations.influence" />
							</p>
						)}
						{processId == 2 && (
							<p className="text-darkest_gray italic text-sm">
								<span className="font-semibold">
									<T tkey="participants.select-process.options.leaders" />
									:{" "}
								</span>
								<T tkey="participants.select-process.explanations.leaders" />
							</p>
						)}
						{processId == 3 && (
							<p className="text-darkest_gray italic text-sm">
								<span className="font-semibold">
									<T tkey="participants.select-process.options.products" />
									:{" "}
								</span>
								<T tkey="participants.select-process.explanations.products" />
								.
							</p>
						)}
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleChangeProcess)}
							className="w-full md:w-2/5 flex md:flex-row flex-col items-end md:gap-x-4 md:gap-y-0 gap-y-2"
						>
							<FormField
								control={form.control}
								name="process_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="process_id">
											<T tkey="participants.form.labels.process" />
										</FormLabel>
										<FormControl>
											<select
												name="process_id"
												id="process_id"
												onChange={handleSelectChange}
												value={processId}
												className="dark:bg-mid_blue appearance-none box-border w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-dark_gray cursor-pointer"
											>
												<option value="1">
													<T tkey="participants.select-process.options.influence" />
												</option>
												<option value="2">
													<T tkey="participants.select-process.options.leaders" />
												</option>
												<option value="3">
													<T tkey="participants.select-process.options.products" />
												</option>
											</select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="w-full flex justify-end">
								<Button type="submit" className="w-full">
									<T tkey="participants.select-process.button" />
								</Button>
							</div>
						</form>
					</Form>
				</div>
			) : (
				<div className="p-5 shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<h2 className="font-semibold text-lg  border-l-4 border-mid_blue pl-2">
						<T tkey="participants.select-process.selected" />{" "}
						<i className="font-normal text-base uppercase">
							<T tkey={processName} />
						</i>
					</h2>
				</div>
			)}
		</>
	);
}
