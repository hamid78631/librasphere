<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LivreController ; 
use App\Http\Controllers\UserController ; 
use App\Http\Controllers\EmpruntController ;
use App\Http\Controllers\ActiviteController ;
use App\Http\Controllers\AlerteController ;
use App\Http\Controllers\PenaliteController ;
use App\Http\Controllers\RemarqueController ;
use App\Http\Controllers\AuthController ;
use App\Http\Controllers\ReservationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::controller(LivreController::class)->prefix('livres')->group(function(){
    Route::get('/' , 'index'); //Tous les livres
    Route::get('/{id}' , 'show'); //Details des livres
    Route::post('/' , 'store'); //Ajouter un livre
    Route::put('/{id}' , 'update'); //modifier un livre
    Route::delete('/{id}' , 'destroy'); //Supprimer un livre 
});

Route::controller(UserController::class)->prefix('users')->group(function(){
    Route::get('/' , 'index');//Tous les utilisateurs
    Route::get('/{id}' , 'show');//Details du user
    Route::post('/' , 'store');//Ajouter un user
    Route::put('/{id}' , 'update');//modifier un user
    Route::delete('/{id}' , 'destroy'); //Supprimer un user
});
Route::controller(EmpruntController::class)->prefix('emprunts')->group(function(){
    Route::get('/' , 'index'); //Tous les emprunts
    Route::post('/' , 'store');//Ajouter un emprunt
    Route::put('/{id}/retour' , 'retourner');//Marqué comme retourné
});

Route::controller(ActiviteController::class)->prefix('activites')->group(function(){
    Route::get('/' , 'index');
});

Route::controller(AlerteController::class)->prefix('alertes')->group(function(){
    Route::get('/' , 'index');
});

Route::controller(RemarqueController::class)->prefix('remarques')->group(function (){
    Route::post('/' , 'store');
    Route::get('/emprunt/{id}', 'getRemarqueById');
    Route::delete('/{id}' , 'destroy');
});

Route::controller(PenaliteController::class)->prefix('penalites')->group(function(){
    Route::get('/', 'index'); //Toutes les pénalités
    Route::get('/{id}', 'show'); //Informations sur une pénalité
    Route::post('/', 'store'); //Ajouter une pénalité
    Route::put('/{id}/lever' , 'lever');//lever une pénalité
    Route::delete('/{id}' , 'destroy'); //supprimer
    Route::get('/utilisateurs/{id}', 'parUtilisateur');//pénalité par user ...

//Route pour l'authentification 

});
Route::controller(AuthController::class)->group(function(){
    Route::middleware('guest')->post('/register' , 'register') ; 
    Route::middleware('guest')->post('/login' , 'login') ; //Connexion
    Route::middleware('auth:sanctum')->get('/user' , 'user'); //Récupérer l'utilisateur connecté
    Route::middleware('auth:sanctum')->post('/logout' , 'logout');//Déconnexion 

});

//Route pour la réservation 
Route::controller(ReservationController::class)->prefix('reservations')->group(function(){
    Route::get('/' , 'index'); //Récupérer toutes les réservations
    Route::get('/{id}' , 'show') ; //Afficher une réservation
    Route::post('/' , 'store') ; //Ajouter une réservation 
    Route::put('/{id}' , 'update') ; //Modifier une réservation
    Route::delete('/{id}' , 'delete'); //Supprimer une réservation 
    Route::post('/{id}/valider' , 'valider') ;//valider une réservation 
    Route::post('/{id}/annuler' , 'annuler'); //Annuler une réservation 
    Route::get('/filtrer' , 'filtrer'); //Filtrer avec une requete spéciale 
})
?>