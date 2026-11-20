import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('Catalogue et droits (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication({ logger: false });
    configureApp(app);
    await app.init(); // la vraie application, branchée sur la base learnhub_test
  });

  afterAll(async () => {
    await app.close(); // ferme la connexion à PostgreSQL, une fois les tests finis
  });

  // Un compte créé puis connecté : renvoie son jeton
  async function connecter(email: string, role: 'student' | 'teacher'): Promise<string> {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password: 'motdepasse', fullName: 'Compte de test', role })
      .expect(201);
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'motdepasse' })
      .expect(200);
    return res.body.access_token as string;
  }

  it('le catalogue se consulte sans compte', () => {
    return request(app.getHttpServer()).get('/api/courses').expect(200);
  });

  it('créer un cours sans jeton : 401', () => {
    return request(app.getHttpServer()).post('/api/courses').send({ title: 'Sans jeton' }).expect(401);
  });

  it('un formateur crée un cours, un élève ne peut pas', async () => {
    const formateur = await connecter('formateur@example.com', 'teacher');
    const eleve = await connecter('eleve@example.com', 'student');

    const res = await request(app.getHttpServer())
      .post('/api/courses')
      .set('Authorization', `Bearer ${formateur}`)
      .send({ title: 'Tests de bout en bout' })
      .expect(201);
    expect(res.body).toMatchObject({ title: 'Tests de bout en bout', published: false });

    await request(app.getHttpServer())
      .post('/api/courses')
      .set('Authorization', `Bearer ${eleve}`)
      .send({ title: 'Interdit' })
      .expect(403);
  });
});
