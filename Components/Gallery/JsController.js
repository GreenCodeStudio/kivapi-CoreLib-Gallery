import {GalleryViewer} from "./GalleryViewer";
import {Slider} from "./Slider";

export default class {
    constructor(params) {
        console.log('gallery', params)
        if (params.domElement.classList.contains('gallery-grid')) {
            params.domElement.querySelectorAll('.gallery-item').forEach(x => x.addEventListener('click', () => this.openGallery(x)))
        } else if (params.domElement.classList.contains('gallery-slider')) {
            const slider = new Slider(params.domElement);
            if (params.frontendData.sliderAutoPlay) {
                setInterval(() => {
                    if (slider.positionStatic == slider.maxPosition)
                        slider.goTo(0)
                    else
                        slider.goBy(1);
                }, params.frontendData.sliderAutoPlay * 1000);
            }
        }
    }

    openGallery(item) {
        let items = [...document.querySelectorAll('.gallery .gallery-item')].map(item => ({
            item,
            i: +item.dataset.i,
            sizes: JSON.parse(item.dataset.sizes),
            src: item.querySelector('img').src,
            srcset: item.querySelector('img').srcset
        }))
        let viewer = new GalleryViewer(items, item.dataset.i)
        document.body.appendChild(viewer)
    }
}
