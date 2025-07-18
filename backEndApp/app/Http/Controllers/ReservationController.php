<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Userr; 
use App\Models\Livre; 
use App\Models\Reservation; 
use App\Http\Requests\StoreReservationRequest; 
use App\Http\Requests\UpdateReservationRequest; 
class ReservationController extends Controller
{
    public function index(){
        try{

            $reservations = Reservation::with('livre' , 'utilisateur')->get();

            if($reservations->isEmpty()){
                return response()->json([
                    'message' => 'Aucune réservation disponible pour l\'instant'
                ], 200);
            }

            $data = $reservations->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'statut' => $reservation->statut,
                'date_debut' => $reservation->date_debut->toDateString(),
                'date_fin' => $reservation->date_fin->toDateString(),
                'livre_titre' => $reservation->livre->titre,
                'utilisateur_nom' =>  $reservation->utilisateur->nom
            ];
        });

            return response()->json([
                'message' => 'Réservations récupérees avec succès!', 
                'reservations' => $data
            ],200);
        }catch(\Exception $e){
            return response()->json([
                'message'=> 'Une erreur est survenue lors de la récupération des réservations',
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function show( $id ) {
        try  {
            $reservation = Reservation::with('livre' , 'utilisateur')->find($id);

            if(!$reservation){
                return response()->json([
                    'message'=> 'Cette réservation n\'existe pas!'
                ],404);
            }
            return response()->json([
                'message' => 'Récupération de la réservation effectuée avec succès',
                'réservation' => $reservation 
            ],200);

        }catch(\Exception $e){
            return response()->json([
                'message' => 'Récupération de la réservation échouée', 
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function store(StoreReservationRequest $request){
        try {
            $validated = $request->validated();

            //Vérification si cet utilsiateur a deja réserver le livre 

            $livre =  Livre::find($validated['livre_id']);

            if(!$livre){
                response()->json([
                    'message' => 'Livre introuvable'
                ],404);
            }
            if($livre->quantite <= 0 ){
                return response()->json([
                    'message' => 'Ce livre est en rupture de stock'
                ],409);
            }
            
            $reservationExistante = Reservation::where('user_id' , $validated['user_id'])
            ->where('livre_id' , $validated['livre_id'])
            ->whereNotIn('statut' , ['annulee'])
            ->first();

            if($reservationExistante){
                return response()->json([
                    'message' => 'Vous avez déjà réservé ce livre! '
                ],409);
            }
        $reservation = Reservation::create($validated);
            return response()->json([
                'message' => 'Réservation ajoutée avec succès',
                'réservation' => $reservation 
            ],200);

        }catch(\Exception $e){
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de la réservation',
                'erreur' => $e->getMessage()
            ],500);
        }
    }
    public function update(UpdateReservationRequest $request , $id){
        try{
            $reservation = Reservation::with('livre' , 'utilisateur')->find($id);
            $validated = $request->validated();
            $reservation->update($validated);

            if(!$reservation){
                return response()->json([
                    'message' => 'Cette réservation n\'existe pas ! '
                ], 404);
            }
            return response()->json([
                'message' => 'Réservation modifiée avec succès',
                'réservation' => $reservation->fresh() 
            ],200); 
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Une erreur s\'est produite lors de la modification', 
                'erreur' =>   $e->getMessage()
            ],500);
        }
    }

    public function delete($id){
        try {
            $reservation = Reservation::with('livre' , 'utilisateur')->find($id);
            
            if(!$reservation){
                return response()->json([
                    'message' => 'Cette réservation n\'existe pas ! '
                ], 404);
            }
            $reservation->delete();
                return response()->json([
                    'message' => 'Réservation supprimée avec succès.'
                ], 200);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Erreur survenue lors de la suppression', 
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function valider($id){
        try{
            $reservation = Reservation::with('livre' , 'utilisateur')->find($id);

        if(!$reservation){
            return response()->json([
                'message' => 'Cette réservation n\'existe pas !'
            ],404);
        }
        if($reservation->statut !== 'validee'){
            $reservation->update(['statut' => 'validee']);
        }
        return response()->json([
            'message' => 'Réservation validée avec succès!',
            'réservation' => $reservation->fresh()
        ],200);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Erreur survenue lors de la validation de la réservation',
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function annuler($id){
        try{
            $reservation = Reservation::with('livre' , 'utilisateur')->find($id);

        if(!$reservation){
            return response()->json([
                'message' => 'Cette réservation n\'existe pas !'
            ],404);
        }
        if($reservation->statut !== 'annulee'){
            $reservation->update(['statut' => 'annulee']);
        }
        return response()->json([
            'message' => 'Réservation annulée avec succès!',
            'réservation' => $reservation->fresh()
        ],200);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Erreur survenue lors de l\'annulation de la réservation',
                'erreur' => $e->getMessage()
            ],500);
        }
    }

    public function filtrer(Request $request)
{
    try {
        $query = Reservation::with('livre', 'utilisateur');
       
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->has('livre_id')) {
            $query->where('livre_id', $request->livre_id);
        }

        if ($request->has('date_debut')) {
            $query->whereDate('date_debut', '>=', $request->date_debut);
        }

        if ($request->has('date_fin')) {
            $query->whereDate('date_fin', '<=', $request->date_fin);
        }

        $reservations = $query->paginate(10);

        if ($reservations->isEmpty()) {
            return response()->json([
                'message' => 'Aucune réservation ne correspond aux critères.'
            ], 200);
        }

        return response()->json([
            'message' => '',
            'réservation' => $reservation
        ],200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors du filtrage des réservations.',
            'erreur' => $e->getMessage()
        ], 500);
    }
}
}
