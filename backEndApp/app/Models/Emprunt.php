<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use  App\Models\Livre;
use  App\Models\Userr;

class Emprunt extends Model
{
    use HasFactory;

    protected $fillable = [
        'livre_id', 
        'user_id',
        'date_emprunt',
        'date_retour_prevue',
        'date_retour_effective',
        'statut'
    ];

    public function livre(){
        return $this->belongsTo(Livre::class);
    }

    public function utilisateur(){
        return $this->belongsTo(Userr::class , 'user_id'); 
    }
}
