<?php
/**
 * Plugin Name: WooCommerce Booking Box Shortcode
 * Plugin URI: https://github.com/yourusername/woocommerce-booking-box-shortcode
 * Description: نمایش فقط باکس رزرو و فیلدهای اضافی محصولات ووکامرس با شورتکد بدون عکس و توضیحات
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * Text Domain: wc-booking-box
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// جلوگیری از دسترسی مستقیم
if (!defined('ABSPATH')) {
    exit;
}

/**
 * کلاس اصلی افزونه
 */
class WC_Booking_Box_Shortcode {

    /**
     * نسخه افزونه
     */
    const VERSION = '1.0.0';

    /**
     * Instance واحد
     */
    private static $instance = null;

    /**
     * دریافت instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * سازنده
     */
    private function __construct() {
        add_action('plugins_loaded', array($this, 'init'));
    }

    /**
     * راه‌اندازی افزونه
     */
    public function init() {
        // بررسی فعال بودن ووکامرس
        if (!class_exists('WooCommerce')) {
            add_action('admin_notices', array($this, 'woocommerce_missing_notice'));
            return;
        }

        // ثبت شورتکد
        add_shortcode('wc_booking_box', array($this, 'booking_box_shortcode'));

        // اضافه کردن استایل‌ها
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));

        // بارگذاری فایل‌های زبان
        add_action('init', array($this, 'load_textdomain'));
    }

    /**
     * پیام خطا برای نبود ووکامرس
     */
    public function woocommerce_missing_notice() {
        ?>
        <div class="error">
            <p><?php _e('افزونه WooCommerce Booking Box Shortcode نیاز به فعال بودن افزونه WooCommerce دارد.', 'wc-booking-box'); ?></p>
        </div>
        <?php
    }

    /**
     * بارگذاری استایل‌ها و اسکریپت‌ها
     */
    public function enqueue_scripts() {
        wp_enqueue_style(
            'wc-booking-box-style',
            plugin_dir_url(__FILE__) . 'assets/css/booking-box.css',
            array(),
            self::VERSION
        );

        wp_enqueue_script(
            'wc-booking-box-script',
            plugin_dir_url(__FILE__) . 'assets/js/booking-box.js',
            array('jquery'),
            self::VERSION,
            true
        );
    }

    /**
     * بارگذاری فایل‌های ترجمه
     */
    public function load_textdomain() {
        load_plugin_textdomain('wc-booking-box', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    /**
     * شورتکد نمایش باکس رزرو
     *
     * استفاده: [wc_booking_box id="123"]
     * یا: [wc_booking_box id="123" show_price="yes" show_stock="yes"]
     *
     * @param array $atts پارامترهای شورتکد
     * @return string خروجی HTML
     */
    public function booking_box_shortcode($atts) {
        // پارامترهای پیش‌فرض
        $atts = shortcode_atts(array(
            'id' => '',
            'show_price' => 'yes',
            'show_stock' => 'yes',
            'show_title' => 'yes',
            'show_sku' => 'no',
            'show_meta' => 'yes',
        ), $atts, 'wc_booking_box');

        // بررسی وجود شناسه محصول
        if (empty($atts['id'])) {
            return '<div class="wc-booking-box-error">' . __('لطفاً شناسه محصول را وارد کنید.', 'wc-booking-box') . '</div>';
        }

        // دریافت محصول
        $product_id = intval($atts['id']);
        $product = wc_get_product($product_id);

        // بررسی معتبر بودن محصول
        if (!$product || !$product->is_purchasable()) {
            return '<div class="wc-booking-box-error">' . __('محصول یافت نشد یا قابل خرید نیست.', 'wc-booking-box') . '</div>';
        }

        // شروع بافر خروجی
        ob_start();

        // تنظیم محصول جاری برای قالب ووکامرس
        global $product;
        $product = wc_get_product($product_id);

        ?>
        <div class="wc-booking-box-container" data-product-id="<?php echo esc_attr($product_id); ?>">

            <?php if ($atts['show_title'] === 'yes') : ?>
                <h2 class="wc-booking-box-title"><?php echo esc_html($product->get_name()); ?></h2>
            <?php endif; ?>

            <?php if ($atts['show_price'] === 'yes') : ?>
                <div class="wc-booking-box-price">
                    <?php echo $product->get_price_html(); ?>
                </div>
            <?php endif; ?>

            <?php if ($atts['show_sku'] === 'yes' && $product->get_sku()) : ?>
                <div class="wc-booking-box-sku">
                    <span class="sku-label"><?php _e('شناسه محصول:', 'wc-booking-box'); ?></span>
                    <span class="sku"><?php echo esc_html($product->get_sku()); ?></span>
                </div>
            <?php endif; ?>

            <?php if ($atts['show_stock'] === 'yes') : ?>
                <div class="wc-booking-box-stock">
                    <?php echo wc_get_stock_html($product); ?>
                </div>
            <?php endif; ?>

            <div class="wc-booking-box-form">
                <?php
                // نمایش فرم افزودن به سبد خرید
                if ($product->is_type('simple')) {
                    woocommerce_simple_add_to_cart();
                } elseif ($product->is_type('variable')) {
                    woocommerce_variable_add_to_cart();
                } elseif ($product->is_type('grouped')) {
                    woocommerce_grouped_add_to_cart();
                } elseif ($product->is_type('external')) {
                    woocommerce_external_add_to_cart();
                }

                // Hook برای افزودن فیلدهای سفارشی (مثل تقویم، فیلدهای رزرو و...)
                do_action('wc_booking_box_after_add_to_cart_form', $product);
                ?>
            </div>

            <?php if ($atts['show_meta'] === 'yes') : ?>
                <div class="wc-booking-box-meta">
                    <?php do_action('woocommerce_product_meta_start'); ?>

                    <?php if (wc_product_sku_enabled() && ($product->get_sku() || $product->is_type('variable'))) : ?>
                        <span class="sku_wrapper"><?php _e('شناسه:', 'wc-booking-box'); ?>
                            <span class="sku"><?php echo ($sku = $product->get_sku()) ? $sku : __('ندارد', 'wc-booking-box'); ?></span>
                        </span>
                    <?php endif; ?>

                    <?php echo wc_get_product_category_list($product->get_id(), ', ', '<span class="posted_in">' . _n('دسته‌بندی:', 'دسته‌بندی‌ها:', count($product->get_category_ids()), 'wc-booking-box') . ' ', '</span>'); ?>

                    <?php echo wc_get_product_tag_list($product->get_id(), ', ', '<span class="tagged_as">' . _n('برچسب:', 'برچسب‌ها:', count($product->get_tag_ids()), 'wc-booking-box') . ' ', '</span>'); ?>

                    <?php do_action('woocommerce_product_meta_end'); ?>
                </div>
            <?php endif; ?>

            <?php
            // Hook برای افزونه‌های شخص ثالث (مثل افزونه‌های رزرو، تقویم و...)
            do_action('wc_booking_box_after_booking_form', $product);
            ?>

        </div>
        <?php

        return ob_get_clean();
    }
}

/**
 * دسترسی به instance اصلی
 */
function WC_Booking_Box() {
    return WC_Booking_Box_Shortcode::get_instance();
}

// راه‌اندازی افزونه
WC_Booking_Box();
