import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameEntity } from "./game.entity";
import { ChatRoomMember } from "src/chat/chat_room_member.entity";
import { ChatMessage } from "src/chat/chat_message.entity";

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  // 3 Common infos to provide!
  @Column({ unique: true })
  login: string;
  @Column({ unique: true })
  userName: string;
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, default: null })
  refreshToken: string;

  // 2fa Google Authentificator
  @Column({ default: false })
  fa2: boolean;
  @Column({ nullable: true, default: null })
  fa2Secret: string;
  @Column({ nullable: true, default: null })
  fa2QRCode: string;

  // For Non-42 Users
  @Column({ default: false })
  hasPassword: boolean;
  @Column({ nullable: true, default: null })
  hash: string;
  @Column({ default: "images/defaultAvatar.jpg" })
  avatar: string;
  @Column({ default: null})
  resetAvatar: string;

  // 42 Users
  @Column({ default: false })
  is42: boolean;
  @Column({ nullable: true, default: null })
  id42: number;
  @Column({ nullable: true, default: null })
  lastName: string;
  @Column({ nullable: true, default: null, })
  firstName: string;

  // Friend System Management
  @Column('text', { array: true, default: [] })
  friends: string[]; // List of friend usernames

  @Column('text', { array: true, default: [] })
  friendRequestsSent: string[]; // List of requests sent to other user and waiting for answer

  @Column('text', { array: true, default: [] })
  pendindFriendRequests: string[]; // List of friend requests received

  // Block User Management
  @Column('text', { array: true, default: [] })
  blockedUser: string[]; // List of users I blocked

  @Column('text', { array: true, default: [] })
  blockedBy: string[]; // List of users who blocked me

  // Game
  @Column({ nullable: false, default: 1 })
  rank: number;
  @Column({ nullable: false, default: "Newbee" })
  title: string;
  @Column({ nullable: false, default: 0 })
  wonGameNbr: number;
  @Column({ nullable: false, default: 0 })
  lostGameNbr: number;

  // Game Match History
  @OneToMany(type => GameEntity, game => game.player1)
  gamesAsPlayer1: GameEntity[];

  @OneToMany(type => GameEntity, game => game.player2)
  gamesAsPlayer2: GameEntity[];

  // Chat
  @OneToMany(() => ChatRoomMember, member => member.user)
  chatRoomMembers: ChatRoomMember[];

  @OneToMany(() => ChatMessage, (message) => message.sender)
  messages: ChatMessage[];

  @BeforeInsert()
  emailToLowerCases() {
    this.email = this.email.toLowerCase();
  }

}