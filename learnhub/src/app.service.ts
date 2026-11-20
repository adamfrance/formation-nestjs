import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome() {
    return { application: 'LearnHub', version: '0.1.0' }; // un objet : Nest le renverra en JSON
  }
}
