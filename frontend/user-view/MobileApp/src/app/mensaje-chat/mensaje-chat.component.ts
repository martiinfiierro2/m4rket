// mensaje-chat.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensaje-chat',
  templateUrl: './mensaje-chat.component.html',
  styleUrls: ['./mensaje-chat.component.scss'],
})
export class MensajeChatComponent  {
  @Input() mensaje: Mensaje = {texto: '', hora: '', esUsuario: true };

}

interface Mensaje {
  texto: string;
  hora: string;
  esUsuario: boolean;
}
