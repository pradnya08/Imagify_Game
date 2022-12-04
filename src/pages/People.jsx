import { collection, onSnapshot, query } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Person from "../components/Person";
import Popup from "../components/Popup";
import { db } from "../firebase";

export default function People() {
	const [peopleData, setPeopleData] = useState([]);
	const [profilePopup, setProfilePopup] = useState(false);
	const [popupData, setPopupData] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		const q = query(collection(db, "users"));
		onSnapshot(q, (querySnapshot) => {
			setPeopleData(
				querySnapshot.docs.map((doc) => ({
					data: doc.data(),
				}))
			);
		});
	}, []);
	function showPopup(name, email) {
		setPopupData({
			name,
			email,
		});
		setProfilePopup(true);
	}
	return (
		<div>
			<div>
				<h2 className='text-3xl font-bold justify-center flex'>People</h2>
			</div>
			<div>
				{peopleData.map((person, i) => (
					<Person
						onClick={() => showPopup(person.data.name, person.data.email)}
						name={person.data.name}
						email={person.data.email}
						key={i}
					/>
				))}
			</div>
			<div>
				<Popup trigger={profilePopup} setTrigger={setProfilePopup}>
					<section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
						<h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
						<div className='w-full md:w-[50%] mt-6 px-3'>
							<form>
								{/* Name Input */}
								<input
									type='text'
									id='name'
									value={popupData.name}
									disabled
									className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out`}
								/>
								{/* Email Input */}
								<input
									type='email'
									id='email'
									value={popupData.email}
									disabled
									className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'
								/>
							</form>
						</div>
						<button
							className='p-2 rounded-lg bg-red-400'
							onClick={() => navigate("/host", { state: popupData })}
						>
							Host a talk with them?
						</button>
					</section>
				</Popup>
			</div>
		</div>
	);
}
