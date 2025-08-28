import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3001');
  }

  onStatusUpdate(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('statusUpdate', (data) => {
        subscriber.next(data);
      });
    });
  }
}
