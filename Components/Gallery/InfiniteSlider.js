import {Slider} from "./Slider";

export class InfiniteSlider extends Slider {
    get maxPosition() {
        return Number.MAX_SAFE_INTEGER;
    }

    get minPosition() {
        return Number.MIN_SAFE_INTEGER;
    }

    calcDistance(to) {
        let pos = this.positionDynamic - to;
        if (pos > 0) {
            pos = pos % this.html.children.length;
            if (pos > this.html.children.length / 2) {
                pos -= this.html.children.length;
            }
        } else {
            pos = -pos;
            pos = pos % this.html.children.length;
            if (pos > this.html.children.length / 2) {
                pos -= this.html.children.length;
            }
            pos = -pos;
        }
        return pos;
    }

    calcDistanceStatic(to) {
        let pos = this.positionStatic - to;
        if (pos > 0) {
            pos = pos % this.html.children.length;
            if (pos > this.html.children.length / 2) {
                pos -= this.html.children.length;
            }
        } else {
            pos = -pos;
            pos = pos % this.html.children.length;
            if (pos > this.html.children.length / 2) {
                pos -= this.html.children.length;
            }
            pos = -pos;
        }
        return pos;
    }

    goToLogical(position) {
        if (this.positionStatic >= 0) {
            this.goTo(this.positionStatic - (this.positionStatic % this.countItems) + position);
        } else {
            let d = (this.positionStatic % this.countItems);
            if (d != 0)
                d += this.countItems;
            this.goTo(this.positionStatic - d + position)
        }
    }
}
