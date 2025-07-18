<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use  App\Models\Userr;
use  App\Models\Emprunt;
class Penalite extends Model
{
    use HasFactory;

    protected $fillable = [
        'utilisateur_id', 
        'emprunt_id',
        'type', 
        'description',
        'date_penalite',
        'date_deblocage',
        'statut'
    ];

    public function utilisateur(){
        return $this->belongsTo(Userr::class);
    }
    public function emprunt(){
        return $this->belongsTo(Emprunt::class);
    }
}
