import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {

  usuario=''
  nombre=''
  apellido=''
  correo=''
  contrasena=''

  constructor(private dbService: DbService, private toastController: ToastController, private http: HttpClient) {
   }

  ngOnInit() {
   
  }
  
  almacenarUsuario(usuario: any, nombre: any, apellido: any, correo: any, contrasena: any) {
    if (usuario != '' && contrasena != '' && nombre != '' && apellido != '' && correo!=''){    
      const data = {
        nombreFuncion: "UsuarioAlmacenar",
        parametros:[
          usuario, correo, contrasena, nombre, apellido
        ]
      };

      return this.http.post('https://fer-sepulveda.cl/API_PRUEBA_2/api-service.php', data).subscribe(
        res => {
          const response = JSON.parse(JSON.stringify(res));
          switch (response.result[0].RESPUESTA) {
            //OK
            case 'OK':
              this.dbService.verificaUsuario(usuario, correo).then((data) => {
                if(data === 0){ 
                  this.dbService.almacenarUsuario(usuario, contrasena, correo, nombre, apellido)
                  this.presentToast(0)
                }
                //Usuario existe
                if (data === 1){ 
                  this.presentToast(1);
                }
                
                //Correo existe
                if(data === 2){
                  this.presentToast(2);
                }
              })
              break;

            //Usuario repetido
            case 'ERR01':
              this.dbService.verificaUsuario(usuario, correo).then((data) => {
                if(data === 0){ 
                  this.dbService.almacenarUsuario(usuario, contrasena, correo, nombre, apellido)
                  this.presentToast(0)
                }
                //Usuario existe
                if (data === 1){ 
                  this.presentToast(1);
                }
                
                //Correo existe
                if(data === 2){
                  this.presentToast(2);
                }
              })
              break;

            //Correo repetido
            case 'ERR02':
              this.dbService.verificaUsuario(usuario, correo).then((data) => {
                if(data === 0){ 
                  this.dbService.almacenarUsuario(usuario, contrasena, correo, nombre, apellido)
                  this.presentToast(0)
                }
                //Usuario existe
                if (data === 1){ 
                  this.presentToast(1);
                }
                
                //Correo existe
                if(data === 2){
                  this.presentToast(2);
                }
              })
              break;
            
            //Otro error
            default:
              this.presentToast(3);
              break;
          }
        },
        err => {
          this.presentToast(3);
        }
      );
    }else{
      //Datos insuficientes
      return this.presentToast(4);
    }
  }

 
  async presentToast(valor: number){
    if (valor === 0){
      const toast = await this.toastController.create({
        message: 'Usuario creado!',
        duration: 2000 
      });
      toast.present();
    }

    if (valor === 1){
      const toast = await this.toastController.create({
        message: 'Usuario en uso!',
        duration: 2000 
      });
      toast.present();
    }

    if (valor === 2){
      const toast = await this.toastController.create({
        message: 'Correo en uso!',
        duration: 2000 
      });
      toast.present();
    }

    if (valor === 3){
      const toast = await this.toastController.create({
        message: 'Error interno, intentelo más tarde',
        duration: 2000 
      });
      toast.present();
    }

    if (valor === 4){
      const toast = await this.toastController.create({
        message: 'Asegurate de ingresar todos los datos',
        duration: 2000 
      });
      toast.present();
    }
  }
}
  


