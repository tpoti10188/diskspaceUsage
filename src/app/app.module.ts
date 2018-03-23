import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Comment out when backend is setup
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { CheckoutData } from './home/checkout-data'; // Mocked data for InMemoryWebApiModule

// PrimeNg Components
import { DropdownModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { GrowlModule } from 'primeng/growl';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component'; // Main Component
import { CheckoutService } from './home/checkout.service'; // Handles CRUD functions


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(CheckoutData, { dataEncapsulation: true }), // Comment out once backend is up
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DropdownModule,
    DialogModule,
    ButtonModule,
    CheckboxModule,
    CalendarModule,
    InputTextModule,
    OverlayPanelModule,
    PanelModule,
    GrowlModule,
    ConfirmDialogModule,
    InputTextareaModule,
    ScrollPanelModule

  ],
  providers: [ CheckoutService,
               ConfirmationService,
               MessageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
