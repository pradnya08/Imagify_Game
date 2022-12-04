import React from "react";

export default function Popup(props) {
	return props.trigger ? (
		<div className='fixed top-0 left-0 w-full h-screen bg-black/20 flex justify-center items-center'>
			<div className='relative p-8 w-full max-w-[640px] bg-white opacity-100'>
				<button
					className='absolute top-4 right-4 h-8 px-4 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-600 rounded-lg cursor-pointer focus:shadow-outline hover:bg-indigo-800'
					onClick={() => props.setTrigger(false)}
				>
					X
				</button>
				{props.children}
			</div>
		</div>
	) : (
		<></>
	);
}
