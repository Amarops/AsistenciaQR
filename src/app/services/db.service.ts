import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx'; //Importación de sqlite
//API
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DbService {



  constructor(private router: Router, private sqlite:SQLite, public _http: HttpClient) {  //Se ingresa en el constructor para que se cree la tabla, importado desde el services

    //Crea la tabla de usuarios
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS usuario(usuario VARCHAR(30), contrasena VARCHAR(30), correo VARCHAR(30),nombre VARCHAR(30), apellido VARCHAR(30))', []) //Para crear tabla
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }


  //Guarda al usuario BD
    almacenarUsuario(usuario: any, contrasena: any, correo: any, nombre: any, apellido: any){
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql('INSERT INTO usuario VALUES(?, ?, ?, ?, ?)', [usuario, contrasena, correo,  nombre, apellido])        //Para insertar datos
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    }


  //Verifica que el correo o usuario no esté en uso por otro usuario
  verificaUsuario(usuario: any, correo: any) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT COUNT(usuario) AS CANTIDADUS FROM USUARIO WHERE usuario = ?', [usuario]).then((data) => {
        if(data.rows.item(0).CANTIDADUS === 0){
          return db.executeSql('SELECT COUNT(correo) AS CANTIDADCO FROM usuario WHERE correo = ?', [correo]).then((data) => {
            if (data.rows.item(0).CANTIDADCO === 0){
              return 0; // OK
            }else{
              return 2; //ERR02
            }
          }).catch(e => {return 3});
        }else{
          return 1; //ERR01
        }
      }).catch(e => {return 3});
    }).catch(e => {return 3});  
  }

  //Funcion para listar a todos los usuarios
  async obtenerUsuarios(): Promise<any[]> { 
    const db: SQLiteObject = await this.sqlite.create({
      name: 'data.db',
      location: 'default'
    });
    const result = await db.executeSql('SELECT * FROM usuario', []);
    let usuarios: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      usuarios.push(result.rows.item(i));
    }
    return usuarios;
  }
  
  //Validacion credenciales incio sesión
  validaLogin(usuario: any, contrasena: any){
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT count(usuario) AS CANTIDAD FROM USUARIO WHERE usuario = ? AND contrasena = ?', [usuario, contrasena]).then((data) => {
        if(data.rows.item(0).CANTIDAD===1){
          return true; // COINCIDE
        }else{
          return false; // NO COINCIDE
        }
      }).catch(e => {
        return false
      })
    }).catch(e => {
      return false
    })  
  }

  //Funcion para cambio de contraseña
  cambiarContrasena(usuario: any, contrasenaAntigua: any, nuevaContrasena: any) {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT COUNT(contrasena) AS CONTRASENAUS FROM USUARIO WHERE usuario = ? AND contrasena = ?', [usuario, contrasenaAntigua]).then((data) => {
        if (data.rows.item(0).CONTRASENAUS===0){
          return 0; // No coincide contraseña
        }else{
          return db.executeSql('UPDATE usuario SET contrasena = ? WHERE usuario = ?', [nuevaContrasena, usuario]).then(() => {
            return 1; // Cambio de contraseña exitoso
          }).catch(error => {
            console.error('JK27: Error al ejecutar la consulta de actualización:', error);
            return 2; // Manejar el error según lo necesites
          });
        }
      });
    }).catch(error => {
      console.error('JK27: Error al abrir la base de datos:', error);
      return 2; // Manejar el error según lo necesites
    });
  }

  //Funcion para obtener todos los datos de usuario en especifico
  async datosUsuario(usuario: any): Promise<any[]> {
    const db: SQLiteObject = await this.sqlite.create({
      name: 'data.db',
      location: 'default'
    });

    const result = await db.executeSql('SELECT * FROM usuario WHERE usuario = ?', [usuario]);
    let usuarioDatos: any[] = [];

    for (let i = 0; i < result.rows.length; i++) {
      usuarioDatos.push(result.rows.item(i));
    }

    return usuarioDatos;
  }
 
}
