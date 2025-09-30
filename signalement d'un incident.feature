#language = fr

Fonctionnalité: Signalement d'un incident

Scénario: Signalement réussi

Etant donné une description d'incident et une adresse
Lorsque l'utlilisateur clique sur le bouton permettant de soumettre l'incident
Alors l'incident est encodé dans le système

Scénario: Signalement échoué

Etant donné un signalement sans description et/ou sans adresse
Lorsque l'utlilisateur clique sur le bouton permettant de soumettre l'incident
Alors l'incident n'est pas encodé dans le système et un message d'erreur apparait pour informer l'utlilisateur qu'il manque une description et/ou une adresse 