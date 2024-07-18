import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class MoveListDto {
  @ApiProperty()
  @IsInt()
  // @Validate(PositionInRangeRule) // validating here seems bad
  position: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  projectId: number;
}
