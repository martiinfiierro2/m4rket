import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { PaginationComponent } from "../../pagination/pagination.component";



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
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.css',
    imports: [FormsModule, CommonModule, ReactiveFormsModule, PaginationComponent]
})


export class UsuariosComponent {


  constructor( private usuarioService: UsuariosService,
               private fb: FormBuilder){}

  usuarios: Usuarios[] = [];
  valueBusquedaInput = '';
  creacionUsuario = false;
  mostrarDesplegableFiltros = false;

  //Variables paginación
  public totalregistros=98;
  public posicionactual =0;
  public registrosporpagina =10;

  private paginaUsada = 0;


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
    this.getAllUsuarios();
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

  

  getAllUsuarios(){
    this.usuarios = [];

    
    let numUsuarios = 0;
    let cont = 1;

    this.usuarioService.getAllUsuarios()
      .subscribe( res =>{
        if (this.opcionesSeleccionadas.length > 0) {
          for (let usuario of res.usuarios){
            if (this.opcionesSeleccionadas.includes(usuario.rol)) {
              numUsuarios++;
            }
          }
          this.totalregistros = numUsuarios;

          let hasta = this.posicionactual + this.registrosporpagina;

          for (let usuario of res.usuarios){
            if (this.opcionesSeleccionadas.includes(usuario.rol)) {
              if (this.posicionactual < cont && cont <= hasta) {
                this.usuarios.push(usuario); 
                cont++;
              }
            }
            
          }
        }
        else{
          this.totalregistros = res.usuarios.length;
          let hasta = this.posicionactual + this.registrosporpagina;
        
          for(let usuario of res.usuarios){
            if (this.posicionactual < cont && cont <= hasta) {
              this.usuarios.push(usuario); 
            }
            cont++;
          }
        }
      }) 

      
      
  }

  crearUsuario(){

    if (this.usuarioForm.status != 'VALID') {
      if (this.usuarioForm.controls.rol.status == 'INVALID') {
        this.usuarioForm.controls.rol.setValue('admin');
      }
      else{
        this.lanzarModelError("Campos incompletos o mal completados");
      }
      console.log(this.usuarioForm);
    }

    if (this.usuarioForm.status == 'VALID') {
      if (this.validarPwd(this.usuarioForm.value.pwd)) {
        this.usuarioService.crearUsuario(this.usuarioForm.value)
          .subscribe(res =>{
            this.cerrarFormulario();
            this.getAllUsuarios();
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
        this.getAllUsuarios();
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

  //FILTROS DE BÚSQUEDA

  opciones = [
    { label: 'Usuarios', value: 'usuario', checked: false },
    { label: 'Admins', value: 'admin', checked: false },
    { label: 'SuperAdmins', value: 'superAdmin', checked: false }
  ];

  opcionesSeleccionadas: string[] = [];

  desplegarFiltros(){
    if (this.mostrarDesplegableFiltros) {
      this.mostrarDesplegableFiltros = false;
    }
    else{
      this.mostrarDesplegableFiltros = true;
    }
  }

  seleccionarOpcion(opcion){
    opcion.checked = !opcion.checked;
    this.actualizarSeleccionadas();
  }

  actualizarSeleccionadas(){
    this.opcionesSeleccionadas = this.opciones.filter(option => option.checked).map(option => option.value);
    this.posicionactual = 0;
    this.getAllUsuarios();
    
  }

  cambiarPagina( pagina:number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.paginaUsada = pagina;

    this.getAllUsuarios();
  }
}
