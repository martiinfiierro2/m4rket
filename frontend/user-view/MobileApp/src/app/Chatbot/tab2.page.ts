/*import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  mensaje1: Mensaje = 
    { texto: '¡Hola! Soy Fermín, estoy aquí para ayudarte.', 
    hora: "13:02", 
    esUsuario: false 
  };
  mensaje2: Mensaje = {
    texto: '¿En qué puedo ayudarte hoy?',
    hora: '13:03',
    esUsuario: true
  };
 
  constructor(private location: Location) {}

}

interface Mensaje {
  texto: string;
  hora: string;
  esUsuario: boolean;
}
*/
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from '../models/message.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { OpenaiService } from '../services/openai.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page{ 
    messages: Message[] = [
      {sender: 'me', content: 'Hola, como estas?'},
      {sender: 'bot', content: '¡Hola! Soy Fermín, tu asistente de compra virtual. Estoy aquí para ayudarte.'}
    ];

    form = new FormGroup({
    promt: new FormControl('')
})

loading: boolean = false;


constructor(
 //ESTO DA ERROR private openAi: OpenaiService
) { }

submit(){
  console.log(this.form.value);

  let promt = this.form.value.promt as string;

 // ====MSG USUARIO
 let userMsg: Message = { sender: 'me', content: promt }
 this.messages.push(userMsg);

 // ====MSG CHATBOT
 let botMsg: Message = { sender: 'bot', content: '' }
 this.messages.push(botMsg);


 this.form.reset();
 this.form.disable();

 this.loading = true;



/*
this.openAi.sendQuestion(promt).subscribe({
  next: (res: any) =>{

    console.log(res);
    this.loading = false;
  }, error: (error: any) =>{
    console.log(error);
  }

})
*/

  setTimeout(() =>{
    this.loading = false;
    this.typeText('Hoy tenemos en oferta, la Leche entera marca Pascual a 0,87€ el litro. El turrón de almendras Alacant a 4,17.')

    this.form.enable();
  }, 2000)


  }

  typeText(text: string){

    let textIndex = 0;
    let messagesLastIndex = this.messages.length - 1;

    let interval = setInterval(() => {
      if(textIndex < text.length){
        this.messages[messagesLastIndex].content += text.charAt(textIndex);
        textIndex++;
      }
      else{
        clearInterval(interval);
      }
    }, 15)
  }
}


