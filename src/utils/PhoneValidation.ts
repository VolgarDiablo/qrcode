import { registerDecorator, ValidationOptions } from 'class-validator';
import { getConfigCountry } from '../config/country.config';

export function IsPhoneForCurrentCountry(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneForCurrentCountry',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          const config = getConfigCountry();
          return config.phoneRegex.test(value);
        },
        defaultMessage(): string {
          const config = getConfigCountry();
          return `Phone number must match country format: ${config.code}`;
        },
      },
    });
  };
}
