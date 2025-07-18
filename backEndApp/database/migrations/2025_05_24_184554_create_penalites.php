<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penalites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('emprunt_id')->constrained('emprunts')->onDelete('cascade');
            $table->enum('type', ['retard' , 'non_retour', 'perte' , 'autres']);
            $table->text('description')->nullable();
            $table->date('date_penalite');
            $table->date('date_deblocage')->nullable();
            $table->enum('statut' , ['levee' , 'active'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penalites');
    }
};
