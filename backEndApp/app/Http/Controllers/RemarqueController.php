<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Remarque;
class RemarqueController extends Controller
{
    public function store(Request $request){
        try{
            $validated = $request->validate([
            'emprunt_id' => 'required|exists:emprunts,id',
            'contenu' => 'required|string|max:1000'
        ]);

        $remarque = Remarque::create($validated);
        return response()->json([
            'message' => 'Remarque ajouté avec succès !',
            'remarque' => $remarque
        ] , 201);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'ajout',
                'erreur' => $e->getMessage()
            ] , 500);
        }
    }
    public function getRemarqueById($id) {
        if(!$id){return null;}
        return Remarque::where('emprunt_id' , $id)->orderBy('created_at' , 'desc')->get();
    }

    public function destroy($id){
        $remarque = Remarque::find($id) ;

        if(!$remarque){
            return response()->json([
                'message' => 'Remarque introuvable'
            ],404);
        }
        $remarque->delete();
        return response()->json([
            'message' => 'Remarque supprimé avec succès!',
            
        ],200);
    }
}
