import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { ClientCardComponent } from './client-card/client-card.component';
import {ICarOwnersServiceService} from "./services/icar-owners-service.service";
import {CommonModule} from "@angular/common";


const appRoutes: Routes =[
  {path: '', component: HomeComponent},
  {path: 'view', component: ClientCardComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClientCardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ICarOwnersServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
