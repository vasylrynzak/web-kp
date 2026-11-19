(function() {
    'use strict';

    var dialog = document.getElementById('consultation-dialog');
    if (!dialog) return;

    var returnFocus = null;

    function validateField(field) {
        var value = field.value.trim();
        var message = '';
        field.setCustomValidity('');

        if (!value) {
            message = 'Заповніть це поле.';
        } else if (field.dataset.field === 'name') {
            var letters = value.match(/\p{L}/gu) || [];
            if (letters.length < 2 || !/^[\p{L}\p{M}\s’'\-]+$/u.test(value)) {
                message = 'Вкажіть ім’я щонайменше з двох літер.';
            } else if (value.length > 80) {
                message = 'Ім’я має містити не більше 80 символів.';
            }
        } else if (field.dataset.field === 'phone') {
            var digits = value.replace(/\D/g, '');
            if (value.length > 24 || !/^[+\d\s()\-]+$/.test(value) || !/^(?:38)?0\d{9}$/.test(digits)) {
                message = 'Вкажіть український номер, наприклад 098 345 6534 або +380 98 345 6534.';
            }
        } else if (field.dataset.field === 'email') {
            if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) || field.validity.typeMismatch) {
                message = 'Вкажіть коректну електронну адресу, наприклад name@example.com.';
            }
        } else if (field.dataset.field === 'message') {
            if (value.length < 10 || value.length > 1500) {
                message = 'Опишіть ваше завдання: від 10 до 1500 символів.';
            }
        }

        field.setCustomValidity(message);
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        var error = document.getElementById(field.id + '-error');
        if (error) {
            error.textContent = message;
            error.hidden = !message;
        }
        return !message;
    }

    function validateForm(form) {
        var firstInvalid = null;
        form.querySelectorAll('[data-field]').forEach(function(field) {
            if (!validateField(field) && !firstInvalid) firstInvalid = field;
        });
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    }

    function openConsultation(trigger, email) {
        if (dialog.open) return;
        returnFocus = trigger;
        dialog.querySelector('[name="email"]').value = email || '';
        dialog.showModal();
        document.body.classList.add('consultation-open');
        dialog.querySelector('[name="name"]').focus();
    }

    function closeConsultation() {
        if (dialog.open) dialog.close();
    }

    document.querySelectorAll('[data-open-consultation]').forEach(function(trigger) {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            openConsultation(trigger);
        });
    });

    dialog.querySelector('[data-close-consultation]').addEventListener('click', closeConsultation);
    dialog.addEventListener('cancel', function(event) {
        event.preventDefault();
        closeConsultation();
    });
    dialog.addEventListener('click', function(event) {
        if (event.target !== dialog) return;
        var rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
            closeConsultation();
        }
    });
    dialog.addEventListener('keydown', function(event) {
        if (event.key !== 'Tab') return;
        var controls = dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled])');
        var first = controls[0];
        var last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
    dialog.addEventListener('close', function() {
        document.body.classList.remove('consultation-open');
        dialog.querySelector('form').reset();
        dialog.querySelectorAll('[data-field]').forEach(function(field) {
            field.setCustomValidity('');
            field.removeAttribute('aria-invalid');
            var error = document.getElementById(field.id + '-error');
            error.textContent = '';
            error.hidden = true;
        });
        if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    });

    document.querySelectorAll('[data-validation-only]').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm(form) && dialog.contains(form)) closeConsultation();
        });
    });
    document.querySelectorAll('[data-consultation-email]').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!validateForm(form)) return;
            var email = form.querySelector('[name="email"]').value.trim();
            openConsultation(form.querySelector('button'), email);
        });
    });
    document.querySelectorAll('[data-field]').forEach(function(field) {
        field.addEventListener('blur', function() { validateField(field); });
        field.addEventListener('input', function() {
            if (field.getAttribute('aria-invalid') === 'true') validateField(field);
        });
    });
})();

(function($) {
"use strict";

/**
 * [isMobile description]
 * @type {Object}
 */
window.isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
}
window.isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
window.windowHeight = window.innerHeight;
window.windowWidth = window.innerWidth;

/**
 * owlCarousel
 */
$('.carousel__element').each(function() {
	var self = $(this),
		optData = eval('(' + self.attr('data-options') + ')'),
		optDefault = {
			items: 1,
			navText: ['Попередній', 'Наступний'],
			nav: true,
			dot: true,
			loop: true
		},
		options = $.extend(optDefault, optData);

self.owlCarousel(options);
});

var selectors = [
	'iframe[src*="player.vimeo.com"]',
	'iframe[src*="youtube.com"]',
	'iframe[src*="youtube-nocookie.com"]',
	'iframe[src*="kickstarter.com"][src*="video.html"]',
	'object',
	'embed'
];
var $allVideos = $('body').find(selectors.join(','));
$allVideos.each(function() {
	var vid = $(this),
		vidWidth = vid.outerWidth(),
		vidHeight = vid.outerHeight(),
		ratio = (vidHeight / vidWidth) * 100;
	$allVideos
		.addClass('embed-responsive-item');
	if (ratio == 75) {
		$allVideos
			.wrap('<div class="embed-responsive embed-responsive-4by3"></div>');
	} else {
		$allVideos
			.wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
	}
});

/**
 * Match height 
 */
$('.row-eq-height > [class*="col-"]').matchHeight();

var myEfficientFn = debounce(function() {
	$('.row-eq-height > [class*="col-"]').matchHeight();
}, 250);

window.addEventListener('resize', myEfficientFn);

/**
 * [debounce description]
 * @param  {[type]} func      [description]
 * @param  {[type]} wait      [description]
 * @param  {[type]} immediate [description]
 * @return {[type]}           [description]
 */
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

$('.js-counter').countUp();

/**
 * Countdown
 */
$('.countdown__module').each(function() {
	var self = $(this),
		_date = self.attr('data-date'),
		_strf = self.html();
	self.countdown(_date, function(event) {
	  	self.html(event.strftime(_strf));
	}).removeClass("hide");
});

// /**
// * Dropdown
// */
$('[data-init="dropdown"]').each(function(index, el) {

$(el).find('a.dropdown__toggle').on('click', function(event) {
		event.preventDefault();
		$(el).find('.dropdown__content').toggleClass('open');
		$(el).toggleClass('open');
	});

$(document).on('click', function(event) {
		var $content = $(el).find('.dropdown__content');
		if ($.contains(el, event.target)) {
			return;
		}

if ($(el).hasClass('open')) {
			$(el).removeClass('open');
		}

if ($content.hasClass('open')) {
			$content.removeClass('open');
		}
	});
});

function consultForm(argument) {
	var _hForm = $('.js-consult-form .js-consult-form__content').outerHeight() / 2;
	var _paddingTop = _hForm + 50;

if(windowWidth > 1200) {
		var _paddingTop = _hForm + 200;
	}

$('.js-consult-form .js-consult-form__content').css('bottom', - _hForm);

if(windowWidth > 768) { 
		$('.js-consult-form + *').css('padding-top', _paddingTop);
	}
}

consultForm();
var myEfficientFn = debounce(function() {	
	consultForm();
}, 250);

window.addEventListener('resize', myEfficientFn);
/**
 * Masonry
 */
$('.grid__inner').masonry({
	itemSelector: '.grid-item',
	columnWidth: '.grid-sizer',
});

/**
 * grid css
 */

$.fn.reCalWidth = function() {
	var $self = $(this);
	$self.on('reCalWidth', function() {
		var _self = $(this);
		_self.css('width', '');
		var width = Math.floor(_self.width());
		_self.css('width', width + 'px');
		var height = Math.floor(_self.parent().children('.wide').width()/2);
		_self.parent().children('.wide').css('height', height + 'px');
	});
	$(window).on('resize', function() {
		$self.trigger('reCalWidth');
	});
}
function work() {
	$('.grid-css').each(function() {
		var workWrapper = $(this),
			workContainer = $('.grid__inner', workWrapper),
			filters = $('.filter', workWrapper),
			filterCurrent = $('.current a', filters),
			filterLiCurrent = $('.current', filters),
			duration = 0.3;
		workContainer.imagesLoaded( function() {
			workContainer.isotope({
				layoutMode: 'masonry',
				itemSelector: '.grid-item',
				transitionDuration: duration + 's',
				masonry: {
					columnWidth: '.grid-sizer'
				},
				// hiddenStyle: {},
				// visibleStyle: {}
			});
		});
		filters.on('click', 'a', function(e) {
			e.preventDefault();
			var $el = $(this);
			var selector = $el.attr('data-filter');
			filters.find('.current').removeClass('current');
			$el.parent().addClass('current');
			workContainer.isotope({
				filter: selector
			});
		});
		$('.grid-item', workWrapper).reCalWidth();
	});
}
work();

$('.js-post-effect').each(function() {
	var contentHeight = $(this).find('.post-02__content').height() + 30;

if(windowWidth > 768) {
		var contentHeight = $(this).find('.post-02__content').height() + 50;
	}

$(this).find('.post-02__body').css('transform', 'translateY(' + contentHeight + 'px)');

$(this).hover(function() {
		$(this).find('.post-02__body').css('transform', 'translateY(' + 0 + 'px)');
	}, function() {
		$(this).find('.post-02__body').css('transform', 'translateY(' + contentHeight + 'px)');
	});
});
$(document).ready(function(){
	$('a[href^="#"].clickScroll').on('click',function (e) {
	    e.preventDefault();

var target = this.hash;
	    var $target = $(target);

$('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function() {
	        window.location.hash = target;
	    });
	});
});
$('[data-init="video"]').each(function(index, el) {
	var el = $(this);
	var iframe = $(this).find('iframe');

$(this).find('.video-button').click(function(e) {

el.addClass('play-video');
		iframe[0].src += "?enablejsapi=1&autoplay=1";
		e.preventDefault();
	});
});

$('#back-to-top').on('click', function (e) {
	e.preventDefault();
	$('html,body').animate({
		scrollTop: 0
	}, 700);
});
/**
 * Menu
 */
$('.consult-nav').dropdownMenu({
    menuClass: 'consult-menu',
    breakpoint: 992,
    toggleClass: 'active',
    classButtonToggle: 'navbar-toggle',
    subMenu: {
        class: 'sub-menu',
        parentClass: 'menu-item-has-children',
        toggleClass: 'active'
    }
});

$(window).scroll(function() {
	if ($(document).scrollTop() > 100) {
		$('.header').addClass('shrink');
	} else {
		$('.header').removeClass('shrink');
	}
});

/**
 * Event click navbar-toggle
 */
$('.navbar-toggle').each(function(index, el) {
    $(el).on('click', function(event) {
        event.preventDefault();
        $(el).toggleClass('open');
    });

$(document).on('click', function(event) {
        var $content = $(el);
        if ($.contains(el, event.target)) {
            return;
        }

if ($(el).hasClass('open')) {
            $(el).removeClass('open');
        }
    });
});

/**
 * Event click search-form
 */
$('.search-form').each(function(index, el) {
    $(el).on('click', function(event) {
        event.preventDefault();
        $(el).addClass('open');
    });

$(document).on('click', function(event) {
        var $content = $(el);
        if ($.contains(el, event.target)) {
            return;
        }

if ($(el).hasClass('open')) {
            $(el).removeClass('open');
        }
    });
});

function slider() {
	var windowWidth    = $(window).innerWidth();
	var containerWidth = $('.container').width();
	var outerPadding   = (windowWidth - containerWidth)/2;

if(windowWidth > 1200) {
		$('.js-consult-slider').css('marginRight', - outerPadding);
	}
}

slider();
var myEfficientFn = debounce(function() {	
	slider();
}, 250);

window.addEventListener('resize', myEfficientFn);

})(jQuery);

