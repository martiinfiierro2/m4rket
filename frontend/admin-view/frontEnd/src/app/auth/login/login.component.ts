import { Component } from '@angular/core';
import { UsuariosService } from "../../services/usuarios.service";
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router';



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
  private tokenUsuario = '';
  private idUsuario = '';

  public avisoError = false;


  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', Validators.required],
    check:  [Validators.required]
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuariosService,
               private route: Router){}

  ngOnInit(): void {
  
  }

  login(){

    this.formSubmint = true;
    
    if (!this.loginForm.valid) {
      console.warn('errores en el formulario');
    }
    else{
      this.usuarioService.login( this.loginForm.value)
      .subscribe( res =>{

        console.log('Respuesta al suscribirse', res);
        this.tokenUsuario = res.token;
        this.idUsuario = res.idUsuario;
        
        //Recordar sesion
        if (this.loginForm.value.check) {
          localStorage.setItem('tokenUsuario', this.tokenUsuario);
          localStorage.setItem('idUsuario', this.idUsuario);
          this.route.navigate(['/productos']);
        }
        else{
          sessionStorage.setItem('tokenUsuario', this.tokenUsuario);
          sessionStorage.setItem('idUsuario', this.idUsuario);
          this.route.navigate(['/productos']);
        }
      },error =>{
        this.avisoError = true;
      })
    }   
  }
  
  campoValido(campo: string){
    return this.loginForm.get(campo)!.valid || !this.formSubmint;
  }
}
