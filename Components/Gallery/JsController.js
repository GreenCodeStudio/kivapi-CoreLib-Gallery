import {GalleryViewer} from "./GalleryViewer";

export default class {
    constructor() {
        document.querySelectorAll('.gallery .gallery-item').forEach(x=>x.addEventListener('click', ()=>this.openGallery(x)))
    }
    openGallery(item) {
        let items= [...document.querySelectorAll('.gallery .gallery-item')].map(item=>({item, i:+item.dataset.i, sizes:JSON.parse(item.dataset.sizes), src:item.querySelector('img').src, srcset:item.querySelector('img').srcset}))
        let viewer=new GalleryViewer(items, item.dataset.i)
        document.body.appendChild(viewer)
    }
}
