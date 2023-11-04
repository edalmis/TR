import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { LockNotSupportedOnGivenDriverError, Repository, EntityManager } from 'typeorm';
import { ChatRoom } from './chat_room.entity';
import { ChatMessage } from './chat_message.entity';
import { ChatRoomMember } from './chat_room_member.entity';
import { UserEntity } from 'src/users/orm/user.entity';
import { title } from 'process';
import { UserService } from 'src/users/user.service';
import { RouterModule } from '@nestjs/core';
import * as bcrypt from 'bcrypt';


@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(ChatRoom)
		private readonly chatRoomRepository: Repository<ChatRoom>,
		@InjectRepository(ChatMessage)
		private readonly chatMessageRepository: Repository<ChatMessage>,
		@InjectRepository(ChatRoomMember)
		private readonly chatRoomMemberRepository: Repository<ChatRoomMember>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private entityManager: EntityManager,
		private readonly UserService: UserService,

	) { }

	// 1. Create a chat room
	async createChatRoom(payload: { title: string, isPrivate: boolean, password?: string, hashedPassword: string, userId: number, user: UserEntity }): Promise<ChatRoom> {
		// const room = await this.chatRoomRepository.findBy({title:title});
		// if(!room){ 
		const newRoom = this.chatRoomRepository.create(payload);

		const savedRoom = await this.chatRoomRepository.save(newRoom);
		// const user = await this..findOne(payload.userId);
		// Assigning the user as the owner of the room in ChatRoomMember entity
		// console.log("member details")
		console.log("USERRR", payload.user)
		const newOwner = this.chatRoomMemberRepository.create({
			user: payload.user,
			chatRoom: savedRoom,
			role: 'Owner',
		});
		// console.log("member details", newOwner)
		await this.chatRoomMemberRepository.save(newOwner);

		return savedRoom;

	}

	// 2. Join a chat room

	async joinChatRoom(
		usere: UserEntity,
		room: ChatRoom,
		role: string,
	): Promise<ChatRoomMember> {
		// Verify that the user and room exist
		// const user = await this.UserService.find_user_by_id( User.id);
		// let num = parseInt(roomId);
		const roome = await this.findChatRoom(room.id);
		// console.log('MY USER ', user)

		// console.log('MY ROOM ', room)
		if (!usere) {
			throw new Error('User does not exist');
		}

		if (!roome) {
			throw new Error('Room does not exist');
		}

		// Check if the user is already a member of the chat room
		const a = await this.isUserMemberOfRoom(usere.id, room.id)
		console.log('a', a)
		if (a != false) {
			console.log('existing member')
			// return await this.chatRoomMemberRepository.findOne({where: {user:{id : user.id}, chatRoom:{id: room.id}}});}
			// console.error('Error checking room membership:');
			return;
		}
		else {
			// throw new Error('User is already a member of this room');
			console.log('new member')

			//-----------------
			const newMember = this.chatRoomMemberRepository.create({
				user: usere,
				chatRoom: room,
				role: 'Participant',
			});
			console.log("member details", newMember)

			return await this.chatRoomMemberRepository.save(newMember);
		}



	}

	async isUserMemberOfRoom(userId: number, roomId: string): Promise<boolean> {
		try {
			const existingMember = await this.chatRoomMemberRepository.find({
				where: { user: { id: userId }, chatRoom: { id: roomId } }
			});
			return existingMember.length > 0;
		} catch (error) {
			console.error('Error checking room membership:', error);
			throw false;
		}
	}


	// 3. Leave a chat room
	async leaveChatRoom(memberId: number): Promise<void> {
		await this.chatRoomMemberRepository.delete(memberId);
	}

	// 4. Send a message in a chat room


	async sendMessage(content: string, senderUser: UserEntity, login: string, roomId: string): Promise<ChatMessage> {
		// Ensure room exists

		const room = await this.chatRoomRepository.findOne({ where: { id: roomId } });
		if (!room) {
			throw new Error("Room not found");
		}

		// Ensure sender exists in the chat room members list
		const chatRoomMember = await this.chatRoomMemberRepository.findOne({ where: { user: { id: senderUser.id }, chatRoom: { id: roomId } } });

		if (!chatRoomMember) {
			console.log('Failed senderUserId:', senderUser.id);  // Log the failed senderUserId for clarity
			throw new Error("Sender not found in chat room members.");
		}

		// const senderId = chatRoomMember.id;  // This is the ID you should use as senderId for ChatMessage
		const senderId = senderUser.id
		const senderLogin = login
		// Create the new message
		const newMessage = this.chatMessageRepository.create({ content, senderId, senderLogin, roomId });

		// Log the message details
		console.log('Attempting to save message with details:', {
			content: content,
			senderId: senderId,
			roomId: roomId,
			senderLogin: senderLogin
		});

		// Save the message
		return await this.chatMessageRepository.save(newMessage);
	}


	// 5. List all messages in a chat room
	async listMessages(id: string): Promise<ChatMessage[]> {
		// console.log('---ID----',id)
		return await this.chatMessageRepository.find({ where: { roomId: id } });
	}

	// 6. List all chat rooms a user is part of
	// async listUserRooms(userId: number): Promise<ChatRoom[]> {
	//   const memberEntities = await this.chatRoomMemberRepository.find({where: {memberId: userId}, relations: ['room']});
	//   return memberEntities.map(member => member.chatRoom);
	// }

	// 7. Update chat room details
	async updateRoom(roomId: string, updatedFields: Partial<ChatRoom>): Promise<ChatRoom> {
		await this.chatRoomRepository.update(roomId, updatedFields);
		return await this.chatRoomRepository.findOne({ where: { id: roomId } });
	}

	// 8. Delete a chat room
	//   async deleteRoom(roomId: number): Promise<void> {
	//     await this.chatRoomRepository.delete(roomId);
	//   }

	// 9.List all rooms on server
	async listAllRooms(): Promise<ChatRoom[]> {
		return await this.chatRoomRepository.find();
	}

	//---------------

	async findRoomIdByTitle(title: string): Promise<string | null> {
		const room = await this.chatRoomRepository.findOne({ where: { title: title } });
		return room ? room.id : null;
	}
	//-----------
	//  10. List all users in channel
	// async getAllUsersInRoomWithRoles(roomId: string): Promise<number[]> {
	//   console.log('here-*-*-*-*-**-*-*-')
	//   // return await this.chatRoomMemberRepository.find({ where: { roomId }});

	//   const room = await this.chatRoomRepository.findOne({where: {id: roomId}});
	//   console.log('room-------------------------------------------->>' , room)
	//   return room.id42s;
	//   // try {
	//   return await this.chatRoomMemberRepository.find({
	//     where: { roomId },
	//     relations: ['user', 'room'], // Ensure these relations exist and adjust as needed
	//   });
	// } catch (error) {
	//   console.error("An error occurred while fetching users:", error);
	//   throw error;  // Re-throwing the error to be handled by the calling function
	// }
	// }
	async findByRoomId(roomId: string): Promise<ChatRoomMember> {
		const room = await this.chatRoomMemberRepository.findOne({
			where:
			{
				chatRoom: { id: roomId }
			}
		});
		return room;
	}



	async findMembersByRoomId(roomId: string): Promise<ChatRoomMember[]> {
		const room = await this.chatRoomRepository.findOne({
			where: { id: roomId },
			// relations: ['members', 'members.user'], // Notice the nested relation
			relations: ['members', 'members.user'], // Notice the nested relation

		});

		// room.members.forEach(member => {
		//   console.log("Member's user:", member.user);
		// });

		if (!room) {
			// Handle the case where the room is not found
			throw new Error(`Room with ID ${roomId} not found`);
		}

		// console.log('all+---------------+-+------------', room.members);
		return room.members;
	}

	async findMemberByUserId(User: UserEntity): Promise<ChatRoomMember> {
		const member = await this.chatRoomMemberRepository.findOne({
			where: {
				user: { id: User.id }
			}
		});

		return member;
	}

	async findMemberInChatRoom(memberId: number, chatRoomId: string): Promise<ChatRoomMember> {
		const member = await this.chatRoomMemberRepository.findOne({
			where: {
				user: { id: memberId },

				chatRoom: { id: chatRoomId }
			}
		});

		return member;
	}

	async findChatRoom(roomId: string): Promise<ChatRoom> {
		try {
			const room = await this.chatRoomRepository.findOne({ where: { id: roomId } });

			if (!room) {
				throw new Error(`Room with ID ${roomId} not found`);
			}

			return room;
		} catch (error) {
			throw new Error(`Room with ID ${roomId} not found`);
		}
	}

	// async findChatRoomBanned(roomId: string): Promise<any> {

	//     const room = await this.chatRoomRepository.findOne({
	//       where: { id: roomId },
	//       relations: ['bannedUsers']
	//     });

	//     if (room && room.bannedUsers) {
	//       return room.bannedUsers.some(bannedUser => bannedUser.id === userId);
	//   } else {
	//       // Handle case where room or bannedUsers is undefined
	//       return false;
	//   }
	//   }

	async incrementUtilisateurs(roomId: string): Promise<void> {
		try {
			await this.chatRoomRepository.increment({ id: roomId }, 'utilisateurs', 1);
		} catch (error) {
			// Handle error appropriately, maybe throw an application exception here
			console.error('Error updating the utilisateurs column', error);
		}
	}

	async verifyPassword(roomId: string, enteredPassword: string): Promise<boolean> {
		const room = await this.findChatRoom(roomId);

		if (!room) {
			throw new NotFoundException(`Room with ID ${roomId} not found`);
		}

		// Note: This assumes that you are storing plain text passwords (which is not recommended).
		// Ideally, you should be hashing passwords and comparing hashes.
		return room.password === enteredPassword;
	}

	async doesRoomExist(roomTitle: string): Promise<boolean> {
		// This is just an example. You will have to fetch from your DB in a way that suits your ORM or DB access method
		const room = await this.chatRoomRepository.findOne({ where: { title: roomTitle } });
		return !!room;
	}

	async doesOwnerExist(user: UserEntity, roomId: string): Promise<boolean> {

		const ownerMember = await this.chatRoomMemberRepository
			.createQueryBuilder('chatRoomMember')
			.innerJoin('chatRoomMember.chatRoom', 'chatRoom')
			.innerJoin('chatRoomMember.user', 'user')
			.where('chatRoom.id = :roomId', { roomId })
			.andWhere('user.id = :userId', { userId: user.id })
			.andWhere('chatRoomMember.role = :role', { role: 'Owner' })
			.getOne();

		return !!ownerMember;  // Returns true if ownerMember exists, otherwise false
	}

	//------------------------------OFFLINE ADDINGS----------------------------===============
	async leaveeChatRoom(usere: UserEntity, room: ChatRoom): Promise<void> {
		// Verify that the user and room exist
		const roome = await this.findChatRoom(room.id);

		if (!usere) {
			throw new Error('User does not exist');
		}

		if (!roome) {
			throw new Error('Room does not exist');
		}

		// Check if the user is a member of the chat room
		const isMember = await this.isUserMemberOfRoom(usere.id, room.id);
		if (!isMember) {
			console.warn('User is not a member of this room');
			return;
		}

		try {
			// Remove user from the chat room
			// await this.chatRoomMemberRepository.delete(usere, room );
			console.log('User successfully left the room');
		} catch (error) {
			console.error('Error while removing user from room:', error.message);
			throw new Error('Unable to remove user from room');
		}
	}

	async updateMember(member: ChatRoomMember): Promise<ChatRoomMember> {
		return await this.chatRoomMemberRepository.save(member);
	}

	async updateRoome(room: ChatRoom): Promise<ChatRoom> {
		return await this.chatRoomRepository.save(room);
	}

	async eligibleMember(userId: number, roomId: string): Promise<Boolean> {
		const member = await this.findMemberInChatRoom(userId, roomId);
		if (member.isKicked == false && member.isBanned == false || await this.isUserBanned(userId, roomId) == false)
			return true;
		return false;
	}

	async deleteMember(member: ChatRoomMember): Promise<{ success: boolean; message: string }> {

		try {
			const tri = await this.chatRoomMemberRepository.remove(member);
			if (tri)
				return { success: true, message: "Member deleted successfully" };
			else {
				return { success: false, message: "Member not found" };
			}
		} catch (error) {
			console.error('Error deleting member:', error);
			throw new Error("There was an error deleting the member");
		}
	}

	async deleteRoom(room: ChatRoom): Promise<{ success: boolean; message: string }> {

		try {
			await this.chatRoomRepository.remove(room);
			return { success: true, message: "Room deleted successfully" };


		} catch (error) {
			console.error('Error deleting Room:', error);
			return { success: false, message: "There was an error deleting the room" };
		}
	}

	async makeOwner(room: ChatRoom): Promise<{ success: boolean; message: string }> {
		try {
			const members = await this.findMembersByRoomId(room.id);
			if (members && members.length > 0) {
				const adminMembers = members.filter(member => member.role === 'Admin');

				if (adminMembers.length > 0) {
					const nextOwner = adminMembers.reduce((prev, curr) => {
						return prev.id < curr.id ? prev : curr;
					});

					// Update role to 'Owner'
					nextOwner.role = 'Owner';
					await this.chatRoomMemberRepository.save(nextOwner); // Assuming you have memberRepository available

					return { success: true, message: "Ownership transferred successfully" };
				} else {
					return { success: false, message: "No admins found to transfer ownership" };
				}
			} else {
				return { success: false, message: "No members found in the room" };
			}
		} catch (error) {
			console.error('Error promoting member to owner:', error);
			throw new Error("There was an error promoting the member to owner");
		}
	}

	// in your chatService.ts (or equivalent service file)

	async isUserBanned(userId: number, roomId: string): Promise<boolean> {
		try {
			const room = await this.chatRoomRepository.findOne({
				where: { id: roomId },
				relations: ['bannedUsers']
			});

			if (room && room.bannedUsers) {
				return room.bannedUsers.some(bannedUser => bannedUser.id === userId);
			} else {
				// Handle case where room or bannedUsers is undefined
				return false;
			}
		} catch (error) {
			throw new Error(`Error checking ban status: ${error.message}`);
		}
	}


	async unbanUser(userId: number, roomId: string): Promise<void> {
		try {
			const room = await this.chatRoomRepository.findOne({
				where: { id: roomId },
				relations: ['bannedUsers']
			});
			console.log('userr', userId)
			if (room && room.bannedUsers) {
				const updatedBannedUsers = room.bannedUsers.filter(user => user.id !== userId);
				room.bannedUsers = updatedBannedUsers;
				await this.chatRoomRepository.save(room);
				console.log("ROOOOOOOOMMMMMMM", room)
			}
		} catch (error) {
			throw new Error(`Error unbanning user: ${error.message}`);
		}
	}

	async updateRoomPassword(roomId: string, newPassword: string): Promise<ChatRoom> {
		// Find the chat room by its ID
		const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });

		if (!chatRoom) {
			throw new Error('Chat room not found.');
		}

		// Update the password
		if (!chatRoom.isPrivate)
			chatRoom.isPrivate = true;
		chatRoom.password = newPassword;
		let hashedPassword;
		const saltRounds = 10; // or another number of rounds
		hashedPassword = await bcrypt.hash(chatRoom.password, saltRounds);
		chatRoom.hashedPassword = hashedPassword;
		// Save the updated chat room entity
		await this.chatRoomRepository.save(chatRoom);

		return chatRoom;
	}

	async cancelRoomPassword(roomId: string): Promise<ChatRoom> {
		// Find the chat room by its ID
		const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });

		if (!chatRoom) {
			throw new Error('Chat room not found.');
		}

		// Update the password
		if (chatRoom.isPrivate) {
			chatRoom.isPrivate = false;
			chatRoom.password = "";
			chatRoom.hashedPassword = "";
			await this.chatRoomRepository.save(chatRoom);
		}

		// Save the updated chat room entity


		return chatRoom;
	}

	async getRoomHashedPassword(roomId: string): Promise<string | null> {
		const room = await this.chatRoomRepository.findOne({ where: { id: roomId } });
		return room ? room.hashedPassword : null;
	}

}