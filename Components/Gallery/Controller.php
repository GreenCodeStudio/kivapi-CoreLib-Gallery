<?php

namespace Page\Components\Gallery;

use Core\ComponentManager\ComponentController;
use Core\ComponentManager\ComponentManager;
use MKrawczyk\FunQuery\FunQuery;

class Controller extends ComponentController
{
    public function __construct($params)
    {
        $this->params = $params;
    }

    public static function DefinedParameters()
    {
        return [
            'photos' => ['type' => 'imagesArray']
        ];
    }

    public function getImages()
    {
        $ret = [];
        foreach ($this->params->photos as $i => $photo) {
            $ratio = $photo->imageWidth / $photo->imageHeight;
            $sizes = [];
            for ($scale = 1; $scale < 64; $scale *= 2) {
                $width = round($photo->imageWidth / $scale);
                $height = round($photo->imageHeight / $scale);
                if ($width < 320 && $height < 320) break;
                $sizes[] = ['width' => $width, 'height' => $height, 'src' => $photo->getSizedUrl($width, $height)];
            }
            if ($ratio < 1) {
                $src = $photo->getSizedUrl(208, round(208 / $ratio));
                $srcset = $photo->getSrcSet(208, round(208 / $ratio));
            } else {
                $src = $photo->getSizedUrl(round(208 * $ratio), 208);
                $srcset = $photo->getSrcSet(round(208 * $ratio), 208);
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
