import { ClassConstructor } from "class-transformer";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function CommentOrPost<T>(
    type: ClassConstructor<T>,
    propBValue: (o: T) => number,
    validationOptions?: ValidationOptions
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          constraints: [propBValue],
          validator: CommentOrPostConstraint,
        });
      };
};


@ValidatorConstraint({ name: 'CommentOrPost' })
export class CommentOrPostConstraint implements ValidatorConstraintInterface {
  
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        const [fn] = validationArguments.constraints;
        const propertyBValue = fn(validationArguments.object);
        console.log(value, propertyBValue);
        
        if(
            (value && propertyBValue) || (!value && !propertyBValue)
        ) return false;
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const [constraintProp]: (() => any)[] = validationArguments.constraints;
        return `${constraintProp} & ${validationArguments.property} should not be null, and not be provided at the same time!`
    }
}