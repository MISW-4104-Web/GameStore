import { IsBoolean, IsDateString, IsNotEmpty, IsObject, IsString } from "class-validator";

export class ReviewDto {

    @IsNotEmpty()
    @IsBoolean()
    readonly isRecommended: boolean;

    @IsNotEmpty()
    @IsDateString()
    readonly creationDate: Date;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsNotEmpty()
    @IsString()
    readonly author: string;

    @IsNotEmpty()
    @IsObject()
    readonly game: object;
}
