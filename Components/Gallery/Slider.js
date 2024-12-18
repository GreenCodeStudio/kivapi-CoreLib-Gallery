export class Slider {
    constructor(html, buttons, drawedCallback = null) {
        this.drawedCallback = drawedCallback;
        this.html = html;
        this.buttons = buttons;
        this.pointermoveBind = this.pointermove.bind(this);
        this.pointerupBind = this.pointerup.bind(this);
        this.startPointer = null;
        this.positionStatic = 0;
        this.positionDynamic = 0;
        this.positionDynamicUpdated = null;
        this.velocity = 0;
        this.basicFriction = 1e-6;
        this.currentFriction = 1e-6;
        // this.lastSlide = null;
        html.addEventListener("pointerdown", (e) => {
            this.pointerdown(e);
        });
        if (buttons) {
            buttons.querySelector(".back").onclick = (e) => {
                this.positionStatic--;
                if (this.positionStatic < this.minPosition) this.positionStatic = this.minPosition;
                this.positionDynamicUpdated = new Date();
                this.slide();
            };
            buttons.querySelector(".next").onclick = (e) => {
                this.positionStatic++;
                if (this.positionStatic > this.maxPosition) this.positionStatic = this.maxPosition;
                this.positionDynamicUpdated = new Date();
                this.slide();
            };
        }
        addEventListener("resize", () => this.redraw());
    }

    get maxPosition() {
        return this.html.children.length - 1;
    }

    get minPosition() {
        return 0;
    }

    get globalScale() {
        return getComputedStyle(document.body).getPropertyValue("--globalScale");
    }

    pointerdown(e) {
        addEventListener("pointermove", this.pointermoveBind);
        addEventListener("pointerup", this.pointerupBind);
        addEventListener("pointercancel", this.pointerupBind);
        let stillDelta = this.positionDynamic - this.positionStatic;
        this.startPointer = stillDelta + this.toPosition(e);
        this.velocity = 0;
    }

    pointermove(e) {
        let delta = this.startPointer - this.toPosition(e);
        if (this.positionDynamicUpdated) {
            this.velocity =
                (this.positionStatic + delta - this.positionDynamic) /
                (new Date() - this.positionDynamicUpdated);
        } else {
            this.velocity = 0;
        }
        this.positionDynamic = this.positionStatic + delta;
        this.positionDynamicUpdated = new Date();
        this.limitHard();
        this.redraw();
    }

    pointerup(e) {
        removeEventListener("pointermove", this.pointermoveBind);
        removeEventListener("pointerup", this.pointerupBind);
        this.startPointer = null;

        this.positionStatic = Math.round(this.simulatePath()[0]);
        if (this.positionStatic < this.minPosition) this.positionStatic = this.minPosition;
        else if (this.positionStatic > this.maxPosition) this.positionStatic = this.maxPosition;
        this.slide();
        requestAnimationFrame(this.slide.bind(this));
    }

    simulatePath() {
        let time = Math.abs(this.velocity) / this.basicFriction;
        let distance = 0.5 * this.basicFriction * time * time * Math.sign(this.velocity);
        let end = this.positionDynamic + distance;
        return [end, time];
    }

    toPosition(e) {
        return e.screenX / this.html.clientWidth;
    }

    redraw() {
        if (this.positionStatic > this.maxPosition) {
            this.positionStatic = this.maxPosition;

            requestAnimationFrame(this.slide.bind(this));
        }
        this.html.style.setProperty("--sliderGlobalPosition", this.positionDynamic);
        for (let i = 0; i < this.html.childElementCount; i++) {
            let item = this.html.children[i];
            let pos = this.positionDynamic - i;
            item.style.setProperty("--sliderPosition", pos);
            let visibility = 0;
            if (pos > 0) visibility = 1 - pos;
            else if (pos > -this.countVisible + 1) visibility = 1;
            else visibility = this.countVisible + pos;
            item.style.setProperty("--sliderVisibility", visibility);

            item.classList.toggle("sliderActive", Math.abs(pos) < 1);
            item.classList.toggle("slider-positive", pos >= 0);
            item.classList.toggle("slider-negative", pos < 0);
        }
        this.buttons
            ?.querySelector(".back")
            ?.classList.toggle("isActive", this.positionStatic > this.minPosition);
        this.buttons
            ?.querySelector(".next")
            ?.classList.toggle("isActive", this.positionStatic < this.maxPosition);

        if (this.drawedCallback) this.drawedCallback(this.positionDynamic, this.maxPosition);
    }

    slideCalc() {
        const delta = 1;
        if (this.startPointer === null) {
            let [simulation, simulationTime] = this.simulatePath();
            let toCorrect = simulation - this.positionStatic;
            if (this.positionDynamicUpdated) {
                let oldVelocity = this.velocity;
                if (toCorrect > 0) {
                    this.velocity -= delta * this.basicFriction * 2;
                } else if (toCorrect < 0) {
                    this.velocity += delta * this.basicFriction * 2;
                }
                if (
                    Math.sign(oldVelocity) != Math.sign(this.velocity) &&
                    Math.abs(this.positionDynamic - this.positionStatic) < 0.001
                ) {
                    this.positionDynamic = this.positionStatic;
                    this.velocity = 0;
                }
                if (this.velocity != 0 && this.startPointer === null) {
                    this.positionDynamic += delta * this.velocity;
                    this.velocity = this.decreaseBy(this.velocity, delta * this.currentFriction);
                }
            }
        }
        this.limitHard();
    }

    limitHard() {
        if (this.positionDynamic < this.minPosition - 0.5) {
            this.positionDynamic = this.minPosition - 0.5;
            this.velocity = 0;
        } else if (this.positionDynamic > this.maxPosition + 0.5) {
            this.positionDynamic = this.maxPosition + 0.5;
            this.velocity = 0;
        }
    }

    slide() {
        if (this.startPointer === null) {
            if (this.positionDynamicUpdated) {
                let delta = new Date() - this.positionDynamicUpdated;
                for (let i = 0; i < delta; i++) {
                    this.slideCalc();
                }
                this.redraw();
            }
            this.positionDynamicUpdated = new Date();
            if (this.positionDynamic != this.positionStatic || this.velocity)
                requestAnimationFrame(this.slide.bind(this));
        }
    }

    decreaseBy(x, y) {
        y = Math.abs(y) * Math.sign(x);
        if (Math.sign(x) == Math.sign(x - y)) return x - y;
        else return 0;
    }
}


