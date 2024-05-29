import { IsNotEmpty, IsNumber } from "class-validator";

export class MinimumSpecDto {

    @IsNotEmpty()
    readonly os: string;

    @IsNotEmpty()
    readonly processor: string;

    @IsNotEmpty()
    @IsNumber()
    readonly ramGb: number;

    @IsNotEmpty()
    readonly videoCard: string;

    @IsNotEmpty()
    @IsNumber()
    readonly storageGb: number;

}
