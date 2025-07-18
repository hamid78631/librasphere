<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'statut' => 'in:en_attente,validee,annulee',
            'livre_id' => 'sometimes|exists:livres,id',
            'user_id' =>'sometimes|exists:utilisateurs,id',
            'date_debut' => 'date|sometimes',
            'date_fin' => 'sometimes|date|after_or_equal:date_debut'
        ];
    }
}
