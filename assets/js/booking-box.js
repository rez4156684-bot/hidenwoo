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
     * راه‌اندازی تقویم فارسی Persian Datepicker
     */
    var initPersianDatepicker = function() {
        // بررسی وجود کتابخانه pDatepicker
        if (typeof $.fn.pDatepicker === 'undefined') {
            console.log('Persian Datepicker library not loaded');
            return;
        }

        // راه‌اندازی تقویم برای فیلدهای مربوطه
        $('.wc-booking-box-container').find('input[type="text"].shamsi-date-picker, input[type="text"].booking-date, input[type="text"][name*="date"], input[type="text"][name*="Date"]').each(function() {
            var $input = $(this);

            // جلوگیری از راه‌اندازی مجدد
            if ($input.hasClass('pdp-initialized')) {
                return;
            }

            try {
                $input.pDatepicker({
                    initialValue: false,
                    format: 'YYYY/MM/DD',
                    autoClose: true,
                    calendar: {
                        persian: {
                            locale: 'fa'
                        }
                    },
                    observer: true,
                    altField: $input.data('alt-field') || '',
                    altFormat: 'YYYY-MM-DD',
                    onSelect: function(unix) {
                        $input.trigger('change');
                    }
                });

                $input.addClass('pdp-initialized');
                console.log('Persian Datepicker initialized for:', $input.attr('name'));
            } catch (e) {
                console.error('Error initializing Persian Datepicker:', e);
            }
        });
    };

    /**
     * پشتیبانی از تقویم فارسی (در صورت نیاز) - تنظیمات قدیمی
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

        // راه‌اندازی تقویم فارسی با تاخیر برای اطمینان از بارگذاری کامل
        setTimeout(function() {
            initPersianDatepicker();
        }, 1000);

        // راه‌اندازی مجدد تقویم بعد از تغییر DOM
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(function() {
                        initPersianDatepicker();
                    }, 300);
                }
            });
        });

        // مشاهده تغییرات در کانتینر
        if ($('.wc-booking-box-container').length > 0) {
            observer.observe($('.wc-booking-box-container')[0], {
                childList: true,
                subtree: true
            });
        }
    });

    /**
     * راه‌اندازی مجدد بعد از AJAX (برای سازگاری با صفحات دینامیک)
     */
    $(document).ajaxComplete(function() {
        if ($('.wc-booking-box-container').length > 0) {
            WCBookingBox.initVariations();
            WCBookingBox.initAddons();

            // راه‌اندازی مجدد تقویم فارسی
            setTimeout(function() {
                initPersianDatepicker();
            }, 500);
        }
    });

})(jQuery);
