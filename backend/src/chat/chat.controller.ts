import { Controller, Body, Post } from '@nestjs/common';
import { ChatService } from './chat.service'; // Assuming you have a ChatService
import { VerifyRoomDto } from './dto/verify-room-dto'
import * as bcrypt from 'bcrypt';

@Controller('chat')
export class ChatController {

	constructor(private readonly chatService: ChatService) { }

	// @Post('verify-room-password')
	// async verifyRoomPassword(@Body() data: VerifyRoomDto): Promise<any> {
	//     const { roomId, password } = data;

	//     // Fetch room by roomId and compare passwords
	//     const room = await this.chatService.verifyPassword(roomId, password);

	//     if (room) {
	//         return { success: true };
	//     } else {
	//         return { success: false };
	//     }
	// }

	// ... add other chat-related methods here
	// @Post('verify-room-password')
	// async verifyRoomPassword(@Body()data:  VerifyRoomDto): Promise<any> {
	//     // console.log("Received request to verify room password", verifyRoomDto);
	//     // Implementation goes here.
	//     const { roomId, password } = data;

	//     //     // Fetch room by roomId and compare passwords
	//         const room = await this.chatService.verifyPassword(roomId, password);

	//         if (room) {
	//             return { success: true };
	//         } else {
	//             return { success: false };
	//         }
	//     }
	@Post('verify-room-password')

	async verifyRoomPassword(@Body() data: VerifyRoomDto): Promise<any> {
		//   console.log("Received request to verify room password", VerifyRoomDto);
		// Implementation goes here.
		//     const { roomId, password } = data;
		const { roomId, password } = data;
		// console.log('passsssss', password)

		// Fetch hashed password for the room by roomId from the database
		const hashedPassword = await this.chatService.getRoomHashedPassword(roomId);

		if (!hashedPassword) {
			// Room not found or no password set for room
			return { success: false };
		}
		// Use bcrypt to compare the provided password with the stored hashed password
		const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

		if (isPasswordMatch) {
			return { success: true };
		} else {
			return { success: false };
		}
	}
	// If successful verification:
	//   return { success: true };

}