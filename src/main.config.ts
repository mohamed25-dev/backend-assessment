import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "./auth/auth.guard";

export function mainConfig(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new AuthGuard());
  app.setGlobalPrefix('api/v1');
}