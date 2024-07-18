import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CardFieldStringDto {
  @ApiProperty()
  @IsInt()
  fieldId: number;

  @ApiProperty()
  @IsString()
  value: string | null;
}

export class CardFieldEnumDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  fieldId: number | null;

  @ApiProperty()
  @IsInt()
  valueId: number;
}

export class CreateCardDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  listId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  position: number;

  @ApiProperty({
    type: () => CardFieldStringDto,
    isArray: true,
  })
  @IsOptional()
  stringFields: CardFieldStringDto[];

  @ApiProperty({
    type: () => CardFieldEnumDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  enumFields: CardFieldEnumDto[];

  // @ApiProperty({
  //   type: () => CardFieldNumberDto,
  //   isArray: true,
  // })
  // @IsOptional()
  // numberFields: CardFieldNumberDto[];
}
