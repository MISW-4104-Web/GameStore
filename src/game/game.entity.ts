import { MinimumSpecEntity } from "../minimum-spec/minimum-spec.entity";
import { TagEntity } from "../tag/tag.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DevelopmentCompanyEntity } from "../development-company/development-company.entity";
import { AwardEntity } from "../award/award.entity";
import { ReviewEntity } from "../review/review.entity";

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    imageUrl: string;

    @Column()
    releaseDate: Date;

    @ManyToMany(() => TagEntity, tag => tag.games)
    tags: TagEntity[];

    @ManyToOne(() => MinimumSpecEntity, minimumSpec => minimumSpec.games)
    minimumRequirements: MinimumSpecEntity;

    @ManyToOne(() => DevelopmentCompanyEntity, developmentCompany => developmentCompany.games)
    developmentCompany: DevelopmentCompanyEntity;

    @OneToMany(() => AwardEntity, award => award.game)
    awards: AwardEntity[];

    @OneToMany(() => ReviewEntity, review => review.game)
    reviews: ReviewEntity[];
}
