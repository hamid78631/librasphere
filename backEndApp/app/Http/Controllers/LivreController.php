<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLivreRequest;
use App\Http\Requests\UpdateLivreRequest;
use App\Models\Livre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class LivreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Livre::all() , 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function show(string $id)
    {
        $livre = Livre::find($id);
        if(!$livre){
            return response()->json(['message' => 'Livre non trouve'] , 404);
        }
        return response()->json($livre , 200);


    }
    public function store(StoreLivreRequest $request)
    {
        try {
            $validated = $request->validated();

            
            if($request->hasFile('image')){
                $filename = $request->file('image')->store('image' , 'public');
                $validated['image'] = $filename ;
            }
            $validated['date_ajout'] = now()->toDateString();

            
            $livre = Livre::create($validated);
            return response()->json($livre, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


public function update(UpdateLivreRequest $request, int $id)
{
    $livre = Livre::find($id);
    if(!$livre){
        return response()->json(['message' => 'Livre non trouvé'], 404);
    }
    
    $validated = $request->validated();
    
    if($request->hasFile('image')) {
        if($livre->image && Storage::disk('public')->exists($livre->image)){
            Storage::disk('public')->delete($livre->image);
        }
        $filename = $request->file('image')->store('image', 'public');
        $validated['image'] = $filename;
    }
    $validated['date_modif'] = now();


    $livre->update($validated);
    return response()->json($livre, 200);
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $livre = Livre::find($id);
        if(!$livre){
            return response()->json(['message' => 'Livre non trouvé !'], 404 );

        }

        $livre->delete();

        return response()->json(['message' => 'Livre supprimé avec succès'] , 200);
    }
}
