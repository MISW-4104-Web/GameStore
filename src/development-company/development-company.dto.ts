import { IsNotEmpty, IsString } from "class-validator";

export class DevelopmentCompanyDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly about: string;

    @IsNotEmpty()
    @IsString()
    readonly website: string;

    @IsNotEmpty()
    @IsString()
    readonly logoUrl: string;

}
