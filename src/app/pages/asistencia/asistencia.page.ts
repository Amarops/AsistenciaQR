import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  constructor(private dbService: DbService,private route: ActivatedRoute, private router: Router, private http: HttpClient) { }
  nombreUs=""
  ngOnInit() {
    const usuario = this.router.getCurrentNavigation()?.extras.state?.['usuario'];
    this.datosUsuario(usuario);
    this.obtieneAsistencia(usuario);
  }
  usuarioDatos: any[] = [];
  async datosUsuario(usuario: any) {
    this.usuarioDatos = await this.dbService.datosUsuario(usuario);
    this.nombreUs = usuario;
  }
  
  datos: any;
  obtieneAsistencia(usuario: string){
    this.http.get('https://fer-sepulveda.cl/API_PRUEBA_3/api-service.php?nombreFuncion=AsistenciaObtener&usuario=' + usuario).
    subscribe((response) => {  
    this.datos = response;
    this.datos = this.datos.result;
    });
  }

  irPrincipal(){
    this.router.navigate(['/principal'], { state: { usuario: this.nombreUs } })
  }

}
