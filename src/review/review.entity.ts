import { GameEntity } from "../game/game.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReviewEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    isRecommended: boolean;

    @Column()
    creationDate: Date;

    @Column()
    content: string;

    @Column()
    author: string;

    @ManyToOne(() => GameEntity, game => game.reviews)
    game: GameEntity;
}
