import {
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Column,
	OneToMany
} from 'typeorm';

import { ChatRoom } from './chat_room.entity'
import { ChatMessage } from './chat_message.entity';
import { UserEntity } from 'src/users/orm/user.entity';



@Entity()
export class ChatRoomMember {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.members)
	chatRoom: ChatRoom;
	// @JoinColumn({ name: "roomId" })  // Explicitly specify the foreign key column name

	@ManyToOne(() => UserEntity, user => user.chatRoomMembers)
	user: UserEntity;
	// @JoinColumn({ name: "userId" })  // Explicitly specify the foreign key column name

	@Column()
	role: string; // 'Owner', 'Admin', 'Participant'

	@Column({ default: false })
	isBanned: boolean;

	@Column({ default: false })
	isKicked: boolean;

	@Column({ default: false })
	isMuted: boolean

	@OneToMany(() => ChatMessage, (message) => message.sender)
	messages: ChatMessage[]



	// @ManyToOne(() => UserEntity)
	// @JoinColumn({ name: 'userId', referencedColumnName: 'id42' }) // referencing id42 in User entity
	// user: UserEntity;
	@Column({ type: 'timestamp', nullable: true })
	kickedTime: Date; // Timestamp when kicked

	@Column({ type: 'int', nullable: true })
	kickDuration: number; // Duration of kick in minutes

	@Column({ type: 'timestamp', nullable: true })
	mutedTime: Date; // Timestamp when muted

	@Column({ type: 'int', nullable: true })
	mutedDuration: number; // Duration of mute in minutes


}