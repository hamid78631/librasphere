<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
class Userr extends Model
{
    use HasFactory , HasApiTokens, Notifiable;

    protected $fillable = [
        'nom',
        'numero_identite',
        'email',
        'role',
        'statut',
        'date_inscription',
        'password'
    ];
    protected $table = 'Utilisateurs';
}
