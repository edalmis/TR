<script lang="ts">
	import { goto } from "$app/navigation";
	import InviteToPlayButton from "$lib/game/InviteToPlayButton.svelte";
	import { closeModal } from "$lib/store/ModalValues";
	import {
		InvitedUserId,
		InvitedUserLogin,
		session,
		userId,
	} from "$lib/store/store";
	import { onDestroy, onMount } from "svelte";

	export let username: string;

	let login: string;
	let id: number;
	let pictureLink: string;
	let rank: string;
	let title: string;
	let win: number;
	let loose: number;

	let isFriend: boolean;
	let isPending: boolean;
	let isRequested: boolean;
	let hasBlocked: boolean;
	let isBlockedBy: boolean;

	let games: any = [];
	// = [
	// 	{
	// 		player1: "Bob",
	// 		player2: "John",
	// 		player1Score: 3,
	// 		player2Score: 2,
	// 	},
	// 	{
	// 		player1: "Donald",
	// 		player2: "Bob",
	// 		player1Score: 3,
	// 		player2Score: 2,
	// 	},
	// ];

	let socket: any;
	session.subscribe((a: any) => {
		socket = a;
	});
	let myId: number;
	userId.subscribe((a: number) => {
		myId = a;
	});

	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
			} else {
				console.log("-[ OtherProfile ]-  - username: ", username);
				const url = `http://localhost:3000/user/profileOther?username=${username}`;
				const response = await fetch(url, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				});
				if (response.ok) {
					const user = await response.json(); // Convertit la réponse JSON en objet JavaScript
					console.log(" -[ Profile Other ]- User: ", user);
					login = user.login;
					id = user.id;
					pictureLink = user.avatar;
					username = user.username;
					rank = user.rank;
					title = user.title;
					win = user.win;
					loose = user.loose;

					isFriend = user.isMyFriend;
					isPending = user.isInPending;
					isRequested = user.isInSentRequest;
					hasBlocked = user.isInBlockList;
					isBlockedBy = user.isInBlockedByList;

					InvitedUserLogin.set(user.login);
					InvitedUserId.set(user.id);
				}

				// Get Match History
				const url_History = `http://localhost:3000/user/getMatchHistory`;
				const response_history = await fetch(url_History, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				});
				if (response_history.ok) {
					games = await response_history.json();
					console.log("-[ Game History ]- Response: [Games]", games);
				}
			}
		} catch (e) {}
	});

	onDestroy(() => {
		closeModal();
	});

	async function handleSendFriendRequest() {
		socket.emit("SendFriendRequest", {
			username: username,
			myId: $userId,
		});
		closeModal();
	}

	// async function handleSendFriendRequest() {
	// 	const jwt = localStorage.getItem("jwt");
	// 	const data = { username: username };
	// 	const response = await fetch(
	// 		"http://localhost:3000/user/sendFriendRequest",
	// 		{
	// 			method: "POST",
	// 			headers: {
	// 				Authorization: `Bearer ${jwt}`,
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({ data }),
	// 		}
	// 	);
	// 	if (response.ok) {
	// 		console.log(
	// 			"response { OK } du [ SendFriendRequest ] : ",
	// 			response.ok
	// 		);
	// 		socket.emit("SendFriendRequest", {
	// 			username: username,
	// 			myId: $userId,
	// 		});
	// 	} else {
	// 		console.log("response { NOT OK } du [ Add Friend ]");
	// 	}
	// 	closeModal();

	// 	// goto("/");
	// }

	async function handleAcceptFriend() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Add Friend ]- username sent: ", username);
		const response = await fetch("http://localhost:3000/user/addFriend", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			// console.log("response { OK } du [ Add Friend ]");
			socket.emit("acceptOrRefuseFriendRequest", {
				username: username,
				myId: id,
			});
			socket.emit("updateFriendList", { username: username, myId: id });
		} else {
			console.log("response { NOT OK } du [ Add Friend ]");
		}

		closeModal();
	}

	async function handleRefuseFriendRequest() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		const response = await fetch(
			"http://localhost:3000/user/refuseFriendRequest",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data }),
			}
		);
		if (response.ok) {
			// console.log("response { OK } du [ Add Friend ]");
			socket.emit("acceptOrRefuseFriendRequest", {
				username: username,
				myId: id,
			});
		} else {
			console.log("response { NOT OK } du [ Add Friend ]");
		}

		closeModal();
	}

	async function handleRemoveFriend() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const response = await fetch(
			"http://localhost:3000/user/removeFriend",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data }),
			}
		);
		if (response.ok) {
			// console.log("response { OK } du [ Remove Friend ]");
			socket.emit("updateFriendList", { username: username, myId: id });
		} else {
			console.log("response { NOT OK } du [ Remove Friend ]");
		}

		closeModal();
		// goto("/");
	}

	async function handleBlockUser() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const response = await fetch("http://localhost:3000/user/blockUser", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			console.log("response { OK } du [ Block User ]");
		} else {
			console.log("response { NOT OK } du [ Block User ]");
		}
		closeModal();
		goto("/");
	}

	async function handleUnblockUser() {
		const jwt = localStorage.getItem("jwt");
		const data = { username: username };
		//console.log("-[ Remove Friend ]- username sent: ", username);
		const response = await fetch("http://localhost:3000/user/unblockUser", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		});
		if (response.ok) {
			console.log("response { OK } du [ Unblock User ]");
		} else {
			console.log("response { NOT OK } du [ Unblock User ]");
		}
		closeModal();
		goto("/");
	}
</script>

<div class="profile-Page">
	<h1>That is * {username} * Profile Bro !</h1>
	<div>
		<img
			class="profile-pic"
			src={pictureLink}
			alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"
		/>
	</div>
	<div>
		<p>Login : {login}</p>
		<p>Name : {username}</p>
		<p>Total Won: {win} - {loose} :Lost</p>
		<p>Rank : {rank}</p>
		<p>Title: {title}</p>
	</div>
	{#if isFriend === true}
		<button
			on:click={() => {
				handleRemoveFriend();
			}}>undo Friendship</button
		>
	{:else if isPending === true}
		<button
			on:click={() => {
				handleAcceptFriend();
			}}>accept Friend</button
		>
		<button
			on:click={() => {
				handleRefuseFriendRequest();
			}}>Refuse Friendship</button
		>
	{:else if isRequested === false}
		<button
			on:click={() => {
				handleSendFriendRequest();
			}}>Send friend Request</button
		>
	{/if}
</div>
<div>
	{#if isBlockedBy === true}
		<p>You have been blocked By {username} !</p>
	{/if}
</div>
<div>
	{#if hasBlocked === true}
		<button
			on:click={() => {
				handleUnblockUser();
			}}>Unblock</button
		>
	{:else if hasBlocked === false}
		<button
			on:click={() => {
				handleBlockUser();
			}}>Block</button
		>
	{/if}
</div>
<InviteToPlayButton />
<div>
	<h1>Game History</h1>
	{#if games.length > 0}
		{#each games as game, i}
			<p>
				{game.player1}
				{game.scorePlayer1} vs {game.scorePlayer2}
				{game.player2}
			</p>
		{/each}
	{:else}
		<p>Aucune partie trouvée.</p>
	{/if}
</div>

<!-- Faire affichage de differents buttons en fonction du friend status -> sendFriendRequest,
Unfriend -->

<style>
	button {
		color: red;
		border-width: 1px;
		border-radius: 25%;
		border-color: red;
		margin-left: 2px;
		margin-right: 2px;
	}
	.profile-Page {
		/* height: 2500px;
		width: 2500px; */
		align-items: center;
	}
	.profile-pic {
		max-width: 20%;
		max-height: 20%;
		border-radius: 50%;
	}
	img {
		align-items: center;
		position: relative;
		border-color: black;
		border-width: 2px;
	}
	p {
		margin-top: 2px;
	}
	h1 {
		align-items: center;
		color: black;
	}
</style>
