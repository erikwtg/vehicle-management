import { IsInt, IsOptional, Min } from 'class-validator';

export class CursorPaginationDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 10;
}
