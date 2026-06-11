# design.md

**Project:** Bazi Calculator (Modern Edition)
**Version:** 2.0
**Design Language:** Minimal Premium + Liquid Glass + Subtle Chinese Accent

---

# 1. Design Philosophy

## Core Principle

Bazi Calculator adalah aplikasi perhitungan metafisika tradisional Tiongkok yang dibawakan dengan pendekatan modern.

Tujuan desain:

* Profesional
* Bersih
* Premium
* Mudah digunakan
* Tidak terlihat "kuno"
* Tidak terlalu bertema China
* Tetap memiliki identitas budaya yang halus

Referensi visual:

* Apple Human Interface Guidelines
* iOS 26 Liquid Glass
* Stripe Dashboard
* Linear
* Notion
* Arc Browser

---

# 2. Visual Personality

## Keywords

* Elegant
* Calm
* Premium
* Mystical
* Modern
* Soft
* Spacious

## Avoid

❌ Naga
❌ Lampion berlebihan
❌ Ornamen China tradisional besar
❌ Warna merah pekat dominan
❌ Emas mencolok
❌ Pattern yang ramai

## Preferred

✅ White space banyak
✅ Soft shadow
✅ Subtle gradient
✅ Glass surface
✅ Rounded corner modern
✅ Aksen merah Cina secukupnya

---

# 3. Color System

## Primary

Chinese Vermilion Modern

```css
#E94B4B
```

Digunakan untuk:

* CTA
* Active State
* Selected Option

---

## Secondary

```css
#F97316
```

Digunakan untuk:

* Hover
* Gradient CTA

---

## Accent Gold

```css
#D4A95A
```

Digunakan sangat sedikit:

* Badge
* Highlight
* Decorative Accent

Maksimal 5% dari keseluruhan layar.

---

## Background

```css
#FAFAFB
```

---

## Surface

```css
#FFFFFF
```

---

## Border

```css
#ECECEC
```

---

## Text Primary

```css
#18181B
```

---

## Text Secondary

```css
#71717A
```

---

# 4. Liquid Glass System

## Philosophy

Liquid Glass hanya digunakan pada:

* Header
* Card utama
* Floating control
* Modal

Jangan seluruh halaman menjadi glass.

---

## Glass Formula

```css
background: rgba(255,255,255,0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.6);
```

---

## Shadow

```css
0 8px 32px rgba(0,0,0,0.08)
```

---

## Corner Radius

```css
24px
```

---

# 5. Layout System

## Desktop Container

```css
max-width: 1280px;
```

---

## Content Width

```css
1200px
```

---

## Section Gap

```css
48px
```

---

## Internal Padding

```css
32px
```

---

## Mobile Padding

```css
20px
```

---

# 6. Typography

## Font

Primary:

```text
Inter
```

Alternative:

```text
SF Pro Display
```

---

## Heading 1

```css
48px
700
```

---

## Heading 2

```css
32px
600
```

---

## Body

```css
16px
400
```

---

## Small Text

```css
14px
400
```

---

# 7. Component Rules

## Inputs

Height:

```css
56px
```

Radius:

```css
16px
```

Style:

```css
background: white;
border: 1px solid #ECECEC;
```

Focus:

```css
border-color: #E94B4B;
box-shadow: 0 0 0 4px rgba(233,75,75,0.12);
```

---

## Buttons

Height

```css
56px
```

Radius

```css
18px
```

Primary Gradient

```css
#E94B4B → #F97316
```

Shadow

```css
0 10px 30px rgba(233,75,75,.25)
```

---

## Toggle

Style seperti segmented control iOS.

Inactive:

```css
#FFFFFF
```

Active:

```css
Linear Gradient
```

---

# 8. Chinese Accent Rules

China element harus terasa, bukan terlihat.

Target:

**90% Modern**
**10% Chinese Identity**

---

## Allowed Elements

### Subtle Circular Seal

Gunakan logo lingkaran merah kecil.

Contoh:

```text
命
```

Sebagai identitas aplikasi.

---

### Soft Cloud Pattern

Opacity:

```css
3% - 5%
```

Posisi:

* Footer
* Background corner

---

### Thin Wave Pattern

Gunakan garis tipis seperti aliran energi.

Opacity:

```css
5%
```

---

## Forbidden

* Lampion besar
* Naga
* Pagoda
* Karakter Hanzi besar di background
* Ornamen emas penuh

---

# 9. Animation

## Duration

```css
200ms
```

---

## Hover

```css
translateY(-2px)
```

---

## Press

```css
scale(0.98)
```

---

## Glass Glow

Sangat halus.

```css
opacity: 0.05
```

---

# 10. Responsive Behavior

## Desktop

Layout:

```text
Date | Time | Timezone
```

Dalam satu baris.

---

## Tablet

Layout:

```text
Date | Time

Timezone
```

---

## Mobile

Layout:

```text
Date

Time

Timezone

Gender

Checkbox

Button
```

Semua vertikal.

---

# 11. Accessibility

Minimum touch target:

```css
44px
```

Kontras minimal:

```css
4.5:1
```

Keyboard navigation wajib.

Focus state wajib terlihat.

---

# 12. Overall Feeling

Jika user pertama kali membuka aplikasi, kesan yang muncul harus:

> "Ini aplikasi profesional modern seperti produk Apple atau Stripe, tetapi masih memiliki identitas Bazi dan budaya Tiongkok yang elegan."

Bukan:

> "Ini aplikasi bertema China."

---

**End of design.md**
