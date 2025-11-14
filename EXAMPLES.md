# نمونه‌های استفاده از افزونه WooCommerce Booking Box

این فایل شامل نمونه‌های مختلف استفاده از شورتکد `[wc_booking_box]` در سناریوهای مختلف است.

## 📋 فهرست مطالب

1. [استفاده پایه](#استفاده-پایه)
2. [محصولات رزرو](#محصولات-رزرو)
3. [محصولات با افزودنی](#محصولات-با-افزودنی)
4. [صفحات رزرو سریع](#صفحات-رزرو-سریع)
5. [یکپارچه‌سازی با افزونه‌ها](#یکپارچه‌سازی-با-افزونه‌ها)
6. [سفارشی‌سازی پیشرفته](#سفارشی‌سازی-پیشرفته)

---

## استفاده پایه

### نمایش ساده باکس رزرو

```
[wc_booking_box id="100"]
```

**کاربرد:** نمایش کامل باکس رزرو با تمام اطلاعات پیش‌فرض

---

### نمایش بدون عنوان

```
[wc_booking_box id="100" show_title="no"]
```

**کاربرد:** وقتی عنوان محصول را قبلاً در صفحه نوشته‌اید

---

### نمایش بدون قیمت

```
[wc_booking_box id="100" show_price="no"]
```

**کاربرد:** برای محصولات رایگان یا وقتی قیمت را جای دیگر نمایش می‌دهید

---

### نمایش فقط فرم

```
[wc_booking_box id="100" show_title="no" show_price="no" show_stock="no" show_meta="no"]
```

**کاربرد:** فقط فرم رزرو، بدون هیچ اطلاعات اضافی

---

## محصولات رزرو

### رزرو هتل با WooCommerce Bookings

```
[wc_booking_box id="201"]
```

**توضیحات:**
- تقویم به صورت خودکار نمایش داده می‌شود
- فیلدهای تاریخ ورود و خروج
- انتخاب تعداد مهمان

**نمونه HTML سفارشی:**

```html
<div class="hotel-booking-section">
    <h2>رزرو اتاق هتل دلوکس</h2>
    <div class="hotel-description">
        <p>اتاقی مجهز با تمام امکانات مدرن</p>
    </div>
    [wc_booking_box id="201" show_title="no"]
</div>
```

---

### رزرو تور گردشگری

```
[wc_booking_box id="202" show_stock="yes"]
```

**مناسب برای:**
- تورهای گروهی
- نمایش ظرفیت باقیمانده
- انتخاب تاریخ تور

---

### رزرو نوبت پزشک

```
[wc_booking_box id="203" show_price="no" show_meta="no"]
```

**ویژگی‌ها:**
- انتخاب تاریخ و ساعت
- فیلدهای اطلاعات بیمار
- بدون نمایش قیمت (برای بیمه‌ها)

---

## محصولات با افزودنی

### رستوران با گزینه‌های غذا

```
[wc_booking_box id="301"]
```

**شامل:**
- انتخاب تاریخ و ساعت رزرو
- تعداد نفرات
- افزودنی‌ها: نوع غذا، دسر، نوشیدنی
- درخواست‌های ویژه

**نمونه افزودنی‌های محصول:**
- ☐ پیش غذا (+50,000 تومان)
- ☐ دسر (+30,000 تومان)
- ☐ نوشیدنی (+20,000 تومان)

---

### استودیو عکاسی

```
[wc_booking_box id="302" show_title="yes" show_price="yes"]
```

**فیلدهای اضافی:**
- نوع عکاسی (عروسی، مهمانی، تبلیغاتی)
- مدت زمان جلسه
- تعداد نفرات
- لوکیشن (استودیو یا بیرون)

---

### سالن زیبایی

```
[wc_booking_box id="303"]
```

**خدمات قابل انتخاب:**
- کوتاهی مو
- رنگ مو
- میکاپ
- ماساژ صورت
- مانیکور و پدیکور

---

## صفحات رزرو سریع

### لندینگ پیج رزرو سریع

```html
<!DOCTYPE html>
<html>
<head>
    <title>رزرو سریع</title>
    <style>
        .quick-booking {
            max-width: 500px;
            margin: 50px auto;
            padding: 40px;
            background: #f9f9f9;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="quick-booking">
        <h1>رزرو فوری با تخفیف ویژه</h1>
        [wc_booking_box id="400" show_meta="no"]
    </div>
</body>
</html>
```

---

### پاپ‌آپ رزرو

```javascript
// با استفاده از JavaScript
<button id="open-booking">رزرو آنلاین</button>

<div id="booking-modal" style="display:none;">
    [wc_booking_box id="401" show_title="no"]
</div>

<script>
jQuery('#open-booking').click(function() {
    jQuery('#booking-modal').fadeIn();
});
</script>
```

---

### ویجت سایدبار

```php
// در فایل functions.php قالب
add_action('widgets_init', function() {
    register_sidebar(array(
        'name' => 'Booking Sidebar',
        'id' => 'booking-sidebar',
    ));
});

// در فایل sidebar.php
<?php if (is_active_sidebar('booking-sidebar')) : ?>
    <aside class="booking-widget">
        <?php echo do_shortcode('[wc_booking_box id="402" show_title="no" show_meta="no"]'); ?>
    </aside>
<?php endif; ?>
```

---

## یکپارچه‌سازی با افزونه‌ها

### با WooCommerce Bookings

```
[wc_booking_box id="500"]
```

**قابلیت‌ها:**
- تقویم تعاملی
- قیمت‌گذاری پویا بر اساس تاریخ
- مدیریت ظرفیت
- بلاک کردن تاریخ‌های خاص

---

### با YITH WooCommerce Booking

```
[wc_booking_box id="501" show_stock="yes"]
```

**ویژگی‌ها:**
- نمایش زمان‌های در دسترس
- رزرو بر اساس ساعت
- تایید خودکار یا دستی
- ایمیل یادآوری

---

### با Product Add-Ons

```
[wc_booking_box id="502"]
```

**افزودنی‌های نمونه:**

```
// فیلدهایی که به صورت خودکار نمایش داده می‌شوند:

- Text Input: نام کامل
- Text Area: توضیحات تکمیلی
- Checkbox: خدمات اضافی
- Radio Buttons: انتخاب پکیج
- Select Dropdown: نوع سرویس
- File Upload: آپلود مدارک
```

---

### با Extra Product Options

```
[wc_booking_box id="503"]
```

**گزینه‌های پیشرفته:**
- قیمت‌گذاری شرطی
- نمایش/مخفی کردن فیلدها بر اساس انتخاب
- اعتبارسنجی فیلدها
- فیلدهای وابسته به هم

---

## سفارشی‌سازی پیشرفته

### تغییر استایل با CSS

```html
<style>
/* تغییر رنگ‌بندی */
.wc-booking-box-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
}

.wc-booking-box-form button {
    background: #f093fb;
    background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

/* افکت‌های انیمیشن */
.wc-booking-box-container {
    animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

[wc_booking_box id="600"]
```

---

### افزودن محتوای سفارشی

```php
// در فایل functions.php

// اضافه کردن پیام قبل از فرم
add_action('wc_booking_box_after_add_to_cart_form', function($product) {
    ?>
    <div class="custom-message">
        <p>⏰ رزرو شما ظرف 24 ساعت تایید می‌شود</p>
        <p>📱 برای رزرو فوری: 021-12345678</p>
    </div>
    <?php
});

// اضافه کردن تخفیف ویژه
add_action('wc_booking_box_after_booking_form', function($product) {
    ?>
    <div class="special-offer">
        <h3>🎁 پیشنهاد ویژه!</h3>
        <p>با رزرو امروز، 20% تخفیف بگیرید</p>
        <code>کد تخفیف: BOOK20</code>
    </div>
    <?php
});
```

---

### فرم چند مرحله‌ای

```html
<div class="multi-step-booking">
    <!-- مرحله 1: انتخاب تاریخ -->
    <div class="step step-1 active">
        <h3>مرحله 1: انتخاب تاریخ</h3>
        [wc_booking_box id="601" show_price="no" show_title="no"]
    </div>

    <!-- مرحله 2: انتخاب خدمات -->
    <div class="step step-2">
        <h3>مرحله 2: انتخاب خدمات اضافی</h3>
        <!-- فرم افزودنی‌ها -->
    </div>

    <!-- مرحله 3: تایید نهایی -->
    <div class="step step-3">
        <h3>مرحله 3: تایید و پرداخت</h3>
        <!-- خلاصه رزرو -->
    </div>
</div>

<script>
// JavaScript برای مدیریت مراحل
jQuery('.next-step').click(function() {
    var currentStep = jQuery('.step.active');
    currentStep.removeClass('active').hide();
    currentStep.next('.step').addClass('active').show();
});
</script>
```

---

### یکپارچگی با Google Calendar

```php
// افزودن به تقویم گوگل
add_action('wc_booking_box_after_booking_form', function($product) {
    ?>
    <a href="#" class="add-to-calendar-btn">
        📅 افزودن به تقویم گوگل
    </a>

    <script>
    jQuery('.add-to-calendar-btn').click(function(e) {
        e.preventDefault();
        var title = '<?php echo esc_js($product->get_name()); ?>';
        var date = jQuery('[name="booking_date"]').val();

        var googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
                       encodeURIComponent(title) +
                       '&dates=' + date;

        window.open(googleUrl, '_blank');
    });
    </script>
    <?php
});
```

---

## نمونه‌های کاربردی خاص

### رزرو میز رستوران

```html
<div class="restaurant-booking">
    <h2>🍽️ رزرو میز</h2>
    <p>رستوران ما آماده پذیرایی از شماست</p>

    [wc_booking_box id="701" show_title="no"]

    <div class="restaurant-info">
        <p>📍 آدرس: تهران، خیابان ولیعصر، پلاک 100</p>
        <p>📞 تلفن: 021-12345678</p>
        <p>⏰ ساعات کاری: 12 ظهر تا 12 شب</p>
    </div>
</div>
```

---

### رزرو کلاس آموزشی

```html
<div class="class-booking">
    <h2>📚 ثبت‌نام در دوره آموزشی</h2>

    <div class="class-details">
        <ul>
            <li>مدت دوره: 3 ماه</li>
            <li>روزهای برگزاری: شنبه و سه‌شنبه</li>
            <li>ساعت: 18 تا 20</li>
            <li>ظرفیت: 15 نفر</li>
        </ul>
    </div>

    [wc_booking_box id="702" show_stock="yes"]

    <div class="instructor-info">
        <h3>مدرس دوره</h3>
        <p>دکتر احمد محمدی - 15 سال سابقه تدریس</p>
    </div>
</div>
```

---

### رزرو خودرو

```html
<div class="car-rental">
    <h2>🚗 رزرو خودرو</h2>

    <div class="car-specs">
        <img src="car-image.jpg" alt="ماشین">
        <ul>
            <li>مدل: پراید 2023</li>
            <li>رنگ: سفید</li>
            <li>گیربکس: دنده‌ای</li>
            <li>بیمه: شخص ثالث</li>
        </ul>
    </div>

    [wc_booking_box id="703"]

    <div class="rental-terms">
        <h3>شرایط اجاره:</h3>
        <ul>
            <li>حداقل سن: 25 سال</li>
            <li>گواهینامه معتبر الزامی</li>
            <li>ودیعه: 50 میلیون تومان</li>
        </ul>
    </div>
</div>
```

---

## نکات حرفه‌ای

### بهینه‌سازی برای موبایل

```css
@media (max-width: 768px) {
    .wc-booking-box-container {
        padding: 15px;
        margin: 10px;
    }

    .wc-booking-box-form button {
        font-size: 14px;
        padding: 12px;
    }
}
```

---

### افزودن امکان اشتراک‌گذاری

```php
add_action('wc_booking_box_after_booking_form', function($product) {
    $url = get_permalink($product->get_id());
    ?>
    <div class="share-booking">
        <p>این رزرو را با دوستان خود به اشتراک بگذارید:</p>
        <a href="https://telegram.me/share/url?url=<?php echo urlencode($url); ?>">تلگرام</a>
        <a href="https://wa.me/?text=<?php echo urlencode($url); ?>">واتساپ</a>
    </div>
    <?php
});
```

---

### نمایش تعداد رزروهای اخیر

```php
add_action('wc_booking_box_after_booking_form', function($product) {
    $recent_bookings = 47; // از دیتابیس بخوانید
    ?>
    <div class="social-proof">
        <p>🔥 <?php echo $recent_bookings; ?> نفر در 24 ساعت گذشته رزرو کرده‌اند</p>
    </div>
    <?php
});
```

---

## پشتیبانی و کمک

اگر سوالی دارید یا به کمک نیاز دارید:

- 📖 [مستندات کامل](README.md)
- 🐛 [گزارش باگ](https://github.com/yourusername/woocommerce-booking-box-shortcode/issues)
- 💬 [انجمن پشتیبانی](https://yourforum.com)

---

**موفق باشید! 🚀**
