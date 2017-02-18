import { Component, NgZone,  } from '@angular/core';

import { NavController, NavParams, AlertController, LoadingController  } from 'ionic-angular';

import { ShareCostService } from '../../services/ShareCostService'

import { GroupeModel } from '../../classes/groupe'

import { DescriptionGroupe } from '../descriptionGroupe/descriptionGroupe'


@Component({
  selector: 'groupe-groupe',
  templateUrl: 'groupe.html',
  providers: [ShareCostService]
})

export class Groupe {
  groupes: GroupeModel[] = [];
  userName: string;
  //loadingController:LoadingController;// = Loading.create();

  constructor(public shareCostService: ShareCostService, private navParams: NavParams, private navControl: NavController, public alertCtrl: AlertController, private loadingController: LoadingController) {
    // Récupération de l'user name à partir des paramètres
    if (navParams.get('username')) {
      this.userName = navParams.get('username');
    }
    else {
      this.userName = "CompteTest";
    }

    //this.loadingController = new LoadingController();
  }

  // Initialisation
  ngOnInit() {
  
    this.getGroupes();
   
  }


  // Récupération de tous les groupes de l'utilisateur
  getGroupes() {
  let loader = this.loadingController.create({
      content: "Récupération des groupes"
    });  
    loader.present();

    this.shareCostService.getGroupes(this.userName).subscribe(
      res => {
        this.groupes = res;
         loader.dismiss();
      },
      err => { this.handleError() }
    );
  }

  // Affichage des détail du groupe 
  onclickGroupe(groupe) {
    var user = this.userName;
    this.navControl.push(DescriptionGroupe, { groupe, user });
  }

  // Alerte demandant les informations du groupe
  showAjouterGroupe() {
    console.log("Ajout d'un groupe");
    let prompt = this.alertCtrl.create({
      title: 'Nouveau groupe',
      inputs: [
        {
          name: 'Nom',
          placeholder: 'Nom du groupe'
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
            console.log(data);
            this.addGroupe(this.userName, data.Nom);
          }
        }
      ]
    });

    prompt.present();
  }

  // Ajout d'un groupe
  addGroupe(username: string, name: string) {
    console.log("Dans le addGRoupe :" + name);
    var response = this.shareCostService.addGroupe(username, name);
    response.subscribe(
      res => { this.getGroupes(); },
      err => { console.error("Le groupe n'a pas pu être ajouté"); }
    );
  }

// Suppression d'un groupe
  removeGroupe(groupe) {
    var response = this.shareCostService.deleteGroupe(this.userName, groupe._id);
    response.subscribe(
      res => { this.getGroupes(); },
      err => { console.log("Erreur lors de la suppression"); }
    );
  }
  handleError() {
    console.log("Pas de groupes récupérés");
  }



}
