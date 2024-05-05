import { CanActivateFn, Router } from '@angular/router';
import { UsuariosService } from "../services/usuarios.service";
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';



export const authGuard: CanActivateFn = (route, state) => {

  const usuService = inject(UsuariosService);
  const router = inject(Router);

  return usuService.validarToken()
         .pipe(
            tap( resp =>{
              console.log(resp);
              if (!resp) {
                localStorage.removeItem('tokenUsuario');
                localStorage.removeItem('idUsuario');
                router.navigateByUrl('/login');
              }
            })
         );

};

export const authGuard2: CanActivateFn = (route, state) => {

  const router = inject(Router);


  if (localStorage['tokenUsuario']) {
    router.navigateByUrl('/productos');
    return of(false);
  }
  else{
    return of(true);
  }
};
