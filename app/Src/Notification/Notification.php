<?php namespace App\Src\Notification;

use App\Core\BaseModel;

class Notification extends BaseModel {

    protected $guarded = ['id'];

    protected $table = 'notifications';

    public function user()
    {
        return $this->belongsTo('App\Src\User\User', 'user_id');
    }

}
