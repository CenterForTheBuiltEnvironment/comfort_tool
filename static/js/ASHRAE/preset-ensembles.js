/*
 * ASHRAE 1504-TRP preset ensembles.
 *
 * Whole-body `clo` values are intrinsic clothing insulation (Icl) from
 * Havenith et al. (2013), Tables 2 and 3. Regional values are total insulation
 * (IT, m2 K/W) at 0.2 m/s from Tables 7 and 8.
 *
 * Regional value order:
 * head, upper arms, forearms, hands, chest, abdomen, back, buttocks,
 * upper legs, lower legs, feet.
 */
(function (root) {
var HAVENITH_REGION_KEYS = [
  "head",
  "upperArms",
  "forearms",
  "hands",
  "chest",
  "abdomen",
  "back",
  "buttocks",
  "upperLegs",
  "lowerLegs",
  "feet",
];

var HAVENITH_REGION_LABELS = {
  head: "Head",
  upperArms: "Upper arms",
  forearms: "Forearms",
  hands: "Hands",
  chest: "Chest",
  abdomen: "Abdomen",
  back: "Back",
  buttocks: "Buttocks",
  upperLegs: "Upper legs",
  lowerLegs: "Lower legs",
  feet: "Feet",
};

// Approximate adult body-surface fractions used to combine local insulation
// with the parallel method. Fractions sum to 1.0.
var HAVENITH_REGION_WEIGHTS = {
  head: 0.07,
  upperArms: 0.08,
  forearms: 0.06,
  hands: 0.05,
  chest: 0.13,
  abdomen: 0.13,
  back: 0.13,
  buttocks: 0.08,
  upperLegs: 0.19,
  lowerLegs: 0.04,
  feet: 0.04,
};

var HAVENITH_ENSEMBLE_DETAILS = {
  "F-ASTM": {
    name: "ASTM calibration ensemble",
    description: "Women's briefs, T-shirt, protective Nomex III pants and shirt, socks, and athletic shoes.",
  },
  "F-A1": {
    name: "Shalwar kameez without scarf",
    description: "Women's briefs, bra, polycotton shalwar pants, polycotton kameez shirt, and female sandals.",
  },
  "F-A2": {
    name: "Shalwar kameez with scarf",
    description: "Women's briefs, bra, polycotton shalwar pants, polycotton kameez shirt, draped polycotton scarf, and female sandals.",
  },
  "F-B1": {
    name: "Polyester shalwar kameez without scarf",
    description: "Women's briefs, bra, polyester shalwar pants, polyester kameez shirt, and female sandals.",
  },
  "F-B2": {
    name: "Polyester shalwar kameez with scarf",
    description: "Women's briefs, bra, polyester shalwar pants, polyester kameez shirt, draped polyester scarf, and female sandals.",
  },
  "F-D1": {
    name: "Cotton shalwar kameez without scarf",
    description: "Women's briefs, bra, cotton shalwar pants, cotton-polyester kameez shirt, and female sandals.",
  },
  "F-D2": {
    name: "Cotton shalwar kameez with scarf",
    description: "Women's briefs, bra, cotton shalwar pants, cotton-polyester kameez shirt, draped polyester scarf, and female sandals.",
  },
  "F-F1": {
    name: "Abaya with long fitted hijab",
    description: "Bra, women's briefs, stretch body layer, over-shirt, jeans, polyester abaya, long fitted hijab, socks, and athletic shoes.",
  },
  "F-F2": {
    name: "Abaya with short traditional hijab",
    description: "Bra, women's briefs, stretch body layer, over-shirt, jeans, polyester abaya, short traditional hijab, socks, and athletic shoes.",
  },
  "F-F3": {
    name: "Abaya with long traditional hijab",
    description: "Bra, women's briefs, stretch body layer, over-shirt, jeans, polyester abaya, long traditional cotton hijab, socks, and athletic shoes.",
  },
  "F-F4": {
    name: "Abaya with long hijab, no body layer",
    description: "Bra, women's briefs, over-shirt, jeans, polyester abaya, long traditional cotton hijab, socks, and athletic shoes.",
  },
  "F-F5": {
    name: "Abaya with short fitted hijab",
    description: "Bra, women's briefs, stretch body layer, over-shirt, jeans, polyester abaya, short fitted hijab, socks, and athletic shoes.",
  },
  "F-F6": {
    name: "Abaya with fitted hijab and burka",
    description: "Bra, women's briefs, stretch body layer, over-shirt, jeans, polyester abaya, short fitted hijab, burka, socks, and athletic shoes.",
  },
  "F-G1": {
    name: "Indonesian trouser suit without hijab",
    description: "Bra, women's briefs, long-sleeved shirt, suit pants, buttoned suit jacket, socks, and athletic shoes.",
  },
  "F-G2": {
    name: "Indonesian trouser suit with hijab",
    description: "Bra, women's briefs, long-sleeved shirt, hijab, suit pants, buttoned suit jacket, socks, and athletic shoes.",
  },
  "F-G3": {
    name: "Indonesian shirt and trousers with hijab",
    description: "Bra, women's briefs, long-sleeved shirt, suit pants, hijab, socks, and athletic shoes; no suit jacket.",
  },
  "F-H1": {
    name: "Indonesian shirt and skirt without scarf",
    description: "Bra, women's briefs, long-sleeved shirt, skirt, socks, and athletic shoes.",
  },
  "F-H2": {
    name: "Indonesian shirt and skirt with scarf",
    description: "Bra, women's briefs, long-sleeved shirt, skirt, headscarf, socks, and athletic shoes.",
  },
  "F-L1": {
    name: "Jeans and hijab without body layer",
    description: "Bra, women's briefs, over-shirt, jeans, anta head cover, hijab, socks, and athletic shoes.",
  },
  "F-L2": {
    name: "Jeans and hijab with body layer",
    description: "Bra, women's briefs, stretch body layer, over-shirt, jeans, anta head cover, hijab, socks, and athletic shoes.",
  },
  "F-L3": {
    name: "Jeans, hijab and coat with body layer",
    description: "Bra, women's briefs, stretch body layer, over-shirt, jeans, anta head cover, hijab, coat, socks, and athletic shoes.",
  },
  "F-M-S1": {
    name: "Summer double-layer abaya without headscarf",
    description: "Bra, women's briefs, full slip, double-layer polyester abaya, and female sandals.",
  },
  "F-M-S2": {
    name: "Summer double-layer abaya with headscarf",
    description: "Bra, women's briefs, full slip, double-layer polyester abaya, anta head cover, hijab, and female sandals.",
  },
  "F-M-W1": {
    name: "Winter double-layer abaya without headscarf",
    description: "Bra, women's briefs, long underwear pants, long-sleeved undershirt, full slip, double-layer polyester abaya, socks, and athletic shoes.",
  },
  "F-M-W2": {
    name: "Winter double-layer abaya with headscarf",
    description: "Bra, women's briefs, long underwear pants, long-sleeved undershirt, full slip, double-layer polyester abaya, anta head cover, hijab, socks, and athletic shoes.",
  },
  "F-N": {
    name: "West African cotton dress",
    description: "Bra, women's briefs, cotton dress, cotton headband, and female sandals.",
  },
  "F-O": {
    name: "West African long shirt and trousers",
    description: "Bra, women's briefs, long cotton shirt, long cotton pants, and female sandals.",
  },
  "F-S": {
    name: "West African short shirt and trousers",
    description: "Bra, women's briefs, short cotton shirt with long sleeves, long cotton pants, and female sandals.",
  },
  "F-W": {
    name: "Chinese short-sleeved qipao",
    description: "Bra, women's briefs, camisole, short-sleeved satin-polyester qipao, and female sandals.",
  },
  "F-X1": {
    name: "Churidhar ensemble without shirt and head towel",
    description: "Bra, women's briefs, churidhar pants, churidhar dress, shawl, and female sandals.",
  },
  "F-X2": {
    name: "Churidhar ensemble with shirt and head towel",
    description: "Bra, women's briefs, churidhar pants, churidhar dress, shirt, shawl, head towel, socks, and athletic shoes.",
  },
  "F-Y1": {
    name: "Saree without shirt and head towel",
    description: "Bra, women's briefs, underskirt, blouse, synthetic-polyester saree, and female sandals.",
  },
  "F-Y2": {
    name: "Saree with shirt and head towel",
    description: "Bra, women's briefs, underskirt, blouse, synthetic-polyester saree, shirt, head towel, socks, and athletic shoes.",
  },
  "M-ASTM": {
    name: "ASTM calibration ensemble",
    description: "Men's briefs, T-shirt, protective Nomex III pants and shirt, socks, and athletic shoes.",
  },
  "M-C": {
    name: "Pakistani shalwar kameez",
    description: "Men's briefs, polycotton shalwar pants, polycotton kameez shirt, socks, and athletic shoes.",
  },
  "M-E": {
    name: "Indian/Pakistani shalwar kameez",
    description: "Men's briefs, polycotton shalwar pants, polyester kameez shirt, socks, and athletic shoes.",
  },
  "M-I": {
    name: "Indonesian workwear",
    description: "Men's briefs, polycotton work shirt, polyester work pants, socks, and athletic shoes.",
  },
  "M-J1": {
    name: "Kuwaiti dishdasha with long underwear",
    description: "Men's briefs, polyester dishdasha, long underwear pants, long-sleeved undershirt, long serwal pants, tagiya, socks, and athletic shoes.",
  },
  "M-J2": {
    name: "Kuwaiti dishdasha with ghutra",
    description: "Men's briefs, polyester dishdasha, long underwear pants, long-sleeved undershirt, long serwal pants, tagiya, iqal, ghutra, socks, and athletic shoes.",
  },
  "M-J3": {
    name: "Kuwaiti dishdasha, ghutra and coat",
    description: "Men's briefs, polyester dishdasha, long underwear pants, long-sleeved undershirt, long serwal pants, tagiya, iqal, ghutra, coat, socks, and athletic shoes.",
  },
  "M-K1": {
    name: "Kuwaiti dishdasha with T-shirt",
    description: "Men's briefs, polycotton dishdasha, short-sleeved T-shirt, long serwal pants, tagiya, socks, and athletic shoes.",
  },
  "M-K2": {
    name: "Kuwaiti dishdasha with T-shirt and ghutra",
    description: "Men's briefs, polycotton dishdasha, short-sleeved T-shirt, long serwal pants, tagiya, iqal, ghutra, socks, and athletic shoes.",
  },
  "M-K3": {
    name: "Kuwaiti dishdasha, ghutra and coat",
    description: "Men's briefs, polycotton dishdasha, short-sleeved T-shirt, long serwal pants, tagiya, iqal, ghutra, coat, socks, and athletic shoes.",
  },
  "M-P": {
    name: "West African long-sleeved shirt and trousers",
    description: "Men's briefs, short cotton shirt with long sleeves, long cotton pants, and male sandals.",
  },
  "M-Q": {
    name: "West African short-sleeved shirt and trousers",
    description: "Men's briefs, short cotton shirt with short sleeves, long cotton pants, and male sandals.",
  },
  "M-R": {
    name: "West African boubou ensemble",
    description: "Men's briefs, short cotton shirt with long sleeves, long cotton pants, wide-sleeved boubou robe, African hat, and male sandals.",
  },
  "M-T": {
    name: "West African shirt and shorts",
    description: "Men's briefs, short cotton shirt with long sleeves, cotton shorts, and male sandals.",
  },
  "M-U": {
    name: "West African long shirt and trousers",
    description: "Men's briefs, long cotton shirt, long cotton pants, African hat, and male sandals.",
  },
  "M-V1": {
    name: "Pakistani wide pants and long shirt",
    description: "Men's briefs, large polycotton pants, matching long polycotton shirt, socks, and athletic shoes.",
  },
  "M-V2": {
    name: "Pakistani ensemble with long underwear",
    description: "Men's briefs, long underwear pants, long-sleeved undershirt, large polycotton pants, matching long shirt, socks, and athletic shoes.",
  },
  "M-V3": {
    name: "Pakistani ensemble with underwear and coat",
    description: "Men's briefs, long underwear pants, long-sleeved undershirt, large polycotton pants, matching long shirt, coat, socks, and athletic shoes.",
  },
  "M-Z": {
    name: "Indian shirt, vest and trousers",
    description: "Men's briefs, polyester pants, cotton bananian vest, shirt, head towel, socks, and athletic shoes.",
  },
};

function havenithGarmentItems(description) {
  return description
    .replace(/\.$/, "")
    .split(/,\s+(?:and\s+)?/)
    .map(function (item) {
      return item.replace(/^and\s+/i, "").trim();
    })
    .filter(function (item) {
      return item.length > 0;
    });
}

function havenithRegionalClothingLabel(preset, regionKey) {
  var items = havenithGarmentItems(preset.description);
  var patterns = {
    head: /hijab|head|scarf|tagiya|iqal|ghutra|hat|burka/i,
    upperArms: /shirt|t-shirt|kameez|body layer|dress|abaya|jacket|coat|slip|boubou|blouse|saree|qipao|camisole|vest/i,
    forearms: /long-sleeved|long sleeved|kameez|dress|abaya|jacket|coat|boubou|saree/i,
    hands: /glove/i,
    chest: /bra|shirt|t-shirt|kameez|body layer|dress|abaya|jacket|coat|slip|boubou|blouse|saree|qipao|camisole|vest/i,
    abdomen: /briefs|underwear|shirt|t-shirt|kameez|body layer|dress|abaya|jacket|coat|slip|boubou|blouse|saree|qipao|camisole|vest/i,
    back: /shirt|t-shirt|kameez|body layer|dress|abaya|jacket|coat|slip|boubou|blouse|saree|qipao|camisole|vest/i,
    buttocks: /briefs|underwear|pants|trousers|jeans|skirt|dress|abaya|dishdasha|serwal|slip|boubou|qipao|saree|shorts|coat/i,
    upperLegs: /briefs|underwear|pants|trousers|jeans|skirt|dress|abaya|dishdasha|serwal|slip|boubou|qipao|saree|shorts|coat/i,
    lowerLegs: /pants|trousers|jeans|skirt|dress|abaya|dishdasha|serwal|boubou|qipao|saree|coat/i,
    feet: /sock|shoe|sandal/i,
  };
  var matchingItems = items.filter(function (item) {
    return patterns[regionKey].test(item);
  });

  if (matchingItems.length) return matchingItems.join(" + ");
  if (regionKey === "hands") return "Uncovered hands";
  if (regionKey === "head") return "Uncovered head";
  if (regionKey === "forearms") return "Uncovered forearms";
  if (regionKey === "lowerLegs") return "Uncovered lower legs";
  return "Uncovered / no listed garment";
}

function havenithParallelInsulation(regions) {
  var reciprocal = HAVENITH_REGION_KEYS.reduce(function (sum, key) {
    var value = parseFloat(regions[key]);
    if (!Number.isFinite(value) || value <= 0) return NaN;
    return sum + HAVENITH_REGION_WEIGHTS[key] / value;
  }, 0);
  return Number.isFinite(reciprocal) && reciprocal > 0
    ? 1 / reciprocal
    : NaN;
}

function havenithAdjustedClo(baseClo, baseRegions, editedRegions) {
  var baseRegionalInsulation = havenithParallelInsulation(baseRegions);
  var editedRegionalInsulation = havenithParallelInsulation(editedRegions);
  if (
    !Number.isFinite(baseClo) ||
    !Number.isFinite(baseRegionalInsulation) ||
    !Number.isFinite(editedRegionalInsulation)
  ) {
    return NaN;
  }
  return baseClo * (editedRegionalInsulation / baseRegionalInsulation);
}

function havenithPreset(code, country, gender, clo, values) {
  var details = HAVENITH_ENSEMBLE_DETAILS[gender + "-" + code];
  return {
    code,
    country,
    gender,
    clo,
    name: details.name,
    description: details.description,
    regions: HAVENITH_REGION_KEYS.reduce(function (regions, key, index) {
      regions[key] = values[index];
      return regions;
    }, {}),
  };
}

var HAVENITH_PRESET_ENSEMBLES = [
  havenithPreset("ASTM", "USA", "F", 0.79, [0.104, 0.271, 0.2, 0.105, 0.299, 0.458, 0.293, 0.358, 0.251, 0.171, 0.289]),
  havenithPreset("A1", "Pakistan", "F", 0.76, [0.102, 0.204, 0.175, 0.097, 0.248, 0.364, 0.229, 0.343, 0.246, 0.148, 0.152]),
  havenithPreset("A2", "India", "F", 0.92, [0.105, 0.222, 0.187, 0.095, 0.274, 0.336, 0.357, 0.422, 0.267, 0.159, 0.155]),
  havenithPreset("B1", "India", "F", 0.57, [0.104, 0.171, 0.106, 0.099, 0.234, 0.416, 0.215, 0.33, 0.242, 0.138, 0.164]),
  havenithPreset("B2", "India", "F", 0.74, [0.106, 0.186, 0.115, 0.099, 0.268, 0.411, 0.314, 0.397, 0.242, 0.139, 0.168]),
  havenithPreset("D1", "Pakistan", "F", 0.64, [0.104, 0.179, 0.125, 0.096, 0.241, 0.343, 0.203, 0.321, 0.239, 0.136, 0.159]),
  havenithPreset("D2", "Pakistan", "F", 0.69, [0.104, 0.186, 0.126, 0.091, 0.252, 0.356, 0.294, 0.381, 0.232, 0.135, 0.157]),
  havenithPreset("F1", "Pakistan", "F", 1.38, [0.148, 0.436, 0.282, 0.112, 0.432, 0.586, 0.479, 0.465, 0.274, 0.208, 0.302]),
  havenithPreset("F2", "Pakistan", "F", 1.33, [0.202, 0.329, 0.248, 0.116, 0.419, 0.538, 0.454, 0.396, 0.258, 0.211, 0.292]),
  havenithPreset("F3", "Pakistan", "F", 1.36, [0.222, 0.378, 0.255, 0.115, 0.471, 0.574, 0.494, 0.417, 0.255, 0.216, 0.301]),
  havenithPreset("F4", "Pakistan", "F", 1.21, [0.237, 0.332, 0.218, 0.107, 0.416, 0.398, 0.374, 0.384, 0.276, 0.215, 0.308]),
  havenithPreset("F5", "Pakistan", "F", 1.28, [0.145, 0.304, 0.267, 0.12, 0.39, 0.571, 0.408, 0.404, 0.264, 0.209, 0.296]),
  havenithPreset("F6", "Pakistan", "F", 1.38, [0.184, 0.32, 0.266, 0.123, 0.436, 0.579, 0.416, 0.433, 0.271, 0.214, 0.303]),
  havenithPreset("G1", "Indonesia", "F", 0.84, [0.106, 0.306, 0.305, 0.124, 0.371, 0.621, 0.313, 0.321, 0.2, 0.159, 0.273]),
  havenithPreset("G2", "Indonesia", "F", 0.95, [0.193, 0.305, 0.276, 0.114, 0.39, 0.597, 0.371, 0.321, 0.193, 0.158, 0.274]),
  havenithPreset("G3", "Indonesia", "F", 0.7, [0.19, 0.213, 0.196, 0.108, 0.264, 0.317, 0.264, 0.225, 0.164, 0.155, 0.302]),
  havenithPreset("H1", "Indonesia", "F", 0.81, [0.103, 0.231, 0.209, 0.116, 0.233, 0.301, 0.219, 0.282, 0.257, 0.146, 0.279]),
  havenithPreset("H2", "Indonesia", "F", 0.97, [0.2, 0.234, 0.203, 0.113, 0.278, 0.307, 0.265, 0.262, 0.251, 0.151, 0.273]),
  havenithPreset("L1", "Kuwait", "F", 0.67, [0.232, 0.222, 0.126, 0.089, 0.263, 0.251, 0.262, 0.243, 0.206, 0.172, 0.286]),
  havenithPreset("L2", "Kuwait", "F", 0.76, [0.229, 0.234, 0.152, 0.098, 0.319, 0.343, 0.328, 0.273, 0.18, 0.168, 0.278]),
  havenithPreset("L3", "Kuwait", "F", 1.26, [0.227, 0.401, 0.346, 0.144, 0.48, 0.698, 0.463, 0.465, 0.291, 0.169, 0.273]),
  havenithPreset("M-S1", "Kuwait", "F", 1.08, [0.102, 0.334, 0.25, 0.141, 0.308, 0.413, 0.312, 0.346, 0.291, 0.166, 0.202]),
  havenithPreset("M-S2", "Kuwait", "F", 1.27, [0.237, 0.36, 0.279, 0.142, 0.37, 0.414, 0.394, 0.352, 0.306, 0.151, 0.203]),
  havenithPreset("M-W1", "Kuwait", "F", 1.18, [0.101, 0.406, 0.33, 0.132, 0.367, 0.622, 0.359, 0.41, 0.35, 0.203, 0.308]),
  havenithPreset("M-W2", "Kuwait", "F", 1.54, [0.227, 0.416, 0.321, 0.126, 0.424, 0.615, 0.445, 0.421, 0.359, 0.207, 0.313]),
  havenithPreset("N", "Nigeria/Ghana", "F", 0.65, [0.129, 0.245, 0.113, 0.097, 0.222, 0.227, 0.209, 0.233, 0.196, 0.124, 0.163]),
  havenithPreset("O", "Nigeria/Ghana", "F", 0.79, [0.105, 0.267, 0.134, 0.098, 0.26, 0.331, 0.23, 0.336, 0.276, 0.152, 0.162]),
  havenithPreset("S", "Nigeria/Ghana", "F", 0.78, [0.105, 0.269, 0.174, 0.1, 0.228, 0.311, 0.227, 0.333, 0.24, 0.154, 0.156]),
  havenithPreset("W", "China", "F", 0.42, [0.096, 0.12, 0.094, 0.09, 0.21, 0.205, 0.191, 0.233, 0.192, 0.129, 0.215]),
  havenithPreset("X1", "India", "F", 0.58, [0.103, 0.127, 0.102, 0.1, 0.239, 0.24, 0.242, 0.262, 0.22, 0.149, 0.225]),
  havenithPreset("X2", "India", "F", 0.74, [0.149, 0.203, 0.105, 0.09, 0.283, 0.353, 0.355, 0.36, 0.248, 0.154, 0.264]),
  havenithPreset("Y1", "India", "F", 0.74, [0.105, 0.173, 0.103, 0.095, 0.272, 0.477, 0.198, 0.302, 0.314, 0.145, 0.16]),
  havenithPreset("Y2", "India", "F", 0.96, [0.159, 0.246, 0.097, 0.093, 0.368, 0.677, 0.405, 0.404, 0.363, 0.178, 0.281]),
  havenithPreset("ASTM", "USA", "M", 0.74, [0.099, 0.24, 0.19, 0.085, 0.282, 0.43, 0.275, 0.44, 0.242, 0.166, 0.241]),
  havenithPreset("C", "Pakistan", "M", 0.86, [0.099, 0.231, 0.208, 0.092, 0.207, 0.367, 0.215, 0.372, 0.315, 0.167, 0.219]),
  havenithPreset("E", "India", "M", 0.99, [0.104, 0.22, 0.221, 0.098, 0.199, 0.399, 0.198, 0.463, 0.375, 0.196, 0.237]),
  havenithPreset("I", "Indonesia", "M", 0.61, [0.103, 0.196, 0.094, 0.084, 0.227, 0.362, 0.202, 0.416, 0.213, 0.145, 0.233]),
  havenithPreset("J1", "Kuwait", "M", 1.1, [0.111, 0.258, 0.268, 0.101, 0.27, 0.452, 0.283, 0.421, 0.334, 0.204, 0.238]),
  havenithPreset("J2", "Kuwait", "M", 1.3, [0.182, 0.269, 0.258, 0.099, 0.333, 0.462, 0.354, 0.437, 0.341, 0.206, 0.239]),
  havenithPreset("J3", "Kuwait", "M", 1.74, [0.18, 0.369, 0.348, 0.101, 0.494, 0.711, 0.573, 0.575, 0.431, 0.21, 0.24]),
  havenithPreset("K1", "Kuwait", "M", 1.07, [0.102, 0.239, 0.23, 0.107, 0.277, 0.474, 0.278, 0.449, 0.363, 0.176, 0.192]),
  havenithPreset("K2", "Kuwait", "M", 1.36, [0.183, 0.255, 0.236, 0.103, 0.333, 0.481, 0.359, 0.484, 0.379, 0.175, 0.198]),
  havenithPreset("K3", "Kuwait", "M", 1.76, [0.178, 0.36, 0.328, 0.114, 0.452, 0.688, 0.541, 0.647, 0.472, 0.183, 0.194]),
  havenithPreset("P", "Nigeria/Ghana", "M", 0.64, [0.1, 0.233, 0.164, 0.091, 0.207, 0.375, 0.221, 0.293, 0.226, 0.152, 0.154]),
  havenithPreset("Q", "Nigeria/Ghana", "M", 0.61, [0.099, 0.228, 0.099, 0.086, 0.211, 0.384, 0.233, 0.339, 0.231, 0.152, 0.152]),
  havenithPreset("R", "Nigeria/Ghana", "M", 1.4, [0.117, 0.433, 0.321, 0.144, 0.319, 0.617, 0.339, 0.505, 0.364, 0.201, 0.171]),
  havenithPreset("T", "Nigeria/Ghana", "M", 0.45, [0.101, 0.235, 0.155, 0.087, 0.197, 0.34, 0.218, 0.405, 0.159, 0.074, 0.139]),
  havenithPreset("U", "Nigeria/Ghana", "M", 0.84, [0.12, 0.254, 0.112, 0.085, 0.228, 0.411, 0.208, 0.333, 0.284, 0.153, 0.158]),
  havenithPreset("V1", "Pakistan", "M", 0.9, [0.101, 0.233, 0.202, 0.097, 0.211, 0.47, 0.203, 0.482, 0.327, 0.167, 0.233]),
  havenithPreset("V2", "Pakistan", "M", 1.06, [0.101, 0.277, 0.252, 0.097, 0.279, 0.623, 0.277, 0.613, 0.369, 0.205, 0.235]),
  havenithPreset("V3", "Pakistan", "M", 1.23, [0.087, 0.382, 0.361, 0.119, 0.406, 0.928, 0.42, 0.654, 0.459, 0.208, 0.235]),
  havenithPreset("Z", "India", "M", 0.61, [0.145, 0.166, 0.097, 0.085, 0.256, 0.372, 0.309, 0.369, 0.167, 0.166, 0.239]),
];

root.HAVENITH_REGION_KEYS = HAVENITH_REGION_KEYS;
root.HAVENITH_REGION_LABELS = HAVENITH_REGION_LABELS;
root.HAVENITH_REGION_WEIGHTS = HAVENITH_REGION_WEIGHTS;
root.HAVENITH_ENSEMBLE_DETAILS = HAVENITH_ENSEMBLE_DETAILS;
root.havenithGarmentItems = havenithGarmentItems;
root.havenithRegionalClothingLabel = havenithRegionalClothingLabel;
root.HAVENITH_PRESET_ENSEMBLES = HAVENITH_PRESET_ENSEMBLES;
root.havenithParallelInsulation = havenithParallelInsulation;
root.havenithAdjustedClo = havenithAdjustedClo;

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    HAVENITH_REGION_KEYS,
    HAVENITH_REGION_LABELS,
    HAVENITH_REGION_WEIGHTS,
    HAVENITH_ENSEMBLE_DETAILS,
    havenithGarmentItems,
    havenithRegionalClothingLabel,
    HAVENITH_PRESET_ENSEMBLES,
    havenithParallelInsulation,
    havenithAdjustedClo,
  };
}
})(typeof window !== "undefined" ? window : this);
