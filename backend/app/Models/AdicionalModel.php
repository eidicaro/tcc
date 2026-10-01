<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdicionalModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'adicional';

    protected $primaryKey = 'id_adicional';

    protected $fillable = [
        'nome',
        'preco',
        'imagem',
        'ativo',
        'ordem',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'ativo' => 'boolean',
        'ordem' => 'integer',
    ];

    protected $appends = ['imagem_url'];

    public function getImagemUrlAttribute(): ?string
    {
        return $this->imagem ? asset('storage/'.$this->imagem) : null;
    }

    public function produtos()
    {
        return $this->belongsToMany(
            ProdutoModel::class,
            'produto_adicional',
            'id_adicional',
            'id_produto'
        );
    }

    public function itensPedido()
    {
        return $this->hasMany(PedidoItemAdicional::class, 'id_adicional', 'id_adicional');
    }
}
