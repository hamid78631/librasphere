<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Emprunt ; 
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ActiviteController extends Controller
{
    public function index(){

        $emprunts = Emprunt::with('livre', 'utilisateur')
        ->orderByDesc('created_at')
        ->limit(20)
        ->get();

        $activite = $emprunts->map( function($emprunt){
            if($emprunt->statut === 'retourné'){
                return [
                    'id' => $emprunt->id,
                    'type' => 'retour', 
                    'utilisateur' => $emprunt->utilisateur->nom,
                    'livre' => $emprunt->livre->titre, 
                    'date' => $emprunt->date_retour_effective ?? $emprunt->updated_at->toDateString()
                ];
            }
            else if ($emprunt->statut === 'en_retard' && !empty($emprunt->date_retour_prevue)) {
                try {
                    $datePrevue = Carbon::parse($emprunt->date_retour_prevue);
                    $aujourdhui = Carbon::now();
                    $jourRetard = $aujourdhui->gt($datePrevue)
                        ? floor($datePrevue->diffInDays($aujourdhui))
                        : 0;
                } catch (\Exception $e) {
                    $jourRetard = 0; // fallback safe
                    \Log::error("Erreur Carbon: " . $e->getMessage());
                }

                return [
                    'id' => $emprunt->id,
                    'type' => 'retard',
                    'utilisateur' => $emprunt->utilisateur->nom,
                    'livre' => $emprunt->livre->titre,
                    'date' => now()->toDateString(),
                    'joursRetard' => $jourRetard
                ];
            }
            else{
                return [
                    'id' => $emprunt->id,
                    'type' => 'emprunt', 
                    'utilisateur' => $emprunt->utilisateur->nom,
                    'livre' => $emprunt->livre->titre, 
                    'date' => $emprunt->date_emprunt
                ];
            }
        });

        return response()->json($activite , 200);
    }
}
