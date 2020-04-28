var BgFader = function(settings) {
    this.s = settings;
    this.init();
};
BgFader.prototype.init = function() {
    this.idx = parseInt(Math.random() * (this.s.images.length - 1));
    this.s.container.appendChild(this.newImage("old_slide"));
    this.nextSlide();
};

BgFader.prototype.nextSlide = function() {
    var self = this;
    var next = parseInt(Math.random() * (this.s.images.length - 1));
    this.idx = next;
    var newImage = this.newImage("");
    this.s.container.appendChild(newImage);
    setTimeout(function() {
        newImage.classList.add("incoming_slide");
        self.initListener(newImage);
    }, 500);
}
BgFader.prototype.newImage = function(imageClass) {
    var img = document.createElement("img");
    if (imageClass) {
      img.classList.add(imageClass);
    }
    img.setAttribute("alt", "");
    img.src = this.s.images[this.idx];
    return img;
}
BgFader.prototype.initListener = function(el) {
    var self = this;
    var transitionEvent = css_transition();
    el.addEventListener(transitionEvent, function(e) {
        if (e.propertyName == "opacity") {
            document.getElementsByClassName
            removeElementsByClass("old_slide");
            addImageClass(self.s.container);
            self.nextSlide();
        }
    });

    function addImageClass(container) {
        var children = container.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].tagName == "IMG") {
                children[i].classList.add("old_slide");
            }
        }
    }

    function removeElementsByClass(className) {
        var elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    function css_transition() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    };
}

module.exports = BgFader;
