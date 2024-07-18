import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCardFieldDto } from './create-card-field.dto';

// prevent changing project, it will mess up too much
// now that I think of it, changing data type will also mess up too much
export class UpdateCardFieldDto extends PartialType(
  OmitType(CreateCardFieldDto, ['type', 'projectId'] as const),
) {}
