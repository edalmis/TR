<script lang="ts">
	import { goto } from "$app/navigation";
	import { closeModal } from "$lib/store/ModalValues";
	import {
		dataGame,
		iAmInvited,
		inviteNotif,
		inviteNotifModal,
		session,
		winnerScore,
		rightPlayerUsername,
		leftPlayerUsername,
		backgroundColor,
		paddleSize,
		isInvitationStillOn,
	} from "$lib/store/store";
	import { onDestroy } from "svelte";

	let wsClient: any;
	session.subscribe((a: any) => {
		wsClient = a;
	});
	let gameData: any;
	dataGame.subscribe((a) => {
		gameData = a;
	});

	let isInvitOn: boolean;

	function handleAccept() {
		inviteNotif.set(false);
		inviteNotifModal.set(false);
		iAmInvited.set(true);
		isInvitationStillOn.subscribe((a) => {
			isInvitOn = a;
		});
		if (isInvitOn) {
			// InvitedUserLogin.set(gameData.login);
			winnerScore.set(gameData.scoreToWin);
			rightPlayerUsername.set(gameData.loginToInvite);
			leftPlayerUsername.set(gameData.login);
			backgroundColor.set(gameData.colorMode);
			paddleSize.set(gameData.paddleSize);
			closeModal();
			goto("/game/create");
		} else {
			alert("Your Opponent Canceled the Game");
			iAmInvited.set(false);
			closeModal();
		}
	}

	function handleRefuse() {
		isInvitationStillOn.subscribe((a) => {
			isInvitOn = a;
		});
		if (isInvitOn) {
			wsClient.emit("refuseGameInvitation", gameData);
			// console.log(" [GameInvitaion -- handleRefuse] data:", data);
		}
		inviteNotif.set(false);
		inviteNotifModal.set(false);
		iAmInvited.set(false);
		closeModal();
		// goto("/game");
	}

	onDestroy(() => {
		inviteNotif.set(false);
		inviteNotifModal.set(false);
		closeModal();
	});
</script>

<button
	class="accept"
	on:click={() => {
		handleAccept();
	}}>Accept</button
>
<button
	class="refuse"
	on:click={() => {
		handleRefuse();
	}}>Refuse</button
>

<style>
	.accept {
		color: blue;
		border-width: 1px;
		border-radius: 25%;
		border-color: blue;
		margin-left: 2px;
		margin-right: 2px;
	}
	.refuse {
		color: rgb(159, 11, 11);
		border-width: 1px;
		border-radius: 25%;
		border-color: blue;
		margin-left: 2px;
		margin-right: 2px;
	}
</style>
