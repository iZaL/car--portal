<?php namespace App\Src\Photo;

use App;
use App\Core\BaseRepository;
use App\Core\CrudableTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\MessageBag;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class PhotoRepository extends BaseRepository {

    use CrudableTrait;
    /**
     * @var \Illuminate\Database\Eloquent\Model
     */
    public $model;

    public $imageService;

    /**
     * Construct
     *
     * @internal param \Illuminate\Database\Eloquent\Model $user
     * @param Photo $model
     */
    public function __construct(Photo $model)
    {
        parent::__construct(new MessageBag);

        $this->model = $model;
    }

    /**
     * Save the entry in Database
     * @param Model $model
     * @param array $array
     * @return bool
     */
    public function create(Model $model, $array = [])
    {

        $photo = $model->photos()->save(new Photo($array));

        return $photo ? true : false;
    }

    /**
     * @param UploadedFile $file
     * @param Model $model
     * @param array $fields
     * @return bool
     * Uploads a photo and then Creates an Entry in the Database
     */
    public function attach(UploadedFile $file, Model $model, $fields = [])
    {
        $upload = $this->uploadFile($file, $model);

        if ( !$upload ) {
            return false;
        }

        $photo = $this->create($model, array_merge($fields, ['name' => $upload->getHashedName()]));

        if ( !$photo ) {
            $this->addError('Could Not save the photo record in the database');

            return false;
        }

        return $this;
    }

    public function uploadFile(UploadedFile $file, Model $model, $array = [])
    {
        $this->setImageService($model);
        // upload the file to the server
        $upload = $this->imageService->store($file);

        return $upload;
    }

    /**
     * @param UploadedFile $file
     * @param Model $model
     * @param array $fields
     * Replace the Existing Thumbnail Photo with the current one
     * @param $imageableID
     */
    public function replace(UploadedFile $file, Model $model, $fields = [], $imageableID)
    {
        $reflectionModel = new \ReflectionClass($model);
        $photos          = $this->model->where('imageable_type', $reflectionModel->name)->where('imageable_id', $imageableID)->where('thumbnail', 1)->get();
        foreach ( $photos as $photo ) {
            $this->setImageService($model);
            $this->imageService->destroy($photo->name);
        }

    }

    public function destroy()
    {

    }

    /**
     * @return mixed
     */
    public function getImageService()
    {
        return $this->imageService;
    }

    /**
     * @param $model
     */
    public function setImageService(Model $model)
    {
        $imageService = App::make('App\\Src\\' . $this->getClassShortName($model) . '\\ImageService');

        $this->imageService = $imageService;
    }
}