<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'nom' => 'required|string|max:255',
            'numero_identite' => 'required|string|max:100|unique:utilisateurs,numero_identite',
            'email' => 'required|email|unique:utilisateurs,email',
            'role' => 'nullable|string|in:admin,assistant,adherent',
            'statut' => 'string|nullable|in:actif,suspendu',
            'date_inscription' => 'nullable|date',
            'password' => 'required|min:8|string|confirmed'
        ];
    }
}
