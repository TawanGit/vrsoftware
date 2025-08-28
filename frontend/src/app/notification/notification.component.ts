import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
  mensagem = '';
  notificacoes: { id: string; status: string }[] = [];

  constructor(private service: NotificationService) {}

  ngOnInit() {
    this.service.onStatus().subscribe((res) => {
      const n = this.notificacoes.find((x) => x.id === res.mensagemId);
      if (n) {
        n.status = res.status;
      } else {
        this.notificacoes.push({ id: res.mensagemId, status: res.status });
      }
    });
  }

  send() {
    this.service.send(this.mensagem).subscribe((res) => {
      this.notificacoes.push({ id: res.mensagemId, status: res.status });
      this.mensagem = '';
    });
  }

  updateStatus() {
    this.notificacoes.forEach((n) => {
      this.service.status(n.id).subscribe((res) => {
        n.status = res.status;
      });
    });
  }
}
