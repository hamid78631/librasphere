<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; 
use App\Models\Userr ; 
use App\Http\Requests\StoreUserRequest;


class AuthController extends Controller
{

    //s'inscrire
public function register(StoreUserRequest $request)
{
    try {
        $validated = $request->validated();

        // Fusionner les données validées avec les autres champs
        $userData = array_merge($validated, [
            'role' => 'adherent',
            'statut' => 'actif',
            'password' => Hash::make($request->password),
        ]);

        $user = Userr::create($userData);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur survenue lors de l\'inscription!',
            'erreur' => $e->getMessage()
        ], 500);
    }
}

    //connexion
    public function login(Request $request){
        $user = Userr::where('email' , $request->email)->first();

        if(!$user || !Hash::check($request->password , $user->password)){
            return response()->json([
                'message' => 'Utilisateur non trouvé! Veuillez saisir les bons coordonnées!'
            ], 401);
        }
        if($user->statut_compte === 'bloque_temp' || $user->statut_compte ==='bloque_def'){
            return response()->json([
                'message' => 'Votre compte a été bloqué. Veuillez contacter l\'administration', 
                'user' => $user
            ],403);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
    //Récupérer l'utilisateur connecté
    public function user(Request $request){
        return response()->json($request->user());
    }
//Déconnexion
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie!'
        ]);
    }
}
