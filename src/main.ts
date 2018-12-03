import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.listen(3000).then((value)=>{
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  },(reject)=>{
    console.log('error init app');
  });
  
  
}
bootstrap();
