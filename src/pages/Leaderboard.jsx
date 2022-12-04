import { getAuth, onAuthStateChanged } from "firebase/auth";
import { query, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

export default function Leaderboard() {
	const auth = getAuth();
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const listener = onAuthStateChanged(auth, async (user) => {
			const q = query(collection(db, "users"));
			const querySnapshot = await getDocs(q);
			if (!querySnapshot.empty) {
				querySnapshot.forEach((d) => {
					setUsers((users) => [
						...users,
						{ name: d.data().name, points: d.data().points },
					]);
				});
			}
		});
		listener();
	}, [auth]);

	return (
		<>
			<div>
				<h1 className='mt-5 font-bold text-3xl flex justify-center mb-4'>
					Leaderboard
				</h1>
				<section className='flex justify-center'>
					<table>
						<thead>
							<tr>
								<th className='pr-7'>Player Name</th>
								<th className=''>Points</th>
							</tr>
						</thead>
						<tbody>
							{users
								.sort((a, b) => b.points - a.points)
								.map((item) => {
									return (
										<tr key={item.name}>
											<td>{item.name}</td>
											<td>{item.points}</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</section>
			</div>
		</>
	);
}
