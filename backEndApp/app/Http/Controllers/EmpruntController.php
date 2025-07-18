<?php

namespace App\Http\Controllers;
use App\Models\Emprunt;
use App\Http\Requests\StoreEmpruntRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class EmpruntController extends Controller
{
    public function index(){
        $emprunts = Emprunt::with(['livre' , 'utilisateur'])->get();

        foreach($emprunts as $emprunt){
            if($emprunt->statut ==='en_cours' &&
            Carbon::parse($emprunt->date_retour_prevue)->isPast() &&
            is_null($emprunt->date_retour_effective)
            ){
                $emprunt['statut'] = 'en_retard';
                $emprunt->save();
            }
        }

        if($emprunts->isEmpty()){
            return response()->json(  [
                'message' => 'Aucun emprunt trouvé pour le moment...'
            ] , 200);
        }
        return response()->json($emprunts , 200);
    }

    public function store(StoreEmpruntRequest $request ){
        try{
           
        $validated = $request->validated();

        $doublon = Emprunt::where('livre_id' , $validated['livre_id'])
        ->where('user_id' , $validated['user_id'])
        ->whereNull('date_retour_effective')
        ->exists();


        if($doublon){
            return response()->json([
                'message' => 'Cet utilisateur a deja un emprunt pour ce livre !',
                
            ],400);
        }

        $validated['statut'] = 'en_cours';
        $validated['date_emprunt'] = now();
        $validated['date_retour_prevue'] = now()->addDays(14);
        $emprunt = Emprunt::create($validated);

        $emprunt->load('livre' , 'utilisateur');
        return response()->json([
            'message' => 'Emprunt enregistré avec succès!',
            'emprunt' => $emprunt
        ], 201);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de l\'emprunt! ',
                'erreur' => $e->getMessage(),
            ],500);
        }
    }

    public function retourner(int $id){

        try{
            $emprunt = Emprunt::find($id);

        if(!$emprunt){
            return response()->json([
                'message' => 'Emprunt introuvable',
            ], 404);
        }
        
        $emprunt->update([
            'date_retour_effective' => Carbon::now()->toDateString(),
            'statut' =>'retourné'
        ]);

        $emprunt->load('livre' , 'utilisateur');

        return response()->json([
            'message' => 'Livre marqué comme retourné avec succès!',
            'emprunt' => $emprunt,
        ], 200);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Une erreur est survenue lors du changement du statut!',
                'erreur' => $e->getMessage(),
            ],500);
        }
    }
}
