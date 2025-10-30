import { DataSource } from 'typeorm';
import { ValidationArguments } from 'class-validator';
import { IsUniqueConstraint, IsUnique } from './is-unique';

import { registerDecorator } from 'class-validator';

jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'), 
  registerDecorator: jest.fn(), 
}));

const mockRepository = {
  findOne: jest.fn(),
};

const mockDataSource = {
  getRepository: jest.fn().mockReturnValue(mockRepository),
};

const mockRegisterDecorator = registerDecorator as jest.Mock;

describe('IsUniqueConstraint', () => {
  let constraint: IsUniqueConstraint;

  beforeEach(() => {

    mockRepository.findOne.mockClear();
    mockDataSource.getRepository.mockClear();

    constraint = new IsUniqueConstraint(mockDataSource as any as DataSource);
  });

  const mockArgs = (
    model: string,
    field: string,
    value: any,
  ): ValidationArguments => ({
    value: value,
    constraints: [model, field],
    targetName: '',
    object: {},
    property: field,
  });

  it('should return false if the entity exists', async () => {
    const args = mockArgs('User', 'email', 'test@example.com');
    const existingUser = { id: 1, email: 'test@example.com' };

    mockRepository.findOne.mockResolvedValue(existingUser);

    const isValid = await constraint.validate('test@example.com', args);

    expect(mockDataSource.getRepository).toHaveBeenCalledWith('User');

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: {
        email: 'test@example.com',
      },
    });

    expect(isValid).toBe(false);
  });

  it('should return true if the entity does not exist', async () => {
    const args = mockArgs('User', 'username', 'newuser');

    mockRepository.findOne.mockResolvedValue(null);

    const isValid = await constraint.validate('newuser', args);

    expect(mockDataSource.getRepository).toHaveBeenCalledWith('User');

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: {
        username: 'newuser',
      },
    });

    expect(isValid).toBe(true);
  });
});

describe('IsUnique Decorator', () => {
  beforeEach(() => {
    mockRegisterDecorator.mockClear();
  });

  it('should call registerDecorator with the correct options', () => {
    const targetObject = { constructor: class TestDto {} };
    const propertyName = 'email';
    const validationOptions = { message: 'Email must be unique' };
    const model = 'User';
    const field = 'email';

    IsUnique(model, field, validationOptions)(targetObject, propertyName);

    expect(mockRegisterDecorator).toHaveBeenCalledTimes(1);
    expect(mockRegisterDecorator).toHaveBeenCalledWith({
      target: targetObject.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: IsUniqueConstraint,
    });
  });

  it('should call registerDecorator with default options if none provided', () => {
    const targetObject = { constructor: class TestDto {} };
    const propertyName = 'username';
    const model = 'Profile';
    const field = 'slug';

    IsUnique(model, field)(targetObject, propertyName);

    expect(mockRegisterDecorator).toHaveBeenCalledWith({
      target: targetObject.constructor,
      propertyName: propertyName,
      options: undefined, 
      constraints: [model, field],
      validator: IsUniqueConstraint,
    });
  });
});
