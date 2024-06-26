import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYinYang } from "@fortawesome/free-solid-svg-icons";
import T from "@/components/translations/translation";

export default function TeamMembersList({participants}) {

	if (participants.length === 0) {
		return <p className="text-sm italic text-center"><T tkey="dashboard.team.nodata"/></p>;
	}

	return (
		<div className="overflow-auto">
			<table className="w-full">
				<tbody>
					{participants.map((participant) => (
						<tr key={participant.id}>
							<td className="py-2 flex justify-center items-center">
								<div className="border-2 border-gray-200 shadow-sm dark:opacity-80 rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br from-accent_color to-accent_hover">
									<FontAwesomeIcon
										icon={faYinYang}
										className="w-5 h-5 text-white"
									/>
								</div>
							</td>
							<td className="p-2 font-bold text-lg md:text-base">
								{participant.name}
							</td>
							<td className="p-2 text-lg md:text-base">{participant.email}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
