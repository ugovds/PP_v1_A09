#language = fr

Fonctionnalité: Authentification d'un utlilisateur

Pour répertorier un problème, il faut d'abord que l'utlilisateur s'identifie

Scénario: Authentification acceptée 

Etant donné un nom d'utlilisateur et un mot de passe secret. 
Lorsque que l'utlilisateur s'hautentifie avec son nom d'utlilisateur et son mot de passe, 
Alors l'utlilisateur est authentifié et il est connecté avec son compte sur le système

Scénario: Authentification refusée

Etant donné un nom d'utlilisateur et un mot de passe secret.
Lorsque que l'utlilisateuressaye de s'hautentifier avec son nom d'utlilisateur et son mot de passe mais que l'un d'entre eux n'est pas correct
Alors un message d'erreur est affiché et l'utlilisateur peut réessayer de s'identifier

