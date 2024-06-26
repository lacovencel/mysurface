"use client";
import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { SuccessMessage } from "@/components/ui/msg/success_msg";
import { ErrorMessage } from "@/components/ui/msg/error_msg";
import { useRouter } from "next/navigation";
import T from "@/components/translations/translation";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { set } from "zod";

export default function DeleteAccountButton({ userId }: { userId: any }) {
	const supabase = createClientComponentClient();
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const handleConfirmOpen = () => {
		setConfirmOpen(true);
	};

	const handleConfirmClose = () => {
		setConfirmOpen(false);
	};

	const handleDelete = async () => {
		try {
			const { error: procedureError } = await supabase.rpc(
				"delete_user",
				{ user_id: userId }
			);

			if (procedureError) {
				setErrorMessage("error.account.deletion");
				throw procedureError;
			} else {
				setSuccessMessage("success.account.deletion");
				console.log("user deleted");
				return router.push("/login");
			}
		} catch (error) {
			setErrorMessage("error.account.deletion");
			console.log("error:", error);
		}
	};

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
			<div>
				<h2 className="mb-2 text-lg font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="account.delete.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base mb-4">
					<T tkey="account.delete.subtitle" />
				</p>
				<div className="w-full flex justify-end">
					<Button
						onClick={handleConfirmOpen}
						variant="login"
						className="w-full md:w-1/2 lg:w-1/3 bg-red-500 hover:bg-red-600"
					>
						<T tkey="account.delete.button" />
					</Button>
				</div>
			</div>
			<Modal
				open={confirmOpen}
				onClose={handleConfirmClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box
					className="bg-white dark:bg-gray-700"
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "90%",
						maxWidth: 400,
						borderRadius: "10px",
						boxShadow: 24,
						p: 4,
					}}
				>
					<Typography
						className="text-black dark:text-white"
						id="modal-modal-title"
						variant="h6"
						component="h2"
						sx={{
							mb: 2,
							textAlign: "center",
							fontFamily: "inherit",
						}}
					>
						<T tkey="account.delete.confirmation" />
					</Typography>
					<Button
						onClick={handleDelete}
						variant="delete"
						className="mt-2 w-full"
					>
						<T tkey="account.delete.options.yes" />
					</Button>
					<Button
						onClick={handleConfirmClose}
						className="mt-2 w-full"
					>
						<T tkey="account.delete.options.no" />
					</Button>
				</Box>
			</Modal>
		</>
	);
}
