import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  isSupported = false;
  barcodes: Barcode[] = [];
  

  constructor(private dbService: DbService, private route: ActivatedRoute, private router: Router, private alertController: AlertController, private http: HttpClient, private toastController: ToastController) { }
  
  usuarioDatos: any[] = [];
  nombreUs="";

  ngOnInit() {
    let usuario = this.router.getCurrentNavigation()?.extras.state?.['usuario'];
    this.datosUsuario(usuario);
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  
  //asistencia
  registraAsistencia(usuario: string, asignatura: string, seccion: string, fecha: string, nombreAsignatura: string){
    let data = {
      nombreFuncion: "AsistenciaAlmacenar",
      parametros:[
        usuario, asignatura, seccion, fecha
      ]
    };

    return this.http.post('https://fer-sepulveda.cl/API_PRUEBA_3/api-service.php', data).subscribe(
      res => {
        let response = JSON.parse(JSON.stringify(res));
        switch (response.result[0].RESPUESTA) {
          //OK
          case 'ASISTENCIA_OK':
            this.presentAlert(nombreAsignatura,fecha);
            break;

          //Usuario repetido
          case 'ASISTENCIA_NOK':
            this.presentAlert("2","2")
            break;

        }
      },
      err => {
      }
    );
  }

    

  

  async datosUsuario(usuario: any) {
    this.usuarioDatos = await this.dbService.datosUsuario(usuario);
    this.nombreUs = usuario;
  }

  irAsistencia(){
    this.router.navigate(['/asistencia'], { state: { usuario: this.nombreUs } })
  }

  public actionSheetButtons = [
    {
      text: 'Cerrar sesión',
      handler: () => {
        this.router.navigate(['/login']);
      },
    },
    {
      text: 'Cambiar contraseña',
      handler:() => {
        this.router.navigate(['/cambiar-contrasena'])
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  pagina(pagina : number) {
    if (pagina == 1) {
      window.open("https://www.duoc.cl/");  
    }
    if (pagina == 2) {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");  
    }
    
  }


  //Funciones QR  
  async scan(): Promise<void> {
    
    let ress = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    if (!ress.available) {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    }
    
    let granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert("1","1");
      return;
    }

    let { barcodes } = await BarcodeScanner.scan();
    
    this.barcodes.push(...barcodes);
  
    let texto_qr = this.barcodes[this.barcodes.length - 1].rawValue;
  
    let arreglo_qr = texto_qr.split('|');
  
    let codigo_asignatura = arreglo_qr[0].split('-')[0]
    let asignatura = arreglo_qr[1]
    let seccion = arreglo_qr[0].split('-')[1]
    let fecha = arreglo_qr[3]
    this.registraAsistencia(this.nombreUs, codigo_asignatura, seccion, fecha, asignatura);

  }
  
  async requestPermissions(): Promise<boolean> {
    let { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(nombre : string, fecha : string): Promise<void> {
    if (nombre === "1"){
      let alert = await this.alertController.create({
        header: 'Permiso denegado',
        message: 'Por favor otorga los permisos correspondientes para continuar.',
        buttons: ['OK'],
      });
      await alert.present();
    }else{
      if (nombre === "2") {
        let alert = await this.alertController.create({
          header: 'Ya estás registrado!',
          message: 'Puedes estar tranquilo, ya estás registrado!.',
          buttons: ['OK'],
        });
        await alert.present();
      }else{
        let alert = await this.alertController.create({
          header: 'Valores obtenidos',
          message: 'Has sido registrado correctamente para tu clase de ' + nombre + " el " + fecha + " 😎",
          buttons: ['OK'],
        });
        await alert.present();
      }
      
    }
    
  }
}
