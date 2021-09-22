import { IsInt, IsOptional } from "class-validator";
import config from "src/config";

export class PageQuery {
    @IsInt()
    @IsOptional()
    limit?: number = config.DEFAULT_PAGE_SIZE;

    @IsInt()
    @IsOptional()
    offset?: number = 0;
}