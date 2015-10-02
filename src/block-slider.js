function BlockSlider(collection, options) {
    'use strict';
   
    const sliders = [];
    
    // if collection not found, return.
    if(!collection) {
        return;
    }
    if (!collection.length && !collection.querySelector) {
        return;
    }

    function debounce (fn, wait) {
        let timeout;
        return () => {
            const later = () => {
                timeout = null;
                fn.apply(this, arguments);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    options = options || {};
    options.sInterval = options.sInterval || 2000;
    options.sTransition = options.sTransition || 400;
    options.containerClass = options.containerClass || '.js-block-slider__container';
    options.itemsClass = options.itemsClass || '.js-block-slider__items';
    
    (function cacheSliders() {
        function cache(slider) {
            const container = slider.querySelector(options.containerClass),
                items = [].slice.call(container.querySelector(options.itemsClass).children, 0),
                sTransition = options.sTransition / 1000;
            slider.style.overflow = 'hidden';
            container.style.webkitTransition = sTransition + 's';
            container.style.MozTransition = sTransition + 's';
            container.style.msTransition = sTransition + 's';
            container.style.transition = sTransition + 's';
            container.style.webkitBackfaceVisibility = 'hidden';
            container.style.MozBackfaceVisibility = 'hidden';
            container.style.msBackfaceVisibility = 'hidden';
            container.style.backfaceVisibility = 'hidden';
            sliders.push({
                slider,
                container,
                items,
                slidePosition: 0,
                itemsPerSlide: 0,
                itemWidth: 0,
                containerWidth: 0,
                sliderWidth: 0
            });
        }
        if (collection.length) {
            [].forEach.call(collection, cache);
        } else {
            cache(collection);
        }
    })();

    function hasReachedEnd(slider) {
        return -(slider.slidePosition + 1) > slider.containerWidth - slider.sliderWidth;
    }

    function slide() {
        sliders.forEach(slider => {

            const container = slider.container;
            container.style.webkitTransform = 'translateX(' + slider.slidePosition + 'px)';
            container.style.MozTransform = 'translateX(' + slider.slidePosition + 'px)';
            container.style.msTransform = 'translateX(' + slider.slidePosition + 'px)';
            container.style.transform = 'translateX(' + slider.slidePosition + 'px)';
            slider.slidePosition -= slider.itemWidth;
            if (hasReachedEnd(slider)) {
                slider.slidePosition = 0;
            }
        });
    }

    function setWidths() {
        sliders.forEach(slider => {
            let itemWidth = 0,
                totalWidth = 0;
            slider.container.style.removeProperty('width');
            slider.items.forEach((item, i, arr) => {
                item.style.removeProperty('width');
                if (!i) {
                    itemWidth = item.offsetWidth;
                }
                item.style.width = itemWidth + 'px';
            });
            totalWidth = itemWidth * slider.items.length;
            slider.container.style.width = totalWidth + 'px';
            slider.sliderWidth = slider.slider.offsetWidth;
            slider.itemsPerSlide = Math.round(slider.sliderWidth / itemWidth);
            slider.itemWidth = itemWidth;
            slider.slidePosition = 0;
            slider.containerWidth = totalWidth;
        });
    }
    setWidths();

    window.addEventListener('resize', () => {
        window.requestAnimationFrame(debounce(() => {
            setWidths();
            slide();
        }, 300));
    });

    setInterval(() => {
        slide(sliders);
    }, options.sInterval);
}

// if jQuery is present, create a plugin.
if (jQuery) {
    (($) => {
        $.fn.BlockSlider = function(options) {
            BlockSlider(this, options);
            return this;
        };
    })(jQuery);
}