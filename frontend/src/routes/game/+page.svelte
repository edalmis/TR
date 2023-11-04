<script lang="ts">
	import { goto } from "$app/navigation";
	import { onDestroy, onMount } from "svelte";
	import {
		winnerScore, 
		ballSpeed, 
		InvitedUserLogin, 
		backgroundColor,
		paddleSize,
	 } from "$lib/store/store";
    import GameModal from "$lib/game/gameModal.svelte";
    // import { GameState } from "$lib/game/game.schema";
	let speed:number = 1; // Default value for speed
	let scoreToWin: string = "3"; // Default value for score to win
	let isModalOpen = false;
	let colorMode: string = 'blue';
	let paddle: string = 'normal';


	let borderColors: Record<string, string> = {
        green: 'rgb(0,100,0)',
        blue: 'rgb(70,130,180)',
    	orange:'rgb(255,143,31)',
    };
	
	$: {
        const selectedColor = colorMode;
        if (selectedColor in borderColors) {
            document.documentElement.style.setProperty('--border-color', borderColors[selectedColor]);
        }
    }
	let invited: string;	 // Game User Login to Invite
	InvitedUserLogin.subscribe((a) => {
		invited = a;
	});

	const openModal = () => {
		isModalOpen = true;
	};
	const closeModal = () => {
		isModalOpen = false;
	};
	
	onMount(() => {});

	function redirectToMatchmaking() {
    	goto('/game/matchmaking');
  	}

	const onSubmit = () => {

		// console.log("scoreToWin:", scoreToWin);
		// if (scoreToWin == "3") {
		// 	const winnerScoreValue = winnerScore.set(3);
		// 	console.log("winnerScoreValue:", winnerScoreValue); 

		// } else {
		// 	const winnerScoreValue = winnerScore.set(5);
		// 	console.log("winnerScoreValue:", winnerScoreValue); 

		// }

		// if (paddle == 'small')
		// 	paddleSize.set('small');
		// else {
		// 	paddleSize.set('normal');
		// }

		const winnerScoreMap: Record<string, number> = {
			"3": 3,
			"5": 5,
		}
		winnerScore.set(winnerScoreMap[scoreToWin]);
// /// //// /// debug
		//console.log("scoreToWin:", scoreToWin);
		const winnerScoreValue = winnerScoreMap[scoreToWin];
		winnerScore.set(winnerScoreValue);
		// console.log("winnerScoreValue:", winnerScoreValue); 
// /// //// /// debug
		// const  paddleSizeMap:  Record<string, string>  = {
		// 	"small": "small",
        // 	"normal": "normal",
		// }
		//console.log("paddle:", paddle); // Log the value of paddle
        // const paddleSizeValue = paddleSizeMap[paddle];
        // console.log("paddleSizeValue:", paddleSizeValue); // Log the value being set
        // paddleSize.set(paddleSizeValue);

		paddleSize.set(paddle);
		backgroundColor.set(colorMode);
		ballSpeed.set(speed);
		closeModal();
		goto("/game/create");
		
	};
	onDestroy(() => {
		closeModal();
	});
</script>


<div style="margin-top: 10px;">
	<button
	 on:click={redirectToMatchmaking} class="create-privateRoom-button"> Matchmaking 🏓 </button>
</div>

<div style="margin-top: 10px;">
	<!-- <button on:click={openModal}>
		<span class="create-privateRoom-button">Create PrivateGame with  🏓 {invited} 🏓 </span>
	</button> -->
	<button on:click={openModal} class="create-privateRoom-button">Create PrivateGame with 🏓 '{invited}'🏓 </button>
</div>

<!-- <h1>[Create Game] with 🎋 * {invited} * 🏓</h1> -->

<GameModal bind:isOpen={isModalOpen} on:close={closeModal}>
<form on:submit|preventDefault={onSubmit}>
	<div class="onSubmitPrivateRoom-container">
		<h2>Let's Play with 🎋 * {invited} * 🏓</h2>
		<label>
			Choose ping-pong court color :
			<select bind:value={colorMode}>
				<option value="green">Sprite</option>
				<option value="blue">Pepsi Blue</option>
				<option value="orange">Fanta</option>
			</select>
		</label>


		<!-- <label for="basic-range">Range Label</label>
		<Range on:change={(e ) => speed = e.detail.speed} id="basic-silder" /> -->

			<label for="speed-range" class="label">
				Speed : 
				<input type="range" id="speed-range" min="1" max="3" bind:value={speed} class="range" />
				<span > {speed} / 3</span>
			</label>

		<label>
			Paddle Size :
			<select bind:value={paddle}>
				<option value="normal">normal</option>
				<option value="small">small</option>
				<option value="invisible">invisible</option>
			</select>
		</label>

		<label>
			Score to Win :
			<select bind:value={scoreToWin}>
				<option value="3">3 vs 3</option>
				<option value="5">5 vs 5</option>
			</select>
		</label>
		<button type="submit">Create Game</button>
	</div>
</form>
</GameModal>

<style>

	.onSubmitPrivateRoom-container {
		width: 100%; /* Set width as needed */
		height: 100%; /* Set height as needed */
		/* border: 15px solid black; */
		border: 35px solid var(--border-color);
		padding: 18px;
		margin: 0 auto;
		box-sizing: border-box;
		background-image: url("/images/playRoom.jpg");
		/* background-image: url("/images/homeRoom.jpeg"); */
		background-position: center;
		background-size: cover;
	}

	.create-privateRoom-button {
		background-color: #03080cbd; /* Blue background color */
		color: white; /* White text color */
		border: none;
		padding: 10px 20px; /* Add padding to make the button larger */
		font-size: 20px; /* Increase font size */
		border-radius: 5px; /* Rounded corners */
		cursor: pointer;
		transition: background-color 0.3s ease; /* Smooth background color transition on hover */
		/* Center the button horizontally */
		display: block;
		margin: 0 auto;
		}
		
	.create-privateRoom-button:hover {
		background-color: #007bff; /* Darker blue color on hover */
	}

	label {
		/* display: block; */
		display: flex;
		/* flex-direction: column; */
		align-items: center;  /* text aligns with the column.*/
		margin-bottom: 10px;
		color: rgb(29, 41, 131);
		/* margin: px; */
		font-size: 16px;
		font-weight: 600;
	}

	.range {
    width: 30%; /* Adjust the width as needed */
    background: linear-gradient(to right, #007bff, #00cc99); /* Gradient background */
    border: none;
    border-radius: 10px; /* Rounded corners */
    padding: 1px;
    margin: 2px 0;
    -webkit-appearance: none; /* Remove default appearance */
}

.range::-webkit-slider-thumb {
    -webkit-appearance: none; /* Remove default appearance for thumb */
    width: 20px; /* Set thumb width */
    height: 20px; /* Set thumb height */
    background: #00cc99; /* Thumb color */
    border: 2px solid #d5dfe9; /* Thumb border */
    border-radius: 66%; /* Rounded thumb */
    cursor: pointer; /* Show pointer cursor on hover */
}

	input, select, button {
    background: rgba(217, 204, 204, 0.8);
    border: none;
    padding: 10px;
    border-radius: 20px;
}

	button {
    cursor: pointer;
    color: white; /* Change text color to white */
    background: #007bff; /* A cool blue color */
    border-radius: 3px;
    padding: 10px 20px;
    font-size: 18px;
    border: 2px solid #eff1f4;
    transition: background 0.3s ease, color 0.3s ease;
	border-radius: 30px;
}

button:hover {
    background: #245a1a; /* Darker blue on hover */
}
</style>
