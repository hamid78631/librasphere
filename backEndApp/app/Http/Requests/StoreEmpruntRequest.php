<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmpruntRequest extends FormRequest
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
            'livre_id' => 'required|exists:livres,id',
            'user_id' => 'required|exists:utilisateurs,id',
            'date_emprunt' => 'nullable|date',
            'date_retour_prevue'=>'|nullable|date|after_or_equal:date_emprunt'
        ];
    }
     public function messages(): array
    {
        return [
            'livre_id.required' => 'Le livre est requis.',
            'livre_id.exists' => 'Ce livre n’existe pas.',
            'user_id.required' => 'L’utilisateur est requis.',
            'user_id.exists' => 'Cet utilisateur n’existe pas.',
            'date_emprunt.required' => 'La date d’emprunt est obligatoire.',
            'date_retour_prevue.after_or_equal' => 'La date de retour prévue doit être postérieure ou égale à la date d’emprunt.',
        ];
    }
}
