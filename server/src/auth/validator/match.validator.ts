import { equals, registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function Match<T> (property: keyof T, validationOptions?: ValidationOptions) {
    return (object: unknown, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        })
    }
}


@ValidatorConstraint({ name: "Match" })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): boolean {
        const confirmPassword = (validationArguments.object)[validationArguments.constraints[0]];
        console.log(confirmPassword, value)
        return equals(confirmPassword, value);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `${validationArguments.constraints[0]} and ${validationArguments.property} does not match!`;
    }

}