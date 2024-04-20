import { Component } from '@angular/core';
import { UsuariosService } from "../../services/usuarios.service";
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { IonInput, IonIcon, IonButton } from "@ionic/angular/standalone";

interface Usuario {
  email: String,
  pwd: String,
  token: String
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonButton, IonIcon, IonInput, ReactiveFormsModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public formSubmint = false;
  private tokenUsuario = '';
  private idUsuario = '';

  public avisoError = false;

  public esperando: boolean = false;


  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    pwd: ['', Validators.required],
    check:  [Validators.required]
  });

  

  constructor( private fb: FormBuilder,
               private usuarioService: UsuariosService,
               private route: Router){}

 

  login(){

    this.formSubmint = true;
    
    if (!this.loginForm.valid) {
      console.warn('errores en el formulario');
    }
    else{

      this.esperando = true;

      this.usuarioService.login( this.loginForm.value)
      .subscribe( res =>{

        console.log('Respuesta al suscribirse', res);
    
        
        //Recordar sesion
        if (this.loginForm.value.check) {
          localStorage.setItem('tokenUsuario', res.token);
          localStorage.setItem('idUsuario', res.idUsuario);
          localStorage.setItem('email', res.email);    
        }
        else{
          localStorage.setItem('tokenUsuario', this.tokenUsuario);
          localStorage.setItem('idUsuario', this.idUsuario);
        }

        this.route.navigateByUrl('/home');

      },(error) =>{
        console.log('error')
          Swal.fire({
        //    title: 'Error!',
        //    text: error.error.msg,
        //    icon: 'error',
        //    confirmButtonText: 'Ok'
        })
      })
      this.esperando = false;
    }   
  }
  
   campoValido(campo: string){
     return this.loginForm.get(campo)!.valid || !this.formSubmint;
   }
}