/**
 * اسکریپت باکس رزرو ووکامرس
 * WooCommerce Booking Box JavaScript
 */

(function($) {
    'use strict';

    /**
     * کلاس اصلی مدیریت باکس رزرو
     */
    var WCBookingBox = {

        /**
         * راه‌اندازی
         */
        init: function() {
            this.bindEvents();
            this.initVariations();
            this.initAddons();
        },

        /**
         * اتصال رویدادها
         */
        bindEvents: function() {
            var self = this;

            // رویداد افزودن به سبد خرید
            $(document).on('submit', '.wc-booking-box-form form.cart', function(e) {
                var $form = $(this);
                var $button = $form.find('button.single_add_to_cart_button');

                // بررسی اعتبارسنجی فیلدها
                if (!self.validateForm($form)) {
                    e.preventDefault();
                    return false;
                }

                // نمایش حالت لودینگ
                $button.addClass('loading');
            });

            // رویداد تغییر محصول متغیر
            $(document).on('change', '.wc-booking-box-form .variations select', function() {
                self.updateVariationPrice();
            });

            // رویداد تغییر تعداد
            $(document).on('change', '.wc-booking-box-form input.qty', function() {
                self.updateTotalPrice();
            });

            // رویداد تغییر افزودنی‌ها
            $(document).on('change', '.wc-booking-box-form .addon, .wc-booking-box-form .wc-pao-addon input, .wc-booking-box-form .wc-pao-addon select', function() {
                self.updateTotalPrice();
            });
        },

        /**
         * راه‌اندازی محصولات متغیر
         */
        initVariations: function() {
            $('.wc-booking-box-form .variations_form').each(function() {
                $(this).wc_variation_form();
            });
        },

        /**
         * راه‌اندازی افزودنی‌های محصول
         */
        initAddons: function() {
            if (typeof $.fn.wc_product_addons !== 'undefined') {
                $('.wc-booking-box-form form.cart').wc_product_addons();
            }
        },

        /**
         * اعتبارسنجی فرم
         */
        validateForm: function($form) {
            var isValid = true;
            var errorMessage = '';

            // بررسی فیلدهای الزامی
            $form.find('[required]').each(function() {
                var $field = $(this);
                if (!$field.val() || $field.val() === '') {
                    isValid = false;
                    $field.addClass('error');

                    var label = $field.closest('tr, div').find('label').text() || 'این فیلد';
                    errorMessage += label + ' الزامی است.\n';
                } else {
                    $field.removeClass('error');
                }
            });

            // بررسی انتخاب محصول متغیر
            if ($form.find('.variations select').length > 0) {
                var allSelected = true;
                $form.find('.variations select').each(function() {
                    if ($(this).val() === '') {
                        allSelected = false;
                        $(this).addClass('error');
                    } else {
                        $(this).removeClass('error');
                    }
                });

                if (!allSelected) {
                    isValid = false;
                    errorMessage = 'لطفاً تمام گزینه‌های محصول را انتخاب کنید.\n';
                }
            }

            // نمایش پیام خطا
            if (!isValid && errorMessage) {
                this.showError(errorMessage);
            }

            return isValid;
        },

        /**
         * به‌روزرسانی قیمت محصول متغیر
         */
        updateVariationPrice: function() {
            var $container = $('.wc-booking-box-container');
            var $priceBox = $container.find('.wc-booking-box-price');

            // استفاده از رویداد ووکامرس برای به‌روزرسانی قیمت
            $(document).on('found_variation', function(event, variation) {
                if (variation.price_html) {
                    $priceBox.html(variation.price_html);
                }
            });
        },

        /**
         * به‌روزرسانی قیمت کل
         */
        updateTotalPrice: function() {
            var $form = $('.wc-booking-box-form form.cart');

            // این تابع می‌تواند برای محاسبه قیمت کل با افزودنی‌ها استفاده شود
            // اگر افزونه Product Add-Ons فعال باشد، خودش این کار را انجام می‌دهد

            // Trigger رویداد سفارشی
            $(document).trigger('wc_booking_box_price_updated');
        },

        /**
         * نمایش پیام خطا
         */
        showError: function(message) {
            var $container = $('.wc-booking-box-container');

            // حذف پیام‌های قبلی
            $container.find('.wc-booking-box-notice').remove();

            // اضافه کردن پیام جدید
            var $notice = $('<div class="wc-booking-box-notice wc-booking-box-error">' + message + '</div>');
            $container.prepend($notice);

            // اسکرول به پیام
            $('html, body').animate({
                scrollTop: $notice.offset().top - 100
            }, 500);

            // حذف خودکار بعد از 5 ثانیه
            setTimeout(function() {
                $notice.fadeOut(function() {
                    $(this).remove();
                });
            }, 5000);
        },

        /**
         * نمایش پیام موفقیت
         */
        showSuccess: function(message) {
            var $container = $('.wc-booking-box-container');

            var $notice = $('<div class="wc-booking-box-notice wc-booking-box-success">' + message + '</div>');
            $container.prepend($notice);

            setTimeout(function() {
                $notice.fadeOut(function() {
                    $(this).remove();
                });
            }, 3000);
        }
    };

    /**
     * پشتیبانی از تقویم فارسی (در صورت نیاز)
     */
    if (typeof $.fn.datepicker !== 'undefined') {
        // تنظیمات پیش‌فرض datepicker برای زبان فارسی
        $.datepicker.regional['fa'] = {
            closeText: 'بستن',
            prevText: '&#x3C;قبلی',
            nextText: 'بعدی&#x3E;',
            currentText: 'امروز',
            monthNames: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
            monthNamesShort: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
            dayNames: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
            dayNamesShort: ['یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه', 'شنبه'],
            dayNamesMin: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
            weekHeader: 'هف',
            dateFormat: 'yy/mm/dd',
            firstDay: 6,
            isRTL: true,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
    }

    /**
     * راه‌اندازی هنگام آماده شدن سند
     */
    $(document).ready(function() {
        WCBookingBox.init();
    });

    /**
     * راه‌اندازی مجدد بعد از AJAX (برای سازگاری با صفحات دینامیک)
     */
    $(document).ajaxComplete(function() {
        if ($('.wc-booking-box-container').length > 0) {
            WCBookingBox.initVariations();
            WCBookingBox.initAddons();
        }
    });

})(jQuery);

/**
 * توابع مدیریت پاپ‌آپ رزرو شمسی
 */

/**
 * باز کردن پاپ‌آپ رزرو
 * @param {number} productId - شناسه محصول
 */
function wcOpenReservePopup(productId) {
    var popupId = 'wc-reserve-popup-' + productId;
    var popup = document.getElementById(popupId);

    if (popup) {
        // نمایش پاپ‌آپ
        popup.style.display = 'flex';

        // غیرفعال کردن اسکرول بدنه
        document.body.style.overflow = 'hidden';

        // افزودن رویداد کلیک روی overlay برای بستن
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                wcCloseReservePopup(productId);
            }
        });

        // افزودن رویداد کلید ESC برای بستن
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape' || e.keyCode === 27) {
                wcCloseReservePopup(productId);
                document.removeEventListener('keydown', escHandler);
            }
        });

        // فوکوس روی اولین فیلد ورودی
        setTimeout(function() {
            var firstInput = popup.querySelector('input:not([type="hidden"]), select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);

        // Trigger رویداد سفارشی
        if (typeof jQuery !== 'undefined') {
            jQuery(document).trigger('wc_reserve_popup_opened', [productId]);
        }
    }
}

/**
 * بستن پاپ‌آپ رزرو
 * @param {number} productId - شناسه محصول
 */
function wcCloseReservePopup(productId) {
    var popupId = 'wc-reserve-popup-' + productId;
    var popup = document.getElementById(popupId);

    if (popup) {
        // اضافه کردن کلاس انیمیشن بستن
        popup.classList.add('closing');

        // بستن بعد از انیمیشن
        setTimeout(function() {
            popup.style.display = 'none';
            popup.classList.remove('closing');

            // فعال کردن اسکرول بدنه
            document.body.style.overflow = '';

            // Trigger رویداد سفارشی
            if (typeof jQuery !== 'undefined') {
                jQuery(document).trigger('wc_reserve_popup_closed', [productId]);
            }
        }, 300);
    }
}

/**
 * رفتار بعد از افزودن موفق به سبد خرید
 */
(function($) {
    $(document).on('added_to_cart', function(event, fragments, cart_hash, button) {
        // پیدا کردن پاپ‌آپ باز
        var openPopup = document.querySelector('.wc-reserve-popup-overlay[style*="display: flex"]');

        if (openPopup) {
            var productId = openPopup.id.replace('wc-reserve-popup-', '');

            // نمایش پیام موفقیت
            var successMessage = document.createElement('div');
            successMessage.className = 'wc-reserve-success-message';
            successMessage.innerHTML = '✓ محصول با موفقیت به سبد خرید اضافه شد!';
            successMessage.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #27ae60; color: white; padding: 15px 25px; border-radius: 8px; z-index: 9999999; box-shadow: 0 4px 15px rgba(0,0,0,0.2); animation: slideInRight 0.3s ease;';

            document.body.appendChild(successMessage);

            // حذف پیام بعد از 3 ثانیه
            setTimeout(function() {
                successMessage.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(function() {
                    document.body.removeChild(successMessage);
                }, 300);
            }, 3000);

            // بستن پاپ‌آپ بعد از 2 ثانیه
            setTimeout(function() {
                wcCloseReservePopup(productId);
            }, 2000);
        }
    });

    // اضافه کردن استایل‌های انیمیشن
    if (!document.getElementById('wc-reserve-popup-animations')) {
        var style = document.createElement('style');
        style.id = 'wc-reserve-popup-animations';
        style.innerHTML = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
})(jQuery);
