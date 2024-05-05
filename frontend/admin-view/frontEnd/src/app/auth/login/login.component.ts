import { Component } from '@angular/core';
import { UsuariosService } from "../../services/usuarios.service";
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'
import { Router, withDisabledInitialNavigation } from '@angular/router';
import Swal from 'sweetalert2'

declare const gapi: any;

interface Usuario {
  email: String,
  pwd: String,
  token: String
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public formSubmint = false;
  public esperando = false;

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

        //si es usuario no puede acceder al panel de admin
        if (res.rol == 'usuario') {   
          Swal.fire({
            title: 'Error!',
            text: 'Solo se permite el acceso a los administradores de los comercios',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.esperando = false;
        }
        else{
          //Recordar sesion
          if (this.loginForm.value.check) {
            localStorage.setItem('tokenUsuario', res.token);
            localStorage.setItem('idUsuario', res.idUsuario);
            localStorage.setItem('email', res.email);
            localStorage.setItem('rol', res.rol);
          }
          else{
            localStorage.removeItem('email');
            localStorage.setItem('tokenUsuario', res.token);
            localStorage.setItem('idUsuario', res.idUsuario);
            localStorage.setItem('rol', res.rol); 
          }
    
          this.route.navigateByUrl('/productos');
          this.esperando = false;
        }
      },(error) =>{
        Swal.fire({
          title: 'Error!',
          text: error.error.msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        this.esperando = false;
      })
    }   
  }
  
  campoValido(campo: string){
    return this.loginForm.get(campo)!.valid || !this.formSubmint;
  }
}
