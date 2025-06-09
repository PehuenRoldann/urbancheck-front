import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";
import { ApiService } from "./core/services/apiservice.service";
import { ITestResponse } from "./core/models/response.interface";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Urbancheck";
  public isLogueado = false;
  public testResponse: ITestResponse | null = null;
  public apiPing = "";
  public apiConectorPing = "";
  public perfilUsuario: KeycloakProfile | null = null;
  public role = false;
  constructor(
    private readonly keycloak: KeycloakService,
    private userService: UserService,
  ) {}

  public async ngOnInit() {
    this.isLogueado = await this.keycloak.isLoggedIn();
    const token = await this.keycloak.getToken();

    // console.log ("role=====>", this.role );

    /* if(this.isLogueado && !this.role){
      this.keycloak.logout();
      return;
    } */

    console.log("DEBUG >> IS LOGEADO");
    console.log(this.isLogueado);

    if (this.isLogueado) {
      console.log("HOLAAAAA");
      const user = await this.userService.syncUserToBackend();
      console.log("DEBUG >> USER");
      console.log(user);
    }
  }

  public iniciarSesion() {
    this.keycloak.login();
  }

  public cerrarSesion() {
    console.log("Login out.... !!!!!");
    this.keycloak.logout();
  }
}
