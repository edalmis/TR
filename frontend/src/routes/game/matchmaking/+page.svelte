<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	// import { goto } from "$app/navigation";
	import type { Room } from "colyseus.js";
	import * as Colyseus from "colyseus.js";
	import { clientColyseus } from "$lib/store/store";
	import { closeModal } from "$lib/store/ModalValues";
	import { gameRender } from "$lib/game/gameRender";
	// import { PaddleDirection } from "$lib/game/PaddleDirection";
	import { PaddleDirection } from "../../../../../backend/src/game/game.physics";
	import { GameState, GameDimensions } from "$lib/game/game.clientSchema";
	import {
		actualUsername, ballSpeed,
		inGame, session, userId,
		userLogin, winnerScore, launchedGame, navbar,
	} from "$lib/store/store";

	let state: GameState;
	let room: Room<GameState>;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	// let isDisconnected = false;
	let isGamePaused = false;
	// let isModalOpen = false;

	// Game options writables
	let speed: number;
	let scoreToWin: number;
	let loginName: string;
	let id: number;

	// **************      ************** //
	let client: any;
	// **************      ************** //
	// Writable userInfos
	let username: string = "john";

	async function EnterGame() {
		const jwt = localStorage.getItem("jwt");
		const response = await fetch("http://localhost:3000/user/enterGame", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			console.log("-[ Enter Game Button ]- ");
		}
	}

	onMount(() => {
		// [ MatchMaking ] // // // // // // // // // // // // // // // // // // // // // //
		winnerScore.set(3);
		ballSpeed.set(3);
		// // // // // // // // // // // // // // // // // // // // // // // // // // // //

		client = new Colyseus.Client("ws://localhost:3001");
		clientColyseus.set(client);

		navbar.set(false);
		launchedGame.set(true);
		EnterGame();

		// **************      ************** //
		clientColyseus.subscribe((dataClient) => {
			client = dataClient;
		});
		// **************      ************** //
		actualUsername.subscribe((a) => {
			username = a;
		});
		userLogin.subscribe((a) => {
			loginName = a;
		});
		userId.subscribe((a) => {
			id = a;
		});
		ballSpeed.subscribe((a) => {
			speed = a;
		});
		winnerScore.subscribe((a) => {
			scoreToWin = a;
		});
		let wsClient: any;
		session.subscribe((a: any) => {
			wsClient = a;
		});
		// console.log("frontend: createGame [] : userName:", username);
		const context = canvas.getContext("2d");
		if (!context) {
			throw new Error("Failed to get 2D context.");
		}
		ctx = context;

		(async () => {
			// Initialize game and state
			await initializeGame();

			// First render
			gameRender(ctx, state);
			//gameRender();

			// Additional setup
			resizeCanvas();

			// Start rendering loop
			renderLoop();
		})();

		room?.onLeave((code) => {
			if (code === 1000) {
				// Normal closure, not a disconnection
				return;
			}
			// handleDisconnection();
		});

		// Add event listeners for key events
		window.addEventListener("resize", resizeCanvas);
		window.addEventListener("keydown", handleKeydown);
		window.addEventListener("keyup", handleKeyup);

		return () => {
			// Cleanup when the component is destroyed
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("keydown", handleKeydown);
			window.removeEventListener("keyup", handleKeyup);
		};
	});

	onDestroy(() => {
		room.send("player_disconnected", {
			messageDuFront: "Salut du Frontend onDestroy SveltKit !",
		});
		room.leave();
		inGame.set(false);
		LeaveGame();
		closeModal();
		navbar.set(true);
		console.log("Le composant [Game/Create] a été démonté.");
	});

	async function LeaveGame() {
		const jwt = localStorage.getItem("jwt");
		const response = await fetch("http://localhost:3000/user/leaveGame", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			console.log("-[ Leave Game ]- ");
		}
	}

	async function registerScoreHistory(data: any) {
		const jwt = localStorage.getItem("jwt");
		const response = await fetch(
			"http://localhost:3000/user/matchHistory",
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
			console.log("-[ Match History ]-  Set !");
		}
	}

	async function initializeGame() {
		try {
			const roomOptions = {
				speed: speed,
				scoreToWin: scoreToWin,
				loginName: loginName,
				id: id,
				username: username,
				//tableSize: tableSize,
				//playMode: playMode,
			};

			inGame.set(true);
			room = await client.joinOrCreate("pong", roomOptions);
			state = room.state;

			room.onMessage("state", (message: any) => {
				console.log("New game state received:", message);
			});
			room.onMessage("startGame", (message: any) => {
				//createRoomWithColyseus();  // This line might actually lead to recursion, be careful
			});

			room.onStateChange((newState) => {
				state = newState;
				gameRender(ctx, state);
			});
			room.onMessage("updateWinningScore", (message: any) => {
				scoreToWin = message.winningScore;
			});
			room.onMessage("scoreHistory", (data: any) => {
				registerScoreHistory(data);
			});
		
			room.onMessage("gameFinished", (message: any) => {
				// alert(message.winner);
				if (message.winnerLogin) {
       				alert("Winner is '" + message.winnerLogin + "'"); // Display the winnerLogin if it exists
    			}
				LeaveGame();
				
			});
		} catch (e) {
			console.error("Failed to connect to the game server:", e);
		}
	}
	// function handleDisconnection() {
	// 	isDisconnected = true;
	// 	isGamePaused = true; // Pause the game on disconnection
	// 	isModalOpen = true;
	// 	goto("/game");
	// }
	// function handleReconnection() {
	// 	isDisconnected = false;
	// 	isGamePaused = false; // Resume the game on reconnection
	// 	isModalOpen = true;
	// }

	// function GameOver() {
	// 	isModalOpen = false; // Close the modal
	// 	goto("/"); // Redirect to the home page
	// }
	// export function handleCancelLeaveGame(){
	// 	isModalOpen = false
	// }

	// ... [Handle key events]
	function handleKeydown(e: KeyboardEvent) {
		if (isGamePaused) {
			return; // Don't handle key events when the game is paused
		}
		switch (e.key) {
			case "ArrowUp":
				//room.send({ newDirection: tion.UP } as PaddleMoveMessage);
				room.send("paddleMove", { newDirection: PaddleDirection.UP });

				break;
			case "ArrowDown":
				//room.send({ newDirection: PaddleDirection.DOWN } as PaddleMoveMessage);
				room.send("paddleMove", { newDirection: PaddleDirection.DOWN });
				break;
		}
	}

	function handleKeyup(e: KeyboardEvent) {
		if (isGamePaused) {
			return; // Don't handle key events when the game is paused
		}

		switch (e.key) {
			case "ArrowUp":
			case "ArrowDown":
				//room.send({ newDirection: PaddleDirection.STOP } as PaddleMoveMessage);
				room.send("paddleMove", { newDirection: PaddleDirection.STOP });
				break;
		}
	}

	function resizeCanvas() {
		const scale = Math.min(
			window.innerWidth / GameDimensions.width,
			window.innerHeight / GameDimensions.height
		);
		ctx.canvas.width = GameDimensions.width * scale;
		ctx.canvas.height = GameDimensions.height * scale;
		ctx.scale(scale, scale);
	}
	function renderLoop() {
		requestAnimationFrame(renderLoop);
		//gameRender();
		gameRender(ctx, state);
	}

</script>

<!-- {#if isDisconnected}
	<div class="disconnected-message">
		<h2>Opponent Left, click to Leave</h2>
	</div> 
{/if} -->
<svelte:window
	on:resize={resizeCanvas}
	on:keydown={handleKeydown}
	on:keyup={handleKeyup}
/>
<canvas bind:this={canvas} id="rendering-canvas" />

<style>
	/* #canvas-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
	} */
	canvas#rendering-canvas {
		max-width: 100%;
		max-height: 100%;
		border: 10px solid white;
	}
</style>
