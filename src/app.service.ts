import { Injectable } from '@nestjs/common';
import * as rdb from 'rethinkdb';
@Injectable()
export class AppService {


  constructor() { }

  async getLog(data) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();
      //console.log({conexion_info:conn});
      if (conn != null) {
        rdb.db(data.db).table(data.table).orderBy({ index: "time" }).between(data.start, data.end, { index: 'time' }).run(conn, async (err, administracion_log) => {
          //console.log({ adm_log_: administracion_log });
          //console.log({ error: err });
          try{
            let items = await administracion_log.toArray();
            resolve(items);
          }catch(e){ 
            //console.log({error_getLogAdministracion:e});
            resolve([]);
          }
          
          

        })
      } else {
        resolve(0);
      }

    })
  }


  async set_logAdministracion(config) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();
      if (conn != null) {
        rdb.db(config.db).table(config.tabla).insert(config.log_data).run(conn, function (err, res) {
          if (!err) {
            return err;
          } else {
            return res;
          }

        });
      } else {
        return null;
      }

    })
  }


  async conexion() {

    try {
      return await rdb.connect({ host: '31.220.60.179', port: 28015, user:'admin', password:'konfortowego_1' });
    } catch (e) {
      return null;
    }

  }

}
