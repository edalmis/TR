import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	Column,
	JoinColumn
} from 'typeorm';
import { UserEntity } from '../users/orm/user.entity';
import { ChatRoom } from './chat_room.entity';
import { ChatRoomMember } from './chat_room_member.entity';

@Entity('chat_message')
export class ChatMessage {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@Column()
	content: string;

	@Column()
	senderId: number;

	@Column()
	senderLogin: string;

	@Column()
	roomId: string;

	@ManyToOne(() => UserEntity, user => user.messages)
	// @JoinColumn({ name: 'senderId' }) // Explicitly specify the foreign key column
	sender: UserEntity;

	@ManyToOne(() => ChatRoom, (room) => room.messages, { cascade: true })
	// @JoinColumn({ name: 'roomId' }) // Explicitly specify the foreign key column
	room: ChatRoom;

	// @ManyToOne(() => ChatRoomMember, (member) => member.messages)
	// sender: ChatRoomMember;

}