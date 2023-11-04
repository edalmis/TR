import type { GameState } from "$lib/game/game.clientSchema";
import { writable } from "svelte/store";

// Auth -[ Value ] - qui definit l'acces au compte Utilisateur ou LoginPage
export let authentificated = writable(false);

// Google Authentificator Layout Authentification
export let isGoogleAuthActivated = writable(false);
export let isGoogleAuthEnabled = writable(false);
export let qrGoogle = writable("");
export let googleAuth = writable(false); // Google Auth Profile Set
export let navbar = writable(true);// Navbar

// General user Infos
export let userLogin = writable("");
export let actualUsername = writable("");
export let userId = writable(0);
export let gameUserToInvite = writable("");

// Game Options
export let gameState = writable<GameState>();
export let clientColyseus = writable();
export let backgroundColor = writable("");
export let paddleSize = writable("");
export let ballSpeed = writable(0);
export let winnerScore = writable(0);
export let dataGame = writable(null);
export let leftPlayerUsername = writable('John');
export let rightPlayerUsername = writable('Tony');
export let InvitedUserLogin = writable('Bob');
export let InvitedUserId = writable(0);
export let inviteNotif = writable(false);
export let inviteNotifModal = writable(false);
export let iAmInvited = writable(false);



export let inGame = writable(false);
export let launchedGame = writable(false);


// DM - Chat
export let session: any = writable(null);
export let user: any = writable(null);
export let chanel: any = writable(null);
export let chanelname: any = writable(null);
export let dm: any = writable(null);
export let block: any = writable(null);
export let kickEndTimes: any = writable(null);
export let muteEndTimes: any = writable(null);