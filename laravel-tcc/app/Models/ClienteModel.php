<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClienteModel extends Model
{
    use HasFactory;
    protected $table = 'cliente';
    public $timestamps = false;

    protected $fillable = [
        'nome',
        'telefone',
        'email',
        'endereco',
    ];

}
