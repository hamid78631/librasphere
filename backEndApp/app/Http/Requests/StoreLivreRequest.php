<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLivreRequest extends FormRequest
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
            'titre' => 'required|string|unique:livres,titre',
            'auteur' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'categorie' => 'required|string|max:255',
            'quantite' => 'required|integer|min:1',
            'image' => 'nullable|image|max:2048',
        ];
    }
}
