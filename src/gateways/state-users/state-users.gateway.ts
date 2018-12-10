import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Observable, of, from, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as rdb from 'rethinkdb';
import { AppService } from 'app.service';
@WebSocketGateway()
export class StateUsersGateway {
  @WebSocketServer() server;
  private comunicacion = new Subject<any>();
  itemComunicacion = this.comunicacion.asObservable();
  constructor(private _appService:AppService){

  }

  @SubscribeMessage('message')
  onEvent(client: any, payload: any): Observable<WsResponse<any>> {
    return from([]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('message')
  onUserAppLog(client: any, payload: any): Observable<WsResponse<any>> {
    return from([]).pipe(map(item => ({ event: 'user_app_log', data: item })));
  }

  @SubscribeMessage('identity')
  identity(client, data: number): Observable<WsResponse<any>>  {
    this._appService.conexion().then(conn=>{

    
    rdb.db('logs').table('smartphone_state_log_users').changes().run(conn, async (err, result) => {
      
    
      result.each((err,row)=>{
        //console.log({cambios_smartphone_state:row});
        this.addItem(row);
      })
      
    })
  })
   return from(this.itemComunicacion).pipe(map(item => ({ event: 'events', data: {update_state_log_user_app:true} })));
    
  }

  @SubscribeMessage('identity-user-administracion')
  log_user_administracion(client, data: number): Observable<WsResponse<any>>  {

    this._appService.conexion().then(conn=>{

    
      rdb.db('logs').table('smartphone_state_log').changes().run(conn, async (err, result) => {
        
      
        result.each((err,row)=>{
          //console.log({cambios_smartphone_state:row});
          this.addItem(row);
        })
        
      })
    })


    return from(this.itemComunicacion).pipe(map(item => ({ event: 'events', data: {update_state_log_user_administracion:true} })));
  }



  addItem(item: any) {
    
    this.comunicacion.next(item);
  }


  
  
}
