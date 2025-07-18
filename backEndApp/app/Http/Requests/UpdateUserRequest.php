<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'nom' => 'sometimes|required|string|max:255',
            
            'numero_identite' => 'sometimes|required|string|max:100|unique:users,numero_identite',
            'email' => 'sometimes|required|email|unique:users,email',
            'role' => 'sometimes|required|string|in:admin,assistant,adherent',
            'statut' => 'sometimes|string|required|in:actif,suspendu,inactif',
            'date_inscription' => 'sometimes|date|required',
            'password' => 'sometimes|required|min:8|string|confirmed'
        ];
    }
}
