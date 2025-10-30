import { SetMetadata } from '@nestjs/common';
import { Public, IS_PUBLIC_KEY } from './public.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Public Decorator', () => {

  const mockSetMetadata = SetMetadata as jest.Mock;

  beforeEach(() => {

    mockSetMetadata.mockClear();
  });

  it('should call SetMetadata with the correct key and value', () => {

    Public();

    expect(mockSetMetadata).toHaveBeenCalledTimes(1);
    expect(mockSetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });

  it('should export IS_PUBLIC_KEY with the value "isPublic"', () => {
    expect(IS_PUBLIC_KEY).toBe('isPublic');
  });

  it('should return the result of SetMetadata', () => {
    const mockDecorator = () => 'decorator_result';
    mockSetMetadata.mockReturnValue(mockDecorator);

    const result = Public();
    expect(result).toBe(mockDecorator);
  });
});
