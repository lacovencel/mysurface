"use client";
import { Notification } from "@/components/home/notification";
import T from "@/components/translation";

export default function Home() {
	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex flex-col md:flex-row md:gap-x-4 gap-y-4">
				<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div className="px-10 py-5">
						<h2 className="font-bold text-lg">
							<T tkey="home.guide.admin.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							<T tkey="home.guide.admin.subtitle" />
						</p>
						<ol className="text-gray-600 dark:text-gray-400 list-inside py-4">
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									1.
								</span>
								<T tkey="home.guide.admin.steps.s1" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									2.
								</span>
								<T tkey="home.guide.admin.steps.s2" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									3.
								</span>
								<T tkey="home.guide.admin.steps.s3" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									4.
								</span>
								<T tkey="home.guide.admin.steps.s4" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									5.
								</span>
								<T tkey="home.guide.admin.steps.s5" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									6.
								</span>
								<T tkey="home.guide.admin.steps.s6" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									7.
								</span>
								<T tkey="home.guide.admin.steps.s7" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									8.
								</span>
								<T tkey="home.guide.admin.steps.s8" />
							</li>
						</ol>
					</div>
				</div>
				<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
					<div className="px-10 py-5">
						<h2 className="font-bold text-lg">
							<T tkey="home.guide.user.title" />
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							<T tkey="home.guide.user.subtitle" />
						</p>
						<ol className="text-gray-600 dark:text-gray-400 list-inside py-4">
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									1.
								</span>
								<T tkey="home.guide.user.steps.s1" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									2.
								</span>
								<T tkey="home.guide.user.steps.s2" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									3.
								</span>
								<T tkey="home.guide.user.steps.s3" />
							</li>
							<li className="font-semibold">
								<span className="text-xl font-bold text-blue-500 inline-block w-6">
									4.
								</span>
								<T tkey="home.guide.user.steps.s4" />
							</li>
						</ol>
					</div>
				</div>
			</div>
			<div className="h-auto w-full flex flex-col shadow-md rounded-lg bg-white dark:bg-black bg-opacity-90">
				<div className="px-10 py-5">
					<div className="mb-2">
						<h2 className="font-bold text-lg">Updates</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Check platform updates and news.
						</p>
					</div>
					<Notification
						type="update"
						msg="New version of MySurface available."
						link="#"
					/>
					<Notification
						type="news"
						msg="New functionalities will be added soon."
						link="#"
					/>
				</div>
			</div>
		</div>
	);
}
