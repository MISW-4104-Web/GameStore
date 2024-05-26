import { GameEntity } from "../game/game.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TagEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => GameEntity, game => game.tags)
    @JoinTable()
    games: GameEntity[];
}
