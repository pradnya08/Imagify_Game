import React from "react";

export default function Person(props) {
	return (
		<div
			className='mt-3 ml-3 p-2 cursor-pointer bg-cyan-50 mr-20'
			onClick={props.onClick}
		>
			<p className='block'>Name: {props.name}</p>
			<p className='block'>Email: {props.email}</p>
		</div>
	);
}
