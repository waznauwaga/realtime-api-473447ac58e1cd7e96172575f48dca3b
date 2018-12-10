import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
declare const module: any;
async function bootstrap() {
  let port =process.env.PORT;
  
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  try{

   /* const options = new DocumentBuilder()
    .setTitle('rt-api')
    .setDescription('api')
    .setVersion('1.0')
    .addTag('cats')
    .build();*/
 /* const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);*/

    await app.listen(port || 3000); 

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
    

  }catch(e){
    console.log({error_grave:e});
  }
  

 
  
  
}
bootstrap();
