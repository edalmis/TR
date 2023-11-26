<script lang="ts">
	import "../app.css";
	import Navigation from "$lib/nav/Navigation.svelte";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { io } from "socket.io-client";
	import Modal from "$lib/modals/Modal.svelte";
	import GoogleAuth from "$lib/auth/GoogleAuth.svelte";
	import LoginFortyTwo from "$lib/Login/LoginFortyTwo.svelte";
	import GameInvitation from "$lib/game/GameInvitation.svelte";
	import GameNavbar from "$lib/game/GameNavbar.svelte";
	import {
		dataGame,
		inviteNotif,
		inviteNotifModal,
		launchedGame,
		session,
		user,
		navbar,
		isItARefreshement,
		isInvitationStillOn,
		iAmInvited,
		authentificated,
		isGoogleAuthActivated,
		qrGoogle,
		userLogin,
		userId,
		actualUsername,
	} from "$lib/store/store";

	let auth: boolean = false;
	authentificated.subscribe((a) => {
		auth = a;
	});

	let ImgQrCode: string = "";
	qrGoogle.subscribe((a) => {
		ImgQrCode = a;
	});

	let googleActivated = false;
	isGoogleAuthActivated.subscribe((a) => {
		googleActivated = a;
	});

	let ModalInviteNotif: boolean = false;
	inviteNotifModal.subscribe((a) => {
		ModalInviteNotif = a;
	});

	let nav: boolean = false;
	navbar.subscribe((a) => {
		nav = a;
	});

	let login: any;

	/// // // // // // // // // // // // // // ///
	// // // // // [  Functions  ] // // // // //
	function connectSocket(id: number) {
		// console.log(" -[ Layout ]- Ws Connection ( 3002 ) ...");
		const socket = io("http://localhost:3002", {
			withCredentials: true,
			extraHeaders: {
				Accept: "abcd",
			},
			query: {
				id: id,
			},
		});
		$session = socket;
		session.set(socket);
		isItARefreshement.set(false);

		socket.on("receivedGameInvitation", (data) => {
			// console.log("[ Layout socket.on(receivedGameInvitation) ] data: ",data);
			launchedGame.set(true);
			inviteNotif.set(true);
			dataGame.set(data);
			isInvitationStillOn.set(true);
		});

		socket.on("updateInvitation", () => {
			inviteNotif.set(false);
			isInvitationStillOn.set(false);
			iAmInvited.set(false);
		});
	}

	async function getUserInfo(jwt: string): Promise<number> {
		try {
			const response = await fetch("http://localhost:3000/user/profile", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const moi = await response.json(); // Convertit la réponse JSON en objet JavaScript
				user.set(moi);
				userLogin.set(moi.login);
				userId.set(moi.id);
				actualUsername.set(moi.userName);

				// console.log("2fa Value from user: [ ", user.fa2, " ]");
				return moi.id;
			} else {
				localStorage.clear();
				authentificated.set(false);
				goto("/");
				return -1;
			}
		} catch (e) {
			// console.log("err");
			return -1;
		}
	}

	if (auth === false) {
		//  *- [ Authentification ] -* { Local Storage }  via  URL
		onMount(async () => {
			// [ 1 ] Check si un Jwt est deja present Dans le LocalStorage du Browser
			const token = localStorage.getItem("jwt");
			if (token) {
				// console.log("On a bien un JWT present dans le localStorage !");
				try {
					// [ 1 - 1 ] Verification validite du Jwt aupres du Backend
					const jwt_verifier_url =
						"http://localhost:3000/auth/verifier_jwt";
					const response = await fetch(jwt_verifier_url, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({}),
					});

					// [ 1 - 2 ] Authorisation Acces si reponse Positive du Back !
					if (response.ok) {
						// console.log("reponse du Backend ***[ Ok ]*** pour le JWT");
						authentificated.set(true);

						let id = await getUserInfo(token);
						if (id == -1) {
							// console.log(" [ Layout ] GetUserInfos Failed");
							return;
						}
						// Créer une connexion websocket si auth est ok
						connectSocket(id);
						navbar.set(true);
						goto("/");
					}

					// [ 1 - 3 ] Si Jwt non Valide par le Back, effacement
					else {
						// console.log("reponse du Backend ***[ BAD ]*** pour le JWT");
						authentificated.set(false);
						localStorage.clear();
						goto("/");
					}
				} catch (e) {}
			}

			// [ 2 ] Si Aucun Jwt dans localStorage du Browser Verification si Jwt present Dans Url
			else {
				// console.log("Pas de Jwt dans le Local storage");
				// [ 2 - 1 ] Recupere Parametre l'UrL
				const queryString = window.location.search;
				const urlParams = new URLSearchParams(queryString);
				let jwt: any;

				// [ 2 - 2 ] Recuperation JWT avec 'await' pour résoudre la Promise
				if (urlParams.has("jwt")) {
					const jwtPromise = urlParams.get("jwt");
					jwt = await jwtPromise;
					// console.log("JWT:", jwt);

					// [ 2 - 3 ] Si param 'JwT' Stockez le JWT dans le Local Storage et Donner Acces a Espace User
					if (jwt) {
						// console.log("jwt: ", jwt);
						localStorage.setItem("jwt", jwt);
						authentificated.set(true);

						let id = await getUserInfo(jwt);
						if (id === -1) return;
						// Connexion socket
						// console.log(" -[ Layout - [2-3] ]-  else-> reception jwt Url -> websocket");
						connectSocket(id);
						navbar.set(true);
					}

					// [ 2 - 4 ] Cas ou Jwt Non present dans l'Url
					// else {console.log("Paramètre URL 'jwt' non trouvé.");}

					// [ 2 - 5 ] Redirection Vers Le Home afin de relancer Verification
					goto("/");
				}

				if (urlParams.has("login")) {
					const loginPromise = urlParams.get("login");
					login = await loginPromise;
					userLogin.set(login);
					// console.log("-[ Verif QR Layout ]-   login: ", login);
					const response = await fetch(
						`http://localhost:3000/auth/get_google_2fa/?login=${login}&qr=google`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						}
					);

					if (response.ok) {
						// console.log("-[ Layout Get QR ]- OK");
						let res = await response.json();
						//console.log("-[ Enable 2fa ]-Response: ", res);
						isGoogleAuthActivated.set(true);
						qrGoogle.set(res.url);
						//console.log("-[ Enable 2fa]- qrSource: ", QrSource);
					}
					else {
					goto("/");
					}
					// else {console.log("-[ Layout Get QR ]-  PROBLEME pas OK");}
				}
			}
		});
	}
</script>

<div class="w-full h-full">
	{#if !auth}
		<main class="w-full h-full">
			{#if googleActivated}
				<Modal>
					<GoogleAuth {login} QrCode={ImgQrCode} />
				</Modal>
			{:else}
				<LoginFortyTwo />
			{/if}
		</main>
	{:else}
		{#if ModalInviteNotif}
			<Modal>
				<GameInvitation />
			</Modal>
		{/if}

		{#if nav}
			<header class="h-24 w-full bg-red-500">
				<Navigation />
			</header>
		{:else}
			<header class="h-24 w-full bg-red-500">
				<GameNavbar />
			</header>
		{/if}
		<slot />
	{/if}
</div>
