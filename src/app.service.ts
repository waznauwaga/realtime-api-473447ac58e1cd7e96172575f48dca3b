import { Injectable } from '@nestjs/common';
import * as rdb from 'rethinkdb';
import { Observable, Subject } from 'rxjs';
var request = require('ajax-request');
import * as _ from 'lodash';
import * as moment from 'moment';
var conexiondb:any =process.env.conexionrethinkdb;
var ipstack:any = process.env.ipstack;
@Injectable()
export class AppService {

  public code = "d41d8cd98f00b204e9800998ecf8427e"

  constructor() { }

  async getLog(data) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();
      //console.log({conexion_info:conn});
      if (conn != null) {
        rdb.db(data.db).table(data.table).orderBy({ index: "time" }).between(data.start, data.end, { index: 'time' }).run(conn, async (err, administracion_log) => {
          //console.log({ adm_log_: administracion_log });
          //console.log({ error: err });
          try {
            let items = await administracion_log.toArray();
            resolve(items);
          } catch (e) {
            //console.log({error_getLogAdministracion:e});
            resolve([]);
          }



        })
      } else {
        resolve(0);
      }

    })
  }


  async set_log(config) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();
      if (conn != null) {
        rdb.db(config.db).table(config.tabla).insert(config.log_data).run(conn, function (err, res) {
          if (!err) {
            resolve(false);
          } else {
            resolve(res);
          }

        });
      } else {
        resolve(false);
      }

    })
  }

  async getIndexTableDB(conf) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();
      if (conn != null) {
        try {
          let indexList = await rdb.db(conf.db).table(conf.table).indexList().run(conn);
          resolve(indexList);
        } catch (e) {
          resolve([]);
        }

      } else {
        resolve([]);
      }
    })


  }


  async createIndexRTDB(config) {
    let conn: any = await this.conexion();
    if (conn != null) {
      rdb.db(config.db).table(config.table).indexCreate(config.nameIndex).run(conn, (err, result) => {
        return result;
      })
    } else {
      return null;
    }

  }



  async createApp(data) {
    return new Promise(async (resolve, reject) => {

      let conn: any = await this.conexion();
      if (conn != null) {
        try {

          rdb.db('datas_app').table(data.table).insert(data.app).run(conn, async (err, result) => {
            resolve(result);
          })

        } catch (e) {
          resolve(null);
        }
      } else {
        resolve(null);
      }

    })
  }


  async getApps(conf) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      if (conn != null) {
        try {
          rdb.db('datas_app').table(conf.table).run(conn, async (err, result) => {
            let apps = await result.toArray()
            resolve(apps);
          })
        } catch (e) {
          resolve([]);
        }
      } else {
        resolve([]);
      }
    })
  }


  async deleteApp(conf) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      if (conn != null) {
        try {

          rdb.db('datas_app').table('api_app').get(conf.document).delete().run(conn, async (err, result) => {
            resolve(result);
          })

        } catch (e) {
          resolve(null);
        }

      } else {
        resolve(null);
      }
    })
  }


  async deleteDataTable(conf) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      if (conn != null) {
        try {

          rdb.db(conf.db).table(conf.table).delete().run(conn, async (err, result) => {
            resolve(result);
          })

        } catch (e) {
          resolve(null);
        }

      } else {
        resolve(null);
      }
    })
  }


  tableSuscribe(): Observable<any> {
    const subject = new Subject<any>();
    rdb.connect({ host: conexiondb.host, port: conexiondb.port, user: conexiondb.user, password: conexiondb.password }, (err, conn) => {
      rdb.db('logs').table('administracion_log').changes().run(conn, (err, result) => {

        subject.next(result);
        subject.complete();
      })
    });

    return subject;
  }




  async getIpAddress() {
    return new Promise((resolve, reject) => {

      request({ url: ipstack, method: 'GET' }, (err, res, body) => {
        let dataParse = JSON.parse(body);
        resolve(dataParse);
      })
    })

  }


  async set_log_phone_user_admin(log) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      if (conn != null) {
        try {

          /* console.log({
             network: log.user.deviceState.netWork, battery: log.user.deviceState.batteryStatus,
             user_data: log.user
           });*/
          //console.log({ objet_key_log: Object.keys(log.user) });
          rdb.db('logs').table('smartphone_state_log').getAll(log.user.email, { index: "email" }).run(conn, async (err, result) => {
            let resultArr = await result.toArray();
            //console.log({ resultado_logUsuario: resultArr });
            if (resultArr.length > 0) {
              let idxUser = _.findIndex(resultArr, (o) => {
                return o.email === log.user.email;
              })
              // console.log({ idxUser: idxUser });
              if (idxUser > -1) {
                rdb.db('logs').table('smartphone_state_log').filter({ email: log.user.email }).update({ email: log.user.email, deviceState: log.user.deviceState, seccionTime: log.seccionTime }).run(conn, async (err, result) => {
                  // console.log({ document_update: result });
                  resolve(true);
                })
              } else {
                rdb.db('logs').table('smartphone_state_log').insert({ email: log.user.email, deviceState: log.user.deviceState, seccionTime: log.seccionTime }).run(conn, async (err, result) => {
                  //console.log({ document_create: result });
                  resolve(true);
                })
              }

            } else {
              //console.log('registrado en base de dato');
              rdb.db('logs').table('smartphone_state_log').insert({ email: log.user.email, deviceState: log.user.deviceState, seccionTime: log.seccionTime }).run(conn, async (err, result) => {
                // console.log({ document_create: result });
                resolve(true);
              })
            }

          })

        } catch (e) {
          resolve(true);
        }
      } else {
        resolve(true);
      }
    })

  }


  async get_log_user_smartphone_administracion(user) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();


      if (conn != null) {
        try {

          rdb.db('logs').table('smartphone_state_log').getAll(user.email, { index: "email" }).run(conn, async (err, result) => {
            let resultArr = await result.toArray();
            let idxUser = _.findIndex(resultArr, (o) => {
              return o.email === user.email;
            })

            if (idxUser > -1) {
              resolve(resultArr[idxUser]);
            } else {
              resolve(false);
            }
          })
        } catch (e) {
          resolve(false);
        }
      } else {
        resolve(true);
      }


    })


  }

  async set_log_user(log) {
    return new Promise(async (resolve, reject) => {

      let conn: any = await this.conexion();
      if (conn != null) {
        try {


          rdb.db('logs').table('smartphone_state_log_users').getAll(log.user.email, { index: "email" }).run(conn, async (err, result) => {


            let resultArr = await result.toArray();



            if (resultArr.length > 0) { 

              let idxUser = _.findIndex(resultArr, (o) => {
                return o.email === log.user.email;
              })
              // console.log({ idxUser: idxUser });
              if (idxUser > -1) {
                rdb.db('logs').table('smartphone_state_log_users').filter({ email: log.user.email }).update({ email: log.user.email, deviceState: log.user.deviceState, seccionTime: log.seccionTime }).run(conn, async (err, result) => {
                  //console.log({ document_update: result });
                  resolve(true);
                })
              } else {
                rdb.db('logs').table('smartphone_state_log_users').insert({ email: log.user.email, deviceState: log.user.deviceState, seccionTime: log.seccionTime }).run(conn, async (err, result) => {
                  //console.log({ document_create: result });
                  resolve(true);
                })
              }

              
            }else {
              //console.log('registrado en base de dato');
              rdb.db('logs').table('smartphone_state_log_users').insert({ email:log.user.email, deviceState:log.user.deviceState, seccionTime: log.seccionTime }).run(conn, async (err, result) => {
                //console.log({ document_create_else: result });
                resolve(true);
              })
            }


          })


        } catch (e) { }

      } else {

      }

    })

  }


  async Add_incidencia(api) {

    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      api.incidencia.time = moment().unix();

      if (conn != null) {
        try {

          rdb.db('datas_app').table('api_incidencias').insert(api.incidencia).run(conn, async (err, result) => {
            resolve({ result: result, error: err });
          })
        } catch (e) {
          resolve({ result: null, err: e });
        }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }
    })

  }


  async incidencia_read_mark(api) {

    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      //api.incidencia.time=moment().unix();

      if (conn != null) {
        try {

          rdb.db('datas_app').table('api_incidencia_read').insert({
            codeincidencia: api.code, emailread: api.email
          }).run(conn, async (err, result) => {
            resolve({ result: result, error: err });
          })
        } catch (e) {
          resolve({ result: null, err: e });
        }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }
    })

  }


  async incidencia_read_historial_user_admin(user) {

    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      //api.incidencia.time=moment().unix();

      if (conn != null) {
        try {

          rdb.db('datas_app').table('api_incidencia_read').getAll(user.email, { index: "emailread" }).run(conn, async (err, result) => {
            let incidencia_markRead = result.toArray();
            resolve({ result: incidencia_markRead, error: err });
          })
        } catch (e) {
          resolve({ result: [], err: e });
        }
      } else {
        resolve({ result: [], err: 'Fallo en la conexión' });
      }
    })

  }

  async Incidencia_historial() {

    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();


      if (conn != null) {
        try {

          rdb.db('datas_app').table('api_incidencias').filter({ active: true }).run(conn, async (err, result) => {
            let incidencias = result.toArray();
            resolve({ result: incidencias, error: err });
          })
        } catch (e) {
          resolve({ result: null, err: e });
        }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }
    })

  }


  async get_users_log(conf) {
    return new Promise(async (resolve, reject) => {

      let conn: any = await this.conexion();


      if (conn != null) {
        try {

          rdb.db(conf.db).table(conf.table).run(conn, async (err, result) => {
            let users = await result.toArray()
            resolve({ result: users, err: null });
          })


        } catch (e) {
          resolve({ result: [], err: e });
        }

      } else {
        resolve({ result: [], err: 'Fallo en la conexión' });
      }

    })
  }


  async message_add(user) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();


      if (conn != null) {
        try {

          rdb.db(user.db).table(user.table).insert(user.insert).run(conn, async (err, result) => {
            //console.log({ document_create: result });
            resolve(result);
          })
        } catch (e) {
          resolve({ result: null, err: e });
        }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }
    })
  }

  async message_delete(message) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      if (conn != null) {
        try {

          rdb.db(message.db).table(message.table).get(message.id).delete().run(conn, async (err, result) => {
            //console.log({ document_create: result });
            resolve(result);
          })

        } catch (e) { }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }

    })
  }

  async message_historial(user) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      if (conn != null) {
        try {

          rdb.db(user.db).table(user.table).getAll(user.email, { index: "email" }).run(conn, async (err, result) => {
            let users = await result.toArray()
            resolve({ result: users, err: null });
          })

        } catch (e) {
          resolve({ result: null, err: e });
        }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }

    })
  }

  async message_mark_read(message) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();
      //console.log({messageRecibe:message.message});
      if (conn != null) {
        try {
          rdb.db(message.db).table(message.table).get(message.message.id).update({
            email: message.message.email,
            message: message.message.message, motivo: message.message.motivo, read: message.message.read,
            remitente: message.message.remitente, remitenteData: message.message.remitenteData,
            time: message.message.time
          }).run(conn, async (err, result) => {
            resolve({ result: result, err: null });
          })

        } catch (e) {
          resolve({ result: null, err: e });
        }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }
    })
  }

  async notificacion_users_add(notificacion) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      if (conn != null) {
        try {
          rdb.db(notificacion.db).table(notificacion.table).insert(notificacion.notificacion).run(conn, async (err, result) => {

            resolve({ result: result, err: null });
          })

        } catch (e) {
          resolve({ result: null, err: e });
        }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }
    })
  }


  async notificacion_users_historial(notificacion) {
    return new Promise(async (resolve, reject) => {
      let conn: any = await this.conexion();

      if (conn != null) {
        try {
          rdb.db(notificacion.db).table(notificacion.table).getAll(notificacion.user.email, { index: "remitente" }).run(conn, async (err, result) => {
            let notificaciones = await result.toArray();
            resolve({ result: notificaciones, err: null });
          })

        } catch (e) {
          resolve({ result: null, err: e });
        }
      } else {
        resolve({ result: null, err: 'Fallo en la conexión' });
      }
    })
  }


  async conexion() {

    try {
      return await rdb.connect({ host: conexiondb.host, port: conexiondb.port, user: conexiondb.user, password: conexiondb.password });
    } catch (e) {
      return null;
    }

  }

}
