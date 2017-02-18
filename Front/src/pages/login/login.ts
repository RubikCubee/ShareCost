import { NavController, Alert, IonicApp } from 'ionic-angular';
import { Inject, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Response } from '@angular/http';

// Le service
import { ShareCostService } from '../../services/ShareCostService'

// Import de la classe
import { User } from '../../classes/User'

// Import de la page
import { Groupe } from '../groupe/groupe';

import { NewUser } from '../newUser/newUser'


/* ---------------

- Les identifiants passent en clair, sans aucune (mais alors pas du tout) sécurité.
- Ce qui pose un souci (étant donné qu'on les passent dans l'url), c'est si jamais un pseudo contient '/'
- Et c'est moche.
- Il n'y a pas de création de nouvel utilisateur possible
 ---------------- */

@Component({
  selector: 'login-page',
  templateUrl: 'login.html',
  providers: [ShareCostService]
})

export class Login {

  // Le formulaire 
  public loginForm = this.fb.group(
    {
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

  // Message d'erreur
  private errorMessage: string;

  // Le user
  private userLogging: User;

  // Le constructeur
  constructor(public fb: FormBuilder, private ShareCostService: ShareCostService, private navControl: NavController) { }

  // La fonction gérant le login
  login(event, username, password) {
    event.preventDefault();

    // Lancement du login
    if (this.loginForm.value.username && this.loginForm.value.password) {
      this.errorMessage = "";
      var response = this.ShareCostService.login(this.loginForm.value.username, this.loginForm.value.password);
      response.subscribe(
        res => { this.loginSuccessful(res) },
        err => { this.loginError() }
      );
    }
    else {
      this.errorMessage = "Les identifiants ne doivent pas être nuls";
    }
  }

  // Si jamais le login est correct
  loginSuccessful(res) {
    this.errorMessage = "Ravi de vous revoir !";
    this.navControl.setRoot(Groupe, { username: res.username });
  }

  // Une erreur de login => affichage d'un p'tit message
  loginError() {
    this.errorMessage = "Les identifiants n'existent pas.";
  }

  // Clic sur le bouton nouveau utilisateur 
  clickNewUser()
  {
    console.log("Ohé ? ");
    this.navControl.setRoot(NewUser);
  }
}