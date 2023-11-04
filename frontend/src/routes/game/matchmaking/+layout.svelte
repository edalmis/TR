<script lang="ts">
  import { onMount } from "svelte";
  import { launchedGame } from "$lib/store/store";

  // let login: string = "";
  // let username: string = "";
  // let id: number = 0;

 
</script>

<div class="game-header">
  <div class="left-player">
    <!-- <span>Left Player: {state.leftPlayerName}</span> -->
    <!-- <span>Left Player: ${leftUsername} </span> -->
    <span>Left Player: </span>
  </div>
  <div class="right-player">
    <!-- <span>Right Player: {state.rightPlayerName}</span> -->
    <!-- <span>Right Player: ${rightUsername}</span> -->
    <span>Right Player: </span>
  </div>
</div>

<div class="game-content">
  <slot />
</div>

<style>
  .game-header {
    display: flex;
    justify-content: space-between;
    background-color: #333;
    color: white;
    padding: 10px;
  }

  .left-player,
  .right-player {
    flex: 1;
    text-align: center;
  }
</style>
