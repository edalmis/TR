import {
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable,
	JoinColumn,
	OneToMany,
	ManyToOne,
	Column,
} from 'typeorm';
import { UserEntity } from '../users/orm/user.entity';
import { ChatMessage } from './chat_message.entity';
import { ChatRoomMember } from './chat_room_member.entity';

@Entity('chat_rooms')
export class ChatRoom {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ length: 100 })
	title: string;


	@Column({ default: false })
	isPrivate: boolean;

	@Column({ nullable: true })
	password: string;


	@Column({ nullable: true }) // or just @Column() if you don't want to make it nullable
	hashedPassword: string;
	// @OneToMany(() => ChatRoomMember, (member) => member.chatRoom)
	// @JoinColumn({ name: "id" }) 
	// members: ChatRoomMember[];

	@OneToMany(() => ChatRoomMember, (member) => member.chatRoom)
	members: ChatRoomMember[];

	@OneToMany(() => ChatMessage, (message) => message.room)
	messages: ChatMessage[];

	// @OneToMany(() => ChatRoomMember, (member) => member.chatRoom)
	// members: ChatRoomMember[];

	// Added this new relationship for banned users
	@ManyToMany(() => UserEntity)
	@JoinTable()
	bannedUsers: UserEntity[];


}
