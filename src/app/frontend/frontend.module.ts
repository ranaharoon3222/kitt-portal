import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FrontendRoutingModule } from "./frontend-routing.module";
import { FrontendComponent } from "./frontend.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { PropertiesComponent } from "./properties/properties.component";
import { PaymentsComponent } from "./payments/payments.component";
import { PropertiesViewComponent } from "./properties-view/properties-view.component";
import { GoogleMapsModule } from "@angular/google-maps";
import { NgxSpinnerModule } from "ngx-spinner";
import { CarouselModule } from "ngx-owl-carousel-o";
import { SupportTicketsComponent } from "./support-tickets/support-tickets.component";
import { AddCaseComponent } from "./add-case/add-case.component";
import { TicketDetailComponent } from "./ticket-detail/ticket-detail.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TimeAgoExtPipePipe } from "../pipes/time-ago-ext-pipe.pipe";
import { NgImageSliderModule } from "ng-image-slider";

@NgModule({
  declarations: [
    FrontendComponent,
    DashboardComponent,
    SidebarComponent,
    PropertiesComponent,
    PaymentsComponent,
    PropertiesViewComponent,
    SupportTicketsComponent,
    AddCaseComponent,
    TicketDetailComponent,
    TimeAgoExtPipePipe,
  ],
  imports: [
    CommonModule,
    FrontendRoutingModule,
    GoogleMapsModule,
    NgxSpinnerModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    NgImageSliderModule,
  ],
})
export class FrontendModule {}
