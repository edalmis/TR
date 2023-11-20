import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class LeaderBoardEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => UserEntity)
	user: UserEntity;

	@Column()
	wonGames: number;
}