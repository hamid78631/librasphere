<?php

namespace App\Http\Controllers;
use App\Models\Penalite ; 
use App\Models\Userr ; 
use App\Http\Requests\StorePenaliteRequest;
use Illuminate\Http\Request;

class PenaliteController extends Controller
{
    public function index(){
        try{
            
            $utilisateursBloques = Userr::where('statut_compte', 'bloque_temp')
                ->whereDate('date_deblocage', '<=', now()->toDateString())
                ->get();

            foreach ($utilisateursBloques as $user) {
                $user->statut_compte = 'actif';
                $user->date_deblocage = null;
                $user->save();
            }

            $penalites = Penalite::with('utilisateur' , 'emprunt')
            ->orderByDesc('date_penalite')
            ->paginate(10);
            
            if($penalites->isEmpty()){
                return response()->json([
                    'message' => 'Aucune pénalité pour l\'instant ',
                    'penalites'=> []
                ],200);
            }


            $formatted = $penalites->map(function ($penalite) {
            return [
                'id' => $penalite->id,
                'utilisateur' => $penalite->utilisateur,
                'livre' => optional($penalite->emprunt->livre)->titre ?? 'Livre inconnu',
                'type' => $penalite->type,
                'description' => $penalite->description,
                'date_penalite' => $penalite->date_penalite,
                'date_deblocage' => $penalite->date_deblocage,
                'statut' => $penalite->statut
            ];
        });

            return response()->json([
            'current_page' => $penalites->currentPage(),
            'last_page' => $penalites->lastPage(),
            'total' => $penalites->total(),
            'per_page' => $penalites->perPage(),
            'data' => $penalites->map(function ($penalite) {
        return [
            'id' => $penalite->id,
            'utilisateur' => $penalite->utilisateur,
            'livre' => optional($penalite->emprunt->livre)->titre ?? 'Livre inconnu',
            'type' => $penalite->type,
            'description' => $penalite->description,
            'date_penalite' => $penalite->date_penalite,
            'date_deblocage' => $penalite->date_deblocage,
            'statut' => $penalite->statut
        ];
    })
]);

            
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Une erreur s\'est produite lors de l\'affichage des pénalités!',
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function show($id){
        try{
            $penalite = Penalite::with('utilisateur' , 'emprunt')->find($id);

            if(!$penalite){
                return response()->json([
                    'message' => 'Pénalité introuvable!'
                ],404);
            }

            return response()->json([
                'message' => 'Penalité trouvée',
                'penalite' => $penalite
            ],200);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Erreur lors de la recherche',
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function store(StorePenaliteRequest $request){
        try{

         
            $validated = $request->validated();
            $validated['statut'] = 'active';
            $validated['date_penalite'] = now()->toDateString();

            $dejaExiste = Penalite::where('utilisateur_id', $validated['utilisateur_id'])
                ->where('emprunt_id', $validated['emprunt_id'])
                ->where('type', $validated['type'])
                ->where('statut', 'active')
                ->exists();

            if ($dejaExiste) {
                return response()->json([
                    'message' => 'Une pénalité identique est déjà active pour cet emprunt.'
                ], 409); // Conflit
            }

            $penalite = Penalite::create($validated);

            if(in_array($validated['type'] , ['non_retour' , 'perte'])){
                $utilisateur = Userr::find($validated['utilisateur_id']);
                if($utilisateur){
                    $utilisateur->statut_compte = 'bloque_temp';
                    $utilisateur->date_deblocage = $validated['date_deblocage'] ?? now()->addDays(7);
                    $utilisateur->save();
                }
            }
            // Cas "retard" : pas de blocage automatique
            
            return response()->json([
                'message' => 'Pénalité crée avec succès',
                'penalite' => $penalite
            ],201);


        }catch(\Exception $e){

            return response()->json([
                'message' => 'Erreur lors de l\'ajout de la pénalité!',
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function lever($id){
        try{
            $penalite = Penalite::with('utilisateur' , 'emprunt')->find($id);

            if(!$penalite){
                return response()->json([
                    'message' => 'Pénalité introuvable!'
                ],404);
            }

            if($penalite->statut === 'levee'){
                return response()->json([
                'message' => 'Le statut est déja levée',
                
                ]);
            } 

            $penalite->statut = 'levee';
            $penalite->save();

            $utilisateur = Userr::find($penalite->utilisateur_id);
            if($utilisateur && $utilisateur->statut_compte ==='bloque_temp'){
                $utilisateur->statut_compte = 'actif';
                $utilisateur->date_deblocage = null;
                $utilisateur->save();
            }
            return response()->json([
                'message' => 'Penalité modifiée avec succès!',
                'penalite' => $penalite
            ],200);

        }catch(\Exception $e){
            return response()->json([
                'message' => 'erreur lors de la modification du statut',
                'erreur' => $e->getMessage()
            ]);
        }
    }


    public function destroy($id){
        try{
            $penalite = Penalite::with('utilisateur','emprunt')->find($id);

            if(!$penalite){
                return response()->json([
                    'message' => 'Cette pénalité n\'existe pas',
                ],404);
            }

            $penalite->delete();

            return response()->json([
                'message'=> 'Pénalité supprimé avec succès!',
                'penalite' => $penalite
            ],200);
        }catch(\Exception $e){
            return response()->json([
                'message'=> 'Erreur lors de la suppression',
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function parUtilisateur($id){
        try{
            $penalite = Penalite::with('emprunt')
            ->where('utilisateur_id',$id)
            ->orderByDesc('date_penalite')
            ->get();
            
            if($penalite->isEmpty()){
                return response()->json([
                    'message'  => 'Cet utilisateur ne possède pas de pénalité!',
                    'penalites' => []
                ],200); 
            }
            return response()->json([
                'message' => 'Pénalités de l\'utilisateur récupérées avec succès.',
                'penalites' => $penalite
            ],200);
        }catch(\Exception $e){

            return response()->json([
                'message' => 'Erreur lors de la récupération !',
                'erreur' => $e->getMessage()
            ],500);
        }
    }
}
