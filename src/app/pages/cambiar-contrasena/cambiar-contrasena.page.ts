import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { DbService } from 'src/app/services/db.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage implements OnInit {
  usuario=''
  contrasenaAntigua=''
  contrasenaNueva=''

  constructor(private dbService: DbService, private toastController: ToastController, private http: HttpClient) { }

  ngOnInit() {

  }
  
  realizaCambio(usuario: any, contrasenaAntigua: any, contrasenaNueva: any){
    if (usuario != '' && contrasenaAntigua != '' && contrasenaNueva != ''){
      
      const data = {
        nombreFuncion: "UsuarioModificarContrasena",
        parametros:[
          usuario, contrasenaNueva, contrasenaAntigua
        ]
      };

      return this.http.patch('https://fer-sepulveda.cl/API_PRUEBA_2/api-service.php', data).subscribe(
        res => {
          const response = JSON.parse(JSON.stringify(res));
          switch (response.result[0].RESPUESTA) {
            
            //OK
            case 'OK':
              this.dbService.cambiarContrasena(usuario, contrasenaAntigua, contrasenaNueva).then((data) =>{
                if (data === 1){
                  //Contraseña cambiada correctamente (interno + API)
                  this.presentToast(1)
                }
                if ( data === 0){
                  //Usuario contraseña incorrectos interno
                  this.presentToast(2)
                }
                if ( data === 2){
                  this.presentToast(4)
                }
              })
              break;

            //Credenciales incorrectas (API)
            case 'ERR01':
              this.presentToast(2);
              break;

            //Otro error
            default:
              this.presentToast(4);
              break;
          }
        },
        err => {
          //Error interno
          this.presentToast(4);
        }
      );
      
    }else{
      //Ingresar todos los datos
      return this.presentToast(3)
    }
  }

  async presentToast(valor: number){
    if (valor === 1){
      const toast = await this.toastController.create({
        message: 'Contraseña cambiada!',
        duration: 2000 
      });
      toast.present();
    }

    if (valor === 2){
      const toast = await this.toastController.create({
        message: 'Usuario o contraseña incorrectos',
        duration: 2000 
      });
      toast.present();
      }

    if (valor === 3){
      const toast = await this.toastController.create({
        message: 'Asegurate de ingresar todos los datos',
        duration: 2000 
      });
      toast.present();
    }

    if (valor === 4){
      const toast = await this.toastController.create({
        message: 'Error interno, vuelve a intentarlo más tarde',
        duration: 2000 
      });
      toast.present();
    }
  }
}
