import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:3001/api/notificar';
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
    });
  }

  send(conteudoMensagem: string) {
    const mensagemId = uuidv4();
    return this.http.post<{ mensagemId: string; status: string }>(this.apiUrl, {
      mensagemId,
      conteudoMensagem,
    });
  }

  status(mensagemId: string) {
    return this.http.get<{ mensagemId: string; status: string }>(
      `${this.apiUrl}/status/${mensagemId}`
    );
  }

  onStatus(): Observable<{ mensagemId: string; status: string }> {
    return new Observable((observer) => {
      this.socket.on('statusUpdate', (data) => {
        observer.next(data);
      });
    });
  }
}
