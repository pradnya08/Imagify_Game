import { React, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Header() {
	const [pageState, setPageState] = useState("Sign In");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const auth = getAuth();
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setPageState("Profile");
				setIsLoggedIn(true);
			} else {
				setPageState("Sign In");
				setIsLoggedIn(false);
			}
		});
	}, [auth]);
	function pathMatchRoute(route) {
		if (route === location.pathname) {
			return true;
		}
	}
	return (
		<div className='bg-white border-b shadow-sm sticky top-0 z-40'>
			<header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
				<div>
					<img
						src='https://youhost.co.nz/images/logo.png'
						alt='logo'
						className='h-10 cursor-pointer'
						onClick={() => navigate("/")}
					/>
				</div>
				<div>
					<ul className='flex space-x-10'>
						<li
							className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
						${pathMatchRoute("/") && "text-black border-b-red-500"}`}
							onClick={() => navigate("/")}
						>
							Home
						</li>
						<li
							className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
						${
							(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
							"text-black border-b-red-500"
						}`}
							onClick={() => navigate("/profile")}
						>
							{pageState}
						</li>
						{isLoggedIn && (
							<li
								className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
						${pathMatchRoute("/people") && "text-black border-b-red-500"}`}
								onClick={() => navigate("/people")}
							>
								People
							</li>
						)}
					</ul>
				</div>
			</header>
		</div>
	);
}
