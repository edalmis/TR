<script lang="ts">
	import { goto } from "$app/navigation";

	async function handleInviteToPlay() {
		goto("/game");
	}
</script>

<div>
	<button on:click={handleInviteToPlay}>Play Moi</button>
</div>

<style>
	button {
		color: blue;
		border-width: 1px;
		border-radius: 25%;
		border-color: blue;
		margin-left: 2px;
		margin-right: 2px;
	}
</style>
