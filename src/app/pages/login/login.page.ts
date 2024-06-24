import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario=''
  contrasena=''


  constructor(private dbService: DbService, private toastController: ToastController,private router: Router, private http: HttpClient) { }

  ngOnInit() {
    
  } 

  validarDatos(usuario: any, contrasena: any){
    if (usuario != '' && contrasena != ''){
      const data = {
        nombreFuncion: "UsuarioLogin",
        parametros:[
          usuario, contrasena
        ]
      };

      return this.http.post('https://fer-sepulveda.cl/API_PRUEBA_2/api-service.php', data).subscribe(
        res => {
          const response = JSON.parse(JSON.stringify(res));
          switch (response.result[0].RESPUESTA) {
            
            //OK
            case 'LOGIN OK':
              this.dbService.validaLogin(usuario, contrasena).then((data) => {
                if (data){
                  //Credenciales correctas (interno + API)
                  this.presentToast(1)
                  this.router.navigate(['/principal'], { state: { usuario: this.usuario } })
                }else{
                  //Credenciales incorrectas (interno)
                  this.presentToast(2)
                }
              })
              break;

            //Credenciales incorrectas (API)
            case 'LOGIN NOK':
              this.presentToast(2);
              break;

            //Otro error
            default:
              this.presentToast(4);
              break;
          }
        },
        err => {
          this.presentToast(4);
        }
      );

    }else{
      //Datos faltantes
      return this.presentToast(3)
    }
  }

  async presentToast(valor: number){
    if (valor === 1){
      const toast = await this.toastController.create({
        message: 'Bienvenido!',
        duration: 2000 
      });
      toast.present();
    }
    if (valor === 2){
      const toast = await this.toastController.create({
        message: 'Credenciales incorrectas!',
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
        message: 'Error interno, intentelo más tarde',
        duration: 2000 
      });
      toast.present();
    }
  }
}
