<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Company extends Model
{
    use HasFactory, softDeletes;

        /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'logo'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function teams()
    {
        return $this->HasMany(Team::class);
    }

    public function roles()
    {
        return $this->HasMany(Role::class);
    }
}
