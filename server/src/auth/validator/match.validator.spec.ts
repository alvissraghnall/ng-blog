import {
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Match, MatchConstraint } from './match.validator';

import { registerDecorator, equals } from 'class-validator';

jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  registerDecorator: jest.fn(),
  equals: jest.fn(),
}));

const mockRegisterDecorator = registerDecorator as jest.Mock;
const mockEquals = equals as jest.Mock;

describe('MatchConstraint', () => {
  let constraint: ValidatorConstraintInterface;

  beforeEach(() => {
    constraint = new MatchConstraint();
  });

  it('should return true when values are equal', () => {
    mockEquals.mockReturnValue(true);

    const args: ValidationArguments = {
      value: 'password123',
      constraints: ['password'],
      targetName: 'CreateUserDto',
      object: {
        password: 'password123',
        confirmPassword: 'password123',
      },
      property: 'confirmPassword',
    };

    const result = constraint.validate('password123', args);

    expect(mockEquals).toHaveBeenCalledWith('password123', 'password123');
    expect(result).toBe(true);
  });

  it('should return false when values are not equal', () => {
    mockEquals.mockReturnValue(false);

    const args: ValidationArguments = {
      value: 'password456',
      constraints: ['password'],
      targetName: 'CreateUserDto',
      object: {
        password: 'password123',
        confirmPassword: 'password456',
      },
      property: 'confirmPassword',
    };

    const result = constraint.validate('password456', args);

    expect(mockEquals).toHaveBeenCalledWith('password123', 'password456');
    expect(result).toBe(false);
  });

  it('should return a default error message', () => {
    const args: ValidationArguments = {
      value: 'password456',
      constraints: ['password'],
      targetName: 'CreateUserDto',
      object: {},
      property: 'confirmPassword',
    };

    const message = constraint.defaultMessage(args);
    expect(message).toBe('password and confirmPassword does not match!');
  });
});

describe('Match Decorator', () => {
  beforeEach(() => {
    mockRegisterDecorator.mockClear();
  });

  it('should call registerDecorator with correct options', () => {
    const mockObject = { constructor: class TestDto {} };
    const propertyName = 'confirmPassword';
    const validationOptions = { message: 'Passwords must match' };

    Match('password', validationOptions)(mockObject, propertyName);

    expect(mockRegisterDecorator).toHaveBeenCalledWith({
      target: mockObject.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: ['password'],
      validator: MatchConstraint,
    });
  });
});
