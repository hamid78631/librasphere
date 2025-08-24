<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Userr;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Validation\Rule;

class UserController extends Controller
{

    public function index(){
        $users = Userr::all();

        Userr::firstOrCreate(
            ['email' => 'Ajtmaroc@gmail.com'],
            [
                'nom' => 'Admin',
                'numero_identite' => 'AJT001',
                'role' => 'admin',
                'statut' => 'actif',
                'password' => Hash::make('1111'),
                'date_inscription' => now()->toDateString()
            ]
        );

        
        // Userr::firstOrCreate(
        //     ['email' => 'assistant@doe.fr'],
        //     [
        //         'nom' => 'Assistant',
        //         'numero_identite' => 'ASSISTANT001',
        //         'role' => 'assistant',
        //         'statut' => 'actif',
        //         'password' => Hash::make('00000'),
        //         'date_inscription' => now()->toDateString()
        //     ]
        // );

        return response()->json($users , 200);
    }
    public function show($id){
        $user = Userr::find($id);
        
        if(!$user){
            return response()->json(['message' =>'Utilisateur non trouvé !' ] ,404 );
        }

        return response()->json($user , 200);
        
    }
    public function store(StoreUserRequest $request){

        try{
        $validated = $request->validated();
        $validated['date_inscription'] = now()->toDatestring();
        $validated['password'] = Hash::make($request->input('password'));
        $validated['date_inscription'] = $validated['date_inscription'] ?? now()->toDateString();

        $user = Userr::create($validated);

       

    //     $admin = Userr::updateOrCreate(['email' => 'John@doe.fr'],
    // [
    //     'nom' => "john", 
    //     'numero_identite' => 'AA340891',
    //     'role'=> 'admin',
    //     'statut' => 'actif' , 
    //     'password' => Hash::make('0000'), 
    //     'date_inscription' => now()->toDateString()
    // ]); 
      
        return response()->json([
            'message' => 'Utilisateur ajouté avec succès.',
            'user' => $user->only(['id', 'nom', 'numero_identite', 'email', 'role', 'statut', 'date_inscription']) , 
            'admin' => $admin->only(['id','nom','numero_identite','email','role','statut','date_inscription'])
        ], 201);
        }catch(\Exception $e){
            Log::error("Erreur lors de la création de l'utilisateur!",['exception' => $e->getMessage()]);
            return response()->json([
                'message' => "Une erreur est survenue lors de l'ajout de l'utlisateur !",
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function update(UpdateUserRequest $request , string $id){
        
        try{
            //Récupérer le user 
        $user = Userr::find($id);

        //Refaire les règles de validations dynamiquement 
        $rules = $request->rules();

        $rules['email'] =[
            'sometimes',
            'required',
            'string',
            Rule::unique('users')->ignore($user->id)
        ];
        $rules['numero_identite'] = [
            'sometimes',
            'required',
            'string',
            Rule::unique('utilisateurs')->ignore($user->id)
        ];
        //validons les données 

        $validated = $request->validate($rules);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }
        $user->update($validated);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès!',
            'user' => $user
        ],200);
        }catch(\Exception $e){
            Log::error("Erreur lors de la mise à jour!" , [
                'Exception' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la mise à jour!',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }


public function destroy($id)
{
    try {
        // 🔍 Rechercher l'utilisateur
        $user = Userr::find($id);

        // ❌ S'il n'existe pas
        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé!'
            ], 404);
        }

        // 🗑 Suppression de l'utilisateur
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès !',
            'user' => $user->only(['id', 'nom', 'numero_identite', 'email', 'role', 'statut'])
        ], 200);

    } catch (\Exception $e) {
        Log::error("Erreur lors de la suppression de l'utilisateur", [
            'exception' => $e->getMessage()
        ]);

        return response()->json([
            'message' => "Une erreur est survenue lors de la suppression.",
            'erreur' => $e->getMessage()
        ], 500);
    }
}

}
