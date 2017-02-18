// Le serveur back-end de ShareCost
// ================================================================================================================

// Appel des packages nécessaires
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
//mongoose.connect('mongodb://admin:admin@ds050869.mlab.com:50869/sharecost');
mongoose.connect('localhost:27017/ShareCost');

// Les modèles
var User = require('./app/models/user');
var Groupe = require('./app/models/groupe');
var Depense = require('./app/models/depense');


// Configuration de l'application pour utiliser body-parser (Pour récupérer des données d'un POST :D)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));

// Le port ou va être lancer le serveur
var port = process.env.PORT || 8080;


// ROUTES DE L'API
// ================================================================================================================
// Récupération d'une instance du Routeutr d'express

var router = express.Router();

// Quelque chose que l'on fait à chaque fois
router.use(function (req, res, next) {
    // Logging ? 
    console.log('Quelque chose a été fait');

    // Voir à quoi ça sert (marche pas sans ça)
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Socket.io
//==============================================================================



// Route de test
router.get('/', function (req, res) {
    res.json({ message: 'Working' });
});

// Routes à faire 
// ==============================================================================
// Suppression d'un utilisateur

//(notification d'ajout dans un groupe) : Accepter/Refuser


// Modification d'une dépense
// Supression d'une dépense 


// Gestion du login : user et password en clair
// ==============================================================================

router.get('/login/:username/:password', function (req, res) {
    User.findOne({ username: req.params.username, password: req.params.password }, function (err, user) {
        if (user && !err) {
            // L'utilisateur existe
            console.log('User here');
            res.json(user);
        }
        else {
            console.log('User not here');
            res.send(err);
        }

    });
});

// Les routes pour user 
// =======================================================
router.route('/users')

    // Création d'un utilisateur
    .post(function (req, res) {
        console.log('Essai ajout utilisateur');

        // Vérification qu'il n'existe pas déjà
        console.log(req.body);
        User.findOne({ username: req.body.username }, function (err, user) {
            console.log(req.headers);
            console.log(req.body);

            if (user) {
                console.log("L'utilisateur existe déjà");
                res.status(418);
                res.send('None shall pass');
                return;
            }
            else {
                console.log("L'utilisateur est nouveau");
                // sauvegarde et gestion des erreurs
                // Création d'une instance User

                var user = new User();
                user.username = req.body.username;
                user.password = req.body.password;
                user.groupe = [];

                user.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json({ message: 'User created!' });
                    }
                });
            }
        });
    })

    // Récupération de tous les utilisateurs : ne va pas être super utile dans l'application en elle-même.
    .get(function (req, res) {
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            else {
                console.log(users);
                res.json(users);
            }
        });
    });

// Récupère un utilisateur suivant son id passé dans la route
router.route('/users/:username')

    // Récupération d'un seul utilisateur (avec un id)
    .get(function (req, res) {
        User.findOne({ username: req.params.username }, function (err, user) {
            if (err) {
                res.send(err);
            }
            else {
                res.json(user);
            }
        });
    })


    // Modification d'un utilisateur, mais toujours pas l'id.
    .put(function (req, res) {
        // Récupération avec l'identifiant
        User.findById(req.params.user_id, function (err, user) {
            if (err) {
                res.send(err);
            }
            else {
                // Mise à jour 
                user.username = req.body.username;
                user.email = req.body.email;
                user.password = req.body.password;

                // On sauvegarde le tout
                user.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json({ message: 'User updated :) !' })
                    }
                });
            }
        });
    })

    // Suppression d'un utilisateur suivant son id (a refaire)
    .delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err) {
                res.send(err);
            }
            else {
                res.json({ message: 'Utilisateur deleted' });
            }
        });

    });



// Gestion des groupes 
// ===============================================================================
router.route('/groupes/:username')

    .get(function (req, res) {

        // Récupération du user
        User.findOne({ username: req.params.username }, function (err, user) {
            if (user && !err) {
                Groupe.find({ '_id': { $in: user.groupe } }, function (err, groupe) {
                    if (user && !err) {
                        res.json(groupe);
                    }
                    else {
                        res.send(err);
                    }
                });
            }
            else {
                res.send(err);
            }
        });
    })
    // Ajoute un groupe, et modifie l'user pour lui associer le groupe
    .post(function (req, res) {
        User.findOne({ username: req.params.username }, function (err, user) {

            // L'utilisateur existe
            if (user && !err) {

                // Création d'un nouveau groupe
                var groupe = new Groupe();
                groupe.name = req.body.groupename;
                groupe.nombreUsers = 1;
                // A la création, il n'y a qu'un seul membre

                // Ajoute le groupe
                groupe.save(function (err, newGroupe) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    // On ajoute l'id du groupe 
                    user.groupe.push(newGroupe._id);
                    user.save(function (err) {
                        if (err) {
                            res.send(err);
                            return;
                        }
                        else {
                            res.json({ message: 'Groupe created & User updated :) !' })
                        }
                    });
                });
            }
            // Il n'existe pas
            else {
                res.send("L'utilisateur n'existe pas.");
                return;
            }
        });
    });

// Suppression d'un groupe (delete)
router.delete('/groupes/:username/:id_Groupe', function (req, res) {
    Groupe.remove({
        _id: req.params.id_Groupe
    }, function (err, user) {
        if (err) {
            res.send(err);
            return;
        }
    });

    // Parcours des utilisateurs et Suppression => Fonctionne sans ça, mais pas propre sinon
    User.findOne({ username: req.params.username }, function (err, user) {
        if (user && !err) {
            var index = user.groupe.indexOf(req.params.id_Groupe);
            if (index >= 0) {
                user.groupe.splice(index, 1);
            }

            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({ message: 'User updated :) !' })
                }
            });
        }
        else {
            console.log("erreur lors de la suppresion d'un groupe");
            res.send(err);
            return;
        }
    });

});


// Modification d'un groupe (put)


// Gestion des utilisateurs dans les groupes 
// ============================================================
router.route('/groupes/detail/:idGroupe')

    // Récupère tous les utilisateurs dans le groupe
    .get(function (req, res) {
        User.find({ groupe: req.params.idGroupe }, function (err, user) {
            if (user && !err) {
                res.json(user);
            }
            else {
                res.send(err);
            }
        });
    })

    // Ajoute un utilisateur dans le groupe 
    .post(function (req, res) {
        // Nom user in body
        console.log(req.body.userToAdd);

        // On récupère l'utilisateur
        User.findOne({ username: req.body.userToAdd }, function (err, user) {
            // On trouve l'utilisateur
            if (user && !err) {
                if (user.groupe.indexOf(req.params.idGroupe) > -1) {
                    // Le groupe est déjà dans l'array
                } else {
                    user.groupe.push(req.params.idGroupe);
                    // On sauvegarde
                    user.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            // On récupère le groupe
                            Groupe.findById(req.params.idGroupe, function (error, groupe) {
                                if (groupe && !error) {
                                    groupe.nombreUsers++;
                                    groupe.save(function (erreur) {
                                        if (erreur) {
                                            res.send(erreur);
                                        }
                                        else {
                                            res.json({ message: 'Groupe to user add!' });
                                        }
                                    });
                                }
                                else {
                                    res.send(error);
                                }
                            });
                        }
                    });
                }


            }
            else {
                res.send(err);
            }
        });
    });

// Les dépenses
// ============================================================
router.route('/groupes/depenses/:username/:id_groupe')

    .get(function (req, res) {
        console.log("Récupération des dépenses d'un groupe");
        // Récupérer toutes les dépenses du groupe qui possèdent l'id_groupe
        Depense.find({ idGroupe: req.params.id_groupe }, function (err, depense) {
            if (depense && !err) {
                res.json(depense);
            }
            else {
                res.send("La dépense n'a pas été trouvée");
                return;
            }
        });
    })

    .post(function (req, res) {
        console.log("Ajout d'une dépense d'un groupe");

        console.log(req.body);
        Groupe.findById(req.params.id_groupe, function (err, groupe) {
            // Le groupe a été trouvé
            if (groupe && !err) {
                req.body.toUsers.forEach(function (toUser) {

                    // Création d'une nouvelle dépense
                    console.log("Nouvelle dépense");
                    var depense = new Depense();
                    depense.idGroupe = req.params.id_groupe;
                    depense.name = req.body.name;
                    depense.fromUser = req.body.fromUser;
                    depense.toUser = toUser;
                    depense.montant = req.body.montant / req.body.toUsers.length;

                    // On sauvegarde cette dépense
                    depense.save(function (err) {
                        if (err) {
                            res.send(err);
                            return;
                        }
                        else {
                            //res.json({ message: 'Depense created!' });
                        }
                    });
                }, this);

                res.json({ message: 'Depenses created!' });
            }
            else {
                res.send("Le groupe n'a pas été trouvé");
                return;
            }

        });

    });


    router.delete('/groupes/depenses/:username/:id_groupe/:idDepense', function(req, res)
    {
        // Supprimer la dépense 
        Depense.remove({_id : req.params.idDepense}, function(err, depense)
        {
            if(err)
            {
                res.send(err);
            }
            else
            {
                res.json({message: 'Depense deleted' });
            }
        });
    });




// Définition de toutes les routes de l'API
// Toutes les routes vont commencer par /api
app.use('/api', router);



// Démarrage du server
// ==================================================================================================================
app.listen(port);
console.log('Maaaaaaaaaaasteeeeer (' + port + ')');