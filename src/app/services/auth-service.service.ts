import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'  // Este servicio estará disponible globalmente
})
export class AuthService {
  private token: string | null = null;

  constructor(private keycloakService: KeycloakService) {}

  // Obtener el token, solo se obtiene una vez
  public async getToken(): Promise<string | null> {
    if (!this.token) {
      try {
        this.token = await this.keycloakService.getToken();  // Obtén el token de Keycloak
      } catch (error) {
        console.error('Error al obtener el token:', error);
        return null;
      }
    }
    return this.token;  // Si el token ya fue obtenido, lo retornamos
  }

  // Método para verificar si el usuario está logueado
  public async isLoggedIn(): Promise<boolean> {
    return await this.keycloakService.isLoggedIn();
  }

  // Método para obtener el perfil del usuario
  public async getUserProfile() {
    return await this.keycloakService.loadUserProfile();
  }
}
