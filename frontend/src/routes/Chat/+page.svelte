<script lang="ts">
    import { onMount } from "svelte";
    // import { writable } from 'svelte/store';
    import { session, user ,kickEndTimes, muteEndTimes} from "$lib/store/store";
    // import { browser } from "$app/environment";
    // import { goto } from "$app/navigation";
    // import Disable2Fa from "$lib/profile/Disable2Fa.svelte";
    // import type { AnyNode } from "postcss";
    // import { openModal, selectedPage } from "$lib/store/ModalValues";
	// import { closeModal } from "$lib/store/ModalValues";
	// import { showModal } from "$lib/store/ModalValues";
    import UserProfileModal from "./../../components/UserProfileModal.svelte";
    // import * as bcrypt from 'bcrypt';
    // import bcrypt from 'bcrypt';


    let title = "";
    let isPrivate = false;
    let password = "";
    let message = "";
    let member: any = { nullable: true };
    let chatRooms: any[] = [];
    let selectedChatRoom: any = null;
    let selectedChatRoomid :string = "";
    let chatMessages: any[] = [];
    
    let showChatWindow = true;
    let isAdmin = $user.isAdmin;
    let showChatHistory = true;
    let showSendMessage= true;
    let userId = $user.id42;
    let usere = $user;
    let userLogin= $user.login;
    let usersInRoom: any[] = [];
    let isUserOwner = true;

    interface ISocketValue{
        rooms:string
    }
    

    let allUsers: any[] = []; // Ensure to declare the allUsers array
    let selectedUserId: string = ""; // For choosing a user to make admin
    let enteredPassword: string | null;
    enteredPassword = "";
    let kickEndTime: any;
    let kickDuration: any;
    let muteDuration: any;
    interface Message {
    // your message properties here, e.g.,
    content: string;
    senderLogin: string;
    createdAt: Date;
    // ... any other properties your message objects might have
}

let chatMessagesPerRoom: { [roomId: string]: Message[] } = {};
// let kickEndTimes = {};
// let muteEndTimes = {};
// const kickEndTimesFromStorage = localStorage.getItem('kickEndTimes');
// export const kickEndTimes = writable(kickEndTimesFromStorage ? JSON.parse(kickEndTimesFromStorage) : {});
// const muteEndTimesFromStorage = localStorage.getItem('muteEndTimes');
// export const muteEndTimes = writable(muteEndTimesFromStorage ? JSON.parse(muteEndTimesFromStorage) : {});
// Define a type for the end times data

// Define a type for the end times data

// Define a type for the end times data
type EndTimesData = Record<string, number>;
const kickEndTimesData: EndTimesData = $kickEndTimes;
const muteEndTimesData: EndTimesData = $muteEndTimes;


// let userToDisplay: string;
let chatRoomms = []; // Example initialization
let isProfileModalOpen = false;
let userToDisplay: any = null;
let isModalVisible = false;




function promptPasswordAndEnter(room: any) {
    enteredPassword = prompt("Enter password for room:");
    
    if (enteredPassword) {
        // const saltRounds = 10; // or another number of rounds
        // enteredPassword =  bcrypt.hash(enteredPassword, saltRounds);
        fetch("http://localhost:3000/chat/verify-room-password", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomId: room.id,
                password: enteredPassword
            })
        })
        .then(response => response.text()) // Get the response as text first
        .then(text => {
            try {
                // Now try to parse the text as JSON
                return JSON.parse(text);
            } catch (error) {
                console.error("Failed to parse JSON:", error);
                console.error("Server response:", text); // log the server's response to inspect what's wrong
                throw new Error("Received non-JSON response from server.");
            }
        })
        .then(parsedData => {
            if (parsedData.success) {
                selectChatRoom(room);
            } else {
                alert("Incorrect password");
            }
        })
        .catch(error => {
            // Handle the error
            console.error("An error occurred:", error.message);
        });
    }
}  

// function promptPasswordAndEnter(room) {
//     const enteredPassword = prompt("Enter password for room:");

//     if (enteredPassword) {
//         fetch("http://localhost:3000/chat/verify-room-password", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 roomId: room.id,
//                 password: enteredPassword
//             })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Server returned an error.");
//             }
//             return response.json();  // Directly parse the response as JSON
//         })
//         .then(parsedData => {
//             if (parsedData.success) {
//                 selectChatRoom(room);
//             } else {
//                 alert("Incorrect password");
//             }
//         })
//         .catch(error => {
//             // Handle the error
//             console.error("An error occurred:", error.message);
//         });
//     }
// }


    onMount(() => {
        $session.emit("getChatRooms");

        // General event listener for debugging
        $session.onAny((event: any, ...args: any) => {
            console.log(`Received event: ${event}`, args);
        });

        $session.on("repChatRooms", (data : ISocketValue) => {
            chatRooms = [...data.rooms];
        });

        $session.on("repMessagesInChatRoom", (data: any) => {
            // chatMessages = [...data.messages];
            chatMessagesPerRoom[selectedChatRoomid] = [...data.messages];

            // console.log("CHATTTTTT1---->", data.messages)
                    scrollToBottom(); 
    //                 const roomId:string = data.messages.roomId;
    // if (!chatMessagesPerRoom[roomId]) {
    //     chatMessagesPerRoom[roomId] = [];
    // }
    // chatMessagesPerRoom[roomId].push(data.messages);
    // console.log("CHATTT", chatMessagesPerRoom[roomId])
    // if (selectedChatRoom && roomId === selectedChatRoom.id) {
    //     scrollToBottom();
    // }
        });

        $session.on('joinedChatRoom', ({room, user, role}: any) => {
        console.log(`${user.login} is trying to join room ${room.title} as ${role}`);
        });

        // })
//         $session.on("newMessage", (data:any) => {
//             // console.log('Received new message:', data);
//             // if (selectedChatRoom && data.savedMessage.roomId === selectedChatRoom.id) {
//             //     chatMessages = [...chatMessages, data.savedMessage];
//             //     scrollToBottom();
//             // }
//     //         const roomId:string = data.savedMessage.roomId;
//     // if (!chatMessagesPerRoom[roomId]) {
//     //     chatMessagesPerRoom[roomId] = [];
//     // }
//     // chatMessagesPerRoom[roomId].push(data.savedMessage);
//     // if (selectedChatRoom && roomId === selectedChatRoom.id) {
//     //     scrollToBottom();
//     // }
//     console.log('Received new message:', data);
//     if (selectedChatRoom && data.savedMessage.roomId === selectedChatRoom.id) {
//         if (!chatMessagesPerRoom[selectedChatRoomid]) {
//             chatMessagesPerRoom[selectedChatRoomid] = [];
//         }
//         chatMessagesPerRoom[selectedChatRoomid].push(data.savedMessage);
//         chatMessagesPerRoom = {...chatMessagesPerRoom}; // Trigger Svelte's reactivity
//         scrollToBottom();
//     }
// });
// $session.on("newMessage", (data:any) => {
//     // Check if data.savedMessage exists before accessing it
//     if (data && data.savedMessage && selectedChatRoom && data.savedMessage.roomId === selectedChatRoom.id) {
//         if (!chatMessagesPerRoom[selectedChatRoomid]) {
//             chatMessagesPerRoom[selectedChatRoomid] = [];
//         }
//         chatMessagesPerRoom[selectedChatRoomid].push(data.savedMessage);
//         chatMessagesPerRoom = {...chatMessagesPerRoom}; // Trigger Svelte's reactivity
//         scrollToBottom();
//     } else {
//         console.error("Error: received message without savedMessage property:", data);
//     }
// });
$session.on("newMessage", (data:any) => {
    console.log('Received new message:', data);
    
    // Check if data.savedMessage exists before accessing it
    if (!data || !data.savedMessage) {
        console.error("Error: received message without savedMessage property:", data);
        return;
    }

    // Check if the logged-in user's login is in the blockedMembers list
    if (data.blockedMembers && data.blockedMembers.includes(usere.login)) {
        // Don't process the message as this user should not see it
        return;
    }

    if (data.blockedByMembers && data.blockedByMembers.includes(usere.login)) {
        // Don't process the message as this user should not see it
        return;
    }

    if (selectedChatRoom && data.savedMessage.roomId === selectedChatRoom.id) {
        if (!chatMessagesPerRoom[selectedChatRoomid]) {
            chatMessagesPerRoom[selectedChatRoomid] = [];
        }
        chatMessagesPerRoom[selectedChatRoomid].push(data.savedMessage);
        chatMessagesPerRoom = {...chatMessagesPerRoom}; // Trigger Svelte's reactivity
        scrollToBottom();
    }
});

           

        $session.on("chatRoomCreated", (data: any)=>{
            const {channel }= data
             console.log("newRoom", channel)
            chatRooms = [...chatRooms, channel];

        })
        $session.on("chatRoomDeleted", (data: any)=>{
            const {room }= data
             console.log("deletedRoom", room)
             chatRooms = chatRooms.filter(item => item.id !== room.id);


        })
       
    $session.on("membersList", (data: any) => {
    usersInRoom = data.members; 
    console.log('users in room', usersInRoom);
});

$session.on('kickedFromRoom', ({ roomId, duration }: any) => {
    // kickEndTimes[roomId] = new Date().getTime() + duration * 60 * 1000;  // Set the kick end time for that specific room
    const newEndTime = new Date().getTime() + duration * 60 * 1000;
    // kickEndTimes.update(kickEndTimesData => ({ ...kickEndTimesData, [roomId]: newEndTime }));
    // localStorage.setItem('kickEndTimes', JSON.stringify(kickEndTimes));
    kickEndTimes[roomId] = newEndTime;
    if (roomId === selectedChatRoomid) {
        // Calculate the time at which the kicked duration will end.
        // kickEndTime = new Date().getTime() + duration * 60 * 1000;  // Convert duration to milliseconds
        showChatHistory = false;
        showSendMessage= false;

    //     setTimeout(() => {
    //         if (new Date().getTime() > kickEndTimes[roomId]) {
    //         showChatHistory = true; 
    //         showSendMessage= true;}
    //     }, duration * 60 * 1000);  // The duration until chat history will be closed
    // }
    // For kickEndTimes
// setTimeout(() => {
    const timer = setTimeout(() => {
    if (new Date().getTime() > (kickEndTimes[roomId] || 0)) {
        showChatHistory = true; 
        showSendMessage = true;
    }
}, duration * 60 * 1000);  // The duration until chat history will be closed
    clearTimeout(timer);
}});

$session.on('mutedFromRoom', ({ roomId, duration }: any) => {
    // muteEndTimes[roomId] = new Date().getTime() + duration * 60 * 1000;  // Set the kick end time for that specific room
    const newEndTime = new Date().getTime() + duration * 60 * 1000;
    // muteEndTimes.update(muteEndTimesData => ({ ...muteEndTimesData, [roomId]: newEndTime }));
    // localStorage.setItem('muteEndTimes', JSON.stringify(muteEndTimes));
    muteEndTimes[roomId] = newEndTime;
    if (roomId === selectedChatRoomid) {
        // Calculate the time at which the kicked duration will end.
        // kickEndTime = new Date().getTime() + duration * 60 * 1000;  // Convert duration to milliseconds
        // showChatHistory = false;
        showSendMessage= false;

    //     setTimeout(() => {
    //         if (new Date().getTime() > muteEndTimes[roomId]) {

    //         // showChatHistory = true; 
    //         showSendMessage= true;}
    //     }, duration * 60 * 1000);  // The duration until chat history will be closed
    // }

// For muteEndTimes
// setTimeout(() => {
    const timer = setTimeout(() => {
    if (new Date().getTime() > (muteEndTimes[roomId] || 0)) {
        showSendMessage = true;
    }
}, duration * 60 * 1000);  // The duration until chat history will be closed
    clearTimeout(timer);
}
});


$session.on('bannedFromRoom', ({ roomId }: any) => {
    if (roomId === selectedChatRoomid) {
        showChatHistory = false;
        showSendMessage= false;
    }
});

// Handle an updated room
$session.on("roomUpdated", (updatedRoom: any) => {
            const index = chatRooms.findIndex(room => room.id === updatedRoom.id);
            if (index !== -1) {
                chatRooms[index] = updatedRoom;
                chatRooms = [...chatRooms]; // Re-assign to trigger reactivity in Svelte
            }
        });

        return (() => {
            $session.off('repChatRooms');
            $session.off('repMessagesInChatRoom');
            $session.off('newMessage');
            $session.off("chatRoomCreated");
            $session.off("chatRoomDeleted");
            $session.off("membersList");
            $session.off("joinedChatRoom");
            $session.off("kickedFromRoom");
            $session.off("mutedFromRoom");
            $session.off("bannedFromRoom");
            $session.off("roomUpdated");

            

        });

    });

    function fetchMembersInRoom(roomId: string) {
        $session.emit("getsMembersInRoom", roomId);  
         usersInRoom = [];
    }

    function scrollToBottom() {
    const chatHistoryDiv = document.querySelector('.chat-history');
    if(chatHistoryDiv) {
        chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
    }
    }

    $: if (chatMessages && chatMessages.length > 0) {
        scrollToBottom(); 
    }

    async function selectChatRoom(room: any) {
        selectedChatRoom  = room;
        selectedChatRoomid=room.id;
        // console.log('useri d ****', usere.id)
        // Check if the user is banned from this room
        $session.emit("checkUserBan", { userId: usere.id, roomId: selectedChatRoomid });

            // Listen to the server's response
        $session.once("userBanStatus", (data: any) => {
        if (data.isBanned) {
            showChatHistory = false;
             showSendMessage= false;
            // Notify the user that they are banned or take appropriate action.
            return;
        }
         // Request user's status in the chat room
    $session.emit("checkUserStatus", { userId: usere.id, roomId: selectedChatRoomid });

// Listen to the server's response
$session.once("userStatus", (data: any) => {
    if (data.isBanned) {
        showChatHistory = false;
        showSendMessage = false;
        // Notify the user that they are banned or take appropriate action.
    } else {
        // Check if user is still kicked from this room
        if (new Date().getTime() <= (data.kickEndTimes[selectedChatRoomid] || 0)) {
            // If the user is still kicked from the room
            showChatHistory = false;
            showSendMessage = false;
        } else {
            showChatHistory = true;
            showSendMessage = true;
        }

        if (new Date().getTime() <= (data.muteEndTimes[selectedChatRoomid] || 0)) {
            // If the user is still muted in the room
            showSendMessage = false;
        } else {
            showSendMessage = true;
        }
    }
});
        fetchMembersInRoom(selectedChatRoomid);

        // Check if user is still kicked from this room
        // if (new Date().getTime() <= (kickEndTimes[selectedChatRoomid] || 0)) {
            if (new Date().getTime() <= (kickEndTimes[selectedChatRoomid] || 0)) {
            // If the user is still kicked from the room
            showChatHistory = false;
            showSendMessage = false;
        } else {
            showChatHistory = true;
            showSendMessage = true;
        }

        if (new Date().getTime() <= (muteEndTimes[selectedChatRoomid] || 0)) {
            // If the user is still mute from the room
            showSendMessage = false;
        } else {
            showSendMessage = true;
        }
        if (member.kickedTime && member.kickDuration) {
            const currentTime = new Date().getTime();
            const kickEndTime = member.kickedTime.getTime() + member.kickDuration * 60 * 1000;
            if (currentTime <= kickEndTime) {
                // The user is still within the kick duration
                showChatHistory = false;
                showSendMessage = false;
                // You can display a message to the user indicating the remaining kick duration.
            }
        }
        const isMember = usersInRoom.some(member => member.user.id == usere.id);
        if (!isMember) {

            const payload = { user: usere, room: selectedChatRoom, role: 'Participant' };
            $session.emit("joinChatRoom", payload);
        }

        $session.emit("getMessagesInChatRoom", selectedChatRoomid);
        });
    }


    // async function selectChatRoom(room) {

    //     selectedChatRoom  = room;
    //     selectedChatRoomid=room.id;
    //     let role = 'Participant'
    //     fetchMembersInRoom(selectedChatRoomid)

    //     const isMember = usersInRoom.some(members => members.user.id == usere.id);
    //     if (!isMember)
    //     {
    //         const payload = { user: usere, room: selectedChatRoom, role :role};
    //         $session.emit("joinChatRoom", payload);
    //     }

    //      $session.emit("getMessagesInChatRoom", selectedChatRoomid);
    // }                                                    

    function createChatRoom() {
        const payload = {
            title,
            member,
           userId,
           usere,
            isPrivate,
            password: isPrivate ? password : null,
            
        };
        $session.emit("sendChatRooms", payload);
    }

    function sendMessage() {
        console.log('here***-*-*-*-*-')

        $session.emit("sendMessageChannel", {
            message: message,
            sendBy: usere,
            sendBylogin: usere.login, 
            sendTo: selectedChatRoomid
        });
        console.log(selectedChatRoomid)

        message = ''; // Clear the message after sending
    }
    
    function logMessages() {
        console.log(chatMessages);
    }

    function clean() {
        showChatHistory = true;
        showChatWindow = true;
    }                                                       

    function kickUser(user: any, login: string, roomId: string, duration:any) {
    $session.emit('kickUser', { user, roomId: roomId, login: login, duration});
    }
    function muteUser(user: any, login: string, roomId: string, duration:any) {
    $session.emit('muteUser', { user, roomId: roomId, login: login, duration});
    }

    function banUser(user: any, login: string, roomId: string) {
        $session.emit('banUser', { user, roomId: roomId, login: login });
    }
    function makeAdmin(user: any, login: string, roomId: string) {
        $session.emit('makeAdmin', { user, roomId: roomId, login: login });
    }

    function unbanUser(user: any, userId: any, roomId: any) {
    $session.emit('unbanUser', { user, userId, roomId });
    
    // Listen for confirmation or errors
    $session.on('userUnbanned', ({ userId, roomId }: any) => {
        // Update the UI or notify the admin that the user has been unbanned
    });

    $session.on('unbanError', ({ message }: any) => {
        // Handle the error (e.g., display an error message to the admin)
    });
}

//------------------------------OFFLINE ADDINGS----------------------------===============

    async function leaveChatRoom() {
        if (selectedChatRoom) {
            $session.emit("leaveChatRoom", { user: usere, room: selectedChatRoom });
            selectedChatRoom = null;
            selectedChatRoomid = "";
        } else {
            console.warn("No chat room selected to leave.");
        }
    }

    async function passChatRoom() {
        if (selectedChatRoom) {
            let newPassword;
    if (selectedChatRoom.password) {
        // If there's already a password, prompt for the new password
        newPassword = prompt("Please enter the new room password:");
    } else {
        // If there's no password, allow the owner to set one
        newPassword = prompt("Set a password for the chat room:");
    }
    if (newPassword) {
        // Emit the event to the server with the new password
        $session.emit("passChatRoom", {
            user: usere,
            room: selectedChatRoom,
            newPassword: newPassword
        });
    } else {
        console.warn("Password change aborted. No password provided.");        }
    }
    }

    async function cancelpassChatRoom() {
        if (selectedChatRoom) {
    if (selectedChatRoom.password) {

        $session.emit("cancelpassChatRoom", {
            user: usere,
            room: selectedChatRoom,
        });
    }} else {
        console.warn("Password cancel aborted..");        }
    
    }

    // async function handleSeeProfil(username: string) {
	// 	//console.log("+page.Friends - username: ", username);
	// 	userToDisplay = username;
	// 	openModal("OtherProfile");
    //     closeModal();
	// 	// goto("/Friends");
	// }

//     function openProfileModal(username) {
//     userToDisplay = username;
//     isProfileModalOpen = true;
// }

// function closeProfileModal() {
//     isProfileModalOpen = false;
//     userToDisplay = null;
// }
    
//     // function toggleModal() {
//     //     isModalVisible = !isModalVisible;
//     // }
//     function toggleModal() {
//     isModalVisible = !isModalVisible;
//     console.log("Toggling modal: ", isModalVisible);
// }

function openProfileModal(username: any) {
        userToDisplay = username;
        isProfileModalOpen = true;
        isModalVisible = true;
    }

    function closeProfileModal() {
        isProfileModalOpen = false;
        isModalVisible = false;
        userToDisplay= null;
    }

    function toggleModal() {
        isModalVisible = !isModalVisible;
       
        if (!isModalVisible) {
            isProfileModalOpen = false;
        }
    }

    function handleKeyDown(event: any) {
        // If the Enter key is pressed
        if (event.key === 'Enter') {
            event.preventDefault(); // To prevent a newline or form submission
            sendMessage();
        }

        // If the Tab key is pressed
        if (event.key === 'Tab') {
            event.preventDefault();  // Prevent moving to the next input or button

            // Insert a tab character at the cursor's current position
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
            message = message.substring(0, start) + '\t' + message.substring(end);

            // Position the cursor after the inserted tab character
            event.target.selectionStart = start + 1;
            event.target.selectionEnd = start + 1;
        }
    }

</script>


<style>
    body {
        font-family: Arial, sans-serif;
    }
    .chat-message p {
    white-space: pre-wrap;
}

    .chat-window {
        position: fixed;
        top: 15%;
        right: 0%;
        width: 34%;
        padding: 20px;
        background-color: #a9abc2;
        border: 1px solid #181313;
        box-shadow: 0 0 10px rgba(255,0,0,0.2); /* Red shadow */
        border-radius: 5px;
        color: rgb(14, 3, 3);
        overflow-y: scroll;

    }

    .chat-history {
        position: fixed;
        top: 15%;
        left: 28%;
        width: 38%;
        background-color: #a9abc2;
        border: 1px solid #181313;
        box-shadow: 0 0 10px rgba(255,0,0,0.2); /* Red shadow */
        border-radius: 5px;
        overflow-y: auto;
        height: 85vh;
        padding: 15px;
        color: white;
        overflow-y: scroll;

        
        /* scroll-behavior:auto; */
     }

    .chat-message {
        margin-bottom: 10px;
        padding: 10px;
        background-color: #181010; /* Slightly lighter than the background */
        border-radius: 5px;
        overflow-y: scroll;
    }

    .chat-message p {
        margin: 0;
    }

    .chat-message .sender {
        font-weight: bold;
        color: red;
    }

    .chat-message .date {
        font-size: 0.8rem;
        color: red;
    }

    .rooms-list ul {
        list-style: none;
        background-color: #a5a7b9;
        padding: 10px;
        border-radius: 5px;
    }

    .rooms-list li:hover {
        background-color: red;
        cursor: pointer;
        color: rgb(14, 12, 12);
    }

    .chat-history button, .chat-window button, .chat-history .message-input button {
        background-color: red;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .chat-window button:hover, .chat-history .message-input button:hover, .chat-history button:hover {
        background-color: #990000;
    }

    input[type="text"], input[type="password"] {
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #999;
        width: 100%;
        box-sizing: border-box;
        background-color: rgb(231, 210, 210);
        color: black;
    }

    .message-input {
        margin-top: 10px;
        display: flex;
        gap: 10px;
        color: black;
    }

    .message-input input {
        flex-grow: 1;
    }
    .user-list {
    background-color: #9c9494;
    border: 1px solid #1a1515;
    color:red;
    border-radius: 5px;
    margin-top: 15px;
    padding: 10px;
}

.user-list ul {
    list-style-type: none;
    padding: 0;

}

.user-list li  {
    margin-bottom: 5px;
}
.users-container {
    position: fixed;
    top: 35%;
    right: 0%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #a9abc2;
    border: 1px solid #181313;
    width: 34%;
    height: 70vh;

    padding: 20px;
}

#userList {
    list-style-type: none;
    padding: 0;
    margin-bottom: 10px;
}
.locked-icon {
    margin-left: 5px; 
}
/* .user-list button {
    background-color: red;
    color: white;
    padding: 2px 2px;
    border: none;
    border-radius: 2px;
    margin-left: 2px; /* to space out between buttons */
    /* transition: background-color 0.3s ease;
    box-shadow: 0 0 2px rgba(255,0,0,0.2); /* subtle red shadow to match other UI elements */
/* } */ 

div.users-container ul#userList li .user-list button {
    background-color: red;
    color: white;
    padding: 1px 3px !important;;  /* further reduced padding */
    border: none;
    border-radius: 2px;
    margin-left: 1px; /* slight margin reduction for tighter spacing */
    transition: background-color 0.3s ease;
    box-shadow: 0 0 2px rgba(255,0,0,0.2);
    font-size: 0.6rem !important; /* further reduced font-size */
    line-height: 1; /* adjusted line-height */
    vertical-align: middle; /* to align button text vertically in case it's misaligned */
}


.user-list button {
    background-color: red;
    color: white;
    padding: 1px 3px !important;;  /* further reduced padding */
    border: none;
    border-radius: 2px;
    margin-left: 1px; /* slight margin reduction for tighter spacing */
    transition: background-color 0.3s ease;
    box-shadow: 0 0 2px rgba(255,0,0,0.2);
    font-size: 0.6rem !important; /* further reduced font-size */
    line-height: 1; /* adjusted line-height */
    vertical-align: middle; /* to align button text vertically in case it's misaligned */
}
.user-list button:hover {
    background-color: #990000;
    color: white;
    text-decoration: none;
}

/* Differentiating Kick and Ban with slight modifications */
.user-list .kick {
    background-color: #ff3333; /* Slightly different shade for distinction */
}

.user-list .ban {
    background-color: red; 
}
.par {
    color: #181313;           /* Green text color */
        background-color: a9abc2; /* White background */
        padding: 4 px 8px;           /* Optional: some padding for better appearance */
        border-radius: 4px;     /* Optional: rounded corners for a softer look */
    }
    .kickd {
    color: #181313;           /* Green text color */
        padding: 4 px 8px;           /* Optional: some padding for better appearance */
        border-radius: 4px;     /* Optional: rounded corners for a softer look */
    }
    .pa:hover{
    color: #fafafa;           /* Green text color */
    background-color: rgb(185, 25, 19); /* red background */
   /* Optional: rounded corners for a softer look */
    }
    .user-list-title {
        text-align: center;
        font-weight: bold;
        color: #181010;
        padding: 4 px 8px;           /* Optional: some padding for better appearance */
        border-radius: 4px; 
    }
    .room-list-title {
        font-weight: bold;
        color: #181010;
        background-color: #a9abc2;
    }

    /* //------------------------------OFFLINE ADDINGS----------------------------=============== */

    .users-container button {
    margin-top: 10px;
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7); /* semi-transparent background to highlight the modal */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* to ensure the modal is always on top */
}

.modal-content {
    background: #a9abc2; /* Matches the chat window's color */
    padding: 20px;
    border-radius: 5px; /* To keep the consistency of rounded corners */
    width: 60%; /* A comfortable width for a modal, but feel free to adjust */
    max-width: 90%;
    max-height: 80%;
    overflow: auto;
    box-shadow: 0 0 15px rgba(255,0,0,0.3); /* A more pronounced red shadow for emphasis */
    color: rgb(14, 3, 3); /* Keeping the text color consistent */
}

.modal-content h2 {
    margin-top: 0;
    color: #181313; /* Matches the .room-list-title color */
    border-bottom: 2px solid #181313; /* A divider for visual separation */
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.modal-content button {
    display: block; /* Ensure the close button takes the full width */
    margin-top: 15px; /* Space from content */
    text-align: center; /* To center the 'Close' text */
}





</style>


{#if showChatWindow}
<div class="chat-window">
    <button class="close-btn" on:click={() => { 
        console.log('Close button clicked'); 
        showChatWindow = false;
    }}>X</button>
   
    
    <form on:submit|preventDefault={createChatRoom}>
        <p class="user-list-title">CREATE CHANNEL</p>

        <label>
            Room Title:
            <input bind:value={title} required />
        </label>
        <label>
            <input type="checkbox" bind:checked={isPrivate} /> Is Private
        </label>
        

        {#if isPrivate}
        <label>
            Password:
            <input type="password" bind:value={password} required />
        </label>
        {/if}
       
        <!-- goto('/current-route'); -->

        <button type="submit" >Create Chat Room</button>    
    </form>
</div>
{/if}

<div class="rooms-list">
    <p class="room-list-title">ACTIVE CHANNELS</p>

    <ul>
        {#each chatRooms as room (room.id)}
            <li on:click={() => room.isPrivate ? promptPasswordAndEnter(room) : selectChatRoom(room)}>
                {room.title}
                {#if room.isPrivate}
                    <span class="locked-icon">🔒</span>
                {/if}
            </li>
        {/each}
    </ul>
</div>
{#if selectedChatRoom && showChatHistory}
    <div class="chat-history">
        <button class="close-btn" on:click={() => { 
            console.log('Close button clicked'); 
            showChatHistory = false;
        }}>X</button>
        
        <!-- Chat Messages Display Section -->
        <div>
            {#if showChatHistory}
            <p class="user-list-title">CHAT HISTORY</p>
            {#if Array.isArray(chatMessagesPerRoom[selectedChatRoomid])}
                {#each chatMessagesPerRoom[selectedChatRoomid] as message}
                <!-- {#each chatMessages as message} -->
                    <div class="chat-message">
                        <p class="sender">{message.senderLogin}</p>
                        <p>{message.content}</p>
                        <p class="date">{new Date(message.createdAt).toLocaleString()}</p>
                    </div>
                {/each}
            {/if}
            {/if}
            <div class="message-input">
                {#if showSendMessage}
                
                <!-- <input bind:value={message} placeholder="Type your message..."/> -->
                <div class="message-input">
                    <input bind:value={message} on:keydown={handleKeyDown} placeholder="Type your message..."/>
                    <button on:click={sendMessage}>Send</button>
                </div>
                
                <!-- <button on:click={sendMessage}>Send</button> -->

                {/if}
            </div>
        </div>
        <div class="users-container">
           
            <ul id="userList">
                <p class="user-list-title">USER LIST</p>
                <p></p>
                <span class="pa">Welcome {usere.login}</span> 
                <p></p>

            {#each usersInRoom as user}
                <li>
                    {user.user.login} <span class="par">: {user.role}</span>
                    {#if (usere.login != user.user.login)}
                    <button on:click={(e) => { e.stopPropagation(); openProfileModal(user.user.userName); }}>
                        See Profile
                    </button>
                    {/if}
                        {#if ((user.role == 'Participant')&&(usere.login != user.user.login)) || ((user.role == 'Admin') && (usere.login != user.user.login))} 
                            <!-- <button on:click={() => kickUser(usere, user.user.login, selectedChatRoomid)}>Kick</button>  -->
                           
                            <input type="number" class="kickd" bind:value={kickDuration} placeholder="Duration (minutes)" />
                            <button on:click={() => kickUser(usere, user.user.login, selectedChatRoomid, kickDuration)}>Kick</button>  
                            <button on:click={() => muteUser(usere, user.user.login, selectedChatRoomid, kickDuration)}>Mute</button>  

                            <button on:click={() => banUser(usere, user.user.login, selectedChatRoomid)}>Ban</button>
                            <button on:click={() => unbanUser(usere, user.user.login, selectedChatRoomid)}>Unban</button>
                            <!-- <button on:click={() => {handleSeeProfil(user.user.login);}}>See Profile</button> -->
                            <!-- {#if isProfileModalOpen}
                            
                                <button on:click={(e) => { e.stopPropagation(); openProfileModal(user.user.login); }}>View Profile</button>
                            {/if} -->
                          
                            <button on:click={() => makeAdmin(usere, user.user.login, selectedChatRoomid)}>Make Admin</button>
                            <!-- Always display the button -->

                            
                                <!-- <button on:click={toggleModal}>Show Modal</button>
                           
                            
<div class="modal content" style="display: {isModalVisible ? 'block' : 'none'}">
    <div class="modal-content">
        <h2>User Profile</h2>
                            <button on:click={(e) => { e.stopPropagation(); openProfileModal(user.user.username); }}>View Profile</button>

     Only display the modal if isProfileModalOpen is true -->
                                <!-- {#if isProfileModalOpen}
                                <UserProfileModal username={userToDisplay} onClose={closeProfileModal} />
                            {/if}
                            <button on:click={toggleModal}>Close</button>
                        </div>
                    </div>  -->
                   
                    
            

<!-- Main Modal -->

                        {/if}  
                     
                </li>
                
            {/each}
            
            </ul>
            
            <!-- //------------------------------OFFLINE ADDINGS----------------------------=============== -->

            <!-- The Leave Channel button -->
            <button on:click={leaveChatRoom}>Leave Channel</button>
            <button on:click={passChatRoom}>Change Channel Password</button>
            <button on:click={cancelpassChatRoom}>Cancel Channel Password</button>

            <!-- <button on:click={() => fetchMembersInRoom(selectedChatRoomid)}>Get Users</button> -->
        </div>
       
    </div>
    
{/if}
<!-- Profile Modal Structure -->
{#if isModalVisible}
<div class="modal content">
    <div class="modal-content">
        <h2>User Profile</h2>
        
        <!-- Display the Profile Information Here -->
        {#if isProfileModalOpen}
            <UserProfileModal username={userToDisplay} onClose={closeProfileModal} />
        {/if}
        
        <button on:click={toggleModal}>Close</button>
    </div>
</div>
{/if}


<!-- Debugging button to manually log chat messages -->
<button on:click={clean}  >New window</button>
<p><button on:click={logMessages}  >Log Messages</button></p>