// import { CollectionSchema } from "@colyseus/schema";
import { Ball, Paddle, GameState, GameStatus, GameDimensions, Scoreboard } from "./game.clientSchema";
import { InvitedUserLogin, backgroundColor, paddleSize } from "$lib/store/store";
import { onMount } from "svelte";
import { goto } from "$app/navigation";

// Constants for background and paddle colors
const BackgroundColors: any = {
	blue: 'rgb(65, 135, 225)',
	orange: 'rgb(255, 143, 31)',
	green: 'rgb(0, 100, 0)',
	default: 'rgb(0, 100, 0)',
};

const PaddleColors: any = {
	blue: 'green',
	orange: 'white',
	green: 'rgb(255, 95, 31)',
	default: 'rgb(255, 95, 31)',
};

//Game writable 
let backgroundColorChoice: string;
backgroundColor.subscribe((a) => {
	backgroundColorChoice = a;
	console.log("gameRender:", backgroundColorChoice);
});

let paddleSizeChoice: string;
paddleSize.subscribe((a) => {
	paddleSizeChoice = a;
	console.log("paddleSizeChoice :", paddleSizeChoice);
})


export function drawTextCenter(ctx: CanvasRenderingContext2D, text: string) {
	ctx.fillText(text, GameDimensions.width / 2, GameDimensions.height / 2);
}

export function drawHalfwayLine(ctx: CanvasRenderingContext2D, color: string) {
	ctx.beginPath();
	ctx.setLineDash([2, 4]);
	ctx.strokeStyle = color; // Set the line color
	ctx.moveTo(GameDimensions.width / 2, 0);
	ctx.lineTo(GameDimensions.width / 2, GameDimensions.height);
	ctx.stroke();
	// ctx.setLineDash([]);
}
export function drawLeftDashedLine(ctx: CanvasRenderingContext2D, color: string) {
	ctx.beginPath();
	ctx.setLineDash([2, 4]);
	ctx.strokeStyle = color;
	ctx.moveTo(0, GameDimensions.height / 6);
	ctx.lineTo(GameDimensions.width, GameDimensions.height / 6);
	ctx.stroke();
	ctx.moveTo(0, (GameDimensions.height / 6) * 5);
	ctx.lineTo(GameDimensions.width, (GameDimensions.height / 6) * 5);
	ctx.stroke();

}

export function drawRightDashedLine(ctx: CanvasRenderingContext2D, color: string) {
	ctx.beginPath();
	ctx.setLineDash([2, 4]);
	ctx.strokeStyle = color;
	ctx.moveTo((GameDimensions.width / 10) * 9, GameDimensions.height / 6);
	ctx.lineTo((GameDimensions.width / 10) * 9, (GameDimensions.height / 6) * 5);
	ctx.stroke();
	ctx.moveTo((GameDimensions.width / 10), GameDimensions.height / 6);
	ctx.lineTo((GameDimensions.width / 10), (GameDimensions.height / 6) * 5);
	ctx.stroke();
}


export function renderBall(ctx: CanvasRenderingContext2D, ball: Ball) {
	ctx.beginPath();
	// ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI); // Assuming Ball has a property radius
	ctx.arc(ball.x, ball.y, Ball.radius, 0, 2 * Math.PI); // Assuming Ball has a property radius
	ctx.closePath();
	ctx.fill();
}

let invited: string = "Boby";	 // Game User Login to Invite
InvitedUserLogin.subscribe((a) => {
	invited = a;
});

export function renderPaddle(ctx: CanvasRenderingContext2D, paddle: Paddle) {
	// let widthFactor: number;
	// let heightFactor: number;

	if (paddleSizeChoice === 'small') {
		//  console.log(" class Paddle: size === PaddleSize.Small ", paddleSizeChoice);
		Paddle.width = 30;
		Paddle.height = 160;
	} else if (paddleSizeChoice === 'invisible') {
		Paddle.width = 40;
		Paddle.height = 0;
	}
	else {
		Paddle.width = 40;
		Paddle.height = 200;
	}

	ctx.fillRect(paddle.x - Paddle.width / 2, paddle.y - Paddle.height / 2, Paddle.width, Paddle.height);
}

export function renderScoreboard(ctx: CanvasRenderingContext2D, scoreboard: Scoreboard) {
	ctx.fillText(scoreboard.left.toString(), GameDimensions.width * (1 / 4), 100);
	ctx.fillText(scoreboard.right.toString(), GameDimensions.width * (3 / 4), 100);
}

let isModalOpen = false;

export function handleBackHomeModal() {
	isModalOpen = true;
}
export function handleCancelLeaveGame() {
	isModalOpen = false
}

export function leaveGame() {
	isModalOpen = false; // Close the modal
	goto("/game"); // Redirect to the home page
}
export function gameRender(ctx: CanvasRenderingContext2D, state: GameState) {
	let backgroundColor: string;
	let paddleColor: string;

	// switch (backgroundColorChoice) {
	// 	case 'blue':
	//         backgroundColor = 'rgb(65, 135, 225)';
	//         paddleColor = 'green';
	//         break;
	//     case 'orange':
	//         backgroundColor = 'rgb(255, 143, 31)';
	//         paddleColor = 'white';
	//         break;
	//     case 'green':
	//         backgroundColor = 'rgb(0, 100, 0)';
	//         paddleColor = 'rgb(255, 95, 31)';
	//         break;
	//     default:
	//         backgroundColor = 'rgb(0, 100, 0)'; // Default background color
	//         paddleColor = 'rgb(255, 95, 31)'; // Default paddle color
	//         break;
	// }
	backgroundColor = BackgroundColors[backgroundColorChoice] || BackgroundColors.default;
	paddleColor = PaddleColors[backgroundColorChoice] || PaddleColors.default;
	ctx.fillStyle = backgroundColor;

	ctx.fillRect(0, 0, GameDimensions.width, GameDimensions.height);
	ctx.fillStyle = paddleColor;
	ctx.lineWidth = 8;
	ctx.font = 'italic 42px Arial, sans-serif';
	ctx.textAlign = "center";
	
	switch (state.gameStatus) {
		case GameStatus.WAITING:
			drawTextCenter(ctx, 'Waiting an Opponent...');
			break;
		case GameStatus.PLAYING:
			drawHalfwayLine(ctx, 'white');
			drawLeftDashedLine(ctx, 'white');
			drawRightDashedLine(ctx, 'white');
			renderBall(ctx, state.ball);
			renderPaddle(ctx, state.leftPaddle);
			renderPaddle(ctx, state.rightPaddle);
			renderScoreboard(ctx, state.scoreboard);
			break;
		case GameStatus.FINISHED:
			renderScoreboard(ctx, state.scoreboard);
			drawTextCenter(ctx, 'Game Over !');
			break;
		case GameStatus.INTERRUPTED:
			drawTextCenter(ctx, 'Opponent left, You Win Bro !');
			break;
	}

}

