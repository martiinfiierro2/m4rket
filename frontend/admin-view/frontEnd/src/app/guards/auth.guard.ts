import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from "../services/usuarios.service";
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';



export const authGuard: CanActivateFn = (route, state) => {

  const usuService = inject(UsuariosService);
  const router = inject(Router);

  console.log("Entro al guard del token");

  return usuService.validarToken()
         .pipe(
            tap( resp =>{
              console.log(resp);
              if (!resp) {
                router.navigateByUrl('/login');
              }
            })
         );

};

export const authGuard2: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const usuService = inject(UsuariosService);

  console.log("Entro al guard del login");
  //return true;

  if (localStorage.getItem('tokenUsuario')) {
    return of(false);
  }
  else{
    return of(true);

  }
};
