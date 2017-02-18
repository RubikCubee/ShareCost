import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { ShareCostService } from '../../services/ShareCostService'

import { AddDepensePage } from '../add-depense/add-depense'

import { Depense } from '../../classes/depense'

import { User } from '../../classes/user'

import { BilanDepense } from '../../classes/bilanDepense'

// Pour la gestion des Observable
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'descriptionGroupe-descriptionGroupe',
  templateUrl: 'descriptionGroupe.html'
})
export class DescriptionGroupe {
  userName: string;
  id_groupe: string;
  name: string;
  imgGrouge: string;
  depenses: Array<Depense>;

  usersInGroupe: Array<User>;

  listeBilan: Array<BilanDepense>;
  usernameToFind: string;
  bilanMessage:string;
  IsDebtOkay:boolean;

  constructor(public navCtrl: NavController, public shareCostService: ShareCostService, private navParams: NavParams, public alertCtrl: AlertController, private loadingController: LoadingController) {

    // Récupération de l'user name à partir des paramètres
    if (navParams.get('groupe') && navParams.get('user')) {
      var groupe = navParams.get('groupe');
      this.id_groupe = groupe._id;
      this.name = groupe.name;

      this.userName = navParams.get('user');
      console.log(this.userName);
      this.IsDebtOkay = true;
    }
    else 
    {
      //Erreur
    }

    this.listeBilan = new Array<BilanDepense>();
    this.usersInGroupe = new Array<User>();
    this.depenses = new Array<Depense>();
  }

  // Initialisation
  // =========================================================
  ngOnInit() {
    this.getDescriptionGroupe();
    this.getUsersGroupe();
  }

  // Gestion du groupe
  // ==========================================================
  //  Récupération des détails du groupe
  getDescriptionGroupe() {

     let loader = this.loadingController.create({
      content: "Récupération des dépenses"
    });  
    loader.present();

    // Récupération des détails du groupe
    this.shareCostService.getDepenses(this.userName, this.id_groupe).subscribe(
      res => {
        this.depenses = res;
        console.log("DEPENSE RECUES " + this.depenses);
        this.doBilanDepense();
        loader.dismiss();
      },
      err => { this.handleError(); 
        this.navCtrl.pop();}
    )
  }

  handleError() {
    console.log("Pas de dépense existante pour ce groupe");
  }


  // -- Récupérer les users du groupe
  getUsersGroupe() {
    // Récupération des users qui possèdent l'id du groupe courant 
    var response = this.shareCostService.getUsersGroupe(this.id_groupe);
    response.subscribe(
      res => {
        this.usersInGroupe = res;
        console.log(this.usersInGroupe);
      },
      err => {
        console.log(err);
      }
    )
  }

  // Gestion des users
  // =============================================== 
  // ----- Ajouter un autre user au groupe 
  showAddUserGroupe() {
    // Afficher une alerte demandant le nom de la personne à ajouter
    console.log("Ajout user groupe");

    let prompt = this.alertCtrl.create({
      title: 'Ajouter un utilisateur',
      inputs: [
        {
          name: 'username',
          placeholder: "Nom de l'utilisateur"
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }

        },
        {
          text: 'Ajouter',
          handler: data => {
            this.addUserGroupe(this.id_groupe, data.username);
          }
        }
      ]
    });
    prompt.present();
  }


  addUserGroupe(idGroupe: string, usernameToAdd: string) {
    var response = this.shareCostService.addUserGroupe(idGroupe, usernameToAdd);
    response.subscribe(
      res => {
        console.log("User ajouté au groupe");
        this.getUsersGroupe();
      },
      err => { console.log(err); }
    )
  }


  // ----- Supprimer un user du groupe 
  deleteUserGroupe() {

  }


  // Gestion des dépenses
  // ====================================================================
  // ----- Pour ajouter une dépense
  clickAjouterDepense(idGroupe: string, usersIG: Array<User>, userLog: string) {
    this.navCtrl.push(AddDepensePage, { idGroupe, usersIG, userLog });
  }


  deleteDepense(depense:Depense)
  {
    console.log(depense);
    var reponse = this.shareCostService.deleteDepense(this.userName, this.id_groupe, depense._id);
    reponse.subscribe(
    res => { console.log("Depense supprimée");
            this.getDescriptionGroupe();
    },
    err => { console.log(err);})
  }

  // Pour faire le bilan des toutes les dépenses réalisées
  doBilanDepense() 
  {
    
    this.listeBilan = [];

    // Parcours de toutes les dépenses
    this.depenses.forEach(depense => {

      // Gestion des dettes 
      if (depense.toUser == this.userName) {
        // Récupération des dépenses que l'on a payé à l'user
        var bilanFind = this.listeBilan.filter(function(dep:BilanDepense)
        {
          return dep.username == depense.toUser;
        });
        // /!\ CE N'EST PAS DU TOUT ROBUSTE 
        // Il doit avoir un seul bilan par personne. 
        if(bilanFind.length > 1) console.error("Erreur d'algorithme");
        if (bilanFind[0]) {
          console.log("Le bilan : " + bilanFind[0]);
          var newBilan = new BilanDepense;
          newBilan.username = bilanFind[0].username;
          newBilan.montant = bilanFind[0].montant - depense.montant;
          var index = this.listeBilan.indexOf(bilanFind[0]);
          this.listeBilan[index] = newBilan;
        }
        else {
          var bilan = new BilanDepense;
          bilan.username = depense.toUser;
          bilan.montant = -depense.montant;
          this.listeBilan.push(bilan);
        }
      }

      // Si c'est pas une dette
      if (depense.fromUser == this.userName) {
        // Récupération des dépenses payé par l'user 
         var bilanFind = this.listeBilan.filter(function(dep:BilanDepense)
        {
          return dep.username == depense.fromUser;
        });

        // /!\ CE N'EST PAS DU TOUT ROBUSTE 
        // Il doit avoir un seul bilan par personne. 
        if(bilanFind.length > 1) console.error("Erreur d'algorithme");
        if (bilanFind[0]) {
          console.log("Le bilan : " + bilanFind[0]);
          var newBilan = new BilanDepense;
          newBilan.username = bilanFind[0].username;
          newBilan.montant = bilanFind[0].montant + depense.montant;
          var index = this.listeBilan.indexOf(bilanFind[0]);
          this.listeBilan[index] = newBilan;
        }
        else {
          var bilan = new BilanDepense;
          bilan.username = depense.toUser;
          bilan.montant = depense.montant;
          this.listeBilan.push(bilan);
        }
      }
    });

    // Pour savoir si l'utilisateur est en positif ou négatif
    // Chercher dans la liste bilan le montant associé à son nom
    var user = this.userName;
      var bilanUser = this.listeBilan.filter(function(dep:BilanDepense)
        {
          return dep.username == user;
        });

        if(bilanUser.length > 1) console.error("Erreur d'algorithme");
        if (bilanUser[0]) {
          console.log("Le bilan : " + bilanUser[0]);
          
          if(bilanUser[0].montant > 0)
          {
            this.IsDebtOkay = true;
            this.bilanMessage = "Tu as " + bilanUser[0].montant + "€ à récupérer parmis les membres de ton groupe !"; 

          }
          else
          {
              this.IsDebtOkay = false;
              var tmp = - bilanUser[0].montant;
              this.bilanMessage = "Ta dette s'élève à " + tmp + "€."; 
          }       
        }
        else
        {
          // Rien au nom de l'utilisateur
          this.IsDebtOkay = true;
          this.bilanMessage = "Les comptes sont bons !";
        }
  }

}
