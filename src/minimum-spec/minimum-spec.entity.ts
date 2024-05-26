import { GameEntity } from "../game/game.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MinimumSpecEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    os: string;

    @Column()
    processor: string;

    @Column()
    ramGb: number;

    @Column()
    videoCard: string;

    @Column()
    storageGb: number;

    @OneToMany(() => GameEntity, game => game.minimumRequirements)
    games: GameEntity[];
}
