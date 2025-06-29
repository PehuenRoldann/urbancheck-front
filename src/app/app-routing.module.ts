import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { TicketAdministartionPanelComponent } from './components/ticket-administartion-panel/ticket-administartion-panel.component';
import { MapCommonComponent } from './components/map-common/map-common.component';
import { WelcomeViewComponent } from './components/welcome-view/welcome-view.component';

const routes: Routes = [
  { path: '', component: WelcomeViewComponent},
  { path: 'map', canActivate: [AuthGuard], component: MapCommonComponent },
  { path: 'admin', canActivate: [AuthGuard], component: TicketAdministartionPanelComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
