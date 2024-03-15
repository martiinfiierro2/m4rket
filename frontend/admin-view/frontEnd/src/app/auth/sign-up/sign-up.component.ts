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
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {


  private tokenUsuario = '';
  private idUsuario = '';
  
  constructor( private fb: FormBuilder,
               private usuarioService: UsuariosService,
               private route: Router){}

  public sign_upForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', Validators.required],
    genero: ['', Validators.required],
    rol: ['', Validators.required]
  });


  sign_up(){
    console.log(this.sign_upForm);

    this.usuarioService.registro(this.sign_upForm.value)
      .subscribe( res =>{
        console.log(res);

        localStorage.setItem('idUsuario', res.usuario.id);
        localStorage.setItem('tokenUsuario', res.token);
        localStorage.setItem('rol', res.usuario.rol);
        
        this.route.navigate(['/productos']);
      }) 
  }

  volverAtras(){
    this.route.navigate(['/login']);
  }
} 
