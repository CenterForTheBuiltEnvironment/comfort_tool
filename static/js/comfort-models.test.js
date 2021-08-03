/*
The file is used to test the various functions in comfort-models.js
Always run the following tests before publishing a new version of the comfort tool.
These tests use the data data as in pythermalcomfort/tests/test_models.py
*/

const { comf } = require("./comfort-models");
const { util } = require("./util");

test("phs", () => {
  expect(comf.phs(35, 35, 71, 0.3, 150, 0.5, 2, true)["t_re"]).toEqual(39.8);
  expect(comf.phs(30, 50, 70.65, 0.3, 150, 0.5, 2, true)["t_re"]).toEqual(37.7);
  expect(comf.phs(43, 43, 34.7, 0.3, 103, 0.5, 1, true)["t_re"]).toEqual(37.3);
  expect(comf.phs(40, 40, 40.63, 0.3, 150, 0.4, 2, true)["t_re"]).toEqual(37.5);
});

test("pmv", () => {
  expect(comf.pmv(22, 22, 0.1, 60, 1.2, 0.5).pmv).toBeCloseTo(-0.75);
  expect(comf.pmv(27, 27, 0.1, 60, 1.2, 0.5).pmv).toBeCloseTo(0.77);
  expect(comf.pmv(27, 27, 0.3, 60, 1.2, 0.5).pmv).toBeCloseTo(0.4338);
  expect(comf.pmv(23.5, 25.5, 0.1, 60, 1.2, 0.5).pmv).toBeCloseTo(-0.01);
  expect(comf.pmv(23.5, 25.5, 0.3, 60, 1.2, 0.5).pmv).toBeCloseTo(-0.55);
  expect(comf.pmv(19, 19, 0.1, 40, 1.2, 1.0).pmv).toBeCloseTo(-0.6);
  // expect(comf.pmv(23.5, 23.5, 0.1, 40, 1.2, 1.0).pmv).toBeCloseTo(0.5);
  expect(comf.pmv(23.5, 23.5, 0.3, 40, 1.2, 1.0).pmv).toBeCloseTo(0.12);
  expect(comf.pmv(23.0, 21.0, 0.1, 40, 1.2, 1.0).pmv).toBeCloseTo(0.05);
  expect(comf.pmv(23.0, 21.0, 0.3, 40, 1.2, 1.0).pmv).toBeCloseTo(-0.1662);
  expect(comf.pmv(22.0, 22.0, 0.1, 60, 1.6, 0.5).pmv).toBeCloseTo(0.05);
  expect(comf.pmv(27.0, 27.0, 0.1, 60, 1.6, 0.5).pmv).toBeCloseTo(1.17);
  expect(comf.pmv(27.0, 27.0, 0.3, 60, 1.6, 0.5).pmv).toBeCloseTo(0.95);
  expect(comf.pmv(19.6, 19.6, 0.1, 86, 1.1, 1).pmv).toBeCloseTo(-0.5, 1);
  expect(comf.pmv(23.9, 23.9, 0.1, 66, 1.1, 1).pmv).toBeCloseTo(0.5, 1);
  expect(comf.pmv(25.7, 25.7, 0.1, 15, 1.1, 1).pmv).toBeCloseTo(0.5, 1);
  expect(comf.pmv(21.2, 21.2, 0.1, 20, 1.1, 1).pmv).toBeCloseTo(-0.5, 1);
  expect(comf.pmv(23.6, 23.6, 0.1, 67, 1.1, 0.5).pmv).toBeCloseTo(-0.5, 1);
});

test("calculate heat strain for 0.2 m/s", () => {
  expect(
    comf.pierceSET(46.5, 46.5, 0.2, 10, 1.1, 0.5, 0, true).thermal_strain
  ).toBeFalsy();
  expect(
    comf.pierceSET(46.87, 46.87, 0.2, 10, 1.1, 0.5, 0, true).thermal_strain
  ).toBeTruthy();
  expect(
    comf.pierceSET(45.6, 45.6, 0.2, 20, 1.1, 0.5, 0, true).thermal_strain
  ).toBeFalsy();
  expect(
    comf.pierceSET(45.8, 45.8, 0.2, 20, 1.1, 0.5, 0, true).thermal_strain
  ).toBeTruthy();
  expect(
    comf.pierceSET(42.4, 42.4, 0.2, 30, 1.1, 0.5, 0, true).thermal_strain
  ).toBeFalsy();
  expect(
    comf.pierceSET(42.6, 42.6, 0.2, 30, 1.1, 0.5, 0, true).thermal_strain
  ).toBeTruthy();
  expect(
    comf.pierceSET(45, 45, 0.8, 20, 1.1, 0.5, 0, true).thermal_strain
  ).toBeFalsy();
  expect(
    comf.pierceSET(45.2, 45.2, 0.8, 20, 1.1, 0.5, 0, true).thermal_strain
  ).toBeTruthy();
  expect(
    comf.pierceSET(32.4, 32.4, 0.3, 82, 1.4, 0.3, 0, true, false, 80)
      .thermal_strain
  ).toBeFalsy();
  expect(
    comf.pierceSET(33, 33, 0.3, 82, 1.4, 0.3, 0, true, false, 80).thermal_strain
  ).toBeTruthy();
  expect(
    comf.pierceSET(32.2, 32.2, 0.2, 82, 1.4, 0.3, 0, true, false, 80)
      .thermal_strain
  ).toBeFalsy();
});

test("temperature converter", () => {
  expect(util.FtoC(77)).toBeCloseTo(25, 1);
  expect(util.CtoF(25)).toBeCloseTo(77, 1);
});

test("cooling effect", () => {
  expect(
    comf.cooling_effect(25, 25, 0.05, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(0, 1);
  expect(
    comf.cooling_effect(25, 25, 0.5, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(2.17, 1);
  expect(
    comf.cooling_effect(27, 25, 0.5, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(1.85, 1);
  expect(
    comf.cooling_effect(29, 25, 0.5, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(1.63, 2);
  expect(
    comf.cooling_effect(31, 25, 0.5, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(1.42, 2);
  expect(
    comf.cooling_effect(25, 27, 0.5, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(2.44, 2);
  expect(
    comf.cooling_effect(25, 29, 0.5, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(2.81, 1);
  expect(
    comf.cooling_effect(25, 25, 0.2, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(0.66, 2);
  expect(
    comf.cooling_effect(25, 25, 0.8, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(2.93, 2);
  expect(
    comf.cooling_effect(25, 25, 0.0, 50, 1, 0.6, 0, "standing")
  ).toBeCloseTo(0, 2);
  expect(
    comf.cooling_effect(25, 25, 0.5, 60, 1, 0.6, 0, "standing")
  ).toBeCloseTo(2.13, 2);
  expect(
    comf.cooling_effect(25, 25, 0.5, 80, 1, 0.6, 0, "standing")
  ).toBeCloseTo(2.06, 2);
  expect(
    comf.cooling_effect(25, 25, 0.5, 20, 1, 0.6, 0, "standing")
  ).toBeCloseTo(2.29, 2);
  expect(
    comf.cooling_effect(25, 25, 0.5, 60, 1.3, 0.6, 0, "standing")
  ).toBeCloseTo(2.83, 2);
  expect(
    comf.cooling_effect(25, 25, 0.5, 60, 1.6, 0.6, 0, "standing")
  ).toBeCloseTo(3.5, 1);
  expect(
    comf.cooling_effect(25, 25, 0.5, 60, 1, 0.3, 0, "standing")
  ).toBeCloseTo(2.41, 2);
  expect(comf.cooling_effect(25, 25, 0.5, 60, 1, 1, 0, "standing")).toBeCloseTo(
    2.05,
    2
  );
});

// I have commented out some lines since they do no longer match after we have introduced back h_c calculation Gagge
test("calculate SET temperature", () => {
  // the test belows are test Federico has implemented to check that both the pythermalcomfort and CBE TCT gives same results
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 2, 0.5, 0, true, false, 90, "standing").set
  ).toBeCloseTo(24.0);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 3, 0.5, 0, true, false, 90, "standing").set
  ).toBeCloseTo(27.5);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 4, 0.5, 0, true, false, 90, "standing").set
  ).toBeCloseTo(30.3);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.5, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(22.3);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.75, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(24.9);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.1, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(17.6);
  expect(
    comf.pierceSET(29, 25, 1.1, 50, 1.5, 0.5, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(25.0);
  expect(
    comf.pierceSET(27, 25, 1.1, 50, 1.5, 0.75, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(26.2);
  expect(
    comf.pierceSET(20, 25, 1.1, 50, 1.5, 0.1, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(13.4);
  expect(
    comf.pierceSET(25, 27, 1.1, 50, 1.5, 0.5, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(22.9);
  expect(
    comf.pierceSET(25, 29, 1.1, 50, 1.5, 0.5, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(23.5);
  expect(
    comf.pierceSET(25, 31, 1.1, 50, 1.5, 0.5, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(24.0);
  expect(
    comf.pierceSET(25, 27, 1.3, 50, 1.5, 0.5, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(22.6);
  expect(
    comf.pierceSET(25, 29, 1.5, 50, 1.5, 0.5, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(22.8);
  expect(
    comf.pierceSET(25, 31, 1.7, 50, 1.5, 0.5, 0, true, false, 90, "standing")
      .set
  ).toBeCloseTo(23.1);
});

test("calculate SET temperature in Fahrenheit", () => {
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(74.9).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(59),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(66.5).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(68),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(70.7).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(86),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(79.6).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(104),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(93.6).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      10,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(74.0).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      90,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(76.8).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      19.7 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(75.2).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      118.1 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(70.4).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      216.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(68.4).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      590.6 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(65.6).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(50),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(59.6).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(104),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(88.9).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      1,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(81.0).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      2,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(90.4).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      4,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(100.01).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      0.8,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(73.9).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(32),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true,
      false,
      90,
      "standing"
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(53.7).toFixed(1)));
});

test("SET equation to calculate Cooling effect", () => {
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 2, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(20.5);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 3, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(20.9);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(20.5);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.75, 0, true, true, 90, "standing")
      .set
  ).toBeCloseTo(23.1);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.1, 0, true, true, 90, "standing").set
  ).toBeCloseTo(15.6);
  expect(
    comf.pierceSET(29, 25, 1.1, 50, 1.5, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(23.3);
  expect(
    comf.pierceSET(27, 25, 1.1, 50, 1.5, 0.75, 0, true, true, 90, "standing")
      .set
  ).toBeCloseTo(24.5);
  expect(
    comf.pierceSET(20, 25, 1.1, 50, 1.5, 0.1, 0, true, true, 90, "standing").set
  ).toBeCloseTo(11.2);
  expect(
    comf.pierceSET(25, 27, 1.1, 50, 1.5, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(21.1);
  expect(
    comf.pierceSET(25, 29, 1.1, 50, 1.5, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(21.7);
  expect(
    comf.pierceSET(25, 31, 1.1, 50, 1.5, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(22.3);
  expect(
    comf.pierceSET(25, 27, 1.3, 50, 1.5, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(20.8);
  expect(
    comf.pierceSET(25, 29, 1.5, 50, 1.5, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(21.1);
  expect(
    comf.pierceSET(25, 31, 1.7, 50, 1.5, 0.5, 0, true, true, 90, "standing").set
  ).toBeCloseTo(21.4);
});
