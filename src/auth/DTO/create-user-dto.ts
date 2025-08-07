import {
  ValidateNested,
  IsOptional,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SignupEmailDTO } from './signup-email.dto';
import { SignupPhoneDTO } from './signup-phone.dto';

@ValidatorConstraint({ name: 'EmailOrPhoneRequired', async: false })
export class EmailOrPhoneRequired implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as CreateUserDTO;
    return obj.emailSignup !== undefined || obj.phoneSignup !== undefined;
  }

  defaultMessage(_: ValidationArguments) {
    return 'Either emailSignup or phoneSignup must be provided';
  }
}

export class CreateUserDTO {
  @IsIn(['email', 'phone'])
  mode: 'email' | 'phone';

  @IsOptional()
  @ValidateNested()
  @Type(() => SignupEmailDTO)
  emailSignup?: SignupEmailDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => SignupPhoneDTO)
  phoneSignup?: SignupPhoneDTO;

  @Validate(EmailOrPhoneRequired)
  dummyField = true;
}
