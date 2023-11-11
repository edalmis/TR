import { Room, Client } from 'colyseus';
import { PaddleDirection, Physics, PhysicsOptions } from "./game.physics";
import { GameState, GameStatus } from "./game.serverSchema";
import { Injectable, Scope } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

export interface PaddleMoveMessage {
	newDirection: PaddleDirection;
}

export interface UserInfos {
	roomId: string,
	username: string,
	login: string,
	id: number,
	clientId: string,
	client: Client,
	// roomId: string,
}

@Injectable({ scope: Scope.DEFAULT })
export class PongRoom extends Room<GameState> {

	static roomPlayerInfosMap = new Map<number, UserInfos>();
	maxClients = 2;

	private client1: Client;
	private client2: Client;

	//private playerInfo: Map<Client, { loginName: string} > = new Map();
	private physics!: Physics;
	public lpId!: any; // <<<=== Left player ID
	public rpId!: any; // <<<=== Right player ID
	public lpUserName: string = 'test 1';
	public rpUserName: string = 'test 2';
	public lpUserId: number = 41;
	public rpUserId: number = 42;
	private winningScore: number;

	onCreate(options: any) {
		// console.log(' -[ onCreate () ]- -> Options : ', options);
		this.setState(new GameState());
		const physicsOptions: PhysicsOptions = {
			ballSpeed: 1, // Default to 1 if not provided
			paddleSpeed: 0.5, // Default value for paddleSpeed
			ballAngle: 0, // Default value for ballAngle
		};
		this.physics = new Physics(this.state.ball, this.state.leftPaddle, this.state.rightPaddle, physicsOptions);
		this.winningScore = options.scoreToWin;
	}

	private update(deltaTime: number, loginName: string) {
		if (this.state.gameStatus !== GameStatus.PLAYING && this.state.gameStatus !== GameStatus.INTERRUPTED) return;
		if (this.physics.checkLeftWall()) {
			this.state.scoreboard.right += 1;
			this.state.ball.center();
			this.physics.setAngle(0);
		}
		if (this.physics.checkRightWall()) {
			this.state.scoreboard.left += 1;
			this.state.ball.center();
			this.physics.setAngle(Math.PI);
		}
		if (this.state.gameStatus === GameStatus.INTERRUPTED) {

		}

		else {
			// -[ End of Game ]- 
			if (this.state.scoreboard.left >= this.winningScore || this.state.scoreboard.right >= this.winningScore) {
				this.state.gameStatus = GameStatus.FINISHED;

				let winnerMessage: string = 'Good Job *** You WON *** !';
				let looserMessage: string = ' *** L O O S E R ***';
				// Enregistrement Scores (Match History)
				// console.log(' -[ GameFinisheD ]- LpUsername: ', this.lpUserName, ' - scoreLeft: ', this.state.scoreboard.left, '  RpUsername: ', this.rpUserName, '  scoreRight: ', this.state.scoreboard.right)
				// console.log(' -[ GameFinisheD ]- scoreLeft: ', this.state.scoreboard.left, '  scoreRight: ', this.state.scoreboard.right)
				const gameResults = {
					lpUserId: this.lpUserId,
					lpScore: this.state.scoreboard.left,
					rpUserId: this.rpUserId,
					rpScore: this.state.scoreboard.right,
				}
				if (this.state.scoreboard.left > this.state.scoreboard.right) // [* Left Player Won *]
				{
					console.log('[ tentative - Increment Rank Left Won ]...')
					// this.broadcast('updateWinningScore', { winningScore: this.winningScore });
					// this.broadcast('scoreHistory', gameResults, { except: [this.client1] });
					// this.broadcast('gameFinished', { message: winnerMessage }, { except: [this.client2] });
					// this.broadcast('gameFinished', { message: looserMessage }, { except: [this.client1] });
					this.broadcast('updateWinningScore', { winningScore: this.winningScore });
					this.broadcast('scoreHistory', gameResults, { except: [this.client1] });
					this.broadcast('gameFinished', { message: winnerMessage, winnerLogin: this.lpUserName }, { except: [this.client2] });
					this.broadcast('gameFinished', { message: looserMessage, winnerLogin: this.lpUserName }, { except: [this.client1] });
				}
				else //  [ *Right Player Won* ]
				{
					console.log('[ tentative - Increment Rank Right Won ]...')
					// this.broadcast('updateWinningScore', { winningScore: this.winningScore });
					// this.broadcast('scoreHistory', gameResults, { except: [this.client2] });
					// this.broadcast('gameFinished', { message: winnerMessage }, { except: [this.client1] });
					// this.broadcast('gameFinished', { message: looserMessage }, { except: [this.client2] });
					this.broadcast('updateWinningScore', { winningScore: this.winningScore });
					this.broadcast('scoreHistory', gameResults, { except: [this.client2] });
					this.broadcast('gameFinished', { message: winnerMessage, winnerLogin: this.rpUserName }, { except: [this.client1] });
					this.broadcast('gameFinished', { message: looserMessage, winnerLogin: this.rpUserName }, { except: [this.client2] });
				}
			}

			this.physics.update(deltaTime);
		}
		this.onMessage('paddleMove', (client, message) => {
			if (client.id === this.rpId) {
				this.physics.setRightPaddleDirection(message.newDirection);
			}
			if (client.id === this.lpId) {
				this.physics.setLeftPaddleDirection(message.newDirection);
			}
		});
	}

	async onJoin(client: Client, options: any) {
		let mapSize = PongRoom.roomPlayerInfosMap.size;
		console.log(" -[ OnJoin() ]- mapSize: ", mapSize)
		if (this.clients.length === 1) {
			if (options.loginName !== undefined) {

				console.log(' -[ onJoin() ]- Player [1]');
				this.client1 = client;
				this.lpId = client.id;
				this.lpUserName = options.username;
				this.lpUserId = options.id;

				// // [ Debug ] // // // // // // // // // // // // // // // // // // // // // //
				// console.log("onJoin ===> [1] OPTIONS: [* ");
				// console.log(options, " *]")
				// console.log("onJoin ===> [1] lpId: [", this.lpId, "]");
				// console.log("onJoin ===> [1] lpUserName: [", this.lpUserName, "]");
				// console.log("onJoin ===> [1] lpUserId: [", this.lpUserId, "]");
				// // // // // // // // // // // // // // // // // // // // // // // // // // //

				const userInfos: UserInfos = {
					roomId: this.roomId,
					username: options.username,
					login: options.loginName,
					id: options.id,
					clientId: client.sessionId,
					client: client,
				};
				// Ajout a la liste des InGame Friends
				UserService.inGameUsersSet.add(this.lpUserId);
				PongRoom.roomPlayerInfosMap.set(1, userInfos);

				// // [ Debug ] // // // // // // // // // // // // //
				// mapSize = PongRoom.roomPlayerInfosMap.size;
				// console.log(" -[ OnJoin ]- mapSize: ", mapSize)
				// PongRoom.roomPlayerInfosMap.forEach((infos) => {
				// 	console.log("Map Infos: -> ", infos)
				// });
				// // // // // // // // // // // // // // // // // //

			}
		} else if (this.clients.length === 2) {
			if (options.loginName !== undefined) {
				const userinfos = PongRoom.roomPlayerInfosMap.get(1);
				if (userinfos.login !== options.loginName) {

					console.log(' -[ onJoin ]- Player [2]');
					this.client2 = client;
					this.rpId = client.id;
					this.rpUserName = options.username;
					this.rpUserId = options.id;

					// // [ Debug ] // // // // // // // // // // // // // // // // // // // // // //
					// console.log("onJoin ===> [2] OPTIONS: [* ");
					// console.log(options, " *]")
					// console.log("onJoin ===> [2] rpId: [", this.rpId, "]");
					// console.log("onJoin ===> [2] rpUserName: [", this.rpUserName, "]");
					// console.log("onJoin ===> [2] rpUserId: [", this.rpUserId, "]");
					// console.log("onJoin ===> [1] lpId: [", this.lpId, "]");
					// console.log("onJoin ===> [1] lpUserName: [", this.lpUserName, "]");
					// console.log("onJoin ===> [1] lpUserId: [", this.lpUserId, "]");
					// // // // // // // // // // // // // // // // // // // // // // // // // // //

					const userInfos: UserInfos = {
						roomId: this.roomId,
						username: options.username,
						login: options.loginName,
						id: options.id,
						clientId: client.sessionId,
						client: client,
					};
					// Ajout a la liste des InGame Friends
					UserService.inGameUsersSet.add(this.rpUserId);
					PongRoom.roomPlayerInfosMap.set(2, userInfos);

					// // [ Debug ] // // // // // // // // // // // // // //
					// const mapSize = PongRoom.roomPlayerInfosMap.size;
					// console.log(" -[ OnJoin ]- mapSize: ", mapSize)
					// PongRoom.roomPlayerInfosMap.forEach((infos) => {
					// 	console.log("Map Infos: -> ", infos)
					// });
					// // // // // // // // // // // // // // // // // // //

					PongRoom.roomPlayerInfosMap.clear();
					this.state.gameStatus = GameStatus.PLAYING;
					this.setSimulationInterval(deltaTime => this.update(deltaTime, options.loginName));
				}
			}
		}

		this.onMessage('player_disconnected', (client, message) => {
			console.log('-[ onJoin() - onMessage\'PlayerDisconected\' )]- message: ', message);
			console.log(' -- Before -- appel onLeave()');
			this.onLeave(client);
			console.log(' -- After -- appel onLeave()');
			this.onDispose();
			PongRoom.roomPlayerInfosMap.clear();
			const mapSize = PongRoom.roomPlayerInfosMap.size;
			console.log(" -[ OnMessage -disconect- ]- mapSize (end): { ", mapSize, ' }')
			client.leave();
		});
	}


	// async onLeave(client: Client, consented?: boolean) {
	// 	if (!this.lpUserName || !this.rpUserName) {
	// 		this.state.gameStatus = GameStatus.INTERRUPTED;
	// 	}
	// 	if (!this.lpUserName && !this.rpUserName) {
	// 		this.disconnect();
	// 	}
	// 	this.disconnect();
	// }

	async onLeave(client: Client, consented?: boolean) {
		if (client.id === this.lpId) {
			this.lpId = undefined;
		} else if (client.id === this.rpId) {
			this.rpId = undefined;
		}
		if (!this.lpId || !this.rpId) {
			if (this.state.gameStatus !== GameStatus.FINISHED) {
				this.state.gameStatus = GameStatus.FINISHED;
				if (!this.lpId) {
					this.state.scoreboard.left = 0;
					this.state.scoreboard.right = 7;
				}
				else {
					this.state.scoreboard.left = 7;
					this.state.scoreboard.right = 0;
				}
				const gameResults = {
					lpUserId: this.lpUserId,
					lpScore: this.state.scoreboard.left,
					rpUserId: this.rpUserId,
					rpScore: this.state.scoreboard.right,
				}
				if (!this.lpId) {
					this.broadcast('opponentLeft', {}, { except: [this.client1] });
					this.broadcast('scoreHistory', gameResults, { except: [this.client1] });
				}
				else {
					this.broadcast('opponentLeft', {}, { except: [this.client2] });
					this.broadcast('scoreHistory', gameResults, { except: [this.client2] });
				}
			}
		}
		if (!this.lpId && !this.rpId) {
			this.disconnect();
		}
	}
	onDispose() {
		console.log("-[ onDispose() ]- ");
	}

}