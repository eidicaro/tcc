<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProdutoModel extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'produto';

    protected $primaryKey = 'id_produto';

    protected $fillable = [
        'nome',
        'descricao',
        'preco',
        'imagem',
        'id_categoria',
        'ativo',
        'destaque',
        'adicionais_configurados',
        'ordem',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'ativo' => 'boolean',
        'destaque' => 'boolean',
        'adicionais_configurados' => 'boolean',
        'ordem' => 'integer',
    ];

    protected $appends = ['imagem_url'];

    public function getImagemUrlAttribute(): ?string
    {
        return $this->imagem ? asset('storage/'.$this->imagem) : null;
    }

    public function adicionais()
    {
        return $this->belongsToMany(
            AdicionalModel::class,
            'produto_adicional',
            'id_produto',
            'id_adicional'
        );
    }

    public function categoria()
    {
        return $this->belongsTo(CategoriaModel::class, 'id_categoria', 'id_categoria');
    }

    public function itensPedido()
    {
        return $this->hasMany(PedidoItemModel::class, 'id_produto', 'id_produto');
    }
}
