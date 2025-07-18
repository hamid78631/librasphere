<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePenaliteRequest extends FormRequest
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
            'utilisateur_id' => 'required|exists:utilisateurs,id',
            'emprunt_id' => 'required|exists:emprunts,id',
            'type' => 'required|string|in:retard,non_retour,perte,autres',
            'description' => 'string|nullable|max:1000',
            'date_penalite' => 'nullable|ndate',
            'date_deblocage' => 'nullable|date|after_or_equal:date_penalite',
            'statut' => 'nullable|string|in:levee,active'
        ];

    }
    public function messages(): array
    {
        return [
            'utilisateur_id.required' => 'L\'utilisateur est requis.',
            'utilisateur_id.exists' => 'L\'utilisateur spécifié n\'existe pas.',
            'emprunt_id.exists' => 'L\'emprunt spécifié n\'existe pas.',
            'type.in' => 'Le type de pénalité est invalide.',
            // 'date_penalite.required' => 'La date de la pénalité est requise.',
            'date_deblocage.after_or_equal' => 'La date de déblocage ne peut pas être antérieure à la date de pénalité.',
        ];
    }
}
