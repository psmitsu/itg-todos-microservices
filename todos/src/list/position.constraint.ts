import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ListService } from './list.service';

// such validation seems bad idea
@ValidatorConstraint({ name: 'PositionInRange', async: true })
@Injectable()
export class PositionInRangeRule implements ValidatorConstraintInterface {
  constructor(private readonly listService: ListService) {}

  async validate(value: number) {
    if (value < 0) {
      return false;
    }

    const maxValue = await this.listService.getMaxPosition();

    if (value > maxValue) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Wrong range for position';
  }
}
