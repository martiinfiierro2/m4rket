import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Console, error } from 'console';
import { of } from 'rxjs';

interface Usuarios{
  nombre: string,
  apellido: string,
  email: string,
  genero: string,
  rol: string,
  uid: number
}


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})


export class UsuariosComponent {


  constructor( private usuarioService: UsuariosService,
               private fb: FormBuilder){}

  usuarios: Usuarios[] = [];
  valueBusquedaInput = '';
  creacionUsuario = false;


  public usuarioForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', Validators.required],
    genero: ['',Validators.required],
    rol: ['admin', Validators.required]
  });

  ngOnInit(){
    this.usuarioService.cargarCabecera();
    this.getUsuariosAdmin();
  }
  
  validarPwd(pwd: string): boolean {
    // Verificar la longitud mínima
    if (pwd.length < 8) {
      return false;
    }

    // Verificar al menos una minúscula
    if (!/[a-z]/.test(pwd)) {
      return false;
    }

    // Verificar al menos una mayúscula
    if (!/[A-Z]/.test(pwd)) {
      return false;
    }

    // Verificar al menos un carácter no alfanumérico
    if (!/[!@#$%^&*(),.-_?":{}|<>]/.test(pwd)) {
      console.log("Fallo en el no alfanumérico");
      return false;
    }


    // Verificar al menos un número
    if (!/\d/.test(pwd)) {
      return false;
    }

    // Si pasa todas las verificaciones, entonces la pwd es válida
    return true;
}

  


  getUsuariosAdmin(){
    let usuariosTotales: Usuarios[] = [];

    this.usuarioService.getUsuarios()
      .subscribe( res =>{
        for (let usuario of res.usuarios){
          if (usuario.rol == 'admin') {
            this.usuarios.push(usuario);
          }
         }
      })    
  }

  getBusquedaUsuarios(){

  }

  crearUsuario(){

    if (this.usuarioForm.status != 'VALID') {
      this.lanzarModelError("Campos incompletos o mal completados");
    }
    else{
      if (this.validarPwd(this.usuarioForm.value.pwd)) {
        this.usuarioService.crearUsuario(this.usuarioForm.value)
          .subscribe(res =>{
            this.getUsuariosAdmin();
          }, err =>{
            this.lanzarModelError("Error creando el usuario")
          });
      }
      else{
        this.lanzarModelError('La logitud de la contraseña tiene que ser de 8 carácteres y debe contener como mínimo una mayúscula, una minúscula, un número y un signo de puntuación');
      }
    }    
  }

  cerrarFormulario(){
    this.creacionUsuario = false;
    this.usuarioForm.reset();
  }

  borrarUsu( idUsu: number){
    this.usuarioService.borrarUsuario(idUsu)
      .subscribe( res =>{
        this.getUsuariosAdmin();
      })
  }

  irEditarUsu( idUsu: number){

  }

  lanzarModelError( msg:string ){
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

}
