# FEATURE: ANHE (暗合) / HIDDEN COMBINATIONS ✅

**Date Added:** May 6, 2026
**Status:** ✅ COMPLETE

---

## 📋 OVERVIEW

Added **Anhe (暗合) / Hidden Combinations** detection to the Bazi Calculator application.

---

## 🔮 WHAT IS ANHE (暗合)?

**Anhe** (暗合) or **Hidden Combinations** are special Earthly Branch combinations based on the **hidden Heavenly Stems** within each branch. Unlike Liu He (六合) which is explicit, Anhe represents a more subtle, hidden affinity between branches.

---

## 📊 ANHE PAIRS IMPLEMENTED

### 7 Hidden Combinations:

| Branches | Classic Name | Modern Name | Hidden Stem Combo | Icon |
|----------|-------------|-------------|-------------------|------|
| Tiger (寅) + Ox (丑) | An He | Hidden Combinations | 甲己合 | 🔮 |
| Tiger (寅) + Goat (未) | An He | Hidden Combinations | 甲己合 | 🔮 |
| Rat (子) + Dragon (辰) | An He | Hidden Combinations | 戊癸合 | 🔮 |
| Rat (子) + Dog (戌) | An He | Hidden Combinations | 戊癸合 | 🔮 |
| Rooster (酉) + Snake (巳) | An He | Hidden Combinations | 乙庚合 | 🔮 |
| Rabbit (卯) + Monkey (申) | An He | Hidden Combinations | 乙庚合 | 🔮 |
| Horse (午) + Pig (亥) | An He | Hidden Combinations | 丁壬合 | 🔮 |

---

## 🔧 CODE CHANGES

### 1. Added ANHE_PAIRS Constant (script.js ~Line 1818)

```javascript
// ============================================
// AN HE (暗合) / HIDDEN COMBINATIONS
// ============================================
// Based on hidden stems combinations (地合/暗合)
// These are combinations based on hidden Heavenly Stems within Earthly Branches

const ANHE_PAIRS = [
    { pair: [2, 1], name: "Tiger-Ox Hidden", icon: "🔮" },      // Yin-Chou (Tiger-Ox): 甲己合
    { pair: [2, 7], name: "Tiger-Goat Hidden", icon: "🔮" },    // Yin-Wei (Tiger-Goat): 甲己合
    { pair: [0, 4], name: "Rat-Dragon Hidden", icon: "🔮" },    // Zi-Chen (Rat-Dragon): 戊癸合
    { pair: [0, 10], name: "Rat-Dog Hidden", icon: "🔮" },      // Zi-Xu (Rat-Dog): 戊癸合
    { pair: [9, 5], name: "Rooster-Snake Hidden", icon: "🔮" }, // You-Si (Rooster-Snake): 乙庚合
    { pair: [3, 8], name: "Rabbit-Monkey Hidden", icon: "🔮" }, // Mao-Shen (Rabbit-Monkey): 乙庚合
    { pair: [6, 11], name: "Horse-Pig Hidden", icon: "🔮" }     // Wu-Hai (Horse-Pig): 丁壬合
];
```

### 2. Added canFormAnhe() Function (script.js ~Line 1948)

```javascript
// Check An He / Hidden Combinations
function canFormAnhe(branch1Index, branch2Index) {
    for (const anhe of ANHE_PAIRS) {
        if ((anhe.pair[0] === branch1Index && anhe.pair[1] === branch2Index) ||
            (anhe.pair[1] === branch1Index && anhe.pair[0] === branch2Index)) {
            return anhe;
        }
    }
    return null;
}
```

### 3. Added to Detection Checks (script.js ~Line 2060)

```javascript
const checks = [
    { func: canFormSeasonalUnion, type: 'seasonal' },
    { func: canFormThreeHarmony, type: 'sanhe' },
    { func: canFormHalfCombination, type: 'banhe' },
    { func: canFormSixHarmony, type: 'liuhe' },
    { func: canFormAnhe, type: 'anhe' },  // ← NEW
    { func: canFormUngratefulPunishment, type: 'ungrateful' },
    // ... rest of checks
];
```

### 4. Updated Positive Types Display (script.js ~Line 2123)

```javascript
// Added 'anhe' to positive types array
const positiveTypes = ['seasonal', 'sanhe', 'banhe', 'liuhe', 'anhe'];
```

### 5. Updated Classic/Modern Naming (script.js ~Line 2132-2145)

```javascript
// Classic vs Modern naming
let name;
if (combinationStyle === 'classic') {
    name = type === 'seasonal' ? 'San Hui' :
           type === 'sanhe' ? 'San He' :
           type === 'banhe' ? 'Ban He' :
           type === 'liuhe' ? 'Liu He' :
           'An He';  // ← NEW
} else {
    name = type === 'seasonal' ? 'Seasonal Unions' :
           type === 'sanhe' ? 'Three Harmonies' :
           type === 'banhe' ? 'Half Combinations' :
           type === 'liuhe' ? 'Six Harmonies' :
           'Hidden Combinations';  // ← NEW
}
```

---

## 📱 DISPLAY EXAMPLES

### Classic Mode:
```
🔮 An He Y,CL
🔮 An He D,M
```

### Modern Mode:
```
🔮 Hidden Combinations Y,CL
🔮 Hidden Combinations D,M
```

---

## 🎯 INTERACTION PRIORITY

Anhe is classified as a **Positive Interaction** and is displayed in this order:

1. San Hui (三会) - Seasonal Unions
2. San He (三合) - Three Harmonies
3. Ban He (半合) - Half Combinations
4. Liu He (六合) - Six Harmonies
5. **An He (暗合) - Hidden Combinations** ← NEW
6. [Negative interactions follow]

---

## 📁 FILES MODIFIED

1. **BAZI 01/script.js** - Added ANHE_PAIRS, canFormAnhe(), updated detection and display
2. **bazica-duplicate/script.js** - Synced changes from BAZI 01

---

## ✅ TESTING CHECKLIST

- [x] ANHE_PAIRS constant defined correctly
- [x] canFormAnhe() function implemented
- [x] Added to detection checks array
- [x] Classic mode label: "An He"
- [x] Modern mode label: "Hidden Combinations"
- [x] Icon: 🔮 (crystal ball)
- [x] Classified as positive interaction
- [x] Synced to main project folder

---

## 📚 THEORY REFERENCE

Anhe (暗合) is based on the concept that each Earthly Branch contains hidden Heavenly Stems (藏干). When the hidden stems of two branches form one of the 5 Heavenly Stem combinations, it creates a "hidden" bond between those branches.

### Hidden Stem Theory:
- **寅 (Tiger)** contains: 甲, 丙, 戊
- **丑 (Ox)** contains: 己, 癸, 辛
- **甲己合** → Tiger + Ox = Hidden Combination

This represents a more subtle, behind-the-scenes affinity that may not be immediately obvious but has underlying strength.

---

**Implementation Date:** May 6, 2026
**Developer:** AI Assistant
**Status:** ✅ COMPLETE & TESTED
