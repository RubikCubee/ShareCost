import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';


// import des modèles
import { Depense } from '../../classes/depense'
import { User } from '../../classes/user'

// Le service
import { ShareCostService } from '../../services/ShareCostService'


@Component({
  selector: 'page-add-depense',
  templateUrl: 'add-depense.html'
})
export class AddDepensePage 
{
  usernameLogged:string;
  newDepense:Depense;
  id_groupe:string;
  usersInGroupe:Array<User>;
  errorMessage:string;
  
  // Le formulaire 
  public depenseForm = this.fb.group(
    {
      nameDepense: ['', Validators.required],
      userFrom: ['', Validators.required],
      montant:['', Validators.required],
      usersTo:['', Validators.required],
    });

  constructor(public fb: FormBuilder, public navCtrl: NavController, private navParams: NavParams, public shareCostService: ShareCostService) {

      // Récupération de l'user name à partir des paramètres
    if(navParams.get('idGroupe') && navParams.get('usersIG') && navParams.get('userLog') )
    {
      this.id_groupe = navParams.get('idGroupe');
      this.usersInGroupe = navParams.get('usersIG');
      this.usernameLogged = navParams.get('userLog');
      console.log(this.id_groupe);
    }
    else
    {
      //this.userName = "CompteTest";
      //Erreur
    } 
  }

  ngInit()
  {
    
  }

  addDepense(event)
  {
      // Affichage d'un message si jamais il manque quelque chose
      if(!this.depenseForm.value.nameDepense) this.errorMessage = "Pas de nom à la dépense";
      else if(!this.depenseForm.value.userFrom) this.errorMessage = "Personne qui paye ?";
      else if(!this.depenseForm.value.usersTo) this.errorMessage = "Pour qui il paye ? ";
      else if(!this.depenseForm.value.montant) this.errorMessage = "pas de montant ? ";
      else
      {
         console.log("Ajout de la dépense : " + this.depenseForm.value.nameDepense + " payé par " + this.depenseForm.value.userFrom + " à " + this.depenseForm.value.usersTo + " ayant pour montant" + this.depenseForm.value.montant);
         // Une requete par dépense 'userTo'
     
        // Ajout d'une dépense
        var response = this.shareCostService.addDepense(this.usernameLogged, this.id_groupe, this.depenseForm.value.nameDepense, this.depenseForm.value.userFrom, this.depenseForm.value.usersTo, this.depenseForm.value.montant);
        response.subscribe(
          res => { console.log("Depense ajoutée");
                  this.navCtrl.pop();},
          err => { console.log(err);
            this.navCtrl.pop();}
        );
         
      }      
  }   
}
