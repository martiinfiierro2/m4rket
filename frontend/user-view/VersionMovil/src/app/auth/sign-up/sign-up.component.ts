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

  public esperando = false;
  public avisoError = '';
  
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
    if (this.esperando) {
      return;
    }

    this.avisoError = '';
    if (this.sign_upForm.invalid) {
      this.sign_upForm.markAllAsTouched();
      this.avisoError = 'Completa todos los campos y utiliza un correo válido.';
      return;
    }

    this.esperando = true;
    this.usuarioService.registro(this.sign_upForm.value)
      .subscribe({
        next: res => {
          this.idUsuario = res.usuario.id;
          this.tokenUsuario = res.token;
          this.email = res.usuario.email;
          sessionStorage.setItem('tokenUsuario', this.tokenUsuario);
          localStorage.setItem('idUsuario', this.idUsuario);
          localStorage.setItem('email', this.email);
          this.esperando = false;
          this.route.navigate(['/home']);
        },
        error: error => {
          this.esperando = false;
          this.avisoError = error.error?.msg || 'No se ha podido crear la cuenta. Revisa los datos e inténtalo de nuevo.';
        }
      });
  }
}
