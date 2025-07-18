<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Livre extends Model
{
    use HasFactory;

    protected $fillable=[
        'titre', 
        'auteur', 
        'description',
        'categorie',
        'quantite',
        'image',
        'date_ajout',
        'date_modif'
    ];
}
