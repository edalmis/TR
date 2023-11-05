<script lang="ts">
	import { onMount } from "svelte";
	import { session, user } from "$lib/store/store";
	import { browser } from "$app/environment";
	import EmojiPicker from "svelte-emoji-picker";

	let isPageFocused = true;
	let rooms: Array<any> = [];
	let roomSelected: number = -1;
	// let messages: Array<{message: string, sendBy: number}> = [];
	let messages: any = [];

	let chatMessage: string = "";
	let showEmojiPicker: boolean = false;
	let usersIBlockedList: string[] = [];
	let usersid42IBlockedList: number[] = [];
	let usersWhoBlockedMeList: string[] = [];
	let usersid42IBlockedByList: number[] = [];
	let usersIBlockedEmptyArray: boolean = false;
	let usersWhoBlockedMeEmptyArray: boolean = false;
	let blockedUsername: boolean = false;
	// let messageListContainer: HTMLElement | null = null;
	let messageListContainer: any = null;

	interface Emoji {
		unicode: string;
		// other properties...
	}

	function addEmoji({ unicode }: Emoji) {
		chatMessage += unicode;
		showEmojiPicker = false;
	}

	function askNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission !== "granted") {
				throw new Error("Permission not granted for Notification");
			}
		});
	}

	function showNotification(message: string) {
		new Notification("New Message", { body: message });
	}

	function scrollToBottom() {
		messageListContainer.scrollTop = messageListContainer.scrollHeight;
	}

	onMount(() => {
		askNotificationPermission();

		if (!browser || !$session) return;
		const fetchData = async () => {
			// Your async code here

			// Users I Blocked List----------------------------------------------
			const jwt = localStorage.getItem("jwt");
			const blockedUsersListResponse = await fetch(
				`http://localhost:3000/user/blockUserList`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (blockedUsersListResponse.ok) {
				usersIBlockedList = await blockedUsersListResponse.json();
				if (usersIBlockedList.length === 0) {
					usersIBlockedEmptyArray = true;
				}
				console.log("usersIblockedList: ", usersIBlockedList);
			}

			//--------------------------------------------------------
			const blockedUsersid42ListResponse = await fetch(
				`http://localhost:3000/user/blockUserid42List`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (blockedUsersid42ListResponse.ok) {
				usersid42IBlockedList =
					await blockedUsersid42ListResponse.json();
				// if (usersid42IBlockedList.length === 0) {
				// 	usersIBlockedEmptyArray = true;
				// }
				console.log("usersid42IblockedList: ", usersid42IBlockedList);
			}
			//----------------------
			const blockedByUsersid42ListResponse = await fetch(
				`http://localhost:3000/user/blockedByUserid4List`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (blockedByUsersid42ListResponse.ok) {
				usersid42IBlockedByList =
					await blockedByUsersid42ListResponse.json();
				// if (usersid42IBlockedList.length === 0) {
				// 	usersIBlockedEmptyArray = true;
				// }
				console.log(
					"usersid42IblockedBYList: ",
					usersid42IBlockedByList
				);
			}

			// getUsersWhoBlockedMeListId42

			// Users Who Blocked Me
			const usersWhoBlockedMeListResponse = await fetch(
				`http://localhost:3000/user/blockedByList`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (usersWhoBlockedMeListResponse.ok) {
				usersWhoBlockedMeList =
					await usersWhoBlockedMeListResponse.json();
				if (usersWhoBlockedMeList.length === 0) {
					usersWhoBlockedMeEmptyArray = true;
				}
				console.log("usersWhoBlockedMeList: ", usersWhoBlockedMeList);
			}
		};
		fetchData();
		//----------------------------------------------------------------------
		$session.emit("getDmRooms");

		$session.on("repDmRooms", (data: any) => {
			rooms = data.rooms;
			console.log("repDmRooms:", rooms);
		});

		// $session.on('repMessagesInDmRooms', (data) => {
		//     console.log('repMessagesInDmRooms:', data.messages);
		//     messages = data.messages;
		// });
		//         $session.on('repMessagesInDmRooms', (data) => {
		//     messages = data.messages.filter(msg => {
		//         // Don't show messages sent by blocked users
		//         if (usersid42IBlockedList.includes(msg.sendBy)) return false;

		//         // Don't show messages sent to users who blocked me
		//         if (usersid42IBlockedByList.includes(msg.sendBy)) return false;

		//         // If none of the above, display the message
		//         return true;
		//     });
		//     scrollToBottom();
		//     console.log('repMessagesInDmRooms:', messages);
		// });
		// $session.on('repMessagesInDmRooms', (data) => {
		//     messages = data.messages.filter(msg => {
		//         // Don't show messages sent by blocked users
		//         if (usersid42IBlockedList.includes(msg.sendBy)) return false;
		//         // Don't show messages sent to users who blocked me
		//         if (usersid42IBlockedByList.includes(msg.sendBy)) return false;
		//         // If none of the above, display the message
		//         return true;
		//     });
		//     scrollToBottom();
		//     console.log('repMessagesInDmRooms:', messages);
		// });

		$session.on("repMessagesInDmRooms", (data: any) => {
			messages = data.messages;
			scrollToBottom();
			console.log("repMessagesInDmRooms:", messages);
		});

		// $session.on('newMessage', (data) => {
		//     messages = [...messages, data];
		//     if (!isPageFocused) {
		//         showNotification(data.message);
		//     }
		// });

		//         $session.on('newMessage', (data) => {
		//     if (!usersid42IBlockedList.includes(data.sendBy) && !usersid42IBlockedByList.includes(data.sendBy)) {
		//         messages = [...messages, data];
		//         if (!isPageFocused) {
		//             showNotification(data.message);
		//         }
		//     }
		//     scrollToBottom();

		// });

		// $session.on('newMessage', (data) => {
		//     if (!usersid42IBlockedList.includes(data.sendBy) && !usersid42IBlockedByList.includes(data.sendBy)) {
		//         messages = [...messages, data];
		//         if (!isPageFocused) {
		//             showNotification(data.message);
		//         }
		//     }
		//     scrollToBottom();
		// });
		$session.on("newMessage", (data) => {
			messages = [...messages, data.messages];
			if (!isPageFocused) {
				showNotification(data.message);
			}
			scrollToBottom();
		});

		return () => {
			$session.off("repDmRooms");
			$session.off("repMessagesInDmRooms");
			$session.off("newMessage");
		};
	});
	function handleClick(use: number) {
		console.log("use----------", use);
		if (
			!(blockedUsername = usersid42IBlockedList.some(
				(blockedUser) => blockedUser == use
			))
		)
			blockedUsername = usersid42IBlockedByList.some(
				(blockedBy) => blockedBy == use
			);

		console.log("blockedusername--", blockedUsername);
		if (blockedUsername) {
			alert("Sending direct message blocked!");
		} else {
			$session.emit("sendMessage", {
				message: chatMessage,
				sendBy: $user.id,
				sendTo: use,
			});
			chatMessage = "";
			showEmojiPicker = false;
		}
	}
	function handleKeyPress(event: any) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleClick(
				rooms[roomSelected].userOne.id == $user.id
					? rooms[roomSelected].userTwo.id
					: rooms[roomSelected].userOne.id
			);
		}
	}
</script>

<svelte:window
	on:focus={() => (isPageFocused = true)}
	on:blur={() => (isPageFocused = false)}
/>

<!-- Your HTML and CSS code remain as before... -->

<!-- <svelte:head> -->

<!-- <link rel='stylesheet' href='https://unpkg.com/svelte-emoji-picker/dist/index.css'> -->
<!-- <link rel='stylesheet' href='/global.css'>
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/svelte-emoji-picker/dist/index.css'> -->
<!-- 
</svelte:head> -->

<div class="w-full h-full flex">
	<div class="room-list">
		{#each rooms as room, i}
			<div
				class="room"
				on:click={() => {
					$session.emit("getMessagesInDmRoom", room.id);
					roomSelected = i;
				}}
			>
				<div class="room-name">
					{room.userOne.userName == $user.userName
						? room.userTwo.userName
						: room.userOne.userName}
				</div>
			</div>
		{/each}
	</div>

	{#if roomSelected !== -1}
		<div class="direct-chat">
			<div
				class="message-list overflow-y-scroll"
				bind:this={messageListContainer}
			>
				<!-- {#each messages as msg} -->
				<!-- //----------------------------------------------------------------------- -->

				<!-- <div class="relative w-full h-40 p-2">
                    <div class="message {msg.sendBy == $user.id ? 'right-0' : 'left-0'}">{msg.message}</div>
                </div> -->
				<!-- //----------------------------------------------------------------------- -->
				<!-- <div class="relative w-full h-40 p-2">
                    <div class="message {msg.sendBy == $user.id ? 'right-0' : 'left-0'}">
                        <strong>"|"{msg.senderLogin}"|"</strong><br>
                        {msg.message}<br>
                        <small>{msg.date}</small>
                    </div>
                </div>
            {/each} -->
				{#each messages.filter((msg) => !usersIBlockedList.includes(msg.senderLogin) && !usersWhoBlockedMeList.includes(msg.senderLogin)) as msg}
					<div class="relative w-full h-40 p-2">
						<div
							class="message {msg.sendBy == $user.id
								? 'right-0'
								: 'left-0'}"
						>
							<strong>|{msg.senderLogin}|</strong>
							<strong style="margin-right: 1rem;">:</strong>
							<br />{msg.message}<br />
							<strong style="margin-right: 1rem;" />
							<small>[{msg.date}]</small>
						</div>
					</div>
				{/each}
			</div>
			<div class="chat-wrapper">
				<textarea
					class="w-full h-full"
					bind:value={chatMessage}
					on:keydown={handleKeyPress}
				/>
				<button
					class="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-blue-400"
					on:click={() =>
						handleClick(
							rooms[roomSelected].userOne.id == $user.id
								? rooms[roomSelected].userTwo.id
								: rooms[roomSelected].userOne.id
						)}>send</button
				>
				<button
					class="absolute right-20 top-1/2 -translate-y-1/2 p-3 bg-yellow-400"
					on:click={() => (showEmojiPicker = !showEmojiPicker)}
				>
					😀
				</button>
				{#if showEmojiPicker}
					<div
						class="absolute bottom-20 border border-solid border-white right-20"
					>
						<EmojiPicker {addEmoji} />
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	/* Your existing CSS and maybe some modifications to accommodate the new UI elements... */
	.room-list {
		display: flex;
		flex-direction: column;
		width: 25%;
		height: 100%;
		background-color: #a9abc2;
		border: 1px solid #181313;
		user-select: none;
	}

	.direct-chat {
		display: flex;
		flex-direction: column;
		width: 75%;
		height: 100%;
		background-color: #48bb78;
	}
	.message {
		/* ... your existing styles ... */
		/* color: aqua; */
		padding: 1rem; /* Increased padding */
	}

	.message strong {
		display: block;
		font-size: 0.8rem;
		color: #0f0f13;
	}

	.message small {
		display: block;
		font-size: 0.6rem;
		color: #79072d;
		margin-top: 0.5rem;
	}

	.message-list {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		width: 100%;
		height: 80%;
		background-color: #a9abc2;
		gap: 1rem;
	}

	.message {
		background-color: red;
		border: 1px solid white;
		padding: 0.75rem;
		font-size: 0.75rem;
		position: absolute;
		top: 0;
		height: 100%;
		max-width: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: pre-wrap; /* Add this line */
	}

	.chat-wrapper {
		position: relative;
		font-size: 1.125rem;
		background-color: #fefcbf;
		height: 20%;
	}

	.room {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		height: 6rem;
		background-color: #a9abc2;
		border: 1px solid #181313;
		cursor: pointer;
		transition: brightness 0.2s;
	}

	.room:hover {
		brightness: 0.9;
	}
	.room:hover {
		background-color: red;
		color: white;
	}
</style>