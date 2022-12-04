import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Host() {
	const location = useLocation();
	const navigate = useNavigate();
	function getzoom() {
		navigate(
			"https://zoom.us/oauth/authorize?response_type=code&client_id=26Bgz4rLRQuLRsvEqSE4Lg&redirect_uri=https%3A%2F%2Flocalhost%2Fhost"
		);
	}
	return (
		<div>
			<h1 className='m-5 text-3xl font-serif font-medium justify-center flex'>
				Lets finish some questions
			</h1>
			<form className='flex flex-col items-center justify-center'>
				<div className='flex flex-row'>
					<p className='w-full m-4'>Speaker Name : </p>
					<input type='text' value={location.state.name} />
				</div>
				<p>Speaker email: </p>
				<input type='text' value={location.state.name} />
				<button onClick={getzoom}>YES</button>
				<a href='https://zoom.us/oauth/authorize?response_type=code&client_id=26Bgz4rLRQuLRsvEqSE4Lg&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhost'>
					asfsdf
				</a>
			</form>
			<div>Host: {location.state.name}</div>
			<div>Email: {location.state.email}</div>
		</div>
	);
}
