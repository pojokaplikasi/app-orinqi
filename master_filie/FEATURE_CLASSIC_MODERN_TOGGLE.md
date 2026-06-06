# FEATURE: CLASSIC/MODERN COMBINATION TOGGLE ✅

## 📋 OVERVIEW

Menambahkan toggle button untuk memilih antara tampilan **Classic** (istilah tradisional Chinese) dan **Modern** (istilah English) untuk kombinasi/interaksi Bazi.

## 🎯 IMPLEMENTATION

### 1. Toggle Buttons (index.html)

Ditambahkan di bawah tombol Calculate:

```html
<!-- Combination Style Toggle (Classic/Modern) -->
<div class="row mt-2">
    <div class="col-12 d-flex justify-content-center">
        <div class="btn-group" role="group" aria-label="Combination Style">
            <button type="button" id="classicBtn" class="btn btn-outline-secondary btn-sm" onclick="setCombinationStyle('classic')">
                <i class="fas fa-book"></i> Classic (经典)
            </button>
            <button type="button" id="modernBtn" class="btn btn-outline-secondary btn-sm active" onclick="setCombinationStyle('modern')">
                <i class="fas fa-globe"></i> Modern
            </button>
        </div>
    </div>
</div>
```

### 2. Global Variable (script.js)

```javascript
// Global variable for combination style (classic or modern)
let combinationStyle = 'modern'; // Default to modern
```

### 3. Toggle Function (script.js)

```javascript
function setCombinationStyle(style) {
    combinationStyle = style;
    
    // Update button states
    const classicBtn = document.getElementById('classicBtn');
    const modernBtn = document.getElementById('modernBtn');
    
    if (style === 'classic') {
        classicBtn.classList.add('active');
        modernBtn.classList.remove('active');
    } else {
        modernBtn.classList.add('active');
        classicBtn.classList.remove('active');
    }
    
    // Refresh display if data exists
    if (window.currentBaziData && window.currentBaziData.four_pillars) {
        displayPillars(window.currentBaziData.four_pillars, window.currentBaziData.luck_pillars);
    }
}
```

### 4. Label Functions Updated

#### formatHSComboLabel()
```javascript
if (combinationStyle === 'classic') {
    return `天干合 ${labels}`;  // Classic: 天干合
} else {
    return `HS Combo ${labels}`;  // Modern: HS Combo
}
```

#### formatSeasonalLabel()
```javascript
if (combinationStyle === 'classic') {
    return `${icon} 三会 ${labels}`;  // Classic: 三会
} else {
    return `${icon} Seasonal ${labels}`;  // Modern: Seasonal
}
```

#### formatBranchInteractionLabels()

**Positive Interactions:**
| Type | Classic | Modern |
|------|---------|--------|
| seasonal | 三会 | Seasonal |
| sanhe | 三合 | SanHe |
| banhe | 半合 | BanHe |
| liuhe | 六合 | LiuHe |

**Negative Interactions:**
| Type | Classic | Modern |
|------|---------|--------|
| ungrateful | 无恩刑 | Ungrateful |
| arrogant | 恃势刑 | Arrogant |
| rude | 无礼刑 | Rude |
| self | 自刑 | Self |
| clash | 六冲 | Clash |
| destruction | 破 | Break |
| harm | 害 | Harm |

### 5. CSS Styling (style.css)

```css
/* Combination Style Toggle Buttons */
.btn-group .btn-outline-secondary.active {
    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    border-color: #e67e22;
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
}

.btn-group .btn-outline-secondary {
    font-size: 0.85rem;
    padding: 0.375rem 1rem;
}

.btn-group .btn-outline-secondary i {
    margin-right: 0.3rem;
}
```

## 📊 NAMING COMPARISON

### Classic Mode (经典模式):
- 天干合 (Heavenly Stem Combination)
- 三会 (Seasonal Union)
- 三合 (Three Harmony)
- 半合 (Half Combination)
- 六合 (Six Harmony)
- 无恩刑 (Ungrateful Punishment)
- 恃势刑 (Arrogant Punishment)
- 无礼刑 (Rude Punishment)
- 自刑 (Self Punishment)
- 六冲 (Six Clash)
- 破 (Destruction)
- 害 (Harm)

### Modern Mode:
- HS Combo
- Seasonal
- SanHe
- BanHe
- LiuHe
- Ungrateful
- Arrogant
- Rude
- Self
- Clash
- Break
- Harm

## ✅ FEATURES

1. **Toggle Button** - Located below Calculate button
2. **Default Mode** - Modern (English terms)
3. **Dynamic Update** - Changes labels immediately when toggled
4. **Visual Feedback** - Active button highlighted with orange gradient
5. **Icons** - Book icon for Classic, Globe icon for Modern
6. **Responsive** - Works on all screen sizes

## 🎨 UI DESIGN

- **Classic Button**: <i class="fas fa-book"></i> Classic (经典)
- **Modern Button**: <i class="fas fa-globe"></i> Modern
- **Active State**: Orange gradient background (#f39c12 → #e67e22)
- **Inactive State**: Outline style with gray border

## 🔗 FILES MODIFIED

1. **index.html** - Line 82-95: Added toggle button group
2. **script.js** - Line 57-59: Added global variable `combinationStyle`
3. **script.js** - Line 257-278: Added `setCombinationStyle()` function
4. **script.js** - Line 1985-1996: Updated `formatHSComboLabel()`
5. **script.js** - Line 2057-2069: Updated `formatSeasonalLabel()`
6. **script.js** - Line 2071-2145: Updated `formatBranchInteractionLabels()`
7. **style.css** - Line 1165-1181: Added toggle button styling

---

**Date Added:** May 6, 2026
**Status:** ✅ COMPLETE - Classic/Modern toggle fully functional
**Default:** Modern mode
**User Benefit:** Can choose preferred terminology (traditional Chinese vs English)
