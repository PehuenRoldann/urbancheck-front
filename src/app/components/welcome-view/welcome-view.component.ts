import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-welcome-view',
  templateUrl: './welcome-view.component.html',
  styleUrls: ['./welcome-view.component.css'],
})
export class WelcomeViewComponent {
  title = 'Urbancheck';
  public isLogueado = false;
  public apiPing = '';
  public apiConectorPing = '';
  public perfilUsuario: KeycloakProfile | null = null;
  public role = false;
  constructor(
    private readonly keycloak: KeycloakService,
    private userService: UserService
  ) {}

  public async ngOnInit() {
    this.isLogueado = await this.keycloak.isLoggedIn();
    const token = await this.keycloak.getToken();

    if (this.isLogueado) {
      const user = await this.userService.syncUserToBackend();
    }
  }

  public iniciarSesion() {
    this.keycloak.login({
      redirectUri: window.location.href + '/map',
    });
  }

  public cerrarSesion() {
    this.keycloak.logout();
  }
}
