import { Test, TestingModule } from '@nestjs/testing';
import { JwtKeyModule } from './jwt-key.module';
import { JwtKeyService } from './jwt-key.service';

jest.mock('fs');

describe('JwtKeyModule', () => {
  it('should compile the module and provide JwtKeyService', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtKeyModule],
    }).compile();

    const service = module.get<JwtKeyService>(JwtKeyService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(JwtKeyService);
  });

  it('should export JwtKeyService', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtKeyModule],
    }).compile();

    const exportedService = module.get(JwtKeyService);
    expect(exportedService).toBeDefined();
  });
});
