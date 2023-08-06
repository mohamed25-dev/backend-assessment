import { INestApplication, ValidationPipe } from "@nestjs/common";

export function mainConfig(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
}