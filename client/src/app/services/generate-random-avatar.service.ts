import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerateRandomAvatarService {

  
  constructor(private http: HttpClient) { }

  private generateDiceBearAvataaars (seed: number) {
    return `https://api.dicebear.com/5.0/avataaars/svg?seed=${seed}`;
  }

  private generateDiceBearBottts (seed: number) {
    return `https://api.dicebear.com/5.0/bottts/svg?seed=${seed}`;
      // .subscribe(result => result);
  }

  private generateDiceBearMicah (seed: number) {
    return `https://api.dicebear.com/5.0/micah/svg?seed=${seed}`;
  }

  private generateDiceBearLorelei (seed: number) {
    return `https://api.dicebear.com/5.0/lorelei/svg?seed=${seed}`;
  }

  private generateDiceBearMiniavs (seed: number) {
    return `https://api.dicebear.com/5.0/miniavs/svg?seed=${seed}`;
  }

  private generateDiceBearFunEmoji (seed: number) {
    return `https://api.dicebear.com/5.0/fun-emoji/svg?seed=${seed}`;
  }

  private generateDiceBearAdventurer (seed: number) {
    return `https://api.dicebear.com/5.0/adventurer/svg?seed=${seed}`;
  }

  generateAvatars () {
    const data = [];
    for (let i = 0; i < 2; i++) {
      const res = this.generateDiceBearAvataaars(Math.random());
      data.push(res);
    }
    for (let i = 0; i < 2; i++) {
      const res = this.generateDiceBearBottts(Math.random());
      data.push(res);
    }
    for (let i = 0; i < 2; i++) {
      const res = this.generateDiceBearMicah(Math.random());
      data.push(res);
    }
    for (let i = 0; i < 2; i++) {
      const res = this.generateDiceBearLorelei(Math.random());
      data.push(res);
    }
    for (let i = 0; i < 2; i++) {
      const res = this.generateDiceBearMiniavs(Math.random());
      data.push(res);
    }
    for (let i = 0; i < 2; i++) {
      const res = this.generateDiceBearFunEmoji(Math.random());
      data.push(res);
    }
    for (let i = 0; i < 2; i++) {
      const res = this.generateDiceBearAdventurer(Math.random());
      data.push(res);
    }
    return data;
  }
}


