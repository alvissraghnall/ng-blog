import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";



@Injectable()
export class JwtKeyService {

  async getPrivKey (): Promise<Buffer> {
    return await new Promise((resolve, reject) => {
      fs.readFile(path.join(process.cwd(), "./private.pem"), (err, data) => {
        if (err) reject(err);
        resolve(data);
      })
    });
  }

  async getPubKey (): Promise<Buffer> {
    return await new Promise((resolve, reject) => {
      fs.readFile(path.join(process.cwd(), "./public.pem"), (err, data) => {
        if (err) reject(err);
        resolve(data);
      })
    });
  }
}