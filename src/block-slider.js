function BlockSlider(collection, opts) {
    'use strict';
    const safariFixDelay = /constructor/i.test(window.HTMLElement) ? 500 : 0,
        sliders = [];
    let resizeTimer;

    // if collection not found, return.
    if (!collection || !collection.length && !collection.querySelector) {
        return;
    }

    opts = opts || {};
    opts.sInterval = opts.sInterval || 2000;
    opts.sTransition = opts.sTransition || 400;
    opts.wrapClass = opts.wrapClass || '.js-block-slider__wrap';
    opts.itemsClass = opts.itemsClass || '.js-block-slider__items';

    function cache(slider) {
        const wrap = slider.querySelector(opts.wrapClass),
            items = [].slice.call(wrap.querySelector(opts.itemsClass).children, 0),
            sTransition = opts.sTransition / 1000;
        slider.setAttribute('style', 'overflow: hidden; opacity: 0');
        wrap.setAttribute('style', `
            -webkit-transition: -webkit-transform ${sTransition}s;
            transition: transform ${sTransition}s;
        `);
        sliders.push({
            slider,
            wrap,
            items,
            slidePosition: 0,
            itemsPerSlide: 0,
            itemWidth: 0,
            wrapWidth: 0,
            sliderWidth: 0
        });
    }
    if (collection.length) {
        [].forEach.call(collection, cache);
    } else {
        cache(collection);
    }

    function hasReachedEnd(s) {
        return -(s.slidePosition + 1) > s.wrapWidth - s.sliderWidth;
    }

    function slide() {
        sliders.forEach(s => {
            const wrap = s.wrap,
                str = `translate3d(${s.slidePosition}px, 0, 0)`
            wrap.style.webkitTransform = str;
            wrap.style.msTransform = str;
            wrap.style.transform = str;
            s.slidePosition -= s.itemWidth;
            if (hasReachedEnd(s)) {
                s.slidePosition = 0;
            }
        });
    }

    function setWidths() {
        sliders.forEach(s => {
            s.slider.style.opacity = 0;
            // remove widths for wrap and all items.
            s.wrap.style.removeProperty('width');
            s.items.forEach((item, i, arr) => {
                item.style.removeProperty('width');
            });
            // create a slight delay.
            setTimeout(function() {

                // get the default CSS item width in pixels.
                let itemWidth = s.items[0].offsetWidth;
                // loop through all items and set their width in pixels
                // to the calculated width.
                s.items.forEach((item) => {
                    item.style.width = itemWidth + 'px';
                });
                //Set wrap width equal to total width of items
                s.wrapWidth = itemWidth * s.items.length;
                s.wrap.style.width = s.wrapWidth + 'px';
                s.sliderWidth = s.slider.offsetWidth;
                s.itemsPerSlide = Math.round(s.sliderWidth / itemWidth);
                s.itemWidth = itemWidth;
                s.slidePosition = 0;
                setTimeout(function() {
                    s.slider.style.opacity = 1;
                    slide();
                }, safariFixDelay);
            }, safariFixDelay);
        });
    }
    setWidths();

    window.addEventListener('resize', () => {
        // call setWidths once the screen has finished resizing.
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setWidths, 250);
    });

    setInterval(() => {
        slide(sliders);
    }, opts.sInterval);
}

// if jQuery is present, create a plugin.
if (window.jQuery) {
    (($) => {
        $.fn.BlockSlider = function(opts) {
            BlockSlider(this, opts);
            return this;
        };
    })(window.jQuery);
}
