<script>
    import { chanel, chanelname, session } from "$lib/store/store";
    import { onMount } from 'svelte';
    export let username ; 
    let user = null;
    // let userNamee = usernale
    let pictureLink;


    onMount(() => {
        console.log('here', username)
            // Assume $session has an 'on' method to listen to events
            $session.emit('message', username);

            $session.on("userResponse", (data) => {
            user = data.user;
            pictureLink = user.avatar;

            });

            // $session.on('message', handleIncomingMessage);
            
            // // Send a request for user data
            // $session.send(JSON.stringify({ action: 'getUser', username: username }));

            // // Clean up the listener when the component is destroyed
            return () => {
                $session.off('userResponse');
            };
        
    });

    // function handleIncomingMessage(event) {
    //     const data = JSON.parse(event.data);
    //     if (data.action === 'userResponse' && data.username === username) {
    //         user = data.user;
    //     }
    // }
</script>

<!-- Display logic -->
<div class="modal-content">
    <!-- <h2>{username}'s Profile</h2> -->

    {#if user}
    <div>
        <img class="profile-pic" src={pictureLink} alt=": 🤖 👨🏻‍🌾 🍪 🤣 :" />
    </div>
        <p>Username: {user.userName}</p>
        <p>Login: {user.login}</p>
   
        <p>Email: {user.email}</p>
        <p>Name: {user.lastName}</p>
        <p>Rank: {user.rank}</p>
        <p>Title: {user.title}</p>
        <p>Total Won: {user.wonGameNbr} - {user. lostGameNbr} :Lost</p>
        <!-- ... other user data -->
    {:else}
        <p>Loading user data...</p>
    {/if}
    <!-- <button on:click={() => isModalVisible = false}>Close</button> -->
</div>