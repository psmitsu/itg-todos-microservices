import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";

export class MoveCardDto {
  @ApiProperty()
  @IsInt()
  position: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  listId: number;
}
