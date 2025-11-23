# language: fr

Fonctionnalité: Enregistrement d'un nouvel utlilisateur dans le système

Pour pouvoir utiliser le site, l'utlilisateur doit disposer d'un compte dans le système

Scénario: Création d'un nouveau compte utlilisateur

Etant donné une adresse mail qui ne dispose pas encore d'un compte utlilisateur et un mot de passe secret
Lorsque l'utlilisateur demande son inscription dans le système, celle ci lui est accordée
Alors l'utlilisateur dispose alors d'un compte dans le système

Scénario: Utlilisateur disposant déja d'un compte

Etant donné une adresse mail déja enregistrée dans le système et un mot de passe secret
Lorsque l'utlilisateur demande son inscription, celle ci lui est refusée et un message s'affiche l'informant que son adresse mail est déja reliée à un compte
Alors l'utlilisateur peut se connecter ou s'enregistrer avec une autre adresse mail
