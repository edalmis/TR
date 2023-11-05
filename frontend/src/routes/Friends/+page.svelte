<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	// Imports -[ MODALS ]- ///////////////////////////
	import Modal from "$lib/modals/Modal.svelte";
	import { openModal, selectedPage } from "$lib/store/ModalValues";
	import { closeModal } from "$lib/store/ModalValues";
	import { showModal } from "$lib/store/ModalValues";
	import { authentificated, user } from "$lib/store/store";
	import OtherProfile from "$lib/OtherProfile/OtherProfile.svelte";
	// import ImgPreviewProfile from "$lib/Profile/ImgPreviewProfile.svelte";


	let userLoginTime: any= new Date().getTime();

  // Function to calculate the time difference
  function calculateTimeDifference() {
    const currentTime: any = new Date().getTime();
    const timeDifference = Math.floor((currentTime - userLoginTime) / (1000* 60 * 60)); // Difference in hours
    	return timeDifference;
  }
	// let image: string;
	let show_Modal: boolean;
	showModal.subscribe((a: boolean) => {
		show_Modal = a;
	});

	let selectedModal: string;
	selectedPage.subscribe((b: string) => {
		selectedModal = b;
	});
	///////////////////////////////////////////////////

	// Afficher la liste des user online
	// ajouter un bouton 'send request'

	// Afficher la liste des amis
	// ajouter bouton 'unfriend'

	// afficher la liste des amis en attente acceptation
	// ajouter bouton 'accept'

	//let users: string[];
	//let id42: number;
	//id42 = $user.id42;

	 // Import any necessary data here
// 	 let users = [
//     {
//       name: 'Leslie Alexander',
//       email: 'leslie.alexander@example.com',
//       role: 'Co-Founder / CEO',
//       lastSeen: '3h ago',
//       imageSrc: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     // Add more user data here
//   ];
	let onlineUsers: string[] = [];
	let friendsList: string[] = [];
	let onlineFriendsList: string[] = [];

	let inGameUsersList: string[] = [];
	let inGameFriendsList: string[] = [];

	let pendingList: string[] = [];
	let sentRequestsList: string[] = [];
	let usersIBlockedList: string[] = [];
	let usersWhoBlockedMeList: string[] = [];
	//let users: string[] = ["Henry", "john", "boby"];
	let userToDisplay: string;

	let onlineUserEmptyArray: boolean = false;
	let friendsListEmptyArray: boolean = false;
	let onlineFriendsEmptyArray: boolean = false;

	let inGameUsersEmptyArray: boolean = false;
	let inGameFriendsEmptyArray: boolean = false;

	let pendingListEmptyArray: boolean = false;
	let sentRequestListEmptyArray: boolean = false;
	let usersIBlockedEmptyArray: boolean = false;
	let usersWhoBlockedMeEmptyArray: boolean = false;
	let pictureLink: string;
	// let chatMessage: string = " ";

	// async function handleDM(username: string) {
	// 	//console.log("+page.Friends - username: ", username);
	// 	goto("/DM");
	// }

	
	onMount(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			// const onlineUsers_url = await fetchData("http://localhost:3000/auth/onlineUsers");
			// if (onlineUsers_url) {
			// console.log("Online Users:", onlineUsers_url);
			// }

			// const onlineUserResponse = await fetchData("http://localhost:3000/user/profile");
			// if (onlineUserResponse) {
			// pictureLink = user.avatar;
			// }
			//Online Users
			
			const onlineUsers_url = "http://localhost:3000/auth/onlineUsers";
			const onlineUserResponse = await fetch(onlineUsers_url, {
			// const onlineUserResponse = await fetchData(onlineUsers_url, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${jwt}`,
					"Content-Type": "application/json",
				},
			});

			if (!jwt) {
				goto("/");
				return;
			} else {
				const response = await fetch( "http://localhost:3000/user/profile", {
				// const response = await fetchData( "http://localhost:3000/user/profile", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				});

				const userProfile= await fetch( "http://localhost:3000/user/profile", {
				// const response = await fetchData( "http://localhost:3000/user/profile", {
					method: "GET",
					headers: {
						Authorization: `Bearer ${jwt}`,
						"Content-Type": "application/json",
					},
				});
				
				if (response.ok) {
					// const user = await userProfile.json();
					const user = await response.json();
					pictureLink = user.avatar;
				}

			if (onlineUserResponse.ok) {
				// onlineUsers = await onlineUserResponse.json();
				onlineUsers = await onlineUserResponse.json();
				if (onlineUsers.length === 0) {
					onlineUserEmptyArray = true;
				}
				console.log("onlineUsers: ", onlineUsers);
			}
       	 // Handle the error, e.g., show an error message to the user
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
				friendsList = await friendsListResponse.json();
				if (friendsList.length === 0) {
					friendsListEmptyArray = true;
				}
				console.log("friendsList: ", friendsList);
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
				console.log("usersWhoBlockedMeList: ", usersWhoBlockedMeList);
			}

			// Online Friends
			onlineFriendsList = friendsList.filter((friend) =>
				onlineUsers.includes(friend)
			);
			if (onlineFriendsList.length === 0) {
				onlineFriendsEmptyArray = true;
			}

			// InGame Friends
			inGameFriendsList = friendsList.filter((friend) =>
				inGameUsersList.includes(friend)
			);
			if (inGameFriendsList.length === 0) {
				inGameFriendsEmptyArray = true;
			}
		} catch (e) {
			console.log("Friend OnMount PB");
		}
	});

	async function handleSeeProfil(username: string) {
		//console.log("+page.Friends - username: ", username);
		userToDisplay = username;
		//user.name = username;
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
			console.log("response { OK } du [ Add Friend ]");
		} else {
			console.log("response { NOT OK } du [ Add Friend ]");
		}
		closeModal();
		goto("/");
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
			console.log("response { OK } du [ Add Friend ]");
		} else {
			console.log("response { NOT OK } du [ Add Friend ]");
		}
		closeModal();
		goto("/");
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
			console.log("response { OK } du [ Remove Friend ]");
		} else {
			console.log("response { NOT OK } du [ Remove Friend ]");
		}
		closeModal();
		goto("/");
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
				<li class="flex justify-between"></li>
				{#if onlineUserEmptyArray === true}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front">
							<p class="text-xs leading-5 text-gray-500"> Sorry Bro no one is connected ! </p>
						</div>
					</li>
				{:else}
					{#each onlineUsers as user}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img class="h-12 w-13 flex-none rounded-full bg-gray-50" style="margin-left: 20px;" src={pictureLink} alt=": 🤖 👨🏻‍🌾 🍪 🤣 :" />
							<div class="min-w-0 flex-auto">
								<p class="text-sm font-semibold leading-6 text-gray-900">{user}</p>
								<p class="mt-1 truncate text-xs leading-5 text-gray-500">
									<button
										on:click={() => { handleSeeProfil(user);}}>See Profile
									</button>
								</p>
							</div>
						</div>
						<!--<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							 <p class="mt-1 truncate text-xs leading-5 text-gray-500">
								<button
									on:click={() => { handleSeeProfil(user);}}>See Profile
								</button>
							</p> -->
							<div class="mt-1 flex items-center gap-x-1.5">
								<div class="flex-none rounded-full bg-emerald-500/20 p-1">
								<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
								</div>
								<p class="text-xs leading-5 text-gray-500" style="margin-right: 130px;">Online</p>
							</div>
						<!-- </div>  -->
						<!-- <div class="mt-1 flex items-center gap-x-1.5">
							<div class="flex-none rounded-full bg-emerald-500/20 p-1">
							<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
							</div>
							<p class="text-xs leading-5 text-gray-500">Online</p>
						</div> -->
						</li>
					{/each}
				{/if}
				<li class="flex justify-between"></li>
				
				<h2>Online Friends</h2>
					{#if onlineFriendsEmptyArray === true}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front">
							<p class="text-xs leading-5 text-gray-500"> 
								Sorry Bro your friends are not connected. Request new Friends !
							</p>
						</div>
					</li>
					{:else}
						{#each onlineFriendsList as user}
						<li class="flex justify-between gap-x-6 py-5">
							<div class="flex min-w-0 gap-x-4">
								<img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;"  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
								<div class="min-w-0 flex-auto">
									<p class="text-sm font-semibold leading-6 text-gray-900">{user}</p>
									<p class="mt-1 truncate text-xs leading-5 text-gray-500">
										<button 
											on:click={() => { handleSeeProfil(user);}}>See Profile 
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
								<div class="flex-none rounded-full bg-emerald-500/20 p-1">
								<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
								</div>
								<p class="text-xs leading-5 text-gray-500" style="margin-right: 130px;">Online</p>
							</div>
						</li>
						{/each}	
					{/if}
				
			
				<h2>In Game Friends</h2>
				{#if inGameFriendsEmptyArray === true}
				<li class="flex justify-between gap-x-6 py-5">
					<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front">
						<p class="text-xs leading-5 text-gray-500"> None of your friends is playing. Invite them to play ! </p>
					</div>
				</li>
				
				{:else}
					{#each inGameFriendsList as user}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;"  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
							<div class="min-w-0 flex-auto">
								<p class="text-sm font-semibold leading-6 text-gray-900">{user}</p>
								<p class="mt-1 truncate text-xs leading-5 text-gray-500">
									<button 
										on:click={() => { handleSeeProfil(user);}}>See Profile 
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
							<div class="flex-none rounded-full bg-emerald-500/20 p-1">
							  <div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
							</div>
							<p class="text-xs leading-5 text-gray-500" style="margin-right: 130px;">Game-On</p>
						</div>
					</li>
					{/each}
				{/if}

			 <h2>Friends List</h2>
				{#if friendsListEmptyArray === true}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front">
							<p class="text-xs leading-5 text-gray-500">
								Sorry Bro, you're a lone wolf! Try to make friends, request online users!
							</p>
						</div>
					</li>
				{:else}
					{#each friendsList as friendUser}
						<li class="flex justify-between gap-x-6 py-5">
							<div class="flex min-w-0 gap-x-4">
								<img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;"  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
								<div class="min-w-0 flex-auto">
									<p class="text-sm font-semibold leading-6 text-gray-900">
										{friendUser}
									</p>
									<p class="mt-1 truncate text-xs leading-5 text-gray-500">
										<button 
											on:click={() => {handleSeeProfil(friendUser);}}>See Profile
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

							<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end" >
								<p class="mt-1 truncate text-xs leading-5 text-gray-500" style="margin-right: 130px;">
									<button
										on:click={() => {handleRemoveFriend(friendUser);}}>Undo Friendship
									</button>
								</p>
							</div>
								{#if onlineFriendsEmptyArray === false}
									<div class="mt-1 flex items-center gap-x-1.5">
										<div class="flex-none rounded-full bg-emerald-500/20 p-1">
										<div class="h-2 w-2 rounded-full bg-emerald-500"></div>
										</div>
										<p class="text-xs leading-5 text-gray-500" style="margin-right:130px;">Online</p>
									</div>
									{:else}
									<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-center">
										<!-- <p class="text-sm leading-6 text-gray-900">
										level
										</p> -->
										<p class="mt-1 text-xs leading-5 text-gray-500" style="margin-right: 130px;">
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
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front">
							<p class="text-xs leading-5 text-gray-500">
								Sorry Bro, no one wants to be your friend !
							</p>
						</div>
					</li>
				{:else}
					{#each pendingList as pendingUser}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;"  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
							<div class="min-w-0 flex-auto">
								<p class="text-sm font-semibold leading-6 text-gray-900">
									{pendingUser}
								</p>
								<p class="mt-1 truncate text-xs leading-5 text-gray-500">
									<button
									on:click={() => {handleSeeProfil(pendingUser);}}>See Profile
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

						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="mt-1 truncate text-xs leading-5 text-gray-500" style="margin-right:500px;">
								<button
								on:click={() => {handleAcceptFriend(pendingUser);}}>Accept
								</button>
							</p>
						</div>
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="mt-1 truncate text-xs leading-5 text-gray-500" style="margin-right:390px;">
								<button 
									on:click={() => {handleRefuseFriendRequest(pendingUser);}}>Refuse
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


				{#if sentRequestListEmptyArray === false}
					<!-- <h2>Waiting an answer from</h2> -->
					<li class="flex justify-between gap-x-6 py-5">
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front">
							<p class="text-xs leading-5 text-gray-500">
								Waiting an answer from
							</p>
						</div>
					</li>
					{#each sentRequestsList as requestedUser}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;"  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
							<div class="min-w-0 flex-auto">
								<p class="text-sm font-semibold leading-6 text-gray-900">
									{requestedUser}
								</p>
								<p class="mt-1 truncate text-xs leading-5 text-gray-500">
									<button
									on:click={() => {handleSeeProfil(requestedUser);}}>See Profile
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
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front">
							<p class="text-xs leading-5 text-gray-500">
								Users I Blocke
							</p>
						</div>
					</li>
					{#each usersIBlockedList as blockedUser}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;"  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
							<div class="min-w-0 flex-auto">
								<p class="text-sm font-semibold leading-6 text-gray-900">
									{blockedUser}
								</p>
								<p class="mt-1 truncate text-xs leading-5 text-gray-500">
									<button
									on:click={() => {handleSeeProfil(blockedUser);}}>See Profile
									
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
						<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-front">
							<p class="text-xs leading-5 text-gray-500">
								Users Who Blocked Me
							</p>
						</div>
					</li>
					{#each usersWhoBlockedMeList as blockedUser}
					<li class="flex justify-between gap-x-6 py-5">
						<div class="flex min-w-0 gap-x-4">
							<img class="h-12 w-12 flex-none rounded-full bg-gray-50" style="margin-left: 20px;"  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
							<div class="min-w-0 flex-auto">
								<p class="text-sm font-semibold leading-6 text-gray-900">
									{blockedUser}
								</p>
								<p class="mt-1 truncate text-xs leading-5 text-gray-500">
									<button
									on:click={() => {handleSeeProfil(blockedUser);}}>See Profile
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
	h1{
		color: rgb(134, 58, 241);
        align-items: center;
	}
</style>
