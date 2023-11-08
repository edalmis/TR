<script lang="ts">
import LoginButton from "./LoginButton.svelte";
	//import { goto } from "$app/navigation";

	/* // DeBug Auth42 user // // // // // // // // // // // //
	function ConnectChchao() {
		goto("http://localhost:3000/loginChchao");
	}
	function ConnectBalbecke() {
		goto("http://localhost:3000/loginBalbecke");
	}
	// // // // // // // // // // // // // // // // // // // */
</script>

<div class="content">
	
	<LoginButton />
	<h2>Transcendence</h2>
	<!-- <img src="/images/logo-42.jpg" alt="Nein" /> -->
	<!-- <h1 class="42">4 2</h1> -->
	
	
	<!-- <div class="testUsers">
		<span class="buttonUserTest">
			<button on:click={ConnectChchao}>User 1 🤵🏻‍♂️ </button>
		</span>
		<span class="buttonUserTest">
			<button on:click={ConnectBalbecke}>User 2 🕵️‍♂️ </button>
		</span>
	</div> -->
</div>

<style>

	.content {
		z-index: 1;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h2 {
		color: green;
		font-size: 180px;
		margin-top: 100;
		/* margin-bottom: 0; */
		font-family: fantasy;
	}
	/* Create the overlay with the background image */
	.content::before {
		content: "";
		position: absolute;
		margin: 0;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url('/images/42auth_image.png');
		background-size: cover; /* Adjust to your preference */
		background-repeat: no-repeat;
		opacity: 0.5; /* Adjust the opacity as needed */
	}
</style>
