import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Card } from 'src/card/card.entity';
import { CardField } from 'src/card-field/card-field.entity';
import { EnumValue } from 'src/card-field/enum-value.entity';

@Entity()
export class CardFieldEnumValue {
  @ManyToOne(() => Card, (card) => card.enumFields, { onDelete: 'CASCADE' })
  @JoinColumn()
  @PrimaryColumn({
    name: 'cardId',
    type: 'integer',
    primaryKeyConstraintName: 'PK_card_field_enum_id',
  })
  card: Card;

  // @ManyToOne(() => CardField, { onDelete: 'CASCADE' })
  // @JoinColumn()
  // @PrimaryColumn({
  //   name: 'fieldId',
  //   type: 'integer',
  //   primaryKeyConstraintName: 'PK_card_field_enum_id',
  // })
  // field: CardField;

  @ManyToOne(() => EnumValue, (val) => val.field, { onDelete: 'SET NULL' })
  @JoinColumn()
  @PrimaryColumn({
    name: 'valueId',
    type: 'integer',
    primaryKeyConstraintName: 'PK_card_field_enum_id',
  })
  value: EnumValue;
}
