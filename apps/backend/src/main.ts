import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { HttpErrorFilter } from './common/filters/http-error/http-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局启用，自动应用你在 DTO 中定义的验证规则
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离非白名单属性
      forbidNonWhitelisted: true, // 当传入非白名单属性时，抛出错误
      transform: true, // 自动转换数据类型
    }),
  );

  // 配置swagger
  const config = new DocumentBuilder()
    .setTitle('Meeting Reservation')
    .setDescription('The Meeting Reservation API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 配置全局过滤器
  app.useGlobalFilters(new HttpErrorFilter());

  // 配置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
