export class ButtonsAll {
    constructor(slider) {
        this.slider = slider;
        this.html = document.createElement("div");
        this.html.classList.add("buttonsAll");
        this.redraw();
    }

    redraw() {
        while (this.html.children.length < this.slider.countItems) {
            const div=document.createElement('div');
            const index=this.html.children.length;
            div.onclick=()=>{
                this.slider.goToLogical(index);
            }
            this.html.append(div);
        }
        while (this.html.children.length < this.slider.countItems) {
            this.html.lastChild.remove();
        }

        for (let i = 0; i < this.slider.countItems; i++) {
            const diff = this.slider.calcDistance(i);
            let activation;
            if(diff<0)
                activation = 1+diff
            else
                activation = 1-diff;

            this.html.children[i].style.setProperty("--activation", activation);
        }
    }
}
