
// ionic et angular import
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

// L'application
import { MyApp } from './app.component';

// Mes modules 
import { Groupe } from '../pages/groupe/groupe';
import { Login } from '../pages/login/login';
import { Compte } from '../pages/compte/compte';
import { DescriptionGroupe } from '../pages/descriptionGroupe/descriptionGroupe';
import { NewUser } from '../pages/newUser/newUser'
import { AddDepensePage } from '../pages/add-depense/add-depense'

// Gestion de la communication réseau
import { HttpModule, JsonpModule }  from '@angular/http';

// Mon service
import { ShareCostService } from '../services/ShareCostService';

@NgModule({
  declarations: [
    MyApp,
    Groupe,
    Login,
    Compte,
    DescriptionGroupe,
    NewUser,
    AddDepensePage
 
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    JsonpModule,
    HttpModule,
    BrowserModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Groupe,
    Login,
    Compte,
    DescriptionGroupe,
    NewUser,
    AddDepensePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, ShareCostService]
})
export class AppModule {
  
}
