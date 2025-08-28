import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { NotificationService } from '../services/notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [NotificationService],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve enviar notificação e adicionar na lista com status inicial', () => {
    const fakeMensagemId = 'uuid-123';
    const fakeMensagem = 'Teste mensagem';
    spyOn(service, 'send').and.returnValue(
      of({ mensagemId: fakeMensagemId, status: 'AGUARDANDO_PROCESSAMENTO' })
    );

    component.mensagem = fakeMensagem;
    component.send();

    expect(service.send).toHaveBeenCalledWith(fakeMensagem);
    expect(component.notificacoes.length).toBe(1);
    expect(component.notificacoes[0]).toEqual({
      id: fakeMensagemId,
      status: 'AGUARDANDO_PROCESSAMENTO',
    });
    expect(component.mensagem).toBe('');
  });
});
