import { Get, Controller, Post, Req, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
var sizeof = require('object-sizeof');
var randtoken = require('rand-token').generator();
@Controller('real-time-api')
export class AppController {
    constructor(private readonly _appService: AppService) { }

    @Post('get-log-administracion')
    async getLogAdministracion(@Req() req) {

        /**
         * start
         * end
         *  */

        try {

            let data = req.body.peticion.data;
            let log_administracion = await this._appService.getLog(data);
            return { response: log_administracion, code_api: this._appService.code };

        } catch (e) {
            return { response: false, code_api: this._appService.code };
        }


    }

    @Post('set-log-administracion')
    async setLogAdministracion(@Req() req) {

        /**
         * start
         * end
         *  */

        try {
            let data = req.body.peticion.data;
            let objeto = req.body.peticion.objeto;
            data.log_data.peticion_size = sizeof(objeto);
            //let request=req;
            let result_setLog = await this._appService.set_log(data);
            //console.log({logAdministracion:data});
            //console.log({req:request});

            return { response: result_setLog, code_api: this._appService.code };

        } catch (e) {
            return { response: false, code_api: this._appService.code };
        }


    }


    @Post('get-index-tabla')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))
    async get_listIndexTable(@Req() req) {

        try {

            let conf = req.body.peticion.conf;
            let list = await this._appService.getIndexTableDB(conf);
            return { response: list, code_api: this._appService.code };
        } catch (e) {
            return { response: false, code_api: this._appService.code };
        }



    }

    @Post('set-index-tabla')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * db, table, nameIndex
     */

    async set_IndexTable(@Req() req) {
        try {

            let conf = req.body.peticion.conf;
            let list = await this._appService.createIndexRTDB(conf);
            return { response: list, code_api: this._appService.code };

        } catch (e) {
            return { response: false, code_api: this._appService.code };
        }

    }


    @Post('get-apps')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * table
     */

    async getApps(@Req() req) {
        try {




            let conf = req.body.peticion.conf;
            let list = await this._appService.getApps(conf);
            return { response: list, code_api: this._appService.code };

        } catch (e) {
            return { response: false, code_api: this._appService.code };

        }


    }

    @Post('create-app')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * table, app:{
     * ip, code, name_api, servidor_name
     * }
     */

    async createApps(@Req() req) {

        try {

            let conf = req.body.peticion.conf;
            let ip = await this._appService.getIpAddress();
            conf.app.ip = ip;
            conf.app.code = randtoken.generate(16, "abcdefghijklnmopqrstuvwxyz");
            let response = await this._appService.createApp(conf);
            return { response: response, code_api: this._appService.code };


        } catch (e) {

            return { response: false, code_api: this._appService.code };

        }



    }


    @Post('delete-app')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * table, app:{
     * ip, code, name_api, servidor_name
     * }
     */

    async deleteApps(@Req() req) {

        /**
         * document
         */

        try {
            let conf = req.body.peticion.conf;
            let response = await this._appService.deleteApp(conf);
            return { response: response, code_api: this._appService.code };


        } catch (e) {
            return { response: false, code_api: this._appService.code };
        }



    }


    @Post('delete-data-table')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * table, app:{
     * ip, code, name_api, servidor_name
     * }
     */

    async deleteAppAll(@Req() req) {

        /**
         * db, table
         */

        try {

            let conf = req.body.peticion.conf
            let response = await this._appService.deleteDataTable(conf);
            return { response: response, code_api: this._appService.code };

        } catch (e) {
            return { response: false, code_api: this._appService.code };
        }



    }




    @Post('pruebas')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * table, app:{
     * ip, code, name_api, servidor_name
     * }
     */

    async pruebas(@Req() req) {


        try {

            let data = await this._appService.getIpAddress();

            return { response: data, code_api: this._appService.code };



        } catch (e) {
            return { response: false, code_api: this._appService.code };

        }



    }





    @Post('pruebas-suscribe')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * table, app:{
     * ip, code, name_api, servidor_name
     * }
     */

    pruebasSuscribe(@Req() req): Observable<any> {


        try {




            return this._appService.tableSuscribe();





        } catch (e) {


        }



    }


    @Post('set-log-user-smartphone-administracion')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * table, app:{
     * ip, code, name_api, servidor_name
     * }
     */

    async setLogUserAdministracionSmarthPhone(@Req() req) {


        try {

            let data = req.body.peticion;
            //console.log({ set_log_data: data });
            let respuesta = await this._appService.set_log_phone_user_admin(data);

            return { response: respuesta, code_api: this._appService.code };




        } catch (e) {

            return { response: false, code_api: this._appService.code };
        }



    }


    @Post('get-log-user-smartphone-administracion')
    @HttpCode(200)
    //@UseGuards(AuthGuard('jwt'))

    /**
     * table, app:{
     * ip, code, name_api, servidor_name
     * }
     */

    async getLogUserAdministracionSmarthPhone(@Req() req) {


        try {

            let data = req.body.peticion.data;
            //console.log({dataUser:data});

            let respuesta = await this._appService.get_log_user_smartphone_administracion(data);
            //console.log({respuesta_db:respuesta});
            return { response: respuesta, code_api: this._appService.code };




        } catch (e) {

            return { response: false, code_api: this._appService.code };
        }



    }

    @Post('add-incidencia')
    @HttpCode(200)

    async addIncidencia(@Req() req) {
        try {

            /**
             * añade una incidencia
             * 
             */

            let data = req.body.peticion.data;
            
            let respuesta = await this._appService.Add_incidencia(data);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }

    @Post('incidencia-mark-read')
    @HttpCode(200)

    async incidenciaReadMark(@Req() req) {
        try {

            /**
             * añade una incidencia
             * 
             */

            let data = req.body.peticion.conf;
            
            let respuesta = await this._appService.incidencia_read_mark(data);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }

    @Post('incidencia-read-historial-user-admin')
    @HttpCode(200)

    async incidenciaReadHistorialUserAdmin(@Req() req) {
        try {

            /**
             * añade una incidencia
             * 
             */

            let data = req.body.peticion.conf;
            
            let respuesta = await this._appService.incidencia_read_historial_user_admin(data);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) {
            return { response: [], code_api: this._appService.code };
         }
    }





    @Post('get-log-user-all-table')
    @HttpCode(200)

    async getLogUserAllTable(@Req() req) {
        try {

            /**
             * Obtiene el log de usuarios independiente de su perfil
             * 
             */

            let conf = req.body.peticion.conf

            let respuesta = await this._appService.get_users_log(conf);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }

    @Post('message-add')
    @HttpCode(200)

    async messageAdd(@Req() req) {
        try {

            /**
             * Obtiene el log de usuarios independiente de su perfil
             * 
             */

            let conf = req.body.peticion.conf

            let respuesta = await this._appService.message_add(conf);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }


    @Post('message-delete')
    @HttpCode(200)

    async messageDelete(@Req() req) {
        try {

            /**
             * Obtiene el log de usuarios independiente de su perfil
             * 
             */

            let conf = req.body.peticion.conf

            let respuesta = await this._appService.message_delete(conf);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }

    @Post('message-historial')
    @HttpCode(200)

    async messageHistorial(@Req() req) {
        try {

            /**
             * Obtiene el historial de mensajes de un usuario
             * 
             */

            let conf = req.body.peticion.conf

            let respuesta = await this._appService.message_historial(conf);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }


    @Post('message-mark-read')
    @HttpCode(200)

    async messageMarkRead(@Req() req) {
        try {

            /**
             * Marca un mensaje como leido
             * 
             */

            let conf = req.body.peticion.conf;

            let respuesta = await this._appService.message_mark_read(conf);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }

    @Post('notificacion-user-add')
    @HttpCode(200)

    async notificacionUserAdd(@Req() req) {
        try {

            /**
             * envia una notificacion a los usuarios
             * 
             */

            let conf = req.body.peticion.conf

            let respuesta = await this._appService.notificacion_users_add(conf);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }


    @Post('notificacion-user-historial')
    @HttpCode(200)

    async notificacionUserHistorial(@Req() req) {
        try {

            /**
             * envia una notificacion a los usuarios
             * 
             */

            let conf = req.body.peticion.conf

            let respuesta = await this._appService.notificacion_users_historial(conf);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }

    @Post('get-incidencias')
    @HttpCode(200)

    async incidencias_historial(@Req() req) {
        try {

            /**
             * envia una notificacion a los usuarios
             * 
             */


            let respuesta = await this._appService.Incidencia_historial();

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }



    /**
     * GESTION DATA USUARIOS
     */



    @Post('set-log-user')
    @HttpCode(200)

    async setLogUser(@Req() req) {
        try {

            /**
             * log usuarios app clima y contaminación
             * 
             */

            let data = req.body.peticion;

            //console.log({data_set_logUser_app:data});
            let respuesta = await this._appService.set_log_user(data);

            return { response: respuesta, code_api: this._appService.code };



        } catch (e) { }
    }
    



}
