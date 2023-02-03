import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 24;
        
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);

        return hashedPassword;
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        // return new Promise((resolve, reject) => {
        //     bcrypt.compare(password, hash, (err, res) => {
        //         if (err) reject(err);
        //         resolve(res);
        //     })
        // })
        return await bcrypt.compare(password, hash)
    }
}