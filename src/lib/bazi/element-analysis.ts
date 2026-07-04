import { EARTHLY_BRANCHES, HEAVENLY_STEMS, HIDDEN_STEMS_MAP } from "./constants"

export function getTenGodsRelationship(
  dayMasterIndex: number,
  stemIndex: number
): string {
  const dayMasterElement = Math.floor(dayMasterIndex / 2)
  const stemElement = Math.floor(stemIndex / 2)
  const sameElement = dayMasterElement === stemElement

  const dayMasterPolarity = dayMasterIndex % 2
  const stemPolarity = stemIndex % 2
  const samePolarity = dayMasterPolarity === stemPolarity

  if (sameElement) {
    return samePolarity ? "F" : "RW"
  }

  const produces = (dayMasterElement + 1) % 5 === stemElement
  const controls = (dayMasterElement + 2) % 5 === stemElement
  const controlledBy = (stemElement + 2) % 5 === dayMasterElement
  const producedBy = (stemElement + 1) % 5 === dayMasterElement

  if (produces) {
    return samePolarity ? "EG" : "HO"
  } else if (controls) {
    return samePolarity ? "IW" : "DW"
  } else if (controlledBy) {
    return samePolarity ? "7K" : "DO"
  } else if (producedBy) {
    return samePolarity ? "IR" : "DR"
  }

  return "--"
}

export function getHiddenStemsWithTenGods(
  branchIndex: number,
  dayMasterIndex: number
): any {
  const branchName = EARTHLY_BRANCHES[branchIndex].name
  const hiddenData = HIDDEN_STEMS_MAP[branchName] || {}

  const result: any = {}

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

export function getHiddenStems(branchIndex: number): any {
  const branchName = EARTHLY_BRANCHES[branchIndex].name
  const hiddenData = HIDDEN_STEMS_MAP[branchName] || {}

  const result: any = {}

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

export function calculateElementStructure(
  fourPillars: any,
  currentPillars: any
) {
  const elements: Record<string, { natal: number; annual: number }> = {
    Wood: { natal: 0, annual: 0 },
    Fire: { natal: 0, annual: 0 },
    Earth: { natal: 0, annual: 0 },
    Metal: { natal: 0, annual: 0 },
    Water: { natal: 0, annual: 0 },
  }

  const STEM_ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"]

  const getElementFromIndex = (stemIndex: number) => {
    return STEM_ELEMENTS[Math.floor(stemIndex / 2)]
  }

  const calculatePillar = (pillar: any, isNatal: boolean) => {
    if (!pillar) return

    const target = isNatal ? "natal" : "annual"
    const branchName = pillar.earthly_branch ? pillar.earthly_branch.name : ""

    const isMaoYouZi =
      branchName === "Rabbit" ||
      branchName === "Rooster" ||
      branchName === "Rat"
    const isHaiOrWu = branchName === "Pig" || branchName === "Horse"

    let mainQiWeight, subMainQiWeight, residualQiWeight

    if (isMaoYouZi) {
      mainQiWeight = 1.0
      subMainQiWeight = 0
      residualQiWeight = 0
    } else if (isHaiOrWu) {
      mainQiWeight = 0.8
      subMainQiWeight = 0.2
      residualQiWeight = 0
    } else {
      mainQiWeight = 0.7
      subMainQiWeight = 0.2
      residualQiWeight = 0.1
    }

    if (pillar.heavenly_stem) {
      const stemIndex =
        pillar.heavenly_stem.index ??
        HEAVENLY_STEMS.findIndex((s) => s.name === pillar.heavenly_stem.name)
      if (stemIndex >= 0) {
        const element = getElementFromIndex(stemIndex)
        elements[element][target] += 1.0
      }
    }

    if (pillar.hidden_stems) {
      if (pillar.hidden_stems.main_qi) {
        const mainIndex =
          pillar.hidden_stems.main_qi.index ??
          pillar.hidden_stems.main_qi.stem_index ??
          HEAVENLY_STEMS.findIndex(
            (s) =>
              s.name === pillar.hidden_stems.main_qi.name ||
              s.name === pillar.hidden_stems.main_qi.stem_name
          )
        if (mainIndex >= 0) {
          const element = getElementFromIndex(mainIndex)
          elements[element][target] += mainQiWeight
        }
      }

      if (pillar.hidden_stems.sub_main_qi && subMainQiWeight > 0) {
        const subIndex =
          pillar.hidden_stems.sub_main_qi.index ??
          pillar.hidden_stems.sub_main_qi.stem_index ??
          HEAVENLY_STEMS.findIndex(
            (s) =>
              s.name === pillar.hidden_stems.sub_main_qi.name ||
              s.name === pillar.hidden_stems.sub_main_qi.stem_name
          )
        if (subIndex >= 0) {
          const element = getElementFromIndex(subIndex)
          elements[element][target] += subMainQiWeight
        }
      }

      if (pillar.hidden_stems.residual_qi && residualQiWeight > 0) {
        const residualIndex =
          pillar.hidden_stems.residual_qi.index ??
          pillar.hidden_stems.residual_qi.stem_index ??
          HEAVENLY_STEMS.findIndex(
            (s) =>
              s.name === pillar.hidden_stems.residual_qi.name ||
              s.name === pillar.hidden_stems.residual_qi.stem_name
          )
        if (residualIndex >= 0) {
          const element = getElementFromIndex(residualIndex)
          elements[element][target] += residualQiWeight
        }
      }
    }
  }

  calculatePillar(fourPillars.year_pillar, true)
  calculatePillar(fourPillars.month_pillar, true)
  calculatePillar(fourPillars.day_pillar, true)
  calculatePillar(fourPillars.hour_pillar, true)

  Object.keys(elements).forEach((elem) => {
    elements[elem].annual = 0
  })

  calculatePillar(fourPillars.year_pillar, false)
  calculatePillar(fourPillars.month_pillar, false)
  calculatePillar(fourPillars.day_pillar, false)
  calculatePillar(fourPillars.hour_pillar, false)

  if (currentPillars && (currentPillars.luck || currentPillars.current_luck))
    calculatePillar(currentPillars.luck || currentPillars.current_luck, false)
  if (currentPillars && (currentPillars.year || currentPillars.current_year))
    calculatePillar(currentPillars.year || currentPillars.current_year, false)
  if (currentPillars && (currentPillars.month || currentPillars.current_month))
    calculatePillar(currentPillars.month || currentPillars.current_month, false)
  if (currentPillars && (currentPillars.day || currentPillars.current_day))
    calculatePillar(currentPillars.day || currentPillars.current_day, false)

  const natalTotal = Object.values(elements).reduce(
    (sum, e) => sum + e.natal,
    0
  )
  const annualTotal = Object.values(elements).reduce(
    (sum, e) => sum + e.annual,
    0
  )

  const natalPercentages: Record<string, string> = {}
  const annualPercentages: Record<string, string> = {}

  Object.keys(elements).forEach((elem) => {
    natalPercentages[elem] =
      natalTotal > 0
        ? ((elements[elem].natal / natalTotal) * 100).toFixed(1)
        : "0.0"
    annualPercentages[elem] =
      annualTotal > 0
        ? ((elements[elem].annual / annualTotal) * 100).toFixed(1)
        : "0.0"
  })

  return {
    natal: natalPercentages,
    annual: annualPercentages,
    natalPoints: elements,
    annualPoints: elements,
    natalTotal: natalTotal,
    annualTotal: annualTotal,
  }
}

export function calculateTenGods(fourPillarsData: any, currentPillars: any) {
  const dayMasterName = fourPillarsData.day_pillar.heavenly_stem.name
  const dayMasterIndex = HEAVENLY_STEMS.findIndex(
    (s) => s.name === dayMasterName
  )
  const dayMasterElement = Math.floor(dayMasterIndex / 2)
  const dayMasterYinYang = dayMasterIndex % 2

  const tenGodsNames = [
    "Friend",
    "Rob Wealth",
    "Eating God",
    "Hurting Officer",
    "Direct Wealth",
    "Indirect Wealth",
    "Direct Officer",
    "Seven Killings",
    "Direct Resource",
    "Indirect Resource",
  ]

  const tenGodsPoints: Record<string, Record<string, number>> = {
    natal: {},
    annual: {},
  }

  const tenGodsStems: Record<string, Record<string, Set<string>>> = {
    natal: {},
    annual: {},
  }

  tenGodsNames.forEach((name) => {
    tenGodsPoints.natal[name] = 0
    tenGodsPoints.annual[name] = 0
    tenGodsStems.natal[name] = new Set()
    tenGodsStems.annual[name] = new Set()
  })

  const getTenGodFromStem = (stemIndex: number) => {
    const element = Math.floor(stemIndex / 2)
    const yinYang = stemIndex % 2

    if (element === dayMasterElement)
      return yinYang === dayMasterYinYang ? "Friend" : "Rob Wealth"
    if ((dayMasterElement + 1) % 5 === element)
      return yinYang === dayMasterYinYang ? "Eating God" : "Hurting Officer"
    if ((dayMasterElement + 2) % 5 === element)
      return yinYang === dayMasterYinYang ? "Indirect Wealth" : "Direct Wealth"
    if ((dayMasterElement + 3) % 5 === element)
      return yinYang === dayMasterYinYang ? "Seven Killings" : "Direct Officer"
    if ((dayMasterElement + 4) % 5 === element)
      return yinYang === dayMasterYinYang
        ? "Direct Resource"
        : "Indirect Resource"

    return null
  }

  const addPoints = (stemIndex: number, targetType: string, weight: number) => {
    const tenGod = getTenGodFromStem(stemIndex)
    if (tenGod) {
      tenGodsPoints[targetType][tenGod] += weight
      const stemChar = HEAVENLY_STEMS[stemIndex].character
      tenGodsStems[targetType][tenGod].add(stemChar)
    }
  }

  const natalPillars = [
    fourPillarsData.year_pillar,
    fourPillarsData.month_pillar,
    fourPillarsData.day_pillar,
    fourPillarsData.hour_pillar,
  ]

  const processPillar = (pillar: any, targetType: string) => {
    if (!pillar) return

    if (pillar.heavenly_stem) {
      const stemIndex =
        pillar.heavenly_stem.index ??
        HEAVENLY_STEMS.findIndex((s) => s.name === pillar.heavenly_stem.name)
      addPoints(stemIndex, targetType, 1.0)
    }

    if (pillar.hidden_stems) {
      const hiddenStems = pillar.hidden_stems
      const branchName = pillar.earthly_branch ? pillar.earthly_branch.name : ""
      const isMaoYouZi =
        branchName === "Rabbit" ||
        branchName === "Rooster" ||
        branchName === "Rat"
      const isHaiOrWu = branchName === "Pig" || branchName === "Horse"

      let mainQiWeight, subMainQiWeight, residualQiWeight

      if (isMaoYouZi) {
        mainQiWeight = 1.0
        subMainQiWeight = 0
        residualQiWeight = 0
      } else if (isHaiOrWu) {
        mainQiWeight = 0.8
        subMainQiWeight = 0.2
        residualQiWeight = 0
      } else {
        mainQiWeight = 0.7
        subMainQiWeight = 0.2
        residualQiWeight = 0.1
      }

      if (hiddenStems.main_qi) {
        const mainIndex =
          hiddenStems.main_qi.index ??
          HEAVENLY_STEMS.findIndex((s) => s.name === hiddenStems.main_qi.name)
        addPoints(mainIndex, targetType, mainQiWeight)
      }

      if (hiddenStems.sub_main_qi && subMainQiWeight > 0) {
        const subIndex =
          hiddenStems.sub_main_qi.index ??
          HEAVENLY_STEMS.findIndex(
            (s) => s.name === hiddenStems.sub_main_qi.name
          )
        addPoints(subIndex, targetType, subMainQiWeight)
      }

      if (hiddenStems.residual_qi && residualQiWeight > 0) {
        const residualIndex =
          hiddenStems.residual_qi.index ??
          HEAVENLY_STEMS.findIndex(
            (s) => s.name === hiddenStems.residual_qi.name
          )
        addPoints(residualIndex, targetType, residualQiWeight)
      }
    }
  }

  natalPillars.forEach((pillar) => processPillar(pillar, "natal"))

  tenGodsNames.forEach((name) => {
    tenGodsPoints.annual[name] = 0
  })

  natalPillars.forEach((pillar) => processPillar(pillar, "annual"))

  const currentPillarsList = []
  if (currentPillars.luck || currentPillars.current_luck)
    currentPillarsList.push(currentPillars.luck || currentPillars.current_luck)
  if (currentPillars.year || currentPillars.current_year)
    currentPillarsList.push(currentPillars.year || currentPillars.current_year)
  if (currentPillars.month || currentPillars.current_month)
    currentPillarsList.push(currentPillars.month || currentPillars.current_month)
  if (currentPillars.day || currentPillars.current_day)
    currentPillarsList.push(currentPillars.day || currentPillars.current_day)

  currentPillarsList.forEach((pillar) => processPillar(pillar, "annual"))

  // Convert Sets to Arrays for easier serialization
  const serializedStems: Record<string, Record<string, string[]>> = {
    natal: {},
    annual: {},
  }

  tenGodsNames.forEach((name) => {
    serializedStems.natal[name] = Array.from(tenGodsStems.natal[name])
    serializedStems.annual[name] = Array.from(tenGodsStems.annual[name])
  })

  return {
    points: tenGodsPoints,
    stems: serializedStems,
  }
}
