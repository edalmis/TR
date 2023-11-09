<script lang="ts">
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";

	// Imports -[ MODALS ]- ///////////////////////////
	import Modal from "$lib/modals/Modal.svelte";
	import { openModal, selectedPage } from "$lib/store/ModalValues";
	import { closeModal } from "$lib/store/ModalValues";
	import { showModal } from "$lib/store/ModalValues";
	import { authentificated, session, user, userId } from "$lib/store/store";
	import OtherProfile from "$lib/OtherProfile/OtherProfile.svelte";
	// import ImgPreviewProfile from "$lib/Profile/ImgPreviewProfile.svelte";

	let userLoginTime: any = new Date().getTime();

	// Function to calculate the time difference
	function calculateTimeDifference() {
		const currentTime: any = new Date().getTime();
		const timeDifference = Math.floor(
			(currentTime - userLoginTime) / (1000 * 60 * 60)
		); // Difference in hours
		return timeDifference;
	}
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	let selectedModal: string;
	selectedPage.subscribe((b: string) => {
		selectedModal = b;
	});

	let messagedUsers = new Set(
		JSON.parse(sessionStorage.getItem("messagedUsers") || "[]")
	);
	let id: number;
	id = $user.id;
	userId.subscribe((a: number) => {
		id = a;
	});
	///////////////////////////////////////////////////

	let socket: any;
	session.subscribe((a: any) => {
		socket = a;
	});

	// [ Online Users ]
	let myId: number = 0;
	let onlineUsersDatas: any[] = [];
	let onlineUserDatasEmptyArray: boolean = true;

	// [ Friends List ]
	let friendsListDatas: any[] = [];
	let friendsListDatasEmptyArray: boolean = false;

	// [ Online Friends List ]
	// let onlineUsers: string[] = [];
	// let friendsList: string[] = [];
	let onlineFriendsList: any[] = [];
	let onlineFriendsEmptyArray: boolean = false;

	// // [ Online Friends ]
	// let onlineFriendsListDatas: any[] = [];
	// let onlineFriendsListDatasEmptyArray: boolean = false;

	// [ InGame Friends ]
	let inGameUsersList: any[] = [];
	let inGameUsersEmptyArray: boolean = false;
	let inGameFriendsList: any[] = [];
	let inGameFriendsEmptyArray: boolean = false;

	// [ Pending List ]
	let pendingList: any[] = [];
	let pendingListEmptyArray: boolean = false;

	// [ Sent Requests List ]
	let sentRequestsList: any[] = [];
	let sentRequestListEmptyArray: boolean = false;

	// [ Block System ]
	let usersIBlockedList: any[] = [];
	let usersIBlockedEmptyArray: boolean = false;
	let usersWhoBlockedMeList: any[] = [];
	let usersWhoBlockedMeEmptyArray: boolean = false;

	//let users: string[] = ["Henry", "john", "boby"];
	let userToDisplay: string;
	// let onlineUserEmptyArray: boolean = false;
	// let friendsListEmptyArray: boolean = false;
	let pictureLink: string;

	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				goto("/");
				return;
			} else {
				// [ OnlineUsers ]
				socket.on("onlineUsersDatas", (datas: any) => {
					onlineUsersDatas = datas;
					console.log(" -[ OnlineUsersDatas ]- : ", onlineUsersDatas);
					userId.subscribe((a: number) => {
						myId = a;
					});
					if (onlineUsersDatas.length >= 2) {
						onlineUserDatasEmptyArray = false;
					} else {
						onlineUserDatasEmptyArray = true;
					}
				});

				socket.on("onlineUsersUpdate", (usersDatas: any[]) => {
					if (usersDatas.length >= 2) {
						onlineUserDatasEmptyArray = false;
					} else {
						onlineUserDatasEmptyArray = true;
					}
					console.log(
						' -[ socket.on("onlineUsersUpdate" ]- : ',
						usersDatas
					);
					onlineUsersDatas = usersDatas;

					onlineFriendsList = onlineUsersDatas.filter((user) => {
						return friendsListDatas.some(
							(friend) => friend.id === user.id
						);
					});
					// onlineFriendsList = friendsList.filter((friend) =>
					// 	onlineUsers.includes(friend)
					// );
					console.log(onlineFriendsList);
					if (onlineFriendsList.length === 0) {
						onlineFriendsEmptyArray = true;
					} else {
						onlineFriendsEmptyArray = false;
					}
				});
				socket.on("friendListUpdate", (newFriendsList: any[]) => {
					friendsListDatasEmptyArray =
						newFriendsList.length === 0 ? true : false;
					console.log(
						' -[ socket.on("friendListUpdate" ]- : ',
						newFriendsList
					);
					friendsListDatas = newFriendsList;
					onlineFriendsList = onlineUsersDatas.filter((user) => {
						return friendsListDatas.some(
							(friend) => friend.id === user.id
						);
					});
					// onlineFriendsList = friendsList.filter((friend) =>
					// 	onlineUsers.includes(friend)
					// );
					console.log(onlineFriendsList);
					if (onlineFriendsList.length === 0) {
						onlineFriendsEmptyArray = true;
					} else {
						onlineFriendsEmptyArray = false;
					}
				});
				socket.on("pendingListUpdate", (newPendingList: any[]) => {
					if (newPendingList.length === 0) {
						pendingListEmptyArray = true;
					} else {
						pendingListEmptyArray = false;
					}
					pendingList = newPendingList;
					console.log(
						" -[ io.on - pendingListUpdate ]- Liste : ",
						pendingList
					);
				});
				socket.on(
					"sentRequestsListUpdate",
					(newSentRequestsList: any[]) => {
						if (newSentRequestsList.length === 0) {
							sentRequestListEmptyArray = true;
						} else {
							sentRequestListEmptyArray = false;
						}
						sentRequestsList = newSentRequestsList;
						console.log(
							" -[ io.on - sentRequestUpdate ]- Liste : ",
							sentRequestsList
						);
					}
				);
				socket.on("inGameFriendUpdate", (inGameUsersList: any[]) => {
					inGameFriendsList = friendsListDatas.filter((friend) => {
						return inGameUsersList.some(
							(user) => friend.id === user.id
						);
					});
					if (inGameFriendsList.length === 0) {
						inGameFriendsEmptyArray = true;
					} else {
						inGameFriendsEmptyArray = false;
					}
					console.log(
						" -[ io.on - inGameFriendUpdate ]- Liste : ",
						inGameFriendsList
					);
				});

				// [ OnlineUsersDatas ]
				socket.emit("getOnlineUsersDatas");

				// const onlineUsers_url =
				// 	"http://localhost:3000/auth/onlineUsers";
				// const onlineUserResponse = await fetch(onlineUsers_url, {
				// 	// const onlineUserResponse = await fetchData(onlineUsers_url, {
				// 	method: "GET",
				// 	headers: {
				// 		Authorization: `Bearer ${jwt}`,
				// 		"Content-Type": "application/json",
				// 	},
				// });

				// if (onlineUserResponse.ok) {
				// 	// onlineUsers = await onlineUserResponse.json();
				// 	onlineUsers = await onlineUserResponse.json();
				// 	if (onlineUsers.length === 0) {
				// 		onlineUserEmptyArray = true;
				// 	}
				// 	console.log("onlineUsers: ", onlineUsers);
				// }
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
				if (response.ok) {
					const user = await response.json();
					pictureLink = user.avatar;
				}

				// InGame Users
				const inGameUsersListResponse = await fetch(
					`http://localhost:3000/user/inGameUsers`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					}
				);
				if (inGameUsersListResponse.ok) {
					inGameUsersList = await inGameUsersListResponse.json();
					if (inGameUsersList.length === 0) {
						inGameUsersEmptyArray = true;
					}
					console.log("inGameUsersList: ", inGameUsersList);
				}

				// Pending List
				const pendingListResponse = await fetch(
					`http://localhost:3000/user/pendingList`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					}
				);
				if (pendingListResponse.ok) {
					pendingList = await pendingListResponse.json();
					if (pendingList.length === 0) {
						pendingListEmptyArray = true;
					}
					console.log("pendingList: ", pendingList);
				} else {
					localStorage.clear();
					authentificated.set(false);
					goto("/");
				}

				// Friends List
				const friendsListResponse = await fetch(
					`http://localhost:3000/user/friendsList`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					}
				);
				if (friendsListResponse.ok) {
					friendsListDatas = await friendsListResponse.json();
					if (friendsListDatas.length === 0) {
						friendsListDatasEmptyArray = true;
					} else {
						friendsListDatasEmptyArray = false;
					}
					console.log("friendsListDatas: ", friendsListDatas);
				}

				// Sent Requests List
				const sentRequestsListResponse = await fetch(
					`http://localhost:3000/user/sentRequestsList`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"Content-Type": "application/json",
						},
					}
				);
				if (sentRequestsListResponse.ok) {
					sentRequestsList = await sentRequestsListResponse.json();
					if (sentRequestsList.length === 0) {
						sentRequestListEmptyArray = true;
					}
					console.log("sendRequest List: ", sentRequestsList);
				}

				// Users I Blocked List
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
					console.log(
						"usersWhoBlockedMeList: ",
						usersWhoBlockedMeList
					);
				}

				// [ Online Friends ]
				onlineFriendsList = onlineUsersDatas.filter((user) => {
					return friendsListDatas.some(
						(friend) => friend.id === user.id
					);
				});
				// onlineFriendsList = friendsList.filter((friend) =>
				// 	onlineUsers.includes(friend)
				// );
				console.log(onlineFriendsList);
				if (onlineFriendsList.length === 0) {
					onlineFriendsEmptyArray = true;
				}

				// [ InGame Friends ]
				// inGameFriendsList = friendsList.filter((friend) =>
				// 	inGameUsersList.includes(friend)
				// );
				inGameFriendsList = friendsListDatas.filter((friend) => {
					return inGameUsersList.some(
						(user) => friend.id === user.id
					);
				});
				if (inGameFriendsList.length === 0) {
					inGameFriendsEmptyArray = true;
				} else {
					inGameFriendsEmptyArray = false;
				}
			}
		} catch (e) {
			console.log("Friend OnMount PB");
		}
	});

	onDestroy(() => {
		socket.off("onlineUsersDatas");
		socket.off("onlineUsersUpdate");
		socket.off("friendListUpdate");
		socket.off("pendingListUpdate");
		socket.off("sentRequestsListUpdate");
		// socket.off('');
	});

	async function handleSeeProfil(username: string) {
		userToDisplay = username;
		openModal("OtherProfile");
		goto("/Friends");
	}

	async function handleAcceptFriend(username: string) {
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
			await socket.emit("acceptOrRefuseFriendRequest", {
				username: username,
				myId: id,
			});
			await socket.emit("updateFriendList", {
				username: username,
				myId: id,
			});
		} else {
			console.log("response { NOT OK } du [ Add Friend ]");
		}

		closeModal();
	}

	async function handleRefuseFriendRequest(username: string) {
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
			console.log("response { OK } du [ Refuse Friend ] : ", response.ok);
			socket.emit("acceptOrRefuseFriendRequest", {
				username: username,
				myId: id,
			});
		} else {
			console.log("response { NOT OK } du [ Refuse Friend ]");
		}

		closeModal();
	}

	async function handleRemoveFriend(username: string) {
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
			console.log("response { OK } du [ Undo Friend ] ", response.ok);
			socket.emit("updateFriendList", { username: username, myId: id });
		} else {
			console.log("response { NOT OK } du [ Undo Friend ]");
		}

		closeModal();
	}

	// /// /// /// /// // [ D M ] // /// /// /// /// //
	function resetMessagedUsers() {
		sessionStorage.removeItem("messagedUsers");
		alert("Messaged users reset successfully!");
	}

	function handleButtonClick(use: string) {
		// console.log('use-----------', use)
		const isBlockedByMe = usersIBlockedList.includes(use);
		const isBlockedByOthers = usersWhoBlockedMeList.includes(use);

		if (isBlockedByMe || isBlockedByOthers) {
			alert("Sending direct message blocked!");
			return; // Exit the function since the user is blocked
		}

		if (!messagedUsers.has(use)) {
			// Only send the default message if we haven't messaged this user before
			$session.emit("sendMessageN", {
				message: "Hello!",
				sendBy: id,
				sendTo: use,
			});

			// Mark this user as messaged
			// messagedUsers.add(use);
			messagedUsers.add(use);

			// Save to sessionStorage
			sessionStorage.setItem(
				"messagedUsers",
				JSON.stringify([...messagedUsers])
			);
		}

		// Call this regardless of whether it's the first message or not,
		// as it appears to be your intention from the original code
		// handleDM(use);
		goto("/DM");
	}
</script>

<ul role="list" class="divide-y divide-gray-100">
	<h1>Find friends</h1>
	{#if show_Modal}
		<div>
			<Modal>
				{#if selectedModal === "OtherProfile"}
					<OtherProfile
						username={userToDisplay}
						on:closeModal={closeModal}
					/>
				{/if}
			</Modal>
		</div>
	{:else}
		<!-- <button
								on:click={() => {
									$session.emit("sendMessageN", {
										message: chatMessage,
										sendBy: id42,

										sendTo: user,
									});
									chatMessage = "";
									handleDM(user);
								}}>Send Direct message</button
							> -->
		<div>
			<h2>Online Users</h2>
			<li class="flex justify-between" />
			{#if onlineUserDatasEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-500">
							Sorry Bro no one is connected !
						</p>
					</div>
				</li>
			{:else}
				<!--  -->

				{#each onlineUsersDatas as { id, username, avatar }}
					{#if id != myId}
						<li class="flex justify-between gap-x-6 py-5">
							<div class="flex min-w-0 gap-x-4">
								<img
									class="h-12 w-13 flex-none rounded-full bg-gray-50"
									style="margin-left: 20px;"
									src={avatar}
									alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"
								/>
								<div class="min-w-0 flex-auto">
									<p
										class="text-sm font-semibold leading-6 text-gray-900"
									>
										{username}
									</p>
									<p
										class="mt-1 truncate text-xs leading-5 text-gray-500"
									>
										<button
											on:click={() => {
												handleSeeProfil(username);
											}}
											>See Profile
										</button>
									</p>
									<p
										class="mt-1 truncate text-xs leading-5 text-gray-500"
									>
										<button on:click={resetMessagedUsers}
											>Reset DM</button
										>
									</p>
								</div>
								<button
									on:click={() => handleButtonClick(username)}
								>
									Send DM</button
								>
							</div>

							<div class="mt-1 flex items-center gap-x-1.5">
								<div
									class="flex-none rounded-full bg-emerald-500/20 p-1"
								>
									<div
										class="h-2 w-2 rounded-full bg-emerald-500"
									/>
								</div>
								<p
									class="text-xs leading-5 text-gray-500"
									style="margin-right: 130px;"
								>
									Online
								</p>
							</div>
						</li>
					{/if}
				{/each}
			{/if}
			<li class="flex justify-between" />
			<!-- 
						<li>{username}</li>
						<button on:click={() => handleButtonClick(id)}
							>Envoyer ID</button
						>
					{/each} -->

			<!--  -->
			<!-- {#each onlineUsers as user}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-13 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={pictureLink}
								alt=": 🤖 👨🏻‍🌾 Error  🍪 🤣 :"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{user}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(user);
										}}
										>See Profile
									</button>
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button on:click={resetMessagedUsers}
										>Reset DM</button
									>
								</p>
							</div>
							<button on:click={() => handleButtonClick(user)}>
								Send DM</button
							>
						</div>

						<div class="mt-1 flex items-center gap-x-1.5">
							<div
								class="flex-none rounded-full bg-emerald-500/20 p-1"
							>
								<div
									class="h-2 w-2 rounded-full bg-emerald-500"
								/>
							</div>
							<p
								class="text-xs leading-5 text-gray-500"
								style="margin-right: 130px;"
							>
								Online
							</p>
						</div>
					</li>
				{/each}
			{/if}
			<li class="flex justify-between" /> -->

			<h2>Online Friends</h2>
			{#if onlineFriendsEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-500">
							Sorry Bro your friends are not connected. Request
							new Friends !
						</p>
					</div>
				</li>
			{:else}
				<!-- {#each onlineFriendsList as user} -->
				{#each onlineFriendsList as { id, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(username);
										}}
										>See Profile
									</button>
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button on:click={resetMessagedUsers}
										>Reset DM</button
									>
								</p>
							</div>
							<button
								on:click={() => handleButtonClick(username)}
							>
								Send DM</button
							>
						</div>

						<!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
								<p class="mt-1 truncate text-xs leading-5 text-gray-500">
									<button 
										on:click={() => { handleSeeProfil(user);}}>See Profile 
									</button>
								</p>
							</div> -->
						<div class="mt-1 flex items-center gap-x-1.5">
							<div
								class="flex-none rounded-full bg-emerald-500/20 p-1"
							>
								<div
									class="h-2 w-2 rounded-full bg-emerald-500"
								/>
							</div>
							<p
								class="text-xs leading-5 text-gray-500"
								style="margin-right: 130px;"
							>
								Online
							</p>
						</div>
					</li>
				{/each}
			{/if}

			<h2>In Game Friends</h2>
			{#if inGameFriendsEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-500">
							None of your friends is playing. Invite them to play
							!
						</p>
					</div>
				</li>
			{:else}
				{#each inGameFriendsList as { id, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(username);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>
						<!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="mt-1 truncate text-xs leading-5 text-gray-500">
								<button 
									on:click={() => { handleSeeProfil(user);}}>See Profile 
								</button>
							</p>
						</div> -->
						<div class="mt-1 flex items-center gap-x-1.5">
							<div
								class="flex-none rounded-full bg-emerald-500/20 p-1"
							>
								<div
									class="h-1.5 w-1.5 rounded-full bg-emerald-500"
								/>
							</div>
							<p
								class="text-xs leading-5 text-gray-500"
								style="margin-right: 130px;"
							>
								Game-On
							</p>
						</div>
					</li>
				{/each}
			{/if}

			<h2>Friends List</h2>
			<!-- {#if friendsListEmptyArray === true} -->
			{#if friendsListDatasEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-500">
							Sorry Bro, you're a lone wolf! Try to make friends,
							request online users!
						</p>
					</div>
				</li>
			{:else}
				{#each friendsListDatas as { id, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(username);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>
						<!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
								<p class="mt-1 truncate text-xs leading-5 text-gray-500">
									<button 
										on:click={() => {handleSeeProfil(friendUser);}}>See Profile
									</button>
								</p>
							</div> -->

						<div
							class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"
						>
							<p
								class="mt-1 truncate text-xs leading-5 text-gray-500"
								style="margin-right: 130px;"
							>
								<button
									on:click={() => {
										handleRemoveFriend(username);
									}}
									>Undo Friendship
								</button>
							</p>
						</div>
						{#if onlineFriendsEmptyArray === false}
							<div class="mt-1 flex items-center gap-x-1.5">
								<div
									class="flex-none rounded-full bg-emerald-500/20 p-1"
								>
									<div
										class="h-2 w-2 rounded-full bg-emerald-500"
									/>
								</div>
								<p
									class="text-xs leading-5 text-gray-500"
									style="margin-right:130px;"
								>
									Online
								</p>
							</div>
						{:else}
							<div
								class="hidden shrink-0 sm:flex sm:flex-col sm:items-center"
							>
								<!-- <p class="text-sm leading-6 text-gray-900">
										level
										</p> -->
								<p
									class="mt-1 text-xs leading-5 text-gray-500"
									style="margin-right: 130px;"
								>
									Last seen {calculateTimeDifference()}h ago
								</p>
							</div>
						{/if}
					</li>
				{/each}
			{/if}

			<h2>Pending friend Request</h2>
			{#if pendingListEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-500">
							Sorry Bro, no one wants to be your friend !
						</p>
					</div>
				</li>
			{:else}
				<!-- {#each pendingList as pendingUser} -->
				{#each pendingList as { id, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(username);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>

						<!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="mt-1 truncate text-xs leading-5 text-gray-500">
								<button
								on:click={() => {handleSeeProfil(pendingUser);}}>See Profile
								</button>
							</p>
						</div> -->

						<div
							class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"
						>
							<p
								class="mt-1 truncate text-xs leading-5 text-gray-500"
								style="margin-right:500px;"
							>
								<button
									on:click={() => {
										handleAcceptFriend(username);
									}}
									>Accept
								</button>
							</p>
						</div>
						<div
							class="hidden shrink-0 sm:flex sm:flex-col sm:items-end"
						>
							<p
								class="mt-1 truncate text-xs leading-5 text-gray-500"
								style="margin-right:390px;"
							>
								<button
									on:click={() => {
										handleRefuseFriendRequest(username);
									}}
									>Refuse
								</button>
							</p>
						</div>
						<!-- <button
								on:click={() => {
									handleSeeProfil(pendingUser);
								}}>See Profile</button>
							<button
								on:click={() => {
									handleAcceptFriend(pendingUser);
								}}>Accept</button>
							<button
								on:click={() => {
									handleRefuseFriendRequest(pendingUser);
								}}>Refuse</button> -->
					</li>
				{/each}
			{/if}

			<h2>Friend Requests sent</h2>
			{#if sentRequestListEmptyArray === true}
				<!-- <h2>Waiting an answer from</h2> -->
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-500">
							Request new friends Bro !
						</p>
					</div>
				</li>
			{:else}
				<p class="text-xs leading-5 text-gray-500">
					Waiting an answer from
				</p>
				{#each sentRequestsList as { id, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(username);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>

						<!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="mt-1 truncate text-xs leading-5 text-gray-500">
								<button
								on:click={() => {handleSeeProfil(requestedUser);}}>See Profile
								</button>
							</p>
						</div> -->
					</li>
				{/each}
			{/if}

			{#if usersIBlockedEmptyArray === false}
				<!-- <h2>Users I Blocked</h2> -->
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-500">
							Users I Blocke
						</p>
					</div>
				</li>
				{#each usersIBlockedList as { id, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(username);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>

						<!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="mt-1 truncate text-xs leading-5 text-gray-500">
								<button
								on:click={() => {handleSeeProfil(blockedUser);}}>See Profile
								
								</button>
							</p>
						</div> -->
					</li>
					<!-- <div class="user-card">
							<p>{blockedUser}</p>
							<button
								on:click={() => {
									handleSeeProfil(blockedUser);
								}}>See Profile</button
							>
						</div> -->
				{/each}
			{/if}

			{#if usersWhoBlockedMeEmptyArray === false}
				<!-- <h2>Users Who Blocked Me</h2> -->
				<li class="flex justify-between gap-x-6 py-5">
					<div
						class="hidden shrink-0 sm:flex sm:flex-col sm:items-front"
					>
						<p class="text-xs leading-5 text-gray-500">
							Users Who Blocked Me
						</p>
					</div>
				</li>
				{#each usersWhoBlockedMeList as { id, username, avatar }}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img
								class="h-12 w-12 flex-none rounded-full bg-gray-50"
								style="margin-left: 20px;"
								src={avatar}
								alt="error"
							/>
							<div class="min-w-0 flex-auto">
								<p
									class="text-sm font-semibold leading-6 text-gray-900"
								>
									{username}
								</p>
								<p
									class="mt-1 truncate text-xs leading-5 text-gray-500"
								>
									<button
										on:click={() => {
											handleSeeProfil(username);
										}}
										>See Profile
									</button>
								</p>
							</div>
						</div>

						<!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="mt-1 truncate text-xs leading-5 text-gray-500">
								<button
								on:click={() => {handleSeeProfil(blockedUser);}}>See Profile
								</button>
							</p>
						</div> -->
					</li>
					<!-- <div class="user-card">
							<p>{blockedUser}</p>
							<button
								on:click={() => {
									handleSeeProfil(blockedUser);
								}}>See Profile</button
							>
						</div> -->
				{/each}
			{/if}
		</div>
	{/if}
	<!-- </div> -->
	<!-- <div>
		<img src="images/imgT3.jpg" alt="Image presentation" />
	</div> -->
	<!-- </div> -->
</ul>

<style>
	h2 {
		color: rgb(241, 58, 58);
		align-items: center;
	}
	h1 {
		color: rgb(134, 58, 241);
		align-items: center;
	}
</style>
