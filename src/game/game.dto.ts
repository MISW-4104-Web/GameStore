import { IsDateString, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class GameDto {

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsNotEmpty()
    @IsString()
    readonly imageUrl: string;

    @IsNotEmpty()
    @IsDateString()
    readonly releaseDate: Date;

    @IsNotEmpty()
    @IsObject()
    readonly minimumRequirements: object;

    @IsNotEmpty()
    @IsObject()
    readonly developmentCompany: object;

}
