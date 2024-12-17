import {create} from "fast-creator";

export class GalleryViewer extends HTMLElement {
    constructor(items, i) {
        super();
        console.log('aaa');
        this.i = i;
        this.items = items;
        for (const item of items) {
            if (item.i == i) {
                const bounding = item.item.getBoundingClientRect();
                const img = create('img', {
                    src: item.src,
                    srcset: item.srcset,
                })
                this.currentImg = img;
                this.setThumbnailSizes(img, item);
                this.append(img);
                setTimeout(() => {
                    this.setFullSizes(img, item)
                }, 1)
            }
        }
        this.addEventListener('click', () => this.remove())
        setTimeout(() => {
            this.classList.add('opened');
            this.setAttribute('tabindex', 0);
            this.focus();
        })
        addEventListener('keydown', (e) => this.keydown(e))

    }

    keydown(e) {
        if (e.key == 'ArrowLeft') {
            this.goToBy(-1);
        } else if (e.key == 'ArrowRight') {
            this.goToBy(1);
        } else if (e.key == 'Escape' || e.key == 'Backspace' || e.key == 'ArrowDown') {
            this.remove();
        }
    }

    remove() {
        this.classList.add('closing');
        this.setThumbnailSizes(this.currentImg, this.items.find(x => x.i == this.i))
        this.currentImg.style.setProperty('--o', 1);

        setTimeout(() => {
            this.currentImg.style.setProperty('--o', 0);
        }, 200)
        setTimeout(() => {
            super.remove();
        }, 400)
    }

    setThumbnailSizes(img, item) {
        const bounding = item.item.getBoundingClientRect();
        console.log(bounding.width)
        img.style.setProperty('--x', bounding.x + 'px');
        img.style.setProperty('--y', bounding.y + 'px');
        img.style.setProperty('--w', bounding.width + 'px');
        img.style.setProperty('--h', bounding.height + 'px');
        img.style.setProperty('--o', 0);
    }

    setFullSizes(img, item, xDiff = 0) {
        const allowedWidth = window.innerWidth - 64;
        const allowedHeight = window.innerHeight - 64;
        const allowedRatio = allowedWidth / allowedHeight;
        const ratio = item.sizes[0].width / item.sizes[0].height;
        if (allowedRatio < ratio) {
            img.style.setProperty('--x', (32 + xDiff) + 'px');
            img.style.setProperty('--y', (allowedHeight - allowedWidth / ratio) / 2 + 'px');
            img.style.setProperty('--w', allowedWidth + 'px');
            img.style.setProperty('--h', allowedWidth / ratio + 'px');
            img.src = this.generateSrc(item, allowedWidth, allowedWidth / ratio)
            img.srcset = this.generateSrcSet(item, allowedWidth)
        } else {
            img.style.setProperty('--x', ((allowedWidth - allowedHeight * ratio) / 2 + xDiff) + 'px');
            img.style.setProperty('--y', '32px');
            img.style.setProperty('--w', allowedHeight * ratio + 'px');
            img.style.setProperty('--h', allowedHeight + 'px');
            img.src = this.generateSrc(item, allowedWidth, allowedWidth / ratio)
            img.srcset = this.generateSrcSet(item, allowedHeight * ratio)
        }
        img.style.setProperty('--o', 1);
    }

    goTo(i, isRight = null) {
        const oldItem = this.items.find(x => x.i == this.i);
        const oldImg = this.currentImg;
        this.setFullSizes(oldImg, oldItem, isRight ? -innerWidth : innerWidth);
        setTimeout(() => {
            oldImg.remove()
        }, 500);
        const item = this.items.find(x => x.i == i);
        const bounding = item.item.getBoundingClientRect();
        const img = create('img', {
            src: item.src,
            srcset: item.srcset,
        })
        this.currentImg = img;
        this.setFullSizes(img, item, isRight ? innerWidth : -innerWidth);
        this.append(img);
        setTimeout(() => {
            this.setFullSizes(img, item)
        }, 1)
        this.i = i;
    }

    goToBy(x) {
        let i = +this.i + x;
        let isRight = x > 0;
        if (i >= this.items.length) {
            i = i % this.items.length;
        } else if (i < 0) {
            i = this.items.length + i;
        }
        this.goTo(i, isRight)
    }

    generateSrc(item, width, height) {
        item.sizes.sort((a, b) => a.width - b.width)
        let size = item.sizes.find(x => x.width >= width && x.height >= height);
        if (!size)
            size = item.sizes[item.sizes.length - 1];
        return size.src;
    }

    generateSrcSet(item, width) {
        item.sizes.sort((a, b) => a.width - b.width)
        return item.sizes.map(x => `${x.src} ${x.width / width}x`).join(', ');
    }
}

customElements.define('gallery-viewer', GalleryViewer);
