import { IsDateString, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { DevelopmentCompanyDto } from "../development-company/development-company.dto";
import { MinimumSpecDto } from "../minimum-spec/minimum-spec.dto";

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
    readonly minimumRequirements: MinimumSpecDto;

    @IsNotEmpty()
    @IsObject()
    readonly developmentCompany: DevelopmentCompanyDto;

}
