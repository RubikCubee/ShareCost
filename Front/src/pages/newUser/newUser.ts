import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

// Le service
import { ShareCostService } from '../../services/ShareCostService'

// Import de la classe
import { User } from '../../classes/User'

// Import de la page
import { Groupe } from '../groupe/groupe';

import { Login } from '../login/login'

@Component({
  selector: 'new-user',
  templateUrl: 'newUser.html',
  providers: [ShareCostService]
})
export class NewUser {

// Le formulaire 
  public loginForm = this.fb.group(
    {
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordVerif: ['', Validators.required],      
    });

  // Message d'erreur
  private errorMessage: string;

  // Le user
  private userLogging: User;

  constructor(public navCtrl: NavController, public fb: FormBuilder, private ShareCostService: ShareCostService) {
    
  }

   // Initilisation
    ngOnInit() 
    {
      this.sayHello();
    }

    sayHello()
    {
      console.log("Hello !");
    }

  // Se charge de créer un nouveau user
  create(event, username,password)
  {
    event.preventDefault();

    if(this.loginForm.value.username && this.loginForm.value.password && this.loginForm.value.passwordVerif)
    {
      if(this.loginForm.value.password != this.loginForm.value.passwordVerif)
      {
        this.errorMessage = "Les mots de passe ne correspondent pas";
      }
      else
      {
        this.errorMessage = "";
        var reponse = this.ShareCostService.addUser(this.loginForm.value.username, this.loginForm.value.password)
        reponse.subscribe(
          res => { this.creationSucces();
            },
          err => {this.handleError(err); 
           }
          
        );
      }
    }
    else
    {
      this.errorMessage = "Les champs ne peuvent pas être vides";
    }
  }

  // Pour se logger
creationSucces()
{
  console.log("Succes : " + this.loginForm.value.username);
  this.navCtrl.setRoot(Groupe, {username: this.loginForm.value.username});
}


RetourLoginPage()
{
  this.navCtrl.setRoot(Login);
}
// Pour gérer l'erreur
  handleError(err)
  {
    console.log("Erreur : " + err);
    this.errorMessage = "L'utilisateur existe déjà.";
  }
}
