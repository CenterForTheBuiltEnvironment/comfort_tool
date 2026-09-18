const {
  HAVENITH_REGION_KEYS,
  HAVENITH_REGION_WEIGHTS,
  HAVENITH_PRESET_ENSEMBLES,
  havenithAdjustedClo,
  havenithRegionalClothingLabel,
} = require("./preset-ensembles");

describe("ASHRAE 1504-TRP preset ensembles", () => {
  test("contains all 52 measured female and male configurations", () => {
    expect(HAVENITH_PRESET_ENSEMBLES).toHaveLength(52);
    expect(
      HAVENITH_PRESET_ENSEMBLES.filter((preset) => preset.gender === "F")
    ).toHaveLength(33);
    expect(
      HAVENITH_PRESET_ENSEMBLES.filter((preset) => preset.gender === "M")
    ).toHaveLength(19);
  });

  test("provides every regional value for every preset", () => {
    HAVENITH_PRESET_ENSEMBLES.forEach((preset) => {
      expect(preset.name.length).toBeGreaterThan(3);
      expect(preset.description.length).toBeGreaterThan(20);
      expect(Object.keys(preset.regions)).toEqual(HAVENITH_REGION_KEYS);
      HAVENITH_REGION_KEYS.forEach((key) => {
        expect(Number.isFinite(preset.regions[key])).toBe(true);
        expect(preset.regions[key]).toBeGreaterThan(0);
      });
    });
  });

  test("matches representative report values", () => {
    const femaleA1 = HAVENITH_PRESET_ENSEMBLES.find(
      (preset) => preset.gender === "F" && preset.code === "A1"
    );
    const maleK3 = HAVENITH_PRESET_ENSEMBLES.find(
      (preset) => preset.gender === "M" && preset.code === "K3"
    );

    expect(femaleA1.clo).toBe(0.76);
    expect(femaleA1.regions.abdomen).toBe(0.364);
    expect(maleK3.clo).toBe(1.76);
    expect(maleK3.regions.buttocks).toBe(0.647);
  });

  test("regional weights are normalized", () => {
    expect(
      Object.values(HAVENITH_REGION_WEIGHTS).reduce(
        (sum, weight) => sum + weight,
        0
      )
    ).toBeCloseTo(1, 10);
  });

  test("recalculates clo when regional insulation changes", () => {
    const preset = HAVENITH_PRESET_ENSEMBLES.find(
      (item) => item.gender === "M" && item.code === "K3"
    );
    const unchanged = havenithAdjustedClo(
      preset.clo,
      preset.regions,
      preset.regions
    );
    const warmerChest = {
      ...preset.regions,
      chest: preset.regions.chest * 2,
    };
    const adjusted = havenithAdjustedClo(
      preset.clo,
      preset.regions,
      warmerChest
    );

    expect(unchanged).toBeCloseTo(preset.clo, 10);
    expect(adjusted).toBeGreaterThan(preset.clo);
  });

  test("shows only garments relevant to a selected body zone", () => {
    const preset = HAVENITH_PRESET_ENSEMBLES.find(
      (item) => item.gender === "F" && item.code === "F6"
    );
    const head = havenithRegionalClothingLabel(preset, "head");
    const chest = havenithRegionalClothingLabel(preset, "chest");
    const feet = havenithRegionalClothingLabel(preset, "feet");

    expect(head).toContain("hijab");
    expect(head).toContain("burka");
    expect(head).not.toContain("shoes");
    expect(chest).toContain("abaya");
    expect(chest).not.toContain("socks");
    expect(feet).toContain("socks");
    expect(feet).toContain("shoes");
    expect(feet).not.toContain("abaya");
  });
});
