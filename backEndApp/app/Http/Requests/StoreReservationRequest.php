<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
            'statut' => 'nullable|in:en_attente,validee,annulee',
            'user_id' => 'required|integer|exists:utilisateurs,id',
            'livre_id' => 'required|integer|exists:livres,id',
            'date_debut' => 'required|date',
            'date_fin'=>'required|date|after_or_equal:date_debut'
        ];
    }
}
