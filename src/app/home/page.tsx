"use client";
import { Notification } from "@/components/home/notification";
import T from "@/components/translations/translation";
import Loading from "@/components/ui/loading";
import { fetchSettings } from "@/db/app_settings/fetchSettingsByUserId";
import { fetchUser } from "@/db/auth_user/fetchUser";
import { fetchNotifications } from "@/db/notifications/fetchNotificationsByLanguageId";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [internalNotifications, setInternalNotifications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const user = await fetchUser();
				const userId = user.id;
				const fetchedSettings = await fetchSettings(userId);
				const languageId = fetchedSettings.language_id;
				const fetchedNotifications = await fetchNotifications(
					languageId
				);
				setInternalNotifications(fetchedNotifications);
			} catch (error) {
				console.error("Error fetching data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="p-5 py-h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
					<T tkey="home.welcome.title" />
				</h2>
				<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
					<T tkey="home.welcome.subtitle" />
				</p>
			</div>
			<div className="flex flex-col md:flex-row md:gap-x-2 gap-y-2">
				<div className="p-5 h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div>
						<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.guide.admin.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.guide.admin.subtitle" />
						</p>
						<table className="border-collapse w-full my-1">
							<tbody>
								{Array.from({ length: 7 }, (_, i) => (
									<tr key={i}>
										<td className="text-accent_color pr-2 py-1 font-semibold align-top">
											{i + 1}.
										</td>
										<td className="py-1">
											<T
												tkey={`home.guide.admin.steps.s${
													i + 1
												}`}
											/>
											.
										</td>
									</tr>
								))}
								<tr className="text-center">
									<td className="pb-1 pt-4" colSpan={2}>
										<a
											target="_blank"
											href="https://mysurface.myaudit.org/webinar/"
											className="text-gray-600 dark:text-gray-400 hover:font-semibold transition-all duration-200 ease-linear"
										>
											<T tkey="home.guide.help" />
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className="p-5 h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div>
						<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.guide.user.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.guide.user.subtitle" />
						</p>
						<table className="border-collapse w-full my-1">
							<tbody>
								{Array.from({ length: 3 }, (_, i) => (
									<tr key={i}>
										<td className="text-accent_color pr-2 py-1 font-semibold align-top">
											{i + 1}.
										</td>
										<td className="py-1">
											<T
												tkey={`home.guide.user.steps.s${
													i + 1
												}`}
											/>
											.
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className="p-5 h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<div>
					<div className="mb-2">
						<h2 className="text-lg mb-2 font-semibold border-l-4 border-mid_blue pl-2">
							<T tkey="home.updates.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400 text-lg md:text-base">
							<T tkey="home.updates.subtitle" />
						</p>
					</div>
					{internalNotifications.length > 0 ? (
						internalNotifications.map((notification, index) => (
							<Notification
								key={index}
								msg={notification.message}
								type={notification.type}
								link={notification.link}
								lang={notification.language_id}
							/>
						))
					) : (
						<p>No notifications.</p>
					)}
				</div>
			</div>
		</div>
	);
}
