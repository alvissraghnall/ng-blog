import { Test, TestingModule } from '@nestjs/testing';
import { JwtKeyService } from './jwt-key.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('JwtKeyService', () => {
  let service: JwtKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtKeyService],
    }).compile();

    service = module.get<JwtKeyService>(JwtKeyService);

    (process.cwd as jest.Mock) = jest.fn().mockReturnValue('/app');
    mockPath.join.mockImplementation((...args) => args.join('/'));

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPrivKey', () => {
    it('should return the private key buffer on success', async () => {
      const mockKeyBuffer = Buffer.from('---BEGIN PRIVATE KEY---');
      mockPath.join.mockReturnValue('/app/private.pem');

      mockFs.readFile.mockImplementation((path, callback) => {
        expect(path).toBe('/app/private.pem');
        callback(null, mockKeyBuffer);
      });

      await expect(service.getPrivKey()).resolves.toEqual(mockKeyBuffer);
    });

    it('should reject with an error if fs.readFile fails', async () => {
      const mockError = new Error('File not found');
      mockPath.join.mockReturnValue('/app/private.pem');

      mockFs.readFile.mockImplementation((path, callback) => {
        expect(path).toBe('/app/private.pem');
        callback(mockError, null);
      });

      await expect(service.getPrivKey()).rejects.toThrow(mockError);
    });
  });

  describe('getPubKey', () => {
    it('should return the public key buffer on success', async () => {
      const mockKeyBuffer = Buffer.from('---BEGIN PUBLIC KEY---');
      mockPath.join.mockReturnValue('/app/public.pem');

      mockFs.readFile.mockImplementation((path, callback) => {
        expect(path).toBe('/app/public.pem');
        callback(null, mockKeyBuffer);
      });

      await expect(service.getPubKey()).resolves.toEqual(mockKeyBuffer);
    });

    it('should reject with an error if fs.readFile fails', async () => {
      const mockError = new Error('File not found');
      mockPath.join.mockReturnValue('/app/public.pem');

      mockFs.readFile.mockImplementation((path, callback) => {
        expect(path).toBe('/app/public.pem');
        callback(mockError, null);
      });

      await expect(service.getPubKey()).rejects.toThrow(mockError);
    });
  });
});
