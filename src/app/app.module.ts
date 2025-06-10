import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { initializeKeycloak } from "./core/init/keycloak-init.factory";
import { ApiService } from "./core/services/apiservice.service";
import { HttpClientModule } from "@angular/common/http";
import { MapCommonComponent } from "./components/map-common/map-common.component";
import { TicketCreationModalComponent } from "./components/ticket-creation-modal/ticket-creation-modal.component";
import { WelcomeViewComponent } from "./components/welcome-view/welcome-view.component";
// import { TicketDataJsonService } from "./services/ticket-data-json.service";
import { TicketViewModalComponent } from "./components/ticket-view-modal/ticket-view-modal.component";
// import { ReclamoModalComponent } from './components/reclamo-modal/reclamo-modal.component';

// import { TicketDataJsonService } from './services/ticket-data-json.service';
import { TICKET_SERVICE_INTERFACE_TOKEN } from "./interfaces/ticket.service.interface";
import { MapboxService } from "./services/mapbox.service";
import { MAP_SERVICE_INTERFACE_TOKEN } from "./interfaces/map.service.interface";
import { PillComponent } from "./components/pill/pill.component";
// import { TicketDataApiService } from "./services/ticket-data-api.service";
import { ProfileModalComponent } from "./components/profile-modal/profile-modal.component";
import { TicketService } from "./services/ticket-data.service";

@NgModule({
  declarations: [
    AppComponent,
    MapCommonComponent,
    TicketCreationModalComponent,
    WelcomeViewComponent,
    TicketViewModalComponent,
    PillComponent,
    ProfileModalComponent,
    //    ReclamoModalComponent,
  ],
  imports: [
    BrowserModule,
    KeycloakAngularModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    ApiService,
    TicketService,
    {
      provide: TICKET_SERVICE_INTERFACE_TOKEN,
      useExisting: TicketService,
    },
    {
      provide: MAP_SERVICE_INTERFACE_TOKEN,
      useClass: MapboxService, // Asegurate que esto también esté bien si usás MapServiceInterface
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
