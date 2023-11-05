<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	// Imports -[ MODALS ]- ///////////////////////////
	import Modal from "$lib/modals/Modal.svelte";
	import { openModal, selectedPage } from "$lib/store/ModalValues";
	import { closeModal } from "$lib/store/ModalValues";
	import { showModal } from "$lib/store/ModalValues"; // Est ce que Display une Modal  -[ boolean ]-
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	let selectedModal: string;
	selectedPage.subscribe((b: string) => {
		selectedModal = b;
	});
	///////////////////////////////////////////////////

	import { actualUsername, authentificated } from "$lib/store/store";
	import { googleAuth } from "$lib/store/store";
	let Google2fa: boolean = false;

	import ImgPreviewProfile from "./ImgPreviewProfile.svelte";
	import ErrorModal from "$lib/modals/ErrorModal.svelte";
	import Enable2Fa from "./Enable2Fa.svelte";
	import Disable2Fa from "./Disable2Fa.svelte";

	let login: string;
	let pictureLink: string;
	let rank: string;
	let title: string;
	let win: number;
	let loose: number;

	let newUserName: string = "";
	$: newImg = "";
	$: username = "";

	let indication_username: string = "";
	let indication_avatar: string = "";

	let isModalOpen = false;
	function handleLoggoutModal() {
		isModalOpen = true;
	}
	function handleCancelLoggoutModal(){
		isModalOpen = false
	}


	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
			} else {
				const response = await fetch(
					"http://localhost:3000/user/profile",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					}
				);
				console.log(" -[ Profile ]- response: ", response);
				if (response.ok) {
					//const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					console.log(" -[ Profile ]- User: ", user);
					console.log("Salut du Profile");
					login = user.login;
					pictureLink = user.avatar;
					username = user.userName;
					rank = user.rank;
					title = user.title;
					win = user.wonGameNbr;
					loose = user.lostGameNbr;

					googleAuth.set(user.fa2);
					console.log("2fa Value from user: [ ", user.fa2, " ]");
				} else {
					localStorage.clear();
					authentificated.set(false);
					goto("/");
				}
				//let user = await response();
			}
		} catch (e) {}
		googleAuth.subscribe((a) => {
			Google2fa = a;
		});
	});

	async function handleChangeName() {
		console.log("login ", login, "    newUserame: ", newUserName);
		const jwt = localStorage.getItem("jwt");
		const data = { login: login, newUsername: newUserName };

		const response = await fetch("http://localhost:3000/auth/changeName", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			// console.log("response.ok");
			username = newUserName;
			actualUsername.set(newUserName);
			goto("/");
		} else {
			// show message erreur Modal
			openModal("errorMsg");
			goto("/Profile");
		}
	}

	async function handleChangeImage() {
		const jwt = localStorage.getItem("jwt");
		const data = { login: login, img: newImg };
		const response = await fetch("http://localhost:3000/auth/changeImage", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});

		if (response.ok) {
			console.log("-[ Change Image ]- New Image bien Set");
		}
		goto("/");
	}
</script>

{#if show_Modal}
	<div>
		<Modal>
			{#if selectedModal === "Try Avatar"}
				<ImgPreviewProfile
					image={newImg}
					{login}
					{username}
					on:closeModal={closeModal}
				/>
			{/if}
			{#if selectedModal === "errorMsg"}
				<ErrorModal
					msg="username [ {newUserName} ] is already used !"
				/>
			{/if}
			{#if selectedModal === "Try Enable 2fa"}
				<Enable2Fa {login} />
			{/if}
			{#if selectedModal === "Try Disable 2fa"}
				<Disable2Fa {login} />
			{/if}
		</Modal>
	</div>
{:else}
	<div class="profile-Page">
		<h1>That is * {username} * Profil Bro !</h1>
		<h3>You will get a Cookie if you are a Good Boy</h3>
		<div>
			<img class="profile-pic" src={pictureLink} alt=": 🤖 👨🏻‍🌾 🍪 🤣 :" />
		</div>
		<div>
			<p>Login : {login}</p>
			<p>Name : {username}</p>
			<p>Rank : {rank}</p>
			<p>Title : {title}</p>
			<p>Total Won: {win} - {loose} :Lost</p>
			<p>
				Change username
				<input
					type="text"
					placeholder="new username"
					bind:value={newUserName}
				/>
				<!-- <button on:click={handleChangeName}>Change</button> -->
				<button
					on:click={async () => {
						if (!newUserName.length) {
							indication_username = "Cannot be empty";
						} else if (newUserName.length > 20) {
							indication_username = "20 char Max";
						} else {
							// handleChangeName();
							handleLoggoutModal();
						}
					}}>Change</button
				>
			</p>

			{#if isModalOpen}
			<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
			
				<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
					<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
						<div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
							</svg>
						</div>
						<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
							<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Change username</h3>
							<div class="mt-2">
							<p class="text-sm text-gray-500">Are you sure to change this username? Once you change, you can stil change again. Don't worry, all your histories remain.</p>
							</div>
						</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button id="leaveGameButton" on:click={handleChangeName} type="button" class="inline-flex w-full justify-center rounded-md bg-emerald-200 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Change it</button>
						<button on:click={handleCancelLoggoutModal} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
					</div>
					</div>
				</div>
				</div>
			</div>
  			{/if}


			{#if indication_username !== ""}
				<div class="indication">{indication_username}</div>
			{/if}
			<p>
				Change Avatar (.jpg only !)
				<input
					type="text"
					placeholder="avatar img link"
					bind:value={newImg}
				/>
				<!-- <button on:click={handleChangeImage}>Change</button> -->
				<button
					on:click={async () => {
						if (!newImg.length) {
							indication_avatar = "Cannot be empty";
						} else if (newImg.length > 200) {
							indication_avatar = "200 char Max";
						} else {
							handleChangeImage();
						}
					}}>Change</button
				>
				<button
					on:click={async () => {
						if (!newImg.length) {
							indication_avatar = "Cannot be empty";
						} else if (newImg.length > 200) {
							indication_avatar = "200 char Max";
						} else {
							openModal("Try Avatar");
							goto("/Profile");
						}
					}}
				>
					Preview
				</button>
				{#if indication_avatar !== ""}
					<div class="indication">{indication_avatar}</div>
				{/if}
			</p>
			<div>You could try : images/defaultAvatar.jpg</div>
			<div>You could try : images/backgroundImg.jpg</div>
			<div>
				<span> Google Authentificator : </span>
				{#if Google2fa === true}
					<span>
						<button
							on:click={() => {
								openModal("Try Disable 2fa");
								goto("/Profile");
							}}
						>
							Disable
						</button>
					</span>
				{:else}
					<span>
						<button
							on:click={() => {
								openModal("Try Enable 2fa");
								goto("/Profile");
							}}
						>
							Enable
						</button>
					</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.indication {
		color: crimson;
	}
	input {
		border-color: black;
		border-width: 1px;
	}
	button {
		color: rgb(239, 36, 36);
		border-width: 1px;
		border-radius: 25%;
		border-color: rgb(52, 16, 16);
		margin-left: 2px;
		margin-right: 2px;
	}
	.profile-Page {
		/* height: 2500px;
		width: 2500px; */
		align-items: center;
		color:  rgb(244, 237, 237);
		margin-left: 300px;
	}
	.profile-pic {
		max-width: 50%;
		max-height: 50%;
		border-radius: 50%;
		align-items: center;
		/* position: relative; */
		border-color: rgb(111, 151, 142);
		border-width: 2px;
		/* margin: 0 auto; */
	}
	/* img {
		align-items: center;
		position: relative;
		border-color: rgb(111, 151, 142);
		border-width: 2px;
		margin: 0 auto;
	} */
	p {
		margin-top: 2px;
		color: rgb(77, 60, 60);
		margin-left: 0px;
	
		
	}

	/* .box {
		width: 1000px;
		height: 1000;
		border: 1px solid #aaa;
		border-radius: 30px;
		box-shadow: 20px 300px 100px rgba(255, 5, 5, 0.1);
		padding: 3em;
		margin: 0 0 1em 0;
		margin: 0 auto; 
        position: fixed;
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
	} */

	h1 {
		align-items: center;
		color: rgb(237, 228, 228);
		
	}

	h3 {
		align-items: center;
		color: rgb(201, 202, 195);
	}
</style>