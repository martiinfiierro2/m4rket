import { Component } from '@angular/core';
import { UsuariosService } from "../../services/usuarios.service";
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {


  private tokenUsuario = '';
  private idUsuario = '';
  private email = '';
  
  constructor( private fb: FormBuilder,
               private usuarioService: UsuariosService,
                private route: Router){}

  public sign_upForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', Validators.required],
    genero: ['', Validators.required],
    rol: ['usuario', Validators.required]
  });


  sign_up(){
    console.log(this.sign_upForm);
    this.usuarioService.registro(this.sign_upForm.value)
      .subscribe( res =>{
        console.log(res);
        console.log('tetas');
        console.log(res.idUsuario);
        this.idUsuario = res.usuario.id;
        this.tokenUsuario = res.token;
        this.email = res.usuario.email;
        console.log(this.idUsuario);
        console.log(this.tokenUsuario);
        sessionStorage.setItem('tokenUsuario', this.tokenUsuario);
        localStorage.setItem('idUsuario', this.idUsuario);
        localStorage.setItem('email', this.email);
        this.route.navigate(['/home']);
      }) 
  }
} 