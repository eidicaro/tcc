<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoriaModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'categoria';

    protected $fillable = ['nome', 'ativo', 'ordem'];

    protected $primaryKey = 'id_categoria';

    protected $casts = [
        'ativo' => 'boolean',
        'ordem' => 'integer',
    ];

    public function produtos()
    {
        return $this->hasMany(ProdutoModel::class, 'id_categoria', 'id_categoria');
    }
}
