<?php

namespace CoreLib\Gallery\Components\Gallery;

use Core\ComponentManager\ComponentController;
use Core\ComponentManager\ComponentManager;
use MKrawczyk\FunQuery\FunQuery;

class Controller extends ComponentController
{
    public array $images;

    public function __construct($params)
    {
        parent::__construct();
        $this->params = $params;
    }

    public static function DefinedParameters()
    {
        return [
            'photos' => ['type' => 'imagesArray'],
            'mode' => ['type' => 'enum', 'values' => ['slider', 'grid'], 'default' => 'grid'],
            'designedWidth' => ['type' => 'int', 'default' => 240],
            'designedHeight' => ['type' => 'int', 'default' => 240],
        ];
    }

    public function getImages()
    {
        $ret = [];
        foreach ($this->params->photos as $i => $photo) {
            $ratio = $photo->imageWidth / $photo->imageHeight;
            $sizes = [];
            $designedWidth=$this->params->designedWidth??1;
            $designedHeight=$this->params->designedHeight??1;
            for ($scale = 1; $scale < 64; $scale *= 2) {
                $width = round($photo->imageWidth / $scale);
                $height = round($photo->imageHeight / $scale);
                if ($width < 320 && $height < 320) break;
                $sizes[] = ['width' => $width, 'height' => $height, 'src' => $photo->getSizedUrl($width, $height)];
            }
            if ($ratio < 1) {
                $src = $photo->getSizedUrl($designedWidth, round($designedHeight / $ratio));
                $srcset = $photo->getSrcSet($designedWidth, round($designedHeight / $ratio));
            } else {
                $src = $photo->getSizedUrl(round($designedWidth * $ratio), $designedHeight);
                $srcset = $photo->getSrcSet(round($designedWidth * $ratio), $designedHeight);
            }
            $ret[] = [
                'src' => $src,
                'srcset' => $srcset,
                'ratio' => $ratio,
                'sizes' => json_encode($sizes),
                'i' => $i,
            ];
        }
        return $ret;
    }

    public function loadView()
    {
        $this->images = $this->getImages();
        $this->loadMPTS(__DIR__."/View.mpts");
    }
}
