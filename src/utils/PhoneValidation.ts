import { registerDecorator, ValidationOptions } from 'class-validator';
import { getConfigCountry } from '../config/country.config';

export function IsPhoneForCurrentCountry(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneForCurrentCountry',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          if (typeof value !== 'string') {
            return false;
          }
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
