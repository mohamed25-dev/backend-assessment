import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../src/main.config';

describe('BikeController (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  const validAt = "2014-09-01T10:00:00";
  const invalidAt = "2023-s32-324";

  const validToken = 'verySecretRandomToken';
  const invalidToken = 'invalid';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    mainConfig(app);
    await app.init();
  });


  afterAll(async () => {
    await prisma.$disconnect();
    await prisma.bike.deleteMany({});
  });

  it('should fetch the data from indego API and stor it in the database', () => {
    return request(app.getHttpServer())
      .post('/api/v1/indego-data-fetch-and-store-it-db')
      .set('Authorization', validToken)
      .expect(HttpStatus.CREATED);
  });


  it('should return 404 because of the station id', () => {
    return request(app.getHttpServer())
      .get(`/api/v1/stations/234324?at=${validAt}`)
      .set('Authorization', validToken)
      .expect(HttpStatus.NOT_FOUND);
  });


  it('should return the correct data', () => {
    return request(app.getHttpServer())
      .get(`/api/v1/stations/3005?at=${validAt}`)
      .set('Authorization', validToken)
      .expect((res: request.Response) => {
        expect(res.body.at).not.toBeNull();
        expect(res.body.station).not.toBeNull();
        expect(res.body.weather).toBeNull();
      })
      .expect(HttpStatus.OK);
  });


  it('should return 400 when invalid date is sent', () => {
    return request(app.getHttpServer())
      .get(`/api/v1/stations/1234?at=${invalidAt}`)
      .set('Authorization', validToken)
      .expect(HttpStatus.BAD_REQUEST);
  });

});
