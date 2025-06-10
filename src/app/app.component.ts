import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";
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

    if (this.isLogueado) {
      const user = await this.userService.syncUserToBackend();

    }
  }

  public iniciarSesion() {
    this.keycloak.login();
  }

  public cerrarSesion() {
    this.keycloak.logout();
  }
}
