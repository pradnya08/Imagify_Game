import React from "react";
import { useState } from "react";
import Game from "../components/Game";
import Popup from "../components/Popup";

export default function Home() {
	const [popup, setPopup] = useState(true);

	return (
		<>
			<div>
				<Game />
			</div>
			<Popup trigger={popup} setTrigger={setPopup}>
				<div className='m-10'>
					<h1 className='font-bold text-2xl flex justify-center mb-4'>
						Welcome
					</h1>
					<div className='flex flex-col justify-center items-center'>
						<button className='w-60 mb-3 inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'>
							How to play????
						</button>
						<button
							onClick={() => {
								setPopup(false);
							}}
							className='w-60 mt-3 inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded'
						>
							Lets Play!
						</button>
					</div>
				</div>
			</Popup>
		</>
	);
}
