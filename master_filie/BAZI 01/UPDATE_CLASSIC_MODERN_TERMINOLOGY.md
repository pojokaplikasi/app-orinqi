# UPDATED: CLASSIC/MODERN COMBINATION TOGGLE ✅

## 📋 CORRECTED TERMINOLOGY

Based on user feedback, updated to use:
- **Classic**: Pinyin/Romanized Chinese terms (San He, Liu Chong, etc.)
- **Modern**: Full English descriptive names (Three Harmonies, Six Clashes, etc.)

---

## 📊 NAMING COMPARISON (UPDATED)

### Heavenly Stems:
| Mode | Term |
|------|------|
| **Classic** | Tian Gan Wu He |
| **Modern** | HS Combinations |

### Positive Interactions (Earthly Branches):

| Type | Classic (Pinyin) | Modern (English) |
|------|------------------|------------------|
| Seasonal Union | San Hui | Seasonal Unions |
| Three Harmony | San He | Three Harmonies |
| Half Combination | Ban He | Half Combinations |
| Six Harmony | Liu He | Six Harmonies |

### Negative Interactions (Earthly Branches):

| Type | Classic (Pinyin) | Modern (English) |
|------|------------------|------------------|
| Ungrateful Punishment | Wu En Zhi Xing | Ungrateful Punishment |
| Arrogant Punishment | Chi Shi Zhi Xing | Bullying Punishment |
| Rude Punishment | Wu Li Zhi Xing | Uncivilized Punishment |
| Self Punishment | Zi Xing | Self Punishment |
| Six Clash | Liu Chong | Six Clashes |
| Destruction | Xiang Po | Destruction |
| Harm | Xiang Hai | Six Harms |

---

## 🔧 CODE CHANGES

### 1. formatHSComboLabel()
```javascript
if (combinationStyle === 'classic') {
    return `Tian Gan Wu He ${labels}`;  // Pinyin
} else {
    return `HS Combinations ${labels}`;  // Full English
}
```

### 2. formatSeasonalLabel()
```javascript
if (combinationStyle === 'classic') {
    return `${icon} San Hui ${labels}`;  // Pinyin
} else {
    return `${icon} Seasonal Unions ${labels}`;  // Full English
}
```

### 3. formatBranchInteractionLabels() - Positive
```javascript
// Classic (Pinyin)
name = type === 'seasonal' ? 'San Hui' :
       type === 'sanhe' ? 'San He' :
       type === 'banhe' ? 'Ban He' :
       'Liu He';

// Modern (Full English)
name = type === 'seasonal' ? 'Seasonal Unions' :
       type === 'sanhe' ? 'Three Harmonies' :
       type === 'banhe' ? 'Half Combinations' :
       'Six Harmonies';
```

### 4. formatBranchInteractionLabels() - Negative
```javascript
// Classic (Pinyin)
name = type === 'ungrateful' ? 'Wu En Zhi Xing' :
       type === 'arrogant' ? 'Chi Shi Zhi Xing' :
       type === 'rude' ? 'Wu Li Zhi Xing' :
       type === 'self' ? 'Zi Xing' :
       type === 'clash' ? 'Liu Chong' :
       type === 'destruction' ? 'Xiang Po' :
       'Xiang Hai';

// Modern (Full English)
name = type === 'ungrateful' ? 'Ungrateful Punishment' :
       type === 'arrogant' ? 'Bullying Punishment' :
       type === 'rude' ? 'Uncivilized Punishment' :
       type === 'self' ? 'Self Punishment' :
       type === 'clash' ? 'Six Clashes' :
       type === 'destruction' ? 'Destruction' :
       'Six Harms';
```

---

## ✅ DISPLAY EXAMPLES

### Classic Mode:
```
🔗 Tian Gan Wu He Y,M
🌿 San Hui D,H
💧 San He M,Y
💥 Liu Chong H,CL
⚠️ Wu En Zhi Xing D,Y,CL
```

### Modern Mode:
```
🔗 HS Combinations Y,M
🌿 Seasonal Unions D,H
💧 Three Harmonies M,Y
💥 Six Clashes H,CL
⚠️ Ungrateful Punishment D,Y,CL
```

---

## 📝 FILES MODIFIED

1. **script.js** - Line 1991-1995: Updated `formatHSComboLabel()`
2. **script.js** - Line 2063-2068: Updated `formatSeasonalLabel()`
3. **script.js** - Line 2088-2100: Updated positive interactions naming
4. **script.js** - Line 2122-2137: Updated negative interactions naming

---

**Date Updated:** May 6, 2026
**Status:** ✅ COMPLETE - Corrected to Pinyin vs Full English
**Classic**: Romanized Chinese (San He, Liu Chong, Wu En Zhi Xing)
**Modern**: Descriptive English (Three Harmonies, Six Clashes, Ungrateful Punishment)
