import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  SOCKET_URL = 'ws://localhost:3000'
  webSocket: WebSocket
  constructor(){
    this.webSocket = new WebSocket(this.SOCKET_URL)
  }
  connect(){
    this.webSocket.onopen = (event: any) => {
      console.log(`open ${event.data}`)
    }
    this.webSocket.onmessage = (event: any) => {
    };
    this.webSocket.onclose = (event: any) => {
      console.log(`close ${event.data}`)
    }
  }
  close(){
    this.webSocket.close()
  }
  getFramesOfVideo(filename: string){
    this.webSocket.send(filename)

  }

}
