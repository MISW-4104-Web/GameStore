import { GameEntity } from "../game/game.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AwardEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    organization: string;

    @ManyToOne(() => GameEntity, game => game.awards)
    game: GameEntity;
}
