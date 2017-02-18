import {Injectable} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from "@angular/http";


import "rxjs/add/operator/toPromise";

// Pour la gestion des Observable
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

// Import du modèle User
import { User } from '../classes/User';
import { GroupeModel } from '../classes/Groupe' 
import { Depense } from '../classes/depense'

// Angular 2 déclare les services/providers avec @Injectable
@Injectable()
export class ShareCostService {
    
    
    // URL to web API
    private API_URL = 'http://localhost:8080/api';

    constructor(private http: Http) {
        this.http = http;
    }


    // ================== LOGIN ===============================
    login(username:string, password:string) : Observable<User>{
        //let body = JSON.stringify({username});
        //let headers = new Headers({ 'Content-Type': 'application/json'});
        //let options = new RequestOptions({headers: headers});

        var url = this.API_URL + '/login/' + username + '/' + password;
        var reponse = this.http.get(url).map(res => <User>res.json());
        return reponse;
    }

    // ==================== USERS ===============================
    // Récupération de tous les utilisateurs
    getAllUser() : Observable<User[]>{
        // Emission d'une requete vers l'API
        // Et on caste les User reçus dans un Array
        return this.http.get(this.API_URL + '/users')
        .map(res => <User[]>res.json());
    }

    // Récupère un utilisateur
    getUser(username:string, password:string) : Observable<User>
    {
        // On récupère bien les valeurs 
        var url = this.API_URL + '/users/' + username +  '/' + password;

        return this.http.get(url).map(res => <User>res.json());
    }


    // Ajoute un utilisateur
    addUser(u:string, p:string) :Observable<User> 
    {

        // Pourquoi le body reçu par l'api est vide ? 

       let body = JSON.stringify({
           username : u, 
           password : p
        });
        console.log(body);
        //var body = 'username=' + username +'&password=' + password;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});

        var reponse = this.http.post(this.API_URL + '/users', body, options).map(res => <User>res.json());
        
        return reponse;
    }


    // Supprime un utilisateur
    deleteUser()
    {

    }

    // Modifie un utilisateur
    modifyUser()
    {

    }


    // ============================ GROUPE ==================================
    // Récupération de tous les groupes d'un utilisateur
    getGroupes(username:string) : Observable<Array<GroupeModel>> 
    {
        var url = this.API_URL + '/groupes/' + username;
       return Observable.interval(2000).switchMap(() => this.http.get(url).map(res => <Array<GroupeModel>>res.json()));
        //return reponse;
    }

    // Ajout d'un groupe
    addGroupe(username:string, nameGroupe:string) : Observable<GroupeModel>
    {
        var url = this.API_URL + '/groupes/' + username;
        let body = JSON.stringify({
           groupename : nameGroupe
        });
        console.log(body);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});

        var reponse = this.http.post(url, body, options).map((res: Response) => res.json());
        return reponse;
    }

    // Supression d'un groupe 
    deleteGroupe(username:string, idGroupe:string) : Observable<any[]>
    {
        var url = this.API_URL + '/groupes/' + username + '/' + idGroupe;
        console.log(url);
        // id_groupe
        var reponse = this.http.delete(url).map((res:Response) => res.json());
        return reponse;
    }


    // ============================ USERS GROUPE ===========================
    // Récupération des utilisateurs dans le groupe 
    getUsersGroupe(idGroupe:string) :  Observable<any[]>
    {
        var url = this.API_URL + '/groupes/detail/' + idGroupe;
        console.log(url);
        return Observable.interval(2000).switchMap(() => this.http.get(url).map(res => <Array<User>>res.json()));
    }

    // Ajout d'un utilisateur dans le groupe
    addUserGroupe(idGroupe:string, usernameToAdd:string) :  Observable<any[]>
    {
        var url = this.API_URL + '/groupes/detail/' + idGroupe;
        console.log(url);


        let body = JSON.stringify({
           userToAdd : usernameToAdd
        });
        console.log(body);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});

        var reponse = this.http.post(url, body, options).map((res: Response) => res.json());
        return reponse;
    }

 
    // ============================= DEPENSES ===============================
    getDepenses(username:string, id_groupe:string) : Observable<Array<Depense>>
    {
        var url = this.API_URL + '/groupes/depenses/' + username + '/' + id_groupe;
        return Observable.interval(2000).switchMap(() => this.http.get(url).map(res => <Array<Depense>>res.json()));
    }

    addDepense(userLogged:string, id_groupe:string, _nameDepense:string, _fromUser:string, _toUsers:Array<string>, _montant:number) : Observable<any[]>
    {
        var url = this.API_URL + '/groupes/depenses/' + userLogged + '/' + id_groupe;
        console.log(url);
        console.log(_toUsers);
        let body = JSON.stringify({
            name:_nameDepense,
            fromUser:_fromUser,
            toUsers:_toUsers,
            montant:_montant
        });
        console.log(body);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({headers: headers});

        var reponse = this.http.post(url, body, options).map((res: Response) => res.json());
        return reponse;

    }

    deleteDepense(userLogged:string, id_groupe:string, id_depense:string) : Observable<Array<any>>
    {
        var url = this.API_URL + '/groupes/depenses/' + userLogged + '/' + id_groupe + '/' + id_depense;
        var reponse = this.http.delete(url).map((res: Response) => res.json());

        return reponse;
    }
    // ====================== FONCTIONS UTILITAIRES ==========================
    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Promise.reject(errMsg);
    }
}