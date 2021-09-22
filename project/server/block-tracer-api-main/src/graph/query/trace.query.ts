import { IsInt, IsString } from "class-validator";

export class TraceQuery {
    @IsString()
    from: string;

    @IsString()
    to: string;

    @IsInt()
    level: number;
}