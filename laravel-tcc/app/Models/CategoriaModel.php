<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoriaModel extends Model
{
    protected $table = 'categoria';
    protected $fillable = ['nome'];
    protected $primaryKey = 'id_categoria';
    use HasFactory;

    public function produtos()
    {
        return $this->hasMany(ProdutoModel::class, 'id_categoria');
    }

}
