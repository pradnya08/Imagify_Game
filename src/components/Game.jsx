import React, { useState } from "react";
import { db } from "../firebase";
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Popup from "./Popup";

export default function Game() {
	const [imgSrc, setImgSrc] = useState("");
	const [currentLevel, setCurrentLevel] = useState(1);
	const [isDisable, setIsDisable] = useState(false);
	const [isFirst, setIsFirst] = useState(true);
	const [currentPoints, setCurrentPoints] = useState(0);
	const [ptsDelta, setPtsDelta] = useState(0);
	const [label, setLabel] = useState("");
	const auth = getAuth();
	const [levelPopup, setLevelPopup] = useState(false);
	useEffect(() => {
		const listener = onAuthStateChanged(auth, async (user) => {
			// const user = auth.currentUser;
			getDoc(doc(db, "users", user.uid)).then((snapShot) => {
				setCurrentLevel(snapShot.data().level);
			});
			getDoc(doc(db, "users", user.uid)).then((snapShot) => {
				setCurrentPoints(snapShot.data().points);
			});
			getDoc(doc(db, "users", user.uid)).then((snapShot) => {
				setPtsDelta(snapShot.data().ptsDelta);
			});
		});
		listener();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	function getImage() {
		// Get the image from DB
		setIsFirst(false);
		const q = query(
			collection(db, "images"),
			// where("clear", "==", 0),
			// where("blur", "==", 0),
			where("not_sure", "<=", currentLevel - 1)
		);
		getDocs(q).then((querySnapshot) => {
			if (!querySnapshot.empty) {
				const imgs = querySnapshot.docs.map((doc) => doc.data());
				const right_imgs = imgs.filter((img) => {
					const users = img.users;
					const fil_users = users.filter(
						(user) => user !== auth.currentUser.uid
					);
					return fil_users.length === users.length;
				});
				if (!right_imgs.empty) {
					setImgSrc(right_imgs[0].src);
					setLabel(right_imgs[0].label);
				} else {
					setImgSrc(
						"https://cdn2.vectorstock.com/i/1000x1000/36/81/all-done-rubber-stamp-vector-17503681.jpg"
					);
				}
			} else {
				setImgSrc(
					"https://cdn2.vectorstock.com/i/1000x1000/36/81/all-done-rubber-stamp-vector-17503681.jpg"
				);
			}
		});
		setIsDisable(false);
	}

	function levelUp() {
		const user = auth.currentUser;
		getDoc(doc(db, "users", user.uid)).then((snapShot) => {
			updateDoc(doc(db, "users", user.uid), {
				level: snapShot.data().level + 1,
			});
			setCurrentLevel(snapShot.data().level + 1);
		});
		setLevelPopup(true);
	}

	async function changeDelta(change) {
		const user = auth.currentUser;
		await getDoc(doc(db, "users", user.uid)).then((snapShot) => {
			const old_delta = snapShot.data().ptsDelta;
			var new_delta = 1;
			if (old_delta + change < 1) {
				setPtsDelta(1);
			} else {
				new_delta = ptsDelta + change;
				setPtsDelta(new_delta);
			}
			updateDoc(doc(db, "users", user.uid), { ptsDelta: new_delta });

			getDoc(doc(db, "users", user.uid)).then((snapShot) => {
				const old_points = snapShot.data().points;
				var new_points = 0;
				if (old_points + new_delta < 0) {
					setCurrentPoints(0);
				} else {
					new_points = currentPoints + new_delta;
					setCurrentPoints(new_points);
				}
				if (new_points !== 0 && new_points >= 100 * currentLevel) {
					levelUp();
				}
				updateDoc(doc(db, "users", user.uid), { points: new_points });
			});
		});
	}

	async function updateScores(type) {
		const q = query(collection(db, "images"), where("src", "==", imgSrc));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((d) => {
			if (d.data().label === "clear" && type === "clear") {
				updateDoc(doc(db, "images", d.id), {
					clear: d.data().clear + 1,
					users: arrayUnion(auth.currentUser.uid),
				});
				// give 10 points
				changeDelta(10);
			} else if (d.data().label === "blur" && type === "blur") {
				updateDoc(doc(db, "images", d.id), {
					blur: d.data().blur + 1,
					users: arrayUnion(auth.currentUser.uid),
				});
				// give 10 points
				changeDelta(10);
			} else if (d.data().label === "n/a") {
				if (type === "clear") {
					updateDoc(doc(db, "images", d.id), {
						clear: d.data().clear + 1,
						users: arrayUnion(auth.currentUser.uid),
					});
					changeDelta(5);
				} else if (type === "blur") {
					updateDoc(doc(db, "images", d.id), {
						blur: d.data().blur + 1,
						users: arrayUnion(auth.currentUser.uid),
					});
					changeDelta(5);
				} else {
					//no change
					updateDoc(doc(db, "images", d.id), {
						not_sure: d.data().not_sure + 1,
						users: arrayUnion(auth.currentUser.uid),
					});
				}
				//give 5 points
			} else if (d.data().label === "clear" && type === "blur") {
				//reduce delta
				changeDelta(-3);
				updateDoc(doc(db, "images", d.id), {
					users: arrayUnion(auth.currentUser.uid),
				});
			} else if (d.data().label === "blur" && type === "clear") {
				//reduce delta
				changeDelta(-3);
				updateDoc(doc(db, "images", d.id), {
					users: arrayUnion(auth.currentUser.uid),
				});
			} else if (type === "not_sure") {
				//do no change
				updateDoc(doc(db, "images", d.id), {
					clear: d.data().not_sure + 1,
					users: arrayUnion(auth.currentUser.uid),
				});
			}
		});
	}

	async function onClear() {
		setIsDisable(true);
		updateScores("clear");
	}
	async function onBlur() {
		setIsDisable(true);
		updateScores("blur");
	}
	function onNotSure() {
		setIsDisable(true);
		console.log("NOT SURE");
		updateScores("not_sure");
	}
	async function reset() {
		const q = query(collection(db, "images"));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((d) => {
			updateDoc(doc(db, "images", d.id), {
				not_sure: 0,
				clear: 0,
				blur: 0,
				users: [""],
			});
		});
	}
	if (isFirst) {
		getImage();
	}
	return (
		<>
			<div className='flex absolute'>
				<div className='pl-[150px] mt-[100px] flex justify-start flex-col'>
					<h1 className='mt-5 font-bold text-lg flex justify-center'>
						Progress Board:
					</h1>
					<p className='font-semibold mb-1'>Delta: {ptsDelta}</p>
					<p className='font-semibold mb-1'>Score: {currentPoints}</p>
					<p className='font-semibold mb-1'>Level: {currentLevel}</p>
					<p className='font-semibold'>Label: {label}</p>
				</div>
			</div>
			<div>
				<img
					className='mt-10 max-w-xl mx-auto'
					src={imgSrc}
					alt=''
					key={imgSrc}
				/>
			</div>
			<div className='mt-10 w-8/12 mx-auto justify-between flex'>
				<button
					disabled={isDisable}
					onClick={onClear}
					className={
						isDisable
							? "w-60 mr-4 inline-block bg-green-300 hover:bg-green-300 text-white font-bold py-2 px-4 border-b-4 border-green-300 hover:border-green-300 rounded"
							: "w-60 mr-4 inline-block bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
					}
				>
					Clear
				</button>
				<button
					disabled={isDisable}
					onClick={onNotSure}
					className={
						isDisable
							? "w-60 mr-4 inline-block bg-red-300 hover:bg-red-300 text-white font-bold py-2 px-4 border-b-4 border-red-300 hover:border-red-300 rounded"
							: "w-60 mr-4 inline-block bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
					}
				>
					Not sure
				</button>
				<button
					disabled={isDisable}
					onClick={onBlur}
					className={
						isDisable
							? "w-60 inline-block bg-blue-300 hover:bg-blue-300 text-white font-bold py-2 px-4 border-b-4 border-blue-300 hover:border-blue-300 rounded"
							: "w-60 inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
					}
				>
					Blur
				</button>
				<button
					onClick={reset}
					className='w-60 inline-block bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 border-b-4 border-purple-700 hover:border-purple-500 rounded'
				>
					Reset
				</button>
				<button
					disabled={!isDisable}
					onClick={getImage}
					className={
						isDisable
							? "w-60 inline-block bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 border-b-4 border-purple-700 hover:border-purple-500 rounded"
							: "w-60 inline-block bg-purple-300 hover:bg-purple-300 text-white font-bold py-2 px-4 border-b-4 border-purple-300 hover:border-purple-300 rounded"
					}
				>
					Next IMG
				</button>
			</div>

			<div>
				<Popup trigger={levelPopup} setTrigger={setLevelPopup}>
					<div className='m-10'>
						<h1 className='font-bold text-2xl flex justify-center mb-4'>
							Congratulations!!! You leveled up
						</h1>
					</div>
				</Popup>
			</div>
		</>
	);
}
