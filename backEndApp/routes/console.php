<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');



            // $table->string('nom');
            // $table->string('numero_identite')->unique();
            // $table->string('email')->unique();
            // $table->string('role');
            // $table->string('password');
            // $table->string('statut')->default('actif');
            // $table->date('date_inscription')->default(now());


            // $table->foreignId('livre_id')->constrained('livres')->onDelete('cascade');
            // $table->foreignId('user_id')->constrained('userrs')->onDelete('cascade');
            // $table->date('date_emprunt');
            // $table->date('date_retour_prevue');
            // $table->date('date_retour_effective')->nullable();
            // $table->enum('statut' , ['en_cours' , 'retourné','en_retard'])->default('en_cours');