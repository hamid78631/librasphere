<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Userr ; 
use App\Models\Livre ; 
class Reservation extends Model
{
    use HasFactory ;

    protected $fillable = [
        'user_id',
        'livre_id',
        'date_debut',
        'date_fin',
        'statut'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        // 'statut' => ReservationStatut::class
    ];

    public function utilisateur(){
        return $this->belongsTo(Userr::class , 'user_id');
    }
    public function Livre(){
        return $this->belongsTo(Livre::class , 'livre_id');
    }
}
