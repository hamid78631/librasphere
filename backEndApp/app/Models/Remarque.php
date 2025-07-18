<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Emprunt; 
class Remarque extends Model
{
    use HasFactory;

    protected $fillable = [
        'emprunt_id' , 'contenu'
    ];

    public function emprunt(){
        $this->belongsTo(Emprunt::class);
    }
    public function remarques(){
        $this->HasMany(Emprunt::class);
    }
}
