import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { InvokeRecordInterceptor } from './common/interceptors/invoke-record/invoke-record.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

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
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 配置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 日志拦截器
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
