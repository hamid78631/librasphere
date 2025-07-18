<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Emprunt ; 
use Illuminate\Support\Carbon;

class AlerteController extends Controller
{

    public function index(){
        try{
            $demain = Carbon::now()->addDay()->startOfDay();
        $aujourdhui = Carbon::now()->startOfDay();

        $empruntsDemain = Emprunt::with('livre','utilisateur')
        ->whereDate('date_retour_prevue' , $demain)
        ->where('statut' , 'en_cours')
        ->take(5)
        ->orderByDesc('created_at')
        ->get()
        ->map(function ($emprunt) {
            return [
                'id' => $emprunt->id, 
                'utilisateur' => $emprunt->utilisateur->nom, 
                'livre' => $emprunt->livre->titre,
                'date_retour_prevue' => $emprunt->date_retour_prevue
            ];
        });

        $empruntEnRetard = Emprunt::with('livre' , 'utilisateur')
        ->whereDate('date_retour_prevue' , '<' , Carbon::now()->toDateString())
        ->where('statut' , 'en_retard')
        ->get()
        ->map(function ($emprunt) use ($aujourdhui) {
            $retourPrevue = Carbon::parse($emprunt->date_retour_prevue);
            $jourRetard = floor( $retourPrevue->diffInDays($aujourdhui));
            return [
                'id' => $emprunt->id,
                'utilisateur' => $emprunt->utilisateur->nom , 
                'livre' => $emprunt->livre->titre, 
                'joursRetard' => $jourRetard,
                'date_retour_prevue' => $emprunt->date_retour_prevue
            ];
        });

        return response()->json([
            'a_rendre_demain' => $empruntsDemain, 
            'en_retard' => $empruntEnRetard
        ],200);
        }catch(\Exception $e){

            return response()->json([
                'message' => 'Erreur lors du chargement des alertes',
                'erreur' => $e->getMessage()
            ],500);
        }
    }
}
