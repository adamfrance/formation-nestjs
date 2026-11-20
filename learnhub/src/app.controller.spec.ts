import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it("renvoie le nom et la version de l'API", () => {
      expect(appController.getWelcome()).toEqual({ application: 'LearnHub', version: '0.1.0' }); // toEqual compare le contenu
    });
  });
});
