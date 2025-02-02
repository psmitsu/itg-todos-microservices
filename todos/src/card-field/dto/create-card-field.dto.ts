import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from '../card-field.entity';
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCardFieldDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['string', 'number', 'enum'] })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty()
  @IsInt()
  projectId: number;

  @ApiProperty({ required: false, isArray: true, type: 'string' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  enumValues: string[];
}
