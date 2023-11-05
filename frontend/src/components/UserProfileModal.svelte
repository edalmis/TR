<script lang="ts">
    import { session } from "$lib/store/store";
    import { onMount } from 'svelte';

    export let username: any ; 
    
    let user: any = null;
    let pictureLink: any;


    onMount(() => {
        console.log('here', username)
            $session.emit('message', username);

            $session.on("userResponse", (data: any) => {
            user = data.user;
            pictureLink = user.avatar;

            });
            return () => {
                $session.off('userResponse');
            };
    });


</script>


<div class="modal-content">

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
    {:else}
        <p>Loading user data...</p>
    {/if}

</div>