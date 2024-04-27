class CaImage extends Image {
    constructor(src) {
        super();
        this.src = src;
        this.loaded = false;
        this.addEventListener("load", function (event) {
            this.loaded = true;
        })
    }
}
