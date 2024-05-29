import { IsNotEmpty, IsString } from "class-validator";

export class AwardDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly organization: string;

}
