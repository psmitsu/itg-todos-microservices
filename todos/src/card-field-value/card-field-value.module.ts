import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardFieldStringValue } from './card-field-string-value.entity';
import { CardFieldValueService } from './card-field-value.service';
import { CardFieldModule } from 'src/card-field/card-field.module';
import { CardFieldEnumValue } from './card-field-enum-value.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardFieldStringValue, CardFieldEnumValue]),
    CardFieldModule,
  ],
  providers: [CardFieldValueService],
  exports: [CardFieldValueService],
})
export class CardFieldValueModule {}
