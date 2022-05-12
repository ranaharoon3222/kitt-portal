import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../auth-guard/authentication.guard';
import { AddCaseComponent } from './add-case/add-case.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontendComponent } from './frontend.component';
import { PaymentsComponent } from './payments/payments.component';
import { PropertiesViewComponent } from './properties-view/properties-view.component';
import { PropertiesComponent } from './properties/properties.component';
import { SupportTicketsComponent } from './support-tickets/support-tickets.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

const routes: Routes = [
  {
     path: '', component: FrontendComponent,
     children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthenticationGuard],
      },
      { 
        path: 'properties', 
        component: PropertiesComponent,
        canActivate: [AuthenticationGuard],
      },
      { 
        path: 'properties-view', 
        component: PropertiesViewComponent,
        canActivate: [AuthenticationGuard],
      },
      { 
        path: 'payments', 
        component: PaymentsComponent,
        canActivate: [AuthenticationGuard],
      },
      { 
        path: 'support-tickets', 
        component: SupportTicketsComponent,
        canActivate: [AuthenticationGuard],
      },
      { 
        path: 'add-case', 
        component: AddCaseComponent,
        canActivate: [AuthenticationGuard],
      },
      { 
        path: 'ticket-detail', 
        component: TicketDetailComponent,
        canActivate: [AuthenticationGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
