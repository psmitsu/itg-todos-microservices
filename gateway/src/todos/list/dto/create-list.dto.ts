import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  projectId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  position: number;
}
