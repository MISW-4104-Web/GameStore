import { GameEntity } from "../game/game.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DevelopmentCompanyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    about: string;

    @Column()
    website: string;

    @Column()
    logoUrl: string;

    @OneToMany(() => GameEntity, game => game.developmentCompany)
    games: GameEntity[];
}
