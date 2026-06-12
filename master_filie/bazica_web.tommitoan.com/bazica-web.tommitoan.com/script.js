const vietnameseTerms = {
  "Yang Wood": "Giáp",
  "Yin Wood": "Ất",
  "Yang Fire": "Bính",
  "Yin Fire": "Đinh",
  "Yang Earth": "Mậu",
  "Yin Earth": "Kỷ",
  "Yang Metal": "Canh",
  "Yin Metal": "Tân",
  "Yang Water": "Nhâm",
  "Yin Water": "Quý",
  Rat: "Tý",
  Ox: "Sửu",
  Tiger: "Dần",
  Rabbit: "Mão",
  Dragon: "Thìn",
  Snake: "Tỵ",
  Horse: "Ngọ",
  Goat: "Mùi",
  Monkey: "Thân",
  Rooster: "Dậu",
  Dog: "Tuất",
  Pig: "Hợi",

  // GanZhi Translations
  "Sea metal": "Hải Trung Kim",
  "Furnace fire": "Lò Trung Hỏa",
  "Forest wood": "Đại Lâm Mộc",
  "Road earth": "Lộ Bàng Thổ",
  "Sword metal": "Kiếm Phong Kim",
  "Volcanic fire": "Sơn Đầu Hỏa",
  "Cave water": "Giản Hạ Thủy",
  "Fortress earth": "Thành Đầu Thổ",
  "Wax metal": "Bạch Lạp Kim",
  "Willow wood": "Dương Liễu Mộc",
  "Stream water": "Tuyền Trung Thủy",
  "Roof tiles earth": "Ốc Thượng Thổ",
  "Lightning fire": "Tích Lịch Hỏa",
  "Conifer wood": "Tùng Bách Mộc",
  "River water": "Trường Lưu Thủy",
  "Sand metal": "Sa Trung Kim",
  "Forest fire": "Sơn Hạ Hỏa",
  "Meadow wood": "Bình Địa Mộc",
  "Adobe earth": "Bích Thượng Thổ",
  "Precious metal": "Kim Bạch Kim",
  "Lamp fire": "Phúc Đăng Hỏa",
  "Sky water": "Thiên Hà Thủy",
  "Highway earth": "Đại Trạch Thổ",
  "Jewellery metal": "Thoa Xuyến Kim",
  "Mulberry wood": "Tang Đố Mộc",
  "Rapids water": "Đại Khê Thủy",
  "Desert earth": "Sa Trung Thổ",
  "Sun fire": "Thiên Thượng Hỏa",
  "Pomegranate wood": "Thạch Lựu Mộc",
  "Ocean water": "Đại Hải Thủy",

  // LifeCycle Translations
  Birth: "Sinh",
  Bath: "Mộc Dục",
  Youth: "Quan Đới",
  Thriving: "Lâm Quan",
  Prosperous: "Đế Vượng",
  Weakening: "Suy",
  Sick: "Bệnh",
  Death: "Tử",
  Grave: "Mộ",
  Extinction: "Tuyệt",
  Conceived: "Thai",
  Nourishing: "Dưỡng",
}

const languageStrings = {
  English: {
    pageTitle: "Bazi Calculator",
    mainHeading: "Bazi Calculator",
    dateTimeLabel: "Date and Time:",
    locationLabel: "Timezone:",
    fourPillarsHeading:
      "Natal Chart & Current Transiting Pillars (Read Right to Left):",
    luckPillarsHeading: "10-Year Luck Pillars (Right to Left):",
    yearPillarsHeading: "Year Pillars:",
    monthPillarsHeading: "Month Pillars:",
    dayPillarsHeading: "Day Pillars:",
    hourPillarsHeading: "Hour Pillars:",
    YearPillar: "Year Pillar (年柱)",
    MonthPillar: "Month Pillar (月柱)",
    DayPillar: "Day Pillar (日柱)",
    HourPillar: "Hour Pillar (時柱)",
    CurrentMonthPillar: "Current Month",
    CurrentYearPillar: "Current Year",
    CurrentLuckPillar: "Current Luck Cycle",
    calculateButton: "Calculate",
    genderLabel: "Gender:",
    femaleLabel: "Female",
    maleLabel: "Male",
    noTimezoneSelected: "Please select a timezone.",
    noGenderSelected: "Please select a gender.",
    noDateTimeSelected: "Please select a date and time.",
  },
}

const elementColors = {
  Fire: "#f44336", // A more vibrant red
  Wood: "#4CAF50", // A darker, richer green
  Earth: "#bc8a60", // A warmer brown with a hint of orange
  Water: "#2196F3", // A classic, slightly deeper blue
  Metal: "#96a6ae", // A darker, more legible gray
}

const branchAssociations = {
  Tiger: "Wood",
  Dần: "Wood",
  Rabbit: "Wood",
  Mão: "Wood",
  Snake: "Fire",
  Tỵ: "Fire",
  Horse: "Fire",
  Ngọ: "Fire",
  Monkey: "Metal",
  Thân: "Metal",
  Rooster: "Metal",
  Dậu: "Metal",
  Pig: "Water",
  Hợi: "Water",
  Rat: "Water",
  Tý: "Water",
  Dragon: "Earth",
  Thìn: "Earth",
  Goat: "Earth",
  Mùi: "Earth",
  Dog: "Earth",
  Tuất: "Earth",
  Ox: "Earth",
  Sửu: "Earth",
}

let currentLanguage = "English"
let birthTimeData = null // Store birth time for hierarchical calculations
let currentExpandedLevel = null // Track which level is currently expanded
let hsCombinations = {} // Store Heavenly Stem combinations

// Hidden Stems mapping (same as backend)
const HIDDEN_STEMS_MAP = {
  Rat: { main_qi: 9, sub_main_qi: null, residual_qi: null }, // 子: 癸
  Ox: { main_qi: 5, sub_main_qi: 9, residual_qi: 7 }, // 丑: 己(main), 癸(sub), 辛(res)
  Tiger: { main_qi: 0, sub_main_qi: 2, residual_qi: 4 }, // 寅: 甲(main), 丙(sub), 戊(res)
  Rabbit: { main_qi: 1, sub_main_qi: null, residual_qi: null }, // 卯: 乙
  Dragon: { main_qi: 4, sub_main_qi: 1, residual_qi: 9 }, // 辰: 戊(main), 乙(sub), 癸(res)
  Snake: { main_qi: 2, sub_main_qi: 4, residual_qi: 6 }, // 巳: 丙(main), 戊(sub), 庚(res)
  Horse: { main_qi: 3, sub_main_qi: 5, residual_qi: null }, // 午: 丁(main), 己(sub)
  Goat: { main_qi: 5, sub_main_qi: 3, residual_qi: 1 }, // 未: 己(main), 丁(sub), 乙(res)
  Monkey: { main_qi: 6, sub_main_qi: 8, residual_qi: 4 }, // 申: 庚(main), 壬(sub), 戊(res)
  Rooster: { main_qi: 7, sub_main_qi: null, residual_qi: null }, // 酉: 辛
  Dog: { main_qi: 4, sub_main_qi: 7, residual_qi: 3 }, // 戌: 戊(main), 辛(sub), 丁(res)
  Pig: { main_qi: 8, sub_main_qi: 0, residual_qi: null }, // 亥: 壬(main), 甲(sub)
}

// 10 Gods calculation function - Based on Wu Xing 5 Elements Theory
function getTenGodsRelationship(dayMasterIndex, stemIndex) {
  // Same element check
  const dayMasterElement = Math.floor(dayMasterIndex / 2)
  const stemElement = Math.floor(stemIndex / 2)
  const sameElement = dayMasterElement === stemElement

  // Same polarity check (both Yang or both Yin)
  const dayMasterPolarity = dayMasterIndex % 2
  const stemPolarity = stemIndex % 2
  const samePolarity = dayMasterPolarity === stemPolarity

  // Same element relationships (Companion)
  if (sameElement) {
    return samePolarity ? "F" : "RW" // Friend : Rob Wealth
  }

  // Five Elements cycle: Wood(0) -> Fire(1) -> Earth(2) -> Metal(3) -> Water(4) -> Wood
  const produces = (dayMasterElement + 1) % 5 === stemElement // DM produces stem (Output)
  const controls = (dayMasterElement + 2) % 5 === stemElement // DM controls stem (Wealth)
  const controlledBy = (stemElement + 2) % 5 === dayMasterElement // DM controlled by stem (Officer/Power)
  const producedBy = (stemElement + 1) % 5 === dayMasterElement // DM produced by stem (Resource)

  if (produces) {
    return samePolarity ? "EG" : "HO" // Eating God : Hurting Officer (Output)
  } else if (controls) {
    return samePolarity ? "IW" : "DW" // Indirect Wealth : Direct Wealth (Wealth)
  } else if (controlledBy) {
    return samePolarity ? "7K" : "DO" // 7 Killings : Direct Officer (Power)
  } else if (producedBy) {
    return samePolarity ? "IR" : "DR" // Indirect Resource : Direct Resource (Resource)
  }

  return "--" // Fallback
}

function getHiddenStemsWithTenGods(branchIndex, dayMasterIndex) {
  // Get hidden stems with 10 Gods relationships for an earthly branch
  const branchName = EARTHLY_BRANCHES[branchIndex].name
  const hiddenData = HIDDEN_STEMS_MAP[branchName] || {}

  const result = {}

  if (hiddenData.main_qi !== null && hiddenData.main_qi !== undefined) {
    const idx = hiddenData.main_qi
    result.main_qi = {
      name: HEAVENLY_STEMS[idx].name,
      character: HEAVENLY_STEMS[idx].character,
      element: HEAVENLY_STEMS[idx].element,
      ten_gods: getTenGodsRelationship(dayMasterIndex, idx),
    }
  } else {
    result.main_qi = null
  }

  if (hiddenData.sub_main_qi !== null && hiddenData.sub_main_qi !== undefined) {
    const idx = hiddenData.sub_main_qi
    result.sub_main_qi = {
      name: HEAVENLY_STEMS[idx].name,
      character: HEAVENLY_STEMS[idx].character,
      element: HEAVENLY_STEMS[idx].element,
      ten_gods: getTenGodsRelationship(dayMasterIndex, idx),
    }
  } else {
    result.sub_main_qi = null
  }

  if (hiddenData.residual_qi !== null && hiddenData.residual_qi !== undefined) {
    const idx = hiddenData.residual_qi
    result.residual_qi = {
      name: HEAVENLY_STEMS[idx].name,
      character: HEAVENLY_STEMS[idx].character,
      element: HEAVENLY_STEMS[idx].element,
      ten_gods: getTenGodsRelationship(dayMasterIndex, idx),
    }
  } else {
    result.residual_qi = null
  }

  return result
}

function getHiddenStems(branchIndex) {
  const branchName = EARTHLY_BRANCHES[branchIndex].name
  const hiddenData = HIDDEN_STEMS_MAP[branchName] || {}

  const result = {}

  if (hiddenData.main_qi !== null && hiddenData.main_qi !== undefined) {
    const idx = hiddenData.main_qi
    result.main_qi = {
      name: HEAVENLY_STEMS[idx].name,
      character: HEAVENLY_STEMS[idx].character,
      element: HEAVENLY_STEMS[idx].element,
    }
  } else {
    result.main_qi = null
  }

  if (hiddenData.sub_main_qi !== null && hiddenData.sub_main_qi !== undefined) {
    const idx = hiddenData.sub_main_qi
    result.sub_main_qi = {
      name: HEAVENLY_STEMS[idx].name,
      character: HEAVENLY_STEMS[idx].character,
      element: HEAVENLY_STEMS[idx].element,
    }
  } else {
    result.sub_main_qi = null
  }

  if (hiddenData.residual_qi !== null && hiddenData.residual_qi !== undefined) {
    const idx = hiddenData.residual_qi
    result.residual_qi = {
      name: HEAVENLY_STEMS[idx].name,
      character: HEAVENLY_STEMS[idx].character,
      element: HEAVENLY_STEMS[idx].element,
    }
  } else {
    result.residual_qi = null
  }

  return result
}

function calculateBazi() {
  const dateTimeInput = document.getElementById("dateTime")
  const locationInput = document.getElementById("location")
  const luckPillarsDiv = document.getElementById("luckPillars")
  const errorDiv = document.getElementById("error")

  // Get selected gender
  const genderRadios = document.getElementsByName("gender")
  let selectedGender = null // Initialize as null
  for (const radio of genderRadios) {
    if (radio.checked) {
      selectedGender = parseInt(radio.value, 10)
      break
    }
  }

  // Clear previous error message
  errorDiv.style.display = "none"

  // Check if date and time is selected
  if (!dateTimeInput.value) {
    errorDiv.textContent = languageStrings[currentLanguage].noDateTimeSelected
    errorDiv.style.display = "block"
    return
  }

  // Date and Time Validation
  const dateTimeValue = dateTimeInput.value
  if (!dateTimeValue) {
    errorDiv.textContent = languageStrings[currentLanguage].noDateTimeSelected
    errorDiv.style.display = "block"
    return
  }

  const inputDate = new Date(dateTimeValue)
  const startYear = 1900
  const endYear = 2100

  if (
    inputDate.getFullYear() < startYear ||
    inputDate.getFullYear() > endYear
  ) {
    errorDiv.textContent = `Year must be between ${startYear} and ${endYear}`
    errorDiv.style.display = "block"
    return
  }

  // Check if timezone is selected
  if (!locationInput.value) {
    errorDiv.textContent = languageStrings[currentLanguage].noTimezoneSelected
    errorDiv.style.display = "block"
    return
  }

  // Check if gender is selected
  if (selectedGender === null) {
    errorDiv.textContent = languageStrings[currentLanguage].noGenderSelected
    errorDiv.style.display = "block"
    return
  }

  luckPillarsDiv.style.display = "none"
  errorDiv.style.display = "none"

  // Hide all hierarchical containers - simplified since we removed them
  // No longer needed

  // Create a new object before sending the data.
  const requestData = {
    dateTime: dateTimeInput.value,
    location: locationInput.value,
    gender: selectedGender,
  }

  // Store birth time data for hierarchical calculations
  birthTimeData = {
    dateTime: dateTimeInput.value,
    location: locationInput.value,
    gender: selectedGender,
  }

  fetch("/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData), // Send the requestData object
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.")
      }
      return response.json()
    })
    .then((data) => {
      // Store data for combination detection
      window.currentBaziData = data

      // Display the Four Pillars (Natal Chart)
      displayPillar(data.four_pillars.year_pillar, "YearPillar")
      displayPillar(data.four_pillars.month_pillar, "MonthPillar")
      displayPillar(data.four_pillars.day_pillar, "DayPillar")
      displayPillar(data.four_pillars.hour_pillar, "HourPillar")

      // Display the Luck Pillars
      displayLuckPillars(data.luck_pillars)

      // Display Current Transiting Pillars (Current Luck Cycle, Current Year, Current Month)
      displayCurrentPillars(data.four_pillars, data.luck_pillars)

      // Display Time Period Rows (Year, Month, Day, Hour Pillars)
      displayTimePeriodRows(data.four_pillars, data.luck_pillars)

      // Detect and display Heavenly Stem combinations
      detectAndDisplayHSCombinations(data.four_pillars, data.luck_pillars)

      // Show the results
      document.getElementById("luckPillars").style.display = "flex"
      document.getElementById("resultsContainer").style.display = "block"
    })
    .catch((error) => {
      errorDiv.textContent = "Error: " + error.message
      errorDiv.style.display = "block"
    })

  // GSAP animation on successful calculation (commented out for stability)
  // gsap.from("#result", { duration: 1, opacity: 0, y: 50, stagger: 0.2 });
  // gsap.from(".luckPillar", { duration: 1, opacity: 0, y: 50, stagger: 0.2 });
  // gsap.from("#resultsContainer", { duration: 1, opacity: 0, y: 50 });
}

function displayPillar(pillarData, element) {
  let div
  if (typeof element === "string") {
    div = document.getElementById(element)
  } else {
    div = element
  }

  let heavenlyStemName = pillarData.heavenly_stem.name
  let heavenlyStemCharacter = pillarData.heavenly_stem.character
  let earthlyBranchName = pillarData.earthly_branch.name
  let earthlyBranchCharacter = pillarData.earthly_branch.character

  // Get element and branch element before translation
  let heavenlyStemElement = heavenlyStemName.split(" ")[1]
  let earthlyBranchElement = branchAssociations[earthlyBranchName]

  // Extract Nayin (GanZhi) information
  let nayinName = "" // Nayin period name
  let nayinElement = ""
  if (pillarData.gan_zhi) {
    nayinName = pillarData.gan_zhi.name
    nayinElement = pillarData.gan_zhi.element_name || ""
  } else if (pillarData.heavenly_stem && pillarData.heavenly_stem.gan_zhi) {
    nayinName = pillarData.heavenly_stem.gan_zhi.name
    nayinElement = pillarData.heavenly_stem.gan_zhi.element_name || ""
  }

  if (!nayinName) {
    nayinName = "N/A"
  }

  // Extract 12 Phrase (Life Cycle) information
  let phrase12Name = ""
  if (pillarData.life_cycle) {
    phrase12Name = pillarData.life_cycle
  }

  // Extract Hidden Stems information with 10 Gods
  let hiddenStemsHTML = ""
  if (pillarData.hidden_stems) {
    const hiddenStems = pillarData.hidden_stems
    let stemColumns = []

    // Residual Qi (left column)
    if (hiddenStems.residual_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.residual_qi.element]}">${hiddenStems.residual_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.residual_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    // Main Qi (center column)
    if (hiddenStems.main_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.main_qi.element]}">${hiddenStems.main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.main_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    // Sub Main Qi (right column)
    if (hiddenStems.sub_main_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.sub_main_qi.element]}">${hiddenStems.sub_main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.sub_main_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    hiddenStemsHTML = `
            <div class="hidden-stems-container">
                <div class="hidden-stems-grid">
                    ${stemColumns.join("")}
                </div>
            </div>
        `
  }

  // Get title for this pillar
  let title = languageStrings[currentLanguage][div.id] || div.id
  if (div.id && div.id.startsWith("Current")) {
    title =
      languageStrings[currentLanguage][div.id] ||
      div.id.replace("Current", "Current ")
  }

  // Build pillar HTML - ALL pillars have same structure:
  // Title (top) -> Heavenly Stem -> HR -> Earthly Branch -> Hidden Stems with 10 Gods -> HR -> Nayin -> HR -> 12 Phrase
  const pillarHTML = `
        <div class="pillar-title">${title}</div>
        <div class="pillar-value">
            <strong id="bigCharacter" style="color: ${elementColors[heavenlyStemElement]}">${heavenlyStemCharacter}</strong>
            <div id="bigValue" style="color: ${elementColors[heavenlyStemElement]}">${heavenlyStemName}</div>
        </div>
        <hr>
        <div class="pillar-value">
            <strong id="bigCharacter" style="color: ${elementColors[earthlyBranchElement]}">${earthlyBranchCharacter}</strong>
            <div id="bigValue" style="color: ${elementColors[earthlyBranchElement]}">${earthlyBranchName}</div>
        </div>
        ${hiddenStemsHTML}
        <hr>
        <div class="ganzhi-separator">
            <strong style="color: ${elementColors[nayinElement]}">${nayinName}</strong>
        </div>
        <hr>
        <div class="lifecycle-separator">
            <div id="lifeCycle">${phrase12Name || ""}</div>
        </div>
    `

  div.innerHTML = pillarHTML
}

// Removed toggleLanguage function as Vietnamese support is no longer needed

// updateTextElements function
function updateTextElements() {
  // Update all text elements with their corresponding translations
  for (const [id, text] of Object.entries(languageStrings[currentLanguage])) {
    const element = document.getElementById(id)
    if (element) {
      element.textContent = text
    }
  }

  // Update the Calculate button text
  const calculateButton = document.getElementById("calculateButton")
  if (calculateButton) {
    calculateButton.textContent =
      languageStrings[currentLanguage].calculateButton
  }

  // Update gender labels
  document.getElementById("femaleRadio").nextElementSibling.textContent =
    languageStrings[currentLanguage].femaleLabel
  document.getElementById("maleRadio").nextElementSibling.textContent =
    languageStrings[currentLanguage].maleLabel

  const currentYearSpan = document.getElementById("current-year")
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear()
  }
}

// Initial call to set text on page load
updateTextElements()

// Add missing calculation functions for Current and Time Period pillars
function calculateCurrentYearPillar(currentDate, fourPillarsData) {
  let year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const day = currentDate.getDate()

  // Chinese New Year boundary - before Feb 4th counts as previous year
  if (month < 2 || (month === 2 && day < 4)) {
    year -= 1
  }

  const yearOffset = year - 1984
  const yearStemIndex = yearOffset % 10
  const yearBranchIndex = yearOffset % 12

  // Get Day Master index from birth chart for 10 Gods calculation
  const dayMasterIndex = HEAVENLY_STEMS.findIndex(
    (s) => s.name === fourPillarsData.day_pillar.heavenly_stem.name
  )

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[yearStemIndex].name,
      character: HEAVENLY_STEMS[yearStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[yearBranchIndex].name,
      character: EARTHLY_BRANCHES[yearBranchIndex].character,
    },
    hidden_stems: getHiddenStemsWithTenGods(yearBranchIndex, dayMasterIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (yearStemIndex * 6 + Math.floor(yearBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(yearStemIndex + yearBranchIndex) % 12],
  }
}

function calculateCurrentLuckPillar(
  currentDate,
  fourPillarsData,
  luckPillarsData
) {
  if (!birthTimeData) {
    return {
      heavenly_stem: { name: "N/A", character: "?" },
      earthly_branch: { name: "N/A", character: "?" },
      gan_zhi: { name: "N/A", element_name: "" },
      life_cycle: "N/A",
    }
  }

  const birthDate = new Date(birthTimeData.dateTime)
  const currentAge = currentDate.getFullYear() - birthDate.getFullYear()

  const baseAge = birthTimeData.gender == 1 ? 3 : 7
  const luckPillarIndex = Math.floor((currentAge - baseAge) / 10)

  if (
    luckPillarIndex >= 0 &&
    luckPillarIndex < luckPillarsData.luck_pillars.length
  ) {
    const activeLuckPillar = luckPillarsData.luck_pillars[luckPillarIndex]

    // Calculate Nayin and 12 Phrase for Current Luck Cycle
    // Get the stem and branch indices
    const stemIndex = HEAVENLY_STEMS.findIndex(
      (s) => s.name === activeLuckPillar.heavenly_stem.name
    )
    const branchIndex = EARTHLY_BRANCHES.findIndex(
      (b) => b.name === activeLuckPillar.earthly_branch.name
    )

    // Calculate Nayin using the same formula as other pillars
    const nayinIndex = (stemIndex * 6 + Math.floor(branchIndex / 2)) % 60
    const nayinData = GANZHI_COMBINATIONS[nayinIndex]

    // Calculate 12 Phrase using the same formula as other pillars
    const phrase12 = LIFE_CYCLES[(stemIndex + branchIndex) % 12]

    return {
      heavenly_stem: activeLuckPillar.heavenly_stem,
      earthly_branch: activeLuckPillar.earthly_branch,
      hidden_stems:
        activeLuckPillar.hidden_stems || getHiddenStems(branchIndex),
      gan_zhi: nayinData, // Use calculated Nayin instead of "10-Year Cycle"
      life_cycle: phrase12, // Use calculated 12 Phrase instead of empty string
      luck_period: `${activeLuckPillar.year_start}-${activeLuckPillar.year_end}`,
    }
  }

  return {
    heavenly_stem: { name: "N/A", character: "?" },
    earthly_branch: { name: "N/A", character: "?" },
    gan_zhi: { name: "Not Active", element_name: "" },
    life_cycle: "N/A",
  }
}

function calculateYearPillar(year) {
  const yearOffset = year - 1984
  const yearStemIndex = yearOffset % 10
  const yearBranchIndex = yearOffset % 12

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[yearStemIndex].name,
      character: HEAVENLY_STEMS[yearStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[yearBranchIndex].name,
      character: EARTHLY_BRANCHES[yearBranchIndex].character,
    },
    hidden_stems: getHiddenStems(yearBranchIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (yearStemIndex * 6 + Math.floor(yearBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(yearStemIndex + yearBranchIndex) % 12],
  }
}

function calculateMonthPillar(year, month) {
  // Use same logic as calculateCurrentMonthPillar but for specific year/month
  const day = 15 // Use middle of month for calculation
  let chineseMonth

  if (month === 1) {
    chineseMonth = 12
  } else if (month === 2) {
    chineseMonth = day < 4 ? 12 : 1
  } else if (month === 3) {
    chineseMonth = day < 6 ? 1 : 2
  } else if (month === 4) {
    chineseMonth = day < 5 ? 2 : 3
  } else if (month === 5) {
    chineseMonth = day < 6 ? 3 : 4
  } else if (month === 6) {
    chineseMonth = day < 6 ? 4 : 5
  } else if (month === 7) {
    chineseMonth = day < 7 ? 5 : 6
  } else if (month === 8) {
    chineseMonth = day < 8 ? 6 : 7
  } else if (month === 9) {
    chineseMonth = day < 8 ? 7 : 8
  } else if (month === 10) {
    chineseMonth = day < 8 ? 8 : 9
  } else if (month === 11) {
    chineseMonth = day < 7 ? 9 : 10
  } else if (month === 12) {
    chineseMonth = day < 7 ? 10 : 11
  }

  let currentYear = year
  if (month < 2 || (month === 2 && day < 4)) {
    currentYear -= 1
  }

  const yearOffset = currentYear - 1984
  const yearStemIndex = yearOffset % 10
  const yearStemType = yearStemIndex % 5
  const monthStemStarts = [2, 4, 6, 8, 0]
  const monthStemBase = monthStemStarts[yearStemType]

  const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10
  const monthBranchIndex = (chineseMonth + 1) % 12

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[monthStemIndex].name,
      character: HEAVENLY_STEMS[monthStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[monthBranchIndex].name,
      character: EARTHLY_BRANCHES[monthBranchIndex].character,
    },
    hidden_stems: getHiddenStems(monthBranchIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (monthStemIndex * 6 + Math.floor(monthBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(monthStemIndex + monthBranchIndex) % 12],
  }
}

function calculateDayPillar(year, month, day) {
  const date = new Date(year, month - 1, day)
  const refDate = new Date(1900, 0, 1)
  const daysDiff = Math.floor((date - refDate) / (1000 * 60 * 60 * 24))

  const oct_20_1987 = new Date(1987, 9, 20)
  const daysToOct1987 = Math.floor(
    (oct_20_1987 - refDate) / (1000 * 60 * 60 * 24)
  )
  const targetStem = 8
  const targetBranch = 2
  const refStem = (targetStem - daysToOct1987) % 10
  const refBranch = (targetBranch - daysToOct1987) % 12

  const dayStemIndex = (refStem + daysDiff) % 10
  const dayBranchIndex = (refBranch + daysDiff) % 12

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[dayStemIndex].name,
      character: HEAVENLY_STEMS[dayStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[dayBranchIndex].name,
      character: EARTHLY_BRANCHES[dayBranchIndex].character,
    },
    hidden_stems: getHiddenStems(dayBranchIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (dayStemIndex * 6 + Math.floor(dayBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(dayStemIndex + dayBranchIndex) % 12],
  }
}

function calculateHourPillar(year, month, day, hour) {
  // First get the day pillar for this date to determine hour stem
  const dayPillar = calculateDayPillar(year, month, day)
  const dayStemIndex = HEAVENLY_STEMS.findIndex(
    (stem) => stem.name === dayPillar.heavenly_stem.name
  )

  const dayStemType = dayStemIndex % 5
  const hourStemStarts = [0, 2, 4, 6, 8]
  const hourStemBase = hourStemStarts[dayStemType]

  const hourStemIndex = (hourStemBase + hour) % 10
  const hourBranchIndex = hour

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[hourStemIndex].name,
      character: HEAVENLY_STEMS[hourStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[hourBranchIndex].name,
      character: EARTHLY_BRANCHES[hourBranchIndex].character,
    },
    hidden_stems: getHiddenStems(hourBranchIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (hourStemIndex * 6 + Math.floor(hourBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(hourStemIndex + hourBranchIndex) % 12],
  }
}

function displayFourPillars(fourPillarsData) {
  displayPillar(fourPillarsData.year_pillar, "YearPillar")
  displayPillar(fourPillarsData.month_pillar, "MonthPillar")
  displayPillar(fourPillarsData.day_pillar, "DayPillar")
  displayPillar(fourPillarsData.hour_pillar, "HourPillar")
}

function displayLuckPillars(luckPillarsData) {
  const luckPillarsDiv = document.getElementById("luckPillars")

  // Clear existing Luck Pillars
  while (luckPillarsDiv.firstChild) {
    luckPillarsDiv.removeChild(luckPillarsDiv.firstChild)
  }

  // Find current luck pillar
  const currentPillarIndex = getCurrentLuckPillar(luckPillarsData.luck_pillars)

  // Display from right to left: Pillar 1 on the right
  // We need to reverse the array AND use normal flex direction
  const pillarsArray = luckPillarsData.luck_pillars

  // Display in reverse order (last to first) so Pillar 1 appears on the right
  for (let i = pillarsArray.length - 1; i >= 0; i--) {
    const pillar = pillarsArray[i]
    const pillarDiv = document.createElement("div")
    pillarDiv.classList.add("pillar")

    // Add current period indicator
    if (i === currentPillarIndex) {
      pillarDiv.classList.add("current-period")
    }

    // Display the pillar with all information
    displayLuckPillar(pillar, pillarDiv)
    luckPillarsDiv.appendChild(pillarDiv)
  }
}

function getCurrentLuckPillar(luckPillarsData) {
  const currentYear = new Date().getFullYear()

  for (let i = 0; i < luckPillarsData.length; i++) {
    const pillar = luckPillarsData[i]
    if (currentYear >= pillar.year_start && currentYear <= pillar.year_end) {
      return i // Return the index of the current luck pillar
    }
  }

  return -1 // No current pillar found (before first or after last)
}

// Specialized function to display Luck Pillars with period labels and 12 Phrase
function displayLuckPillar(pillarData, div) {
  let heavenlyStemName = pillarData.heavenly_stem.name
  let heavenlyStemCharacter = pillarData.heavenly_stem.character
  let earthlyBranchName = pillarData.earthly_branch.name
  let earthlyBranchCharacter = pillarData.earthly_branch.character

  // Get element colors
  let heavenlyStemElement = heavenlyStemName.split(" ")[1]
  let earthlyBranchElement = branchAssociations[earthlyBranchName]

  // Calculate Nayin (same formula as other pillars)
  const stemIndex = HEAVENLY_STEMS.findIndex((s) => s.name === heavenlyStemName)
  const branchIndex = EARTHLY_BRANCHES.findIndex(
    (b) => b.name === earthlyBranchName
  )
  const nayinIndex = (stemIndex * 6 + Math.floor(branchIndex / 2)) % 60
  const nayinData = GANZHI_COMBINATIONS[nayinIndex]
  const nayinName = nayinData.name
  const nayinElement = nayinData.element_name || ""

  // Calculate 12 Phrase (same formula as other pillars)
  const phrase12 = LIFE_CYCLES[(stemIndex + branchIndex) % 12]

  // Extract Hidden Stems with 10 Gods - NEW FORMAT
  let hiddenStemsHTML = ""
  if (pillarData.hidden_stems) {
    const hiddenStems = pillarData.hidden_stems
    let stemColumns = []

    // Residual Qi (left column)
    if (hiddenStems.residual_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.residual_qi.element]}">${hiddenStems.residual_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.residual_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    // Main Qi (center column)
    if (hiddenStems.main_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.main_qi.element]}">${hiddenStems.main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.main_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    // Sub Main Qi (right column)
    if (hiddenStems.sub_main_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.sub_main_qi.element]}">${hiddenStems.sub_main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.sub_main_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    hiddenStemsHTML = `
            <div class="hidden-stems-container">
                <div class="hidden-stems-grid">
                    ${stemColumns.join("")}
                </div>
            </div>
        `
  }

  // Get pillar number and period
  const pillarNumber = pillarData.number || ""
  const yearStart = pillarData.year_start || ""
  const yearEnd = pillarData.year_end || ""
  const title = pillarNumber ? `Luck ${pillarNumber}` : "Luck Pillar"

  // Build HTML with period label at bottom - matching main pillar structure
  const pillarHTML = `
        <div class="pillar-title">${title}</div>
        <div class="pillar-value">
            <strong id="bigCharacter" style="color: ${elementColors[heavenlyStemElement]}">${heavenlyStemCharacter}</strong>
            <div id="bigValue" style="color: ${elementColors[heavenlyStemElement]}">${heavenlyStemName}</div>
        </div>
        <hr>
        <div class="pillar-value">
            <strong id="bigCharacter" style="color: ${elementColors[earthlyBranchElement]}">${earthlyBranchCharacter}</strong>
            <div id="bigValue" style="color: ${elementColors[earthlyBranchElement]}">${earthlyBranchName}</div>
        </div>
        ${hiddenStemsHTML}
        <hr>
        <div class="ganzhi-separator">
            <strong style="color: ${elementColors[nayinElement]}">${nayinName}</strong>
        </div>
        <hr>
        <div class="lifecycle-separator">
            <div id="lifeCycle">${phrase12}</div>
        </div>
        <hr>
        <div class="luck-period-label">
            <div class="luck-period-number">Period:</div>
            <div>${yearStart}-${yearEnd}</div>
        </div>
    `

  div.innerHTML = pillarHTML
}

function displayCurrentPillars(fourPillarsData, luckPillarsData) {
  const currentDate = new Date()

  // Calculate current month pillar - Use birth time Day Master for 10 Gods
  const currentMonthPillar = calculateCurrentMonthPillar(
    currentDate,
    fourPillarsData
  )
  displayPillar(currentMonthPillar, "CurrentMonthPillar")

  // Calculate current year pillar - Use birth time Day Master for 10 Gods
  const currentYearPillar = calculateCurrentYearPillar(
    currentDate,
    fourPillarsData
  )
  displayPillar(currentYearPillar, "CurrentYearPillar")

  // Calculate current 10-year luck pillar
  const currentLuckPillar = calculateCurrentLuckPillar(
    currentDate,
    fourPillarsData,
    luckPillarsData
  )
  displayPillar(currentLuckPillar, "CurrentLuckPillar")
}

function displayTimePeriodRows(fourPillarsData, luckPillarsData) {
  if (!birthTimeData) return

  const birthDate = new Date(birthTimeData.dateTime)
  const currentDate = new Date()
  const currentAge = currentDate.getFullYear() - birthDate.getFullYear()
  const baseAge = birthTimeData.gender == 1 ? 3 : 7
  const luckPillarIndex = Math.floor((currentAge - baseAge) / 10)

  if (
    luckPillarIndex >= 0 &&
    luckPillarIndex < luckPillarsData.luck_pillars.length
  ) {
    const activeLuckPillar = luckPillarsData.luck_pillars[luckPillarIndex]
    const startYear = activeLuckPillar.year_start
    const endYear = activeLuckPillar.year_end

    // Fetch year pillars for the current 10-year period from backend
    fetchAndDisplayYearPillars(startYear, endYear)

    // Fetch month pillars for the current year from backend
    fetchAndDisplayMonthPillars(currentDate.getFullYear())

    // Fetch day pillars for the current month from backend
    fetchAndDisplayDayPillars(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    )

    // Fetch hour pillars for today from backend
    fetchAndDisplayHourPillars(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    )
  }
}

function fetchAndDisplayYearPillars(startYear, endYear) {
  const requestData = {
    start_year: startYear,
    end_year: endYear,
    birth_time: birthTimeData.dateTime,
  }

  fetch("/calculate_yearly", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("yearPillarsRow")
      container.innerHTML = ""

      const yearPillars = data.yearly_pillars
      yearPillars.forEach((yearPillar, index) => {
        const pillarDiv = createTimePeriodPillar(
          yearPillar,
          yearPillar.year.toString()
        )

        // Detect both HS and Branch interactions for this year pillar
        const { hsCombos, branchInteractions } = detectTimePeriodCombinations(
          yearPillar,
          yearPillars,
          index,
          "year"
        )
        addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions)

        container.appendChild(pillarDiv)
      })
    })
    .catch((error) => console.error("Error fetching year pillars:", error))
}

function fetchAndDisplayMonthPillars(year) {
  const requestData = {
    year: year,
    birth_time: birthTimeData.dateTime,
  }

  fetch("/calculate_monthly", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("monthPillarsRow")
      container.innerHTML = ""

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]

      const monthPillars = data.monthly_pillars
      monthPillars.forEach((monthPillar, index) => {
        const pillarDiv = createTimePeriodPillar(
          monthPillar,
          monthNames[index] || monthPillar.month_english
        )

        // Detect both HS and Branch interactions for this month pillar
        const { hsCombos, branchInteractions } = detectTimePeriodCombinations(
          monthPillar,
          monthPillars,
          index,
          "month"
        )
        addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions)

        container.appendChild(pillarDiv)
      })
    })
    .catch((error) => console.error("Error fetching month pillars:", error))
}

function fetchAndDisplayDayPillars(year, month) {
  const requestData = {
    year: year,
    month: month,
    birth_time: birthTimeData.dateTime,
  }

  fetch("/calculate_daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("dayPillarsRow")
      container.innerHTML = ""

      const dayPillars = data.daily_pillars
      dayPillars.forEach((dayPillar, index) => {
        const pillarDiv = createTimePeriodPillar(
          dayPillar,
          dayPillar.day.toString()
        )

        // Detect both HS and Branch interactions for this day pillar
        const { hsCombos, branchInteractions } = detectTimePeriodCombinations(
          dayPillar,
          dayPillars,
          index,
          "day"
        )
        addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions)

        container.appendChild(pillarDiv)
      })
    })
    .catch((error) => console.error("Error fetching day pillars:", error))
}

function fetchAndDisplayHourPillars(year, month, day) {
  const requestData = {
    year: year,
    month: month,
    day: day,
    birth_time: birthTimeData.dateTime,
  }

  fetch("/calculate_hourly", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("hourPillarsRow")
      container.innerHTML = ""

      const hourTimes = [
        "23-01",
        "01-03",
        "03-05",
        "05-07",
        "07-09",
        "09-11",
        "11-13",
        "13-15",
        "15-17",
        "17-19",
        "19-21",
        "21-23",
      ]

      const hourPillars = data.hourly_pillars
      hourPillars.forEach((hourPillar, index) => {
        const pillarDiv = createTimePeriodPillar(
          hourPillar,
          hourTimes[index] || hourPillar.hour_time
        )

        // Detect both HS and Branch interactions for this hour pillar
        const { hsCombos, branchInteractions } = detectTimePeriodCombinations(
          hourPillar,
          hourPillars,
          index,
          "hour"
        )
        addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions)

        container.appendChild(pillarDiv)
      })
    })
    .catch((error) => console.error("Error fetching hour pillars:", error))
}

function createTimePeriodPillar(pillarData, title) {
  const div = document.createElement("div")
  div.className = "time-period-pillar"

  const heavenlyStemElement = pillarData.heavenly_stem.name.split(" ")[1]
  const earthlyBranchElement =
    branchAssociations[pillarData.earthly_branch.name]
  const ganZhiName = pillarData.gan_zhi ? pillarData.gan_zhi.name : "N/A"
  const ganZhiElement = pillarData.gan_zhi
    ? pillarData.gan_zhi.element_name
    : ""
  const lifeCycleName = pillarData.life_cycle || ""

  // Extract Hidden Stems with 10 Gods - NEW FORMAT
  let hiddenStemsHTML = ""
  if (pillarData.hidden_stems) {
    const hiddenStems = pillarData.hidden_stems
    let stemColumns = []

    // Residual Qi (left column)
    if (hiddenStems.residual_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.residual_qi.element]}">${hiddenStems.residual_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.residual_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    // Main Qi (center column)
    if (hiddenStems.main_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.main_qi.element]}">${hiddenStems.main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.main_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    // Sub Main Qi (right column)
    if (hiddenStems.sub_main_qi) {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: ${elementColors[hiddenStems.sub_main_qi.element]}">${hiddenStems.sub_main_qi.character}</div>
                    <div class="ten-gods-label">${hiddenStems.sub_main_qi.ten_gods || "--"}</div>
                </div>
            `)
    } else {
      stemColumns.push(`
                <div class="hidden-stem-column">
                    <div class="hidden-stem-char" style="color: #ccc">-</div>
                    <div class="ten-gods-label">-</div>
                </div>
            `)
    }

    hiddenStemsHTML = `
            <div class="hidden-stems-container">
                <div class="hidden-stems-grid">
                    ${stemColumns.join("")}
                </div>
            </div>
        `
  }

  // Build HTML with grid structure matching main pillars
  div.innerHTML = `
        <div class="pillar-title">${title}</div>
        <div class="pillar-value">
            <strong class="bigCharacter" style="color: ${elementColors[heavenlyStemElement]}">${pillarData.heavenly_stem.character}</strong>
            <div class="bigValue" style="color: ${elementColors[heavenlyStemElement]}">${pillarData.heavenly_stem.name}</div>
        </div>
        <hr>
        <div class="pillar-value">
            <strong class="bigCharacter" style="color: ${elementColors[earthlyBranchElement]}">${pillarData.earthly_branch.character}</strong>
            <div class="bigValue" style="color: ${elementColors[earthlyBranchElement]}">${pillarData.earthly_branch.name}</div>
        </div>
        ${hiddenStemsHTML}
        <hr>
        <div class="ganzhi-separator">
            <strong style="color: ${elementColors[ganZhiElement]}">${ganZhiName}</strong>
        </div>
        <hr>
        <div class="lifecycle-separator">
            <div class="lifeCycle">${lifeCycleName}</div>
        </div>
    `

  return div
}

function calculateCurrentMonthPillar(currentDate, fourPillarsData) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1 // JavaScript months are 0-based
  const day = currentDate.getDate()

  // Get Chinese solar month (same logic as in Python backend)
  let chineseMonth
  if (month === 1) {
    chineseMonth = 12 // January is always 丑月 (Ox month) until 立春
  } else if (month === 2) {
    chineseMonth = day < 4 ? 12 : 1 // 立春 around Feb 4 starts 寅月 (Tiger month)
  } else if (month === 3) {
    chineseMonth = day < 6 ? 1 : 2 // 驚蟄 around Mar 6 starts 卯月 (Rabbit month)
  } else if (month === 4) {
    chineseMonth = day < 5 ? 2 : 3 // 清明 around Apr 5 starts 辰月 (Dragon month)
  } else if (month === 5) {
    chineseMonth = day < 6 ? 3 : 4 // 立夏 around May 6 starts 巳月 (Snake month)
  } else if (month === 6) {
    chineseMonth = day < 6 ? 4 : 5 // 芒种 around Jun 6 starts 午月 (Horse month)
  } else if (month === 7) {
    chineseMonth = day < 7 ? 5 : 6 // 小暑 around Jul 7 starts 未月 (Goat month)
  } else if (month === 8) {
    chineseMonth = day < 8 ? 6 : 7 // 立秋 around Aug 8 starts 申月 (Monkey month)
  } else if (month === 9) {
    chineseMonth = day < 8 ? 7 : 8 // 白露 around Sep 8 starts 酉月 (Rooster month)
  } else if (month === 10) {
    chineseMonth = day < 8 ? 8 : 9 // 寒露 around Oct 8 starts 戌月 (Dog month)
  } else if (month === 11) {
    chineseMonth = day < 7 ? 9 : 10 // 立冬 around Nov 7 starts 亥月 (Pig month)
  } else if (month === 12) {
    chineseMonth = day < 7 ? 10 : 11 // 大雪 around Dec 7 starts 子月 (Rat month)
  }

  // Calculate year stem for month stem calculation
  let currentYear = year
  if (month < 2 || (month === 2 && day < 4)) {
    currentYear -= 1 // Before Chinese New Year
  }

  const yearOffset = currentYear - 1984
  const yearStemIndex = yearOffset % 10
  const yearStemType = yearStemIndex % 5
  const monthStemStarts = [2, 4, 6, 8, 0] // 丙, 戊, 庚, 壬, 甲
  const monthStemBase = monthStemStarts[yearStemType]

  const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10
  const monthBranchIndex = (chineseMonth + 1) % 12

  // Get Day Master index from birth chart for 10 Gods calculation
  const dayMasterIndex = HEAVENLY_STEMS.findIndex(
    (s) => s.name === fourPillarsData.day_pillar.heavenly_stem.name
  )

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[monthStemIndex].name,
      character: HEAVENLY_STEMS[monthStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[monthBranchIndex].name,
      character: EARTHLY_BRANCHES[monthBranchIndex].character,
    },
    hidden_stems: getHiddenStemsWithTenGods(monthBranchIndex, dayMasterIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (monthStemIndex * 6 + Math.floor(monthBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(monthStemIndex + monthBranchIndex) % 12],
  }
}

function calculateCurrentLuckPillar(
  currentDate,
  fourPillarsData,
  luckPillarsData
) {
  if (!birthTimeData) {
    // Fallback if birth data not available
    return {
      heavenly_stem: { name: "N/A", character: "?" },
      earthly_branch: { name: "N/A", character: "?" },
      gan_zhi: { name: "N/A", element_name: "" },
      life_cycle: "N/A",
    }
  }

  const birthDate = new Date(birthTimeData.dateTime)
  const currentAge = currentDate.getFullYear() - birthDate.getFullYear()

  // Determine which luck pillar is active
  const baseAge = birthTimeData.gender == 1 ? 3 : 7
  const luckPillarIndex = Math.floor((currentAge - baseAge) / 10)

  if (
    luckPillarIndex >= 0 &&
    luckPillarIndex < luckPillarsData.luck_pillars.length
  ) {
    const activeLuckPillar = luckPillarsData.luck_pillars[luckPillarIndex]

    // Get stem and branch indices for calculations
    const stemIndex = HEAVENLY_STEMS.findIndex(
      (s) => s.name === activeLuckPillar.heavenly_stem.name
    )
    const branchIndex = EARTHLY_BRANCHES.findIndex(
      (b) => b.name === activeLuckPillar.earthly_branch.name
    )

    // Calculate Nayin (same formula as in displayLuckPillar)
    const nayinIndex = (stemIndex * 6 + Math.floor(branchIndex / 2)) % 60
    const nayinData = GANZHI_COMBINATIONS[nayinIndex]

    // Calculate 12 Phrase (same formula as in displayLuckPillar)
    const phrase12 = LIFE_CYCLES[(stemIndex + branchIndex) % 12]

    return {
      heavenly_stem: activeLuckPillar.heavenly_stem,
      earthly_branch: activeLuckPillar.earthly_branch,
      hidden_stems:
        activeLuckPillar.hidden_stems || getHiddenStems(branchIndex),
      gan_zhi: activeLuckPillar.gan_zhi || nayinData,
      life_cycle: phrase12,
      luck_period: `${activeLuckPillar.year_start}-${activeLuckPillar.year_end}`,
    }
  }

  // If no active luck pillar found
  return {
    heavenly_stem: { name: "N/A", character: "?" },
    earthly_branch: { name: "N/A", character: "?" },
    gan_zhi: { name: "Not Active", element_name: "" },
    life_cycle: "N/A",
  }
}

function calculateYearPillar(year) {
  // Chinese New Year boundary - before Feb 4th counts as previous year
  const yearOffset = year - 1984
  const yearStemIndex = yearOffset % 10
  const yearBranchIndex = yearOffset % 12

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[yearStemIndex].name,
      character: HEAVENLY_STEMS[yearStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[yearBranchIndex].name,
      character: EARTHLY_BRANCHES[yearBranchIndex].character,
    },
    hidden_stems: getHiddenStems(yearBranchIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (yearStemIndex * 6 + Math.floor(yearBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(yearStemIndex + yearBranchIndex) % 12],
  }
}

function calculateMonthPillar(year, month) {
  // Get Chinese solar month (same logic as in calculateCurrentMonthPillar)
  const day = 15 // Use middle of month for consistency
  let chineseMonth
  if (month === 1) {
    chineseMonth = 12
  } else if (month === 2) {
    chineseMonth = day < 4 ? 12 : 1
  } else if (month === 3) {
    chineseMonth = day < 6 ? 1 : 2
  } else if (month === 4) {
    chineseMonth = day < 5 ? 2 : 3
  } else if (month === 5) {
    chineseMonth = day < 6 ? 3 : 4
  } else if (month === 6) {
    chineseMonth = day < 6 ? 4 : 5
  } else if (month === 7) {
    chineseMonth = day < 7 ? 5 : 6
  } else if (month === 8) {
    chineseMonth = day < 8 ? 6 : 7
  } else if (month === 9) {
    chineseMonth = day < 8 ? 7 : 8
  } else if (month === 10) {
    chineseMonth = day < 8 ? 8 : 9
  } else if (month === 11) {
    chineseMonth = day < 7 ? 9 : 10
  } else if (month === 12) {
    chineseMonth = day < 7 ? 10 : 11
  }

  const yearOffset = year - 1984
  const yearStemIndex = yearOffset % 10
  const yearStemType = yearStemIndex % 5
  const monthStemStarts = [2, 4, 6, 8, 0]
  const monthStemBase = monthStemStarts[yearStemType]

  const monthStemIndex = (monthStemBase + chineseMonth - 1) % 10
  const monthBranchIndex = (chineseMonth + 1) % 12

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[monthStemIndex].name,
      character: HEAVENLY_STEMS[monthStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[monthBranchIndex].name,
      character: EARTHLY_BRANCHES[monthBranchIndex].character,
    },
    hidden_stems: getHiddenStems(monthBranchIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (monthStemIndex * 6 + Math.floor(monthBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(monthStemIndex + monthBranchIndex) % 12],
  }
}

function calculateDayPillar(year, month, day) {
  const date = new Date(year, month - 1, day)
  const refDate = new Date(1900, 0, 1)
  const daysDiff = Math.floor((date - refDate) / (1000 * 60 * 60 * 24))

  const oct_20_1987 = new Date(1987, 9, 20)
  const daysToOct1987 = Math.floor(
    (oct_20_1987 - refDate) / (1000 * 60 * 60 * 24)
  )
  const targetStem = 8
  const targetBranch = 2
  const refStem = (targetStem - daysToOct1987) % 10
  const refBranch = (targetBranch - daysToOct1987) % 12

  const dayStemIndex = (refStem + daysDiff) % 10
  const dayBranchIndex = (refBranch + daysDiff) % 12

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[dayStemIndex].name,
      character: HEAVENLY_STEMS[dayStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[dayBranchIndex].name,
      character: EARTHLY_BRANCHES[dayBranchIndex].character,
    },
    hidden_stems: getHiddenStems(dayBranchIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (dayStemIndex * 6 + Math.floor(dayBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(dayStemIndex + dayBranchIndex) % 12],
  }
}

function calculateHourPillar(year, month, day, hourIndex) {
  const dayPillar = calculateDayPillar(year, month, day)
  const dayStemIndex = HEAVENLY_STEMS.findIndex(
    (stem) => stem.name === dayPillar.heavenly_stem.name
  )
  const dayStemType = dayStemIndex % 5
  const hourStemStarts = [0, 2, 4, 6, 8]
  const hourStemBase = hourStemStarts[dayStemType]

  const hourStemIndex = (hourStemBase + hourIndex) % 10
  const hourBranchIndex = hourIndex

  return {
    heavenly_stem: {
      name: HEAVENLY_STEMS[hourStemIndex].name,
      character: HEAVENLY_STEMS[hourStemIndex].character,
    },
    earthly_branch: {
      name: EARTHLY_BRANCHES[hourBranchIndex].name,
      character: EARTHLY_BRANCHES[hourBranchIndex].character,
    },
    hidden_stems: getHiddenStems(hourBranchIndex),
    gan_zhi:
      GANZHI_COMBINATIONS[
        (hourStemIndex * 6 + Math.floor(hourBranchIndex / 2)) % 60
      ],
    life_cycle: LIFE_CYCLES[(hourStemIndex + hourBranchIndex) % 12],
  }
}

// Constants for current pillar calculations
const HEAVENLY_STEMS = [
  { name: "Yang Wood", character: "甲", element: "Wood" },
  { name: "Yin Wood", character: "乙", element: "Wood" },
  { name: "Yang Fire", character: "丙", element: "Fire" },
  { name: "Yin Fire", character: "丁", element: "Fire" },
  { name: "Yang Earth", character: "戊", element: "Earth" },
  { name: "Yin Earth", character: "己", element: "Earth" },
  { name: "Yang Metal", character: "庚", element: "Metal" },
  { name: "Yin Metal", character: "辛", element: "Metal" },
  { name: "Yang Water", character: "壬", element: "Water" },
  { name: "Yin Water", character: "癸", element: "Water" },
]

const EARTHLY_BRANCHES = [
  { name: "Rat", character: "子", element: "Water" },
  { name: "Ox", character: "丑", element: "Earth" },
  { name: "Tiger", character: "寅", element: "Wood" },
  { name: "Rabbit", character: "卯", element: "Wood" },
  { name: "Dragon", character: "辰", element: "Earth" },
  { name: "Snake", character: "巳", element: "Fire" },
  { name: "Horse", character: "午", element: "Fire" },
  { name: "Goat", character: "未", element: "Earth" },
  { name: "Monkey", character: "申", element: "Metal" },
  { name: "Rooster", character: "酉", element: "Metal" },
  { name: "Dog", character: "戌", element: "Earth" },
  { name: "Pig", character: "亥", element: "Water" },
]

const GANZHI_COMBINATIONS = [
  { name: "Sea metal", element_name: "Metal" },
  { name: "Furnace fire", element_name: "Fire" },
  { name: "Forest wood", element_name: "Wood" },
  { name: "Road earth", element_name: "Earth" },
  { name: "Sword metal", element_name: "Metal" },
  { name: "Volcanic fire", element_name: "Fire" },
  { name: "Cave water", element_name: "Water" },
  { name: "Fortress earth", element_name: "Earth" },
  { name: "Wax metal", element_name: "Metal" },
  { name: "Willow wood", element_name: "Wood" },
  { name: "Stream water", element_name: "Water" },
  { name: "Roof tiles earth", element_name: "Earth" },
  { name: "Lightning fire", element_name: "Fire" },
  { name: "Conifer wood", element_name: "Wood" },
  { name: "River water", element_name: "Water" },
  { name: "Sand metal", element_name: "Metal" },
  { name: "Forest fire", element_name: "Fire" },
  { name: "Meadow wood", element_name: "Wood" },
  { name: "Adobe earth", element_name: "Earth" },
  { name: "Precious metal", element_name: "Metal" },
  { name: "Lamp fire", element_name: "Fire" },
  { name: "Sky water", element_name: "Water" },
  { name: "Highway earth", element_name: "Earth" },
  { name: "Jewellery metal", element_name: "Metal" },
  { name: "Mulberry wood", element_name: "Wood" },
  { name: "Rapids water", element_name: "Water" },
  { name: "Desert earth", element_name: "Earth" },
  { name: "Sun fire", element_name: "Fire" },
  { name: "Pomegranate wood", element_name: "Wood" },
  { name: "Ocean water", element_name: "Water" },
  { name: "Sea metal", element_name: "Metal" },
  { name: "Furnace fire", element_name: "Fire" },
  { name: "Forest wood", element_name: "Wood" },
  { name: "Road earth", element_name: "Earth" },
  { name: "Sword metal", element_name: "Metal" },
  { name: "Volcanic fire", element_name: "Fire" },
  { name: "Cave water", element_name: "Water" },
  { name: "Fortress earth", element_name: "Earth" },
  { name: "Wax metal", element_name: "Metal" },
  { name: "Willow wood", element_name: "Wood" },
  { name: "Stream water", element_name: "Water" },
  { name: "Roof tiles earth", element_name: "Earth" },
  { name: "Lightning fire", element_name: "Fire" },
  { name: "Conifer wood", element_name: "Wood" },
  { name: "River water", element_name: "Water" },
  { name: "Sand metal", element_name: "Metal" },
  { name: "Forest fire", element_name: "Fire" },
  { name: "Meadow wood", element_name: "Wood" },
  { name: "Adobe earth", element_name: "Earth" },
  { name: "Precious metal", element_name: "Metal" },
  { name: "Lamp fire", element_name: "Fire" },
  { name: "Sky water", element_name: "Water" },
  { name: "Highway earth", element_name: "Earth" },
  { name: "Jewellery metal", element_name: "Metal" },
  { name: "Mulberry wood", element_name: "Wood" },
  { name: "Rapids water", element_name: "Water" },
  { name: "Desert earth", element_name: "Earth" },
  { name: "Sun fire", element_name: "Fire" },
  { name: "Pomegranate wood", element_name: "Wood" },
  { name: "Ocean water", element_name: "Water" },
]

const LIFE_CYCLES = [
  "Birth",
  "Bath",
  "Youth",
  "Thriving",
  "Prosperous",
  "Weakening",
  "Sick",
  "Death",
  "Grave",
  "Extinction",
  "Conceived",
  "Nourishing",
]

// ============================================
// HEAVENLY STEM COMBINATIONS (合化)
// ============================================

// Heavenly Stem Combination Pairs
const HS_COMBINATIONS = [
  { stems: [0, 5], element: "Earth", name: "Jia-Ji Combine to Earth" }, // 甲+己 → Earth
  { stems: [1, 6], element: "Metal", name: "Yi-Geng Combine to Metal" }, // 乙+庚 → Metal
  { stems: [2, 7], element: "Water", name: "Bing-Xin Combine to Water" }, // 丙+辛 → Water
  { stems: [3, 8], element: "Wood", name: "Ding-Ren Combine to Wood" }, // 丁+壬 → Wood
  { stems: [4, 9], element: "Fire", name: "Wu-Gui Combine to Fire" }, // 戊+癸 → Fire
]

// ============================================
// SAN HUI (三會) / SEASONAL UNION - EARTHLY BRANCHES
// ============================================

// Seasonal Union Combinations (3 branches forming a season)
const SEASONAL_UNIONS = [
  {
    branches: [2, 3, 4], // Tiger (寅), Rabbit (卯), Dragon (辰)
    season: "Spring",
    element: "Wood",
    name: "Spring Wood Union",
    icon: "🌿",
  },
  {
    branches: [5, 6, 7], // Snake (巳), Horse (午), Goat (未)
    season: "Summer",
    element: "Fire",
    name: "Summer Fire Union",
    icon: "🔥",
  },
  {
    branches: [8, 9, 10], // Monkey (申), Rooster (酉), Dog (戌)
    season: "Autumn",
    element: "Metal",
    name: "Autumn Metal Union",
    icon: "🌾",
  },
  {
    branches: [11, 0, 1], // Pig (亥), Rat (子), Ox (丑)
    season: "Winter",
    element: "Water",
    name: "Winter Water Union",
    icon: "💧",
  },
]

// ============================================
// SAN HE (三合) / THREE HARMONIES
// ============================================

const THREE_HARMONIES = [
  {
    branches: [8, 0, 4], // Monkey (申), Rat (子), Dragon (辰)
    element: "Water",
    name: "Water Harmony",
    icon: "💧",
  },
  {
    branches: [11, 3, 7], // Pig (亥), Rabbit (卯), Goat (未)
    element: "Wood",
    name: "Wood Harmony",
    icon: "🌿",
  },
  {
    branches: [2, 6, 10], // Tiger (寅), Horse (午), Dog (戌)
    element: "Fire",
    name: "Fire Harmony",
    icon: "🔥",
  },
  {
    branches: [5, 9, 1], // Snake (巳), Rooster (酉), Ox (丑)
    element: "Metal",
    name: "Metal Harmony",
    icon: "🌾",
  },
]

// ============================================
// BAN HE (半合) / HALF COMBINATION
// ============================================

const HALF_COMBINATIONS = [
  { pair: [8, 0], element: "Water", name: "Water Half Combo", icon: "💧" }, // Monkey-Rat
  { pair: [0, 4], element: "Water", name: "Water Half Combo", icon: "💧" }, // Rat-Dragon
  { pair: [11, 3], element: "Wood", name: "Wood Half Combo", icon: "🌿" }, // Pig-Rabbit
  { pair: [3, 7], element: "Wood", name: "Wood Half Combo", icon: "🌿" }, // Rabbit-Goat
  { pair: [2, 6], element: "Fire", name: "Fire Half Combo", icon: "🔥" }, // Tiger-Horse
  { pair: [6, 10], element: "Fire", name: "Fire Half Combo", icon: "🔥" }, // Horse-Dog
  { pair: [5, 9], element: "Metal", name: "Metal Half Combo", icon: "🌾" }, // Snake-Rooster
  { pair: [9, 1], element: "Metal", name: "Metal Half Combo", icon: "🌾" }, // Rooster-Ox
]

// ============================================
// LIU HE (六合) / SIX HARMONIES
// ============================================

const SIX_HARMONIES = [
  { pair: [0, 1], element: "Earth", name: "Rat-Ox Harmony", icon: "🐀🐂" }, // Zi-Chou
  { pair: [2, 11], element: "Wood", name: "Tiger-Pig Harmony", icon: "🐅🐖" }, // Yin-Hai
  { pair: [3, 10], element: "Fire", name: "Rabbit-Dog Harmony", icon: "🐇🐕" }, // Mao-Xu
  {
    pair: [4, 9],
    element: "Metal",
    name: "Dragon-Rooster Harmony",
    icon: "🐉🐔",
  }, // Chen-You
  {
    pair: [5, 8],
    element: "Water",
    name: "Snake-Monkey Harmony",
    icon: "🐍🐒",
  }, // Si-Shen
  { pair: [6, 7], element: "Fire", name: "Horse-Goat Harmony", icon: "🐎🐐" }, // Wu-Wei
]

// ============================================
// XING (刑) / PUNISHMENTS
// ============================================

// Wu En Zhi Xing (无恩之刑) / Ungrateful Punishment
const UNGRATEFUL_PUNISHMENT = [
  { branches: [2, 5, 8], name: "Ungrateful Punishment", icon: "⚠️" }, // Yin-Si-Shen
]

// Chi Shi Zhi Xing (持势之刑) / Arrogant Punishment
const ARROGANT_PUNISHMENT = [
  { branches: [7, 10, 1], name: "Arrogant Punishment", icon: "⚠️" }, // Wei-Xu-Chou
]

// Wu Li Zhi Xing (无礼之刑) / Rude Punishment
const RUDE_PUNISHMENT = [
  { pair: [0, 3], name: "Rude Punishment", icon: "⚠️" }, // Zi-Mao
]

// Zi Xing (自刑) / Self Punishment
const SELF_PUNISHMENT = [
  { branch: 4, name: "Self Punishment", icon: "⚠️" }, // Chen-Chen
  { branch: 6, name: "Self Punishment", icon: "⚠️" }, // Wu-Wu
  { branch: 9, name: "Self Punishment", icon: "⚠️" }, // You-You
  { branch: 11, name: "Self Punishment", icon: "⚠️" }, // Hai-Hai
]

// ============================================
// LIU CHONG (六冲) / SIX CLASHES
// ============================================

const SIX_CLASHES = [
  { pair: [0, 6], name: "Rat-Horse Clash", icon: "💥" }, // Zi-Wu
  { pair: [1, 7], name: "Ox-Goat Clash", icon: "💥" }, // Chou-Wei
  { pair: [2, 8], name: "Tiger-Monkey Clash", icon: "💥" }, // Yin-Shen
  { pair: [3, 9], name: "Rabbit-Rooster Clash", icon: "💥" }, // Mao-You
  { pair: [4, 10], name: "Dragon-Dog Clash", icon: "💥" }, // Chen-Xu
  { pair: [5, 11], name: "Snake-Pig Clash", icon: "💥" }, // Si-Hai
]

// ============================================
// XIANG PO (相破) /破 DESTRUCTION
// ============================================

const DESTRUCTIONS = [
  { pair: [0, 9], name: "Rat-Rooster Break", icon: "💔" }, // Zi-You
  { pair: [1, 4], name: "Ox-Dragon Break", icon: "💔" }, // Chou-Chen
  { pair: [2, 11], name: "Tiger-Pig Break", icon: "💔" }, // Yin-Hai
  { pair: [3, 6], name: "Rabbit-Horse Break", icon: "💔" }, // Mao-Wu
  { pair: [5, 8], name: "Snake-Monkey Break", icon: "💔" }, // Si-Shen
  { pair: [7, 10], name: "Goat-Dog Break", icon: "💔" }, // Wei-Xu
]

// ============================================
// XIANG HAI (相害) / SIX HARMS
// ============================================

const SIX_HARMS = [
  { pair: [0, 7], name: "Rat-Goat Harm", icon: "☠️" }, // Zi-Wei
  { pair: [1, 6], name: "Ox-Horse Harm", icon: "☠️" }, // Chou-Wu
  { pair: [2, 5], name: "Tiger-Snake Harm", icon: "☠️" }, // Yin-Si
  { pair: [3, 4], name: "Rabbit-Dragon Harm", icon: "☠️" }, // Mao-Chen
  { pair: [8, 11], name: "Monkey-Pig Harm", icon: "☠️" }, // Shen-Hai
  { pair: [9, 10], name: "Rooster-Dog Harm", icon: "☠️" }, // You-Xu
]

// Check if two branches can form part of a seasonal union
function canFormSeasonalUnion(branch1Index, branch2Index) {
  for (const union of SEASONAL_UNIONS) {
    if (
      union.branches.includes(branch1Index) &&
      union.branches.includes(branch2Index)
    ) {
      return union
    }
  }
  return null
}

// Check San He / Three Harmonies
function canFormThreeHarmony(branch1Index, branch2Index) {
  for (const harmony of THREE_HARMONIES) {
    if (
      harmony.branches.includes(branch1Index) &&
      harmony.branches.includes(branch2Index)
    ) {
      return harmony
    }
  }
  return null
}

// Check Ban He / Half Combination
function canFormHalfCombination(branch1Index, branch2Index) {
  for (const half of HALF_COMBINATIONS) {
    if (
      (half.pair[0] === branch1Index && half.pair[1] === branch2Index) ||
      (half.pair[1] === branch1Index && half.pair[0] === branch2Index)
    ) {
      return half
    }
  }
  return null
}

// Check Liu He / Six Harmonies
function canFormSixHarmony(branch1Index, branch2Index) {
  for (const harmony of SIX_HARMONIES) {
    if (
      (harmony.pair[0] === branch1Index && harmony.pair[1] === branch2Index) ||
      (harmony.pair[1] === branch1Index && harmony.pair[0] === branch2Index)
    ) {
      return harmony
    }
  }
  return null
}

// Check Ungrateful Punishment
function canFormUngratefulPunishment(branch1Index, branch2Index) {
  const branches = UNGRATEFUL_PUNISHMENT[0].branches
  if (branches.includes(branch1Index) && branches.includes(branch2Index)) {
    return UNGRATEFUL_PUNISHMENT[0]
  }
  return null
}

// Check Arrogant Punishment
function canFormArrogantPunishment(branch1Index, branch2Index) {
  const branches = ARROGANT_PUNISHMENT[0].branches
  if (branches.includes(branch1Index) && branches.includes(branch2Index)) {
    return ARROGANT_PUNISHMENT[0]
  }
  return null
}

// Check Rude Punishment
function canFormRudePunishment(branch1Index, branch2Index) {
  const pair = RUDE_PUNISHMENT[0].pair
  if (
    (pair[0] === branch1Index && pair[1] === branch2Index) ||
    (pair[1] === branch1Index && pair[0] === branch2Index)
  ) {
    return RUDE_PUNISHMENT[0]
  }
  return null
}

// Check Self Punishment (same branch appears twice)
function canFormSelfPunishment(branch1Index, branch2Index) {
  if (branch1Index === branch2Index) {
    for (const punishment of SELF_PUNISHMENT) {
      if (punishment.branch === branch1Index) {
        return punishment
      }
    }
  }
  return null
}

// Check Liu Chong / Six Clashes
function canFormClash(branch1Index, branch2Index) {
  for (const clash of SIX_CLASHES) {
    if (
      (clash.pair[0] === branch1Index && clash.pair[1] === branch2Index) ||
      (clash.pair[1] === branch1Index && clash.pair[0] === branch2Index)
    ) {
      return clash
    }
  }
  return null
}

// Check Xiang Po / Destruction
function canFormDestruction(branch1Index, branch2Index) {
  for (const destruction of DESTRUCTIONS) {
    if (
      (destruction.pair[0] === branch1Index &&
        destruction.pair[1] === branch2Index) ||
      (destruction.pair[1] === branch1Index &&
        destruction.pair[0] === branch2Index)
    ) {
      return destruction
    }
  }
  return null
}

// Check Xiang Hai / Six Harms
function canFormHarm(branch1Index, branch2Index) {
  for (const harm of SIX_HARMS) {
    if (
      (harm.pair[0] === branch1Index && harm.pair[1] === branch2Index) ||
      (harm.pair[1] === branch1Index && harm.pair[0] === branch2Index)
    ) {
      return harm
    }
  }
  return null
}

// Get combination info between two stems
function getHSCombination(stem1Index, stem2Index) {
  for (const combo of HS_COMBINATIONS) {
    if (
      (combo.stems[0] === stem1Index && combo.stems[1] === stem2Index) ||
      (combo.stems[1] === stem1Index && combo.stems[0] === stem2Index)
    ) {
      return combo
    }
  }
  return null
}

// Detect all Heavenly Stem combinations in the chart
function detectAllHSCombinations(fourPillars, currentPillars) {
  const allPillars = [
    { name: "H", stem: fourPillars.hour_pillar.heavenly_stem },
    { name: "D", stem: fourPillars.day_pillar.heavenly_stem },
    { name: "M", stem: fourPillars.month_pillar.heavenly_stem },
    { name: "Y", stem: fourPillars.year_pillar.heavenly_stem },
    { name: "CL", stem: currentPillars.luck.heavenly_stem },
    { name: "CY", stem: currentPillars.year.heavenly_stem },
    { name: "CM", stem: currentPillars.month.heavenly_stem },
  ]

  const combinations = {}

  // Initialize empty arrays for each pillar
  allPillars.forEach((p) => {
    combinations[p.name] = []
  })

  // Check all pairs
  for (let i = 0; i < allPillars.length; i++) {
    for (let j = i + 1; j < allPillars.length; j++) {
      const pillar1 = allPillars[i]
      const pillar2 = allPillars[j]

      const stem1Index = HEAVENLY_STEMS.findIndex(
        (s) => s.name === pillar1.stem.name
      )
      const stem2Index = HEAVENLY_STEMS.findIndex(
        (s) => s.name === pillar2.stem.name
      )

      const combo = getHSCombination(stem1Index, stem2Index)
      if (combo) {
        combinations[pillar1.name].push({ partner: pillar2.name, combo: combo })
        combinations[pillar2.name].push({ partner: pillar1.name, combo: combo })
      }
    }
  }

  return combinations
}

// Format combination label for display
function formatHSComboLabel(combos) {
  if (!combos || combos.length === 0) return ""

  const labels = combos.map((c) => c.partner).join(", ")
  return `HS Combo ${labels}`
}

// Detect all Earthly Branch interactions in the chart
function detectAllBranchInteractions(fourPillars, currentPillars) {
  const allPillars = [
    { name: "H", branch: fourPillars.hour_pillar.earthly_branch },
    { name: "D", branch: fourPillars.day_pillar.earthly_branch },
    { name: "M", branch: fourPillars.month_pillar.earthly_branch },
    { name: "Y", branch: fourPillars.year_pillar.earthly_branch },
    { name: "CL", branch: currentPillars.luck.earthly_branch },
    { name: "CY", branch: currentPillars.year.earthly_branch },
    { name: "CM", branch: currentPillars.month.earthly_branch },
  ]

  const interactions = {}

  // Initialize empty arrays for each pillar
  allPillars.forEach((p) => {
    interactions[p.name] = []
  })

  // Check all pairs for ALL types of interactions
  for (let i = 0; i < allPillars.length; i++) {
    for (let j = i + 1; j < allPillars.length; j++) {
      const pillar1 = allPillars[i]
      const pillar2 = allPillars[j]

      const branch1Index = EARTHLY_BRANCHES.findIndex(
        (b) => b.name === pillar1.branch.name
      )
      const branch2Index = EARTHLY_BRANCHES.findIndex(
        (b) => b.name === pillar2.branch.name
      )

      // Check all interaction types
      const checks = [
        { func: canFormSeasonalUnion, type: "seasonal" },
        { func: canFormThreeHarmony, type: "sanhe" },
        { func: canFormHalfCombination, type: "banhe" },
        { func: canFormSixHarmony, type: "liuhe" },
        { func: canFormUngratefulPunishment, type: "ungrateful" },
        { func: canFormArrogantPunishment, type: "arrogant" },
        { func: canFormRudePunishment, type: "rude" },
        { func: canFormSelfPunishment, type: "self" },
        { func: canFormClash, type: "clash" },
        { func: canFormDestruction, type: "destruction" },
        { func: canFormHarm, type: "harm" },
      ]

      checks.forEach((check) => {
        const result = check.func(branch1Index, branch2Index)
        if (result) {
          interactions[pillar1.name].push({
            partner: pillar2.name,
            interaction: result,
            type: check.type,
          })
          interactions[pillar2.name].push({
            partner: pillar1.name,
            interaction: result,
            type: check.type,
          })
        }
      })
    }
  }

  return interactions
}

// Format seasonal union label for display
function formatSeasonalLabel(combos) {
  if (!combos || combos.length === 0) return ""

  const labels = combos.map((c) => c.partner).join(", ")
  return `${combos[0].union.icon} Seasonal ${labels}`
}

// Format branch interaction labels by type
function formatBranchInteractionLabels(interactions) {
  if (!interactions || interactions.length === 0) return []

  // Group by type
  const grouped = {}
  interactions.forEach((interaction) => {
    if (!grouped[interaction.type]) {
      grouped[interaction.type] = []
    }
    grouped[interaction.type].push(interaction)
  })

  // Format labels
  const labels = []

  // Positive interactions (order matters for display)
  const positiveTypes = ["seasonal", "sanhe", "banhe", "liuhe"]
  positiveTypes.forEach((type) => {
    if (grouped[type]) {
      const items = grouped[type]
      const partners = items.map((i) => i.partner).join(",")
      const icon = items[0].interaction.icon
      const name =
        type === "seasonal"
          ? "Seasonal"
          : type === "sanhe"
            ? "SanHe"
            : type === "banhe"
              ? "BanHe"
              : "LiuHe"
      labels.push({
        text: `${icon} ${name} ${partners}`,
        element: items[0].interaction.element,
        tooltip: items[0].interaction.name,
        category: "positive",
      })
    }
  })

  // Negative interactions
  const negativeTypes = [
    "ungrateful",
    "arrogant",
    "rude",
    "self",
    "clash",
    "destruction",
    "harm",
  ]
  negativeTypes.forEach((type) => {
    if (grouped[type]) {
      const items = grouped[type]
      const partners = items.map((i) => i.partner).join(",")
      const icon = items[0].interaction.icon
      const name =
        type === "ungrateful"
          ? "Ungrateful"
          : type === "arrogant"
            ? "Arrogant"
            : type === "rude"
              ? "Rude"
              : type === "self"
                ? "Self"
                : type === "clash"
                  ? "Clash"
                  : type === "destruction"
                    ? "Break"
                    : "Harm"
      labels.push({
        text: `${icon} ${name} ${partners}`,
        element: null, // No element for negative
        tooltip: items[0].interaction.name,
        category: "negative",
      })
    }
  })

  return labels
}

// Detect and display HS combinations for all pillars
function detectAndDisplayHSCombinations(fourPillars, luckPillarsData) {
  const currentDate = new Date()

  // Calculate current pillars
  const currentYearPillar = calculateCurrentYearPillar(currentDate, fourPillars)
  const currentMonthPillar = calculateCurrentMonthPillar(
    currentDate,
    fourPillars
  )
  const currentLuckPillar = calculateCurrentLuckPillar(
    currentDate,
    fourPillars,
    luckPillarsData
  )

  // Detect all HS combinations for main pillars
  const hsCombinations = detectAllHSCombinations(fourPillars, {
    luck: currentLuckPillar,
    year: currentYearPillar,
    month: currentMonthPillar,
  })

  // Detect all Branch interactions for main pillars
  const branchInteractions = detectAllBranchInteractions(fourPillars, {
    luck: currentLuckPillar,
    year: currentYearPillar,
    month: currentMonthPillar,
  })

  // Add combination rows to main pillars (both HS and Branch interactions)
  addCombinationRow("HourPillar", hsCombinations["H"], branchInteractions["H"])
  addCombinationRow("DayPillar", hsCombinations["D"], branchInteractions["D"])
  addCombinationRow("MonthPillar", hsCombinations["M"], branchInteractions["M"])
  addCombinationRow("YearPillar", hsCombinations["Y"], branchInteractions["Y"])
  addCombinationRow(
    "CurrentLuckPillar",
    hsCombinations["CL"],
    branchInteractions["CL"]
  )
  addCombinationRow(
    "CurrentYearPillar",
    hsCombinations["CY"],
    branchInteractions["CY"]
  )
  addCombinationRow(
    "CurrentMonthPillar",
    hsCombinations["CM"],
    branchInteractions["CM"]
  )

  // Detect and add combinations for Luck Pillars
  detectLuckPillarsCombinations(luckPillarsData, fourPillars)

  // Detect and add combinations for Time Period Pillars
  // These will be added when the pillars are created
}

// Add combination row to a pillar (both HS and Branch interactions)
function addCombinationRow(pillarId, hsCombos, branchInteractions) {
  const pillar = document.getElementById(pillarId)
  if (!pillar) return

  // Remove existing combination row if any
  const existingCombo = pillar.querySelector(".hs-combo-row")
  if (existingCombo) {
    existingCombo.remove()
  }

  // Create combination row
  const comboRow = document.createElement("div")
  comboRow.className = "hs-combo-row"

  const hsLabel =
    hsCombos && hsCombos.length > 0 ? formatHSComboLabel(hsCombos) : ""
  const branchLabels = formatBranchInteractionLabels(branchInteractions)

  if (hsLabel || branchLabels.length > 0) {
    let content = ""

    // HS Combinations
    if (hsLabel) {
      const hsElement = hsCombos[0].combo.element
      const hsTooltip = hsCombos.map((c) => c.combo.name).join(", ")
      content += `
                <div class="hs-combo-label" style="color: ${elementColors[hsElement]}" title="${hsTooltip}">
                    <i class="fas fa-link"></i> ${hsLabel}
                </div>
            `
    }

    // Branch Interactions
    branchLabels.forEach((label) => {
      const colorStyle = label.element
        ? `color: ${elementColors[label.element]}`
        : label.category === "negative"
          ? "color: #e74c3c"
          : "color: #27ae60"
      content += `
                <div class="branch-interaction-label ${label.category}" style="${colorStyle}" title="${label.tooltip}">
                    ${label.text}
                </div>
            `
    })

    comboRow.innerHTML = content
  } else {
    comboRow.innerHTML = `
            <div class="hs-combo-label empty">
                <span>-</span>
            </div>
        `
  }

  // Append to pillar
  pillar.appendChild(comboRow)
}

// Detect combinations for Luck Pillars (only with Natal Chart)
function detectLuckPillarsCombinations(luckPillarsData, fourPillars) {
  const luckPillars = luckPillarsData.luck_pillars

  // For each luck pillar, check combinations ONLY with natal chart
  luckPillars.forEach((pillar, index) => {
    const pillarDiv = document.querySelectorAll("#luckPillars .pillar")[
      luckPillars.length - 1 - index
    ]
    if (!pillarDiv) return

    const hsCombos = []
    const branchInteractions = []

    const stemIndex = HEAVENLY_STEMS.findIndex(
      (s) => s.name === pillar.heavenly_stem.name
    )
    const branchIndex = EARTHLY_BRANCHES.findIndex(
      (b) => b.name === pillar.earthly_branch.name
    )

    // Check ONLY against natal pillars (NOT other luck pillars)
    const natalPillars = [
      {
        name: "H",
        stem: fourPillars.hour_pillar.heavenly_stem,
        branch: fourPillars.hour_pillar.earthly_branch,
      },
      {
        name: "D",
        stem: fourPillars.day_pillar.heavenly_stem,
        branch: fourPillars.day_pillar.earthly_branch,
      },
      {
        name: "M",
        stem: fourPillars.month_pillar.heavenly_stem,
        branch: fourPillars.month_pillar.earthly_branch,
      },
      {
        name: "Y",
        stem: fourPillars.year_pillar.heavenly_stem,
        branch: fourPillars.year_pillar.earthly_branch,
      },
    ]

    natalPillars.forEach((natalPillar) => {
      const natalStemIndex = HEAVENLY_STEMS.findIndex(
        (s) => s.name === natalPillar.stem.name
      )
      const natalBranchIndex = EARTHLY_BRANCHES.findIndex(
        (b) => b.name === natalPillar.branch.name
      )

      // Check HS combinations
      const hsCombo = getHSCombination(stemIndex, natalStemIndex)
      if (hsCombo) {
        hsCombos.push({ partner: natalPillar.name, combo: hsCombo })
      }

      // Check all branch interactions
      const checkFunctions = [
        { func: canFormSeasonalUnion, type: "seasonal" },
        { func: canFormThreeHarmony, type: "sanhe" },
        { func: canFormHalfCombination, type: "banhe" },
        { func: canFormSixHarmony, type: "liuhe" },
        { func: canFormUngratefulPunishment, type: "ungrateful" },
        { func: canFormArrogantPunishment, type: "arrogant" },
        { func: canFormRudePunishment, type: "rude" },
        { func: canFormSelfPunishment, type: "self" },
        { func: canFormClash, type: "clash" },
        { func: canFormDestruction, type: "destruction" },
        { func: canFormHarm, type: "harm" },
      ]

      checkFunctions.forEach((check) => {
        const result = check.func(branchIndex, natalBranchIndex)
        if (result) {
          branchInteractions.push({
            partner: natalPillar.name,
            interaction: result,
            type: check.type,
          })
        }
      })
    })

    // Add combination row
    addCombinationRowToPillar(pillarDiv, hsCombos, branchInteractions)
  })
}

// Add combination row directly to a pillar element (for dynamic pillars)
function addCombinationRowToPillar(
  pillarElement,
  hsCombos,
  branchInteractions
) {
  if (!pillarElement) return

  // Remove existing combination row if any
  const existingCombo = pillarElement.querySelector(".hs-combo-row")
  if (existingCombo) {
    existingCombo.remove()
  }

  // Create combination row
  const comboRow = document.createElement("div")
  comboRow.className = "hs-combo-row"

  const hsLabel =
    hsCombos && hsCombos.length > 0 ? formatHSComboLabel(hsCombos) : ""
  const branchLabels = formatBranchInteractionLabels(branchInteractions)

  if (hsLabel || branchLabels.length > 0) {
    let content = ""

    // HS Combinations
    if (hsLabel) {
      const hsElement = hsCombos[0].combo.element
      const hsTooltip = hsCombos.map((c) => c.combo.name).join(", ")
      content += `
                <div class="hs-combo-label" style="color: ${elementColors[hsElement]}" title="${hsTooltip}">
                    <i class="fas fa-link"></i> ${hsLabel}
                </div>
            `
    }

    // Branch Interactions
    branchLabels.forEach((label) => {
      const colorStyle = label.element
        ? `color: ${elementColors[label.element]}`
        : label.category === "negative"
          ? "color: #e74c3c"
          : "color: #27ae60"
      content += `
                <div class="branch-interaction-label ${label.category}" style="${colorStyle}" title="${label.tooltip}">
                    ${label.text}
                </div>
            `
    })

    comboRow.innerHTML = content
  } else {
    comboRow.innerHTML = `
            <div class="hs-combo-label empty">
                <span>-</span>
            </div>
        `
  }

  // Append to pillar
  pillarElement.appendChild(comboRow)
}

// Detect combinations for time period pillars (hierarchical/cascading)
// Returns {hsCombos, branchInteractions}
function detectTimePeriodCombinations(
  currentPillar,
  allPillars,
  currentIndex,
  type
) {
  const hsCombos = []
  const branchInteractions = []

  const currentStemIndex = HEAVENLY_STEMS.findIndex(
    (s) => s.name === currentPillar.heavenly_stem.name
  )
  const currentBranchIndex = EARTHLY_BRANCHES.findIndex(
    (b) => b.name === currentPillar.earthly_branch.name
  )

  // Always check combinations with natal pillars
  if (window.currentBaziData && window.currentBaziData.four_pillars) {
    const fourPillars = window.currentBaziData.four_pillars
    const natalPillars = [
      {
        name: "H",
        stem: fourPillars.hour_pillar.heavenly_stem,
        branch: fourPillars.hour_pillar.earthly_branch,
      },
      {
        name: "D",
        stem: fourPillars.day_pillar.heavenly_stem,
        branch: fourPillars.day_pillar.earthly_branch,
      },
      {
        name: "M",
        stem: fourPillars.month_pillar.heavenly_stem,
        branch: fourPillars.month_pillar.earthly_branch,
      },
      {
        name: "Y",
        stem: fourPillars.year_pillar.heavenly_stem,
        branch: fourPillars.year_pillar.earthly_branch,
      },
    ]

    natalPillars.forEach((natalPillar) => {
      const natalStemIndex = HEAVENLY_STEMS.findIndex(
        (s) => s.name === natalPillar.stem.name
      )
      const natalBranchIndex = EARTHLY_BRANCHES.findIndex(
        (b) => b.name === natalPillar.branch.name
      )

      // Check HS combinations
      const hsCombo = getHSCombination(currentStemIndex, natalStemIndex)
      if (hsCombo) {
        hsCombos.push({ partner: natalPillar.name, combo: hsCombo })
      }

      // Check all branch interactions
      const checkFunctions = [
        { func: canFormSeasonalUnion, type: "seasonal" },
        { func: canFormThreeHarmony, type: "sanhe" },
        { func: canFormHalfCombination, type: "banhe" },
        { func: canFormSixHarmony, type: "liuhe" },
        { func: canFormUngratefulPunishment, type: "ungrateful" },
        { func: canFormArrogantPunishment, type: "arrogant" },
        { func: canFormRudePunishment, type: "rude" },
        { func: canFormSelfPunishment, type: "self" },
        { func: canFormClash, type: "clash" },
        { func: canFormDestruction, type: "destruction" },
        { func: canFormHarm, type: "harm" },
      ]

      checkFunctions.forEach((check) => {
        const result = check.func(currentBranchIndex, natalBranchIndex)
        if (result) {
          branchInteractions.push({
            partner: natalPillar.name,
            interaction: result,
            type: check.type,
          })
        }
      })
    })
  }

  // Get current transiting pillars for hierarchical checks
  const currentDate = new Date()
  const fourPillars = window.currentBaziData?.four_pillars
  const luckPillarsData = window.currentBaziData?.luck_pillars

  if (!fourPillars || !luckPillarsData) return { hsCombos, branchInteractions }

  // Calculate current transiting pillars
  const currentLuckPillar = calculateCurrentLuckPillar(
    currentDate,
    fourPillars,
    luckPillarsData
  )
  const currentYearPillar = calculateCurrentYearPillar(currentDate, fourPillars)
  const currentMonthPillar = calculateCurrentMonthPillar(
    currentDate,
    fourPillars
  )

  // Helper function to check both HS and Branch interactions for a current pillar
  const checkCurrentPillar = (pillar, label) => {
    if (!pillar || !pillar.heavenly_stem || !pillar.earthly_branch) return

    const stemIdx = HEAVENLY_STEMS.findIndex(
      (s) => s.name === pillar.heavenly_stem.name
    )
    const branchIdx = EARTHLY_BRANCHES.findIndex(
      (b) => b.name === pillar.earthly_branch.name
    )

    // HS Combination
    const hsCombo = getHSCombination(currentStemIndex, stemIdx)
    if (hsCombo) {
      hsCombos.push({ partner: label, combo: hsCombo })
    }

    // All branch interactions
    const checkFunctions = [
      { func: canFormSeasonalUnion, type: "seasonal" },
      { func: canFormThreeHarmony, type: "sanhe" },
      { func: canFormHalfCombination, type: "banhe" },
      { func: canFormSixHarmony, type: "liuhe" },
      { func: canFormUngratefulPunishment, type: "ungrateful" },
      { func: canFormArrogantPunishment, type: "arrogant" },
      { func: canFormRudePunishment, type: "rude" },
      { func: canFormSelfPunishment, type: "self" },
      { func: canFormClash, type: "clash" },
      { func: canFormDestruction, type: "destruction" },
      { func: canFormHarm, type: "harm" },
    ]

    checkFunctions.forEach((check) => {
      const result = check.func(currentBranchIndex, branchIdx)
      if (result) {
        branchInteractions.push({
          partner: label,
          interaction: result,
          type: check.type,
        })
      }
    })
  }

  // Hierarchical checks based on type
  if (type === "year") {
    checkCurrentPillar(currentLuckPillar, "CL")
  } else if (type === "month") {
    checkCurrentPillar(currentYearPillar, "CY")
    checkCurrentPillar(currentLuckPillar, "CL")
  } else if (type === "day") {
    checkCurrentPillar(currentMonthPillar, "CM")
    checkCurrentPillar(currentYearPillar, "CY")
    checkCurrentPillar(currentLuckPillar, "CL")
  } else if (type === "hour") {
    const currentDayPillar = allPillars[currentDate.getDate() - 1]
    if (
      currentDayPillar &&
      currentDayPillar.heavenly_stem &&
      currentDayPillar.earthly_branch
    ) {
      const dayLabel = currentDayPillar.day || currentDate.getDate()
      checkCurrentPillar(currentDayPillar, dayLabel.toString())
    }
    checkCurrentPillar(currentMonthPillar, "CM")
    checkCurrentPillar(currentYearPillar, "CY")
    checkCurrentPillar(currentLuckPillar, "CL")
  }

  return { hsCombos, branchInteractions }
}

// End of script
