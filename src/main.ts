import { Logger, RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function setupSwagger(app, port: number) {
  let swaggerDocPath = '/docs';

  const config = new DocumentBuilder()
    .setTitle('Hoppscotch Test')
    .setDescription('NestJS API DOC')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}/`, 'localhost')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerDocPath, app, document, {
    swaggerOptions: { persistAuthorization: true, ignoreGlobalPrefix: true }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  let PORT = +process.env.PORT || 3000;

  app.enableCors();
  app.setGlobalPrefix('api', { exclude: [{ path: '', method: RequestMethod.GET }] });
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalInterceptors(new LoggingInterceptor());

  await setupSwagger(app, PORT);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  await app.listen(3000);
  Logger.log(await app.getUrl(), 'App URL');
}
bootstrap();
