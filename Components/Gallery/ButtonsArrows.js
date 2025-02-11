export class ButtonsArrows {
    constructor(slider) {
        this.html = document.createElement("div");
        this.slider = slider;
        this.back = document.createElement("div");
        this.back.classList.add("back")
        this.html.append(this.back);
        this.next = document.createElement("div");
        this.next.classList.add("next")
        this.next.append(this.next);
        this.redraw();
    }

    redraw() {
        this.back
            ?.classList.toggle("isActive", this.slider.positionStatic > this.slider.minPosition);
        this.next
            ?.classList.toggle("isActive", this.slider.positionStatic < this.slider.maxPosition);
    }
}
