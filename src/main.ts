import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir cualquier origen
  app.enableCors({
    origin: ['http://179.43.127.133:9001','http://179.43.127.133:9002','http://localhost:9000'], // Permite cualquier dominio
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: true, // Permite el envío de credenciales (cookies, cabeceras de autorización, etc.)
  });

  const PORT = process.env.PORT ?? 3006; // Usa el puerto establecido en la variable de entorno o el puerto 3001 por defecto

  await app.listen(PORT); // Inicia el servidor en el puerto especificado
}

bootstrap();
