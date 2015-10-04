function BlockSlider(collection, {
    sInterval = 2000,
    sTransition = 400,
    wrapClass = '.js-block-slider__wrap',
    itemsClass = '.js-block-slider__items'
}) {
    'use strict';
    const safariFixDelay = /constructor/i.test(window.HTMLElement) ? 500 : 0,
        sliders = [],
        lgStart = 'Block Slider: ';
    let resizeTimer;

    function testTiming(timing) {
        if (typeof timing !== 'number') {
            console.warn(`${lgStart}Supplied timing: '${timing}' is not an integer`);
            return false;
        }
        return true;
    }
    if (! testTiming(sInterval)) {
        sInterval = 2000;
    }
    if (! testTiming(sTransition)) {
        sTransition = 400;
    }
    
    try {
        // can collection be found ?
        if (!collection || !collection.length && !collection.querySelector) {
            throw new Error(`${lgStart}Supplied slider(s) could not be found.`);
        }
    }
    catch(e) {
        console.warn(e.message);
        return;
    }

    const calcTransiton = () => sTransition / 1000;

    function cache(slider) {
        let wrap,
            items,
            duration,
            sliderName = slider.id ? '#' + slider.id : '.' + slider.className,
            msg2 = ' could not be found as a direct descendant of ';
        try {
            wrap = slider.querySelector(wrapClass);
            if (!wrap) {
                throw new Error(`${lgStart}'${wrapClass}'${msg2}'${sliderName}.'`);
            } 
            else {
                items = wrap.querySelector(itemsClass);
                if (!items) {
                    throw new Error(`${lgStart}'${itemsClass}'${msg2}'${wrapClass}.'`);
                } 
                else {
                    items = [].slice.call(items.children, 0);                    
                }
            }
        } 
        catch(e) {
            console.warn(e.message);
            return false;
        }
        duration = calcTransiton();
        slider.setAttribute('style', 'overflow: hidden; opacity: 0');
        wrap.setAttribute('style', `-webkit-transition: -webkit-transform ${duration}s;transition: transform ${duration}s;`);
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

    const hasReachedEnd = s => -(s.slidePosition + 1) > s.wrapWidth - s.sliderWidth;

    function slide() {
        sliders.forEach(s => {
            const wrap = s.wrap,
                str = `translate3d(${s.slidePosition}px, 0, 0)`;
            wrap.style.webkitTransform = str;
            wrap.style.msTransform = str;
            wrap.style.transform = str;
            s.slidePosition -= s.itemWidth;
            if (hasReachedEnd(s)) {
                s.slidePosition = 0;
            }
        });
    }

    function calcAndSetWidths() {
        function removeInlineWidths(s) {
            // Temporarily hide the slider
            s.slider.style.opacity = 0;
            // Remove widths for wrap and all items.
            s.wrap.style.removeProperty('width');
            s.items.forEach((item, i, arr) => {
                item.style.removeProperty('width');
            });
        }

        const calcItemWidth = s => s.items[0].offsetWidth;

        const calcItemsPerSlide = s => Math.round(s.sliderWidth / s.itemWidth);

        function setWidths(s) {
            // loop through all items and set their width in pixels
            // to the calculated width.
            s.items.forEach((item) => {
                item.style.width = s.itemWidth + 'px';
            });
            // Set wrap width equal to total width of items.
            s.wrapWidth = s.itemWidth * s.items.length;
            s.wrap.style.width = s.wrapWidth + 'px';
            s.sliderWidth = s.slider.offsetWidth;
        }

        sliders.forEach(s => {
            removeInlineWidths(s);
            // create a slight delay for Safari being rubbishly slow at layout calcs.
            setTimeout(() => {
                // get the default CSS item width in pixels.
                s.itemWidth = calcItemWidth(s);
                setWidths(s);
                s.itemsPerSlide = calcItemsPerSlide(s);
                s.slidePosition = 0;
                setTimeout(() => {
                    // fade slider back in.
                    s.slider.style.opacity = 1;
                    slide();
                }, safariFixDelay);
            }, safariFixDelay);
        });
    }

    calcAndSetWidths();

    window.addEventListener('resize', () => {
        // call setWidths once the screen has finished resizing.
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(calcAndSetWidths, 250);
    });

    setInterval(() => {
        if (requestAnimationFrame) {
            requestAnimationFrame(() => {
                slide(sliders)
            });            
        } else {
            slide(sliders); 
        }
    }, sInterval);
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
