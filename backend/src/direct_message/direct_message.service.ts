import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './direct_message.entity';
import { DirectMessageRoom } from './direct_message_room.entity';
import { UserService } from 'src/users/user.service';

interface EnhancedDirectMessageRoom extends DirectMessageRoom {
	userOneDetails: { userName: string; avatar: string; };
	userTwoDetails: { userName: string; avatar: string; };
}

// TODO try catch

@Injectable()
export class DirectMessageService {
	constructor(
		@InjectRepository(DirectMessage)
		private readonly dmRepository: Repository<DirectMessage>,
		@InjectRepository(DirectMessageRoom)
		private readonly roomRepository: Repository<DirectMessageRoom>,
		private readonly userService: UserService
	) { }

	sayCoucou() {
		console.log("coucoucou")
	}

	//     async sendMessage(sender: number, receiver: number, messageText: string): Promise<DirectMessage> {
	//     let room = await this.roomRepository.findOne({
	//         where: [
	//             { userOneId: sender, userTwoId: receiver },
	//             { userOneId: receiver, userTwoId: sender },
	//         ],
	//     });

	//     const userSender = await this.userService.find_user_by_id(sender);
	//     if (!room) {
	//         room = new DirectMessageRoom();
	//         room.userOneId = sender;
	//         room.userTwoId = receiver;
	//         await this.roomRepository.save(room);
	//     }

	//     const message = new DirectMessage();
	//     message.room = room;
	//     message.sendBy = sender;
	//     message.sendTo = receiver;
	//     message.message = messageText;
	//     message.senderLogin = userSender.login;

	//     await this.dmRepository.save(message);

	//     return message;
	// }

	// async sendMessage(sender: number, receiver: number, messageText: string): Promise<DirectMessage> {
	//     // Step 1 & 2: Check or create room
	//     let room = await this.roomRepository.findOne({
	//       where: [
	//         { userOneId: sender, userTwoId: receiver },
	//         { userOneId: receiver, userTwoId: sender },
	//       ],
	//     });
	//     console.log('room found', room)
	//     const usere=await this.userService.find_user_by_id(sender);
	//     if (!room) {
	//       room = new DirectMessageRoom();

	//       room.userOneId = sender;
	//       room.userTwoId = receiver;

	//       console.log('bizarre', room)
	//       await this.roomRepository.save(room);
	//     }

	//     // Step 3: Add message to room
	//     const message = new DirectMessage();
	//     message.room = room;
	//     message.sendBy = sender;
	//     message.sendTo = receiver;
	//     message.message = messageText;
	//     message.roomId = room.id;
	//     message.senderLogin = usere.login

	//     await this.dmRepository.save(message);

	//     return message;
	//   }

	// async findAllRoomsForUser(userId: number): Promise<DirectMessageRoom[]> {
	//     const rooms = await this.roomRepository.find({
	//         where: [
	//             { userOneId: userId },
	//             { userTwoId: userId },
	//         ],
	//     });

	//     // temporary solution
	//     const enhancedRooms = [];
	//     for (const room of rooms) {
	//       const userOne = await this.userService.find_user_by_id(room.userOneId);
	//       const userTwo = await this.userService.find_user_by_id(room.userTwoId);

	//       if (!userOne || !userTwo) {
	//           // Log the issue and continue to the next iteration
	//           console.error(`Missing user details for room ID: ${room.id}`);
	//           continue;
	//       }

	//       enhancedRooms.push({
	//           ...room,
	//           userOne: {
	//               userName: userOne.userName,
	//               avatar: userOne.avatar,
	//           },
	//           userTwo: {
	//               userName: userTwo.userName,
	//               image: userTwo.avatar,
	//           },
	//       });
	//   }

	// for (const room of rooms) {
	//     const userOne = await this.userService.find_user_by_id(room.userOneId);
	//     const userTwo = await this.userService.find_user_by_id(room.userTwoId);

	//     enhancedRooms.push({
	//         ...room,
	//         userOne: {
	//             userName: userOne.userName,
	//             avatar: userOne.avatar,
	//         },
	//         userTwo: {
	//           userName: userTwo.userName,
	//           image: userTwo.avatar,
	//         },
	//     });
	// }

	// return enhancedRooms;
	// }

	async sendMessage(sender: number, receiver: number, messageText: string): Promise<DirectMessage> {
		const userSender = await this.userService.find_user_by_id(sender);
		const userReceiver = await this.userService.find_user_by_id(receiver);

		let room = await this.roomRepository.createQueryBuilder("room")
			.leftJoinAndSelect("room.userOne", "userOne")
			.leftJoinAndSelect("room.userTwo", "userTwo")
			.where("userOne.id = :senderId AND userTwo.id = :receiverId", { senderId: userSender.id, receiverId: userReceiver.id })
			.orWhere("userOne.id = :receiverId AND userTwo.id = :senderId", { senderId: userSender.id, receiverId: userReceiver.id })
			.getOne();
		if (!room) {
			room = new DirectMessageRoom();
			room.userOne = userSender;
			room.userTwo = userReceiver;
			await this.roomRepository.save(room);
		}

		const message = new DirectMessage();
		message.room = room;
		message.roomId = room.id
		message.sendBy = sender;
		message.sendTo = receiver;
		message.message = messageText;
		message.senderLogin = userSender.userName;
		message.recieverLogin = userReceiver.userName;

		const mes = await this.dmRepository.save(message);

		return mes;
	}

	async findAllRoomsForUser(userId: number): Promise<EnhancedDirectMessageRoom[]> {
		const rooms = await this.roomRepository.createQueryBuilder("room")
			.leftJoinAndSelect("room.userOne", "userOne")
			.leftJoinAndSelect("room.userTwo", "userTwo")
			.where("userOne.id = :userId", { userId })
			.orWhere("userTwo.id = :userId", { userId })
			.getMany();

		const enhancedRooms: EnhancedDirectMessageRoom[] = rooms.map(room => ({
			...room,
			userOneDetails: {
				userName: room.userOne.userName,
				avatar: room.userOne.avatar,
			},
			userTwoDetails: {
				userName: room.userTwo.userName,
				avatar: room.userTwo.avatar,
			},
		}));

		return enhancedRooms;
	}




	async findAllMessagesForRoom(roomId: number): Promise<DirectMessage[]> {
		const messages = await this.dmRepository.find({
			where: { roomId: roomId },
			order: { date: 'ASC' } // Order by date in ascending order, you can also use 'DESC' for descending
		});
		return messages;
	}

	async clearDatabase() {
		await this.roomRepository.clear()
		await this.dmRepository.clear()
	}
}