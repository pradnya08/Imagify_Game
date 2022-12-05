import React from "react";
import { useNavigate } from "react-router";

export default function HowToPlay() {
	const navigate = useNavigate();
	return (
		<>
			<div>
				<h1 className='mt-5 font-bold text-3xl flex justify-center mb-4'>
					How to play
				</h1>
			</div>
			<div className='flex justify-center flex-col items-center'>
				<p className='w-1/2 font-serif mb-8'>
					Image cleaning is a very important and crucial part in visual data
					analytics and by playing this game you will be helping us collect data
					about clarity of the image and we can use this data to train our
					models to better understand visual data.
					<br />
					You will be shown an image along with three options below the image{" "}
					<b>Clear, Blur</b> or <b>Not Sure</b>
					<br />
					Choose the options carefully based on the image you see
					<br />
					<b>
						<i>Remember once you click on a choice you cannot change it.</i>
					</b>
					<br />
					Once you have made your choice click <b>Next Image</b> button to get a
					new image. Your performance will be scored and based on what you
					choose for the images.
					<br />
					You will level up based on the scores and you can see how you stand
					with other players by checking the Leaderboard page.
					<br />
					To begin click Lets Play!
				</p>
				<button
					onClick={() => {
						navigate("/game");
					}}
					className='w-60 mr-4 inline-block bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded'
				>
					Lets play!
				</button>
			</div>
		</>
	);
}
