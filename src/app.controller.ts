import { Get, Controller, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
var sizeof = require('object-sizeof');
var get_trusted_ip = require('ipware')().get_trusted_ip;
const requestIp = require('request-ip');
@Controller('real-time-api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('get-log-administracion')
 async getLogAdministracion(@Req() req){

  /**
   * start
   * end
   *  */ 

    let data = req.body.peticion.data;
    let log_administracion = await this.appService.getLog(data);
    //console.log({logAdministracion:log_administracion});
    return log_administracion
  }

  @Post('set-log-administracion')
 async setLogAdministracion(@Req() req){

  /**
   * start
   * end
   *  */ 

    let data = req.body.peticion.data;
    let objeto = req.body.peticion.objeto;
    data.log_data.peticion_size = sizeof(objeto);
    //let request=req;
    let result_setLog = await this.appService.set_logAdministracion(data);
    //console.log({logAdministracion:data});
    //console.log({req:request});
  
    return result_setLog;
  }
}
