import { Component, Input, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import {
  UserServiceService,
} from "src/app/services/user-service.service";
import { User } from "@app/interfaces/user.interface";

@Component({
  selector: "app-profile-modal",
  templateUrl: "./profile-modal.component.html",
  styleUrls: ["./profile-modal.component.css"],
})
export class ProfileModalComponent implements OnInit {
  @Input({ required: true }) modalId: string = "";

  public perfilUsuario!: User;

  constructor(
    private keycloak: KeycloakService,
    private userService: UserServiceService,
  ) {}

  async ngOnInit(): Promise<void> {

    this.perfilUsuario = await this.userService.getUserData();
  }

  LogOut() {
    this.keycloak.logout();
  }
}
