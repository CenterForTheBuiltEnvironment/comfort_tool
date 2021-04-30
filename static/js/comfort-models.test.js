/*
The file is used to test the various functions in comfort-models.js
Always run the following tests before publishing a new version of the comfort tool.
These tests use the data data as in pythermalcomfort/tests/test_models.py
*/

const { comf } = require("./comfort-models");
const { util } = require("./util");

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

test("temperature converter", () => {
  expect(util.FtoC(77)).toBeCloseTo(25, 1);
  expect(util.CtoF(25)).toBeCloseTo(77, 1);
});

test("cooling effect", () => {
  expect(comf.cooling_effect(25, 25, 0.05, 50, 1, 0.6)).toBeCloseTo(0, 1);
  expect(comf.cooling_effect(25, 25, 0.5, 50, 1, 0.6)).toBeCloseTo(2.1, 1);
  expect(comf.cooling_effect(27, 25, 0.5, 50, 1, 0.6)).toBeCloseTo(1.78, 1);
  expect(comf.cooling_effect(29, 25, 0.5, 50, 1, 0.6)).toBeCloseTo(1.57, 2);
  expect(comf.cooling_effect(31, 25, 0.5, 50, 1, 0.6)).toBeCloseTo(1.36, 2);
  expect(comf.cooling_effect(25, 27, 0.5, 50, 1, 0.6)).toBeCloseTo(2.38, 2);
  expect(comf.cooling_effect(25, 29, 0.5, 50, 1, 0.6)).toBeCloseTo(2.7, 1);
  expect(comf.cooling_effect(25, 25, 0.2, 50, 1, 0.6)).toBeCloseTo(0.64, 2);
  expect(comf.cooling_effect(25, 25, 0.8, 50, 1, 0.6)).toBeCloseTo(2.85, 2);
  expect(comf.cooling_effect(25, 25, 0.0, 50, 1, 0.6)).toBeCloseTo(0, 2);
  expect(comf.cooling_effect(25, 25, 0.5, 60, 1, 0.6)).toBeCloseTo(2.07, 2);
  expect(comf.cooling_effect(25, 25, 0.5, 80, 1, 0.6)).toBeCloseTo(2.0, 2);
  expect(comf.cooling_effect(25, 25, 0.5, 20, 1, 0.6)).toBeCloseTo(2.23, 2);
  expect(comf.cooling_effect(25, 25, 0.5, 60, 1.3, 0.6)).toBeCloseTo(2.76, 2);
  expect(comf.cooling_effect(25, 25, 0.5, 60, 1.6, 0.6)).toBeCloseTo(3.4, 1);
  expect(comf.cooling_effect(25, 25, 0.5, 60, 1, 0.3)).toBeCloseTo(2.34, 2);
  expect(comf.cooling_effect(25, 25, 0.5, 60, 1, 1)).toBeCloseTo(2.0, 2);
});

// I have commented out some lines since they do no longer match after we have introduced back h_c calculation Gagge
test("calculate SET temperature", () => {
  expect(comf.pierceSET(25, 25, 0.15, 10, 1, 0.5, 0, true).set).toBeCloseTo(
    23.3
  );
  expect(comf.pierceSET(25, 25, 0.15, 90, 1, 0.5, 0, true).set).toBeCloseTo(
    24.8
  );
  expect(comf.pierceSET(25, 25, 0.1, 50, 1, 0.5, 0, true).set).toBeCloseTo(24);
  expect(comf.pierceSET(25, 25, 0.6, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    21.4
  );
  expect(comf.pierceSET(25, 25, 3, 50, 1, 0.5, 0, true).set).toBeCloseTo(18.8);
  expect(comf.pierceSET(25, 25, 0.15, 50, 1, 0.1, 0, true).set).toBeCloseTo(
    20.7
  );
  expect(comf.pierceSET(25, 25, 0.15, 50, 1, 2, 0, true).set).toBeCloseTo(32.5);
  expect(comf.pierceSET(25, 25, 0.15, 50, 1, 4, 0, true).set).toBeCloseTo(37.8);
  expect(comf.pierceSET(25, 25, 0.15, 50, 0.8, 0.5, 0, true).set).toBeCloseTo(
    23.3
  );
  // expect(comf.pierceSET(25, 25, 0.15, 50, 2, 0.5, 0, true).set).toBeCloseTo(
  //   29.7
  // );
  expect(comf.pierceSET(10, 25, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(17);
  expect(comf.pierceSET(15, 25, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    19.3
  );
  expect(comf.pierceSET(20, 25, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    21.6
  );
  expect(comf.pierceSET(30, 25, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    26.4
  );
  // expect(comf.pierceSET(40, 25, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
  //   34.3
  // );
  expect(comf.pierceSET(25, 25, 0.15, 50, 1, 1, 0, true).set).toBeCloseTo(27.3);
  expect(comf.pierceSET(25, 25, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    23.8
  );
  expect(comf.pierceSET(0, 25, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    12.3
  );
  expect(comf.pierceSET(25, 40, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    31.8
  );
  expect(comf.pierceSET(25, 10, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    15.2
  );
  // expect(comf.pierceSET(25, 25, 0.15, 50, 4, 0.5, 0, true).set).toBeCloseTo(36);
  expect(comf.pierceSET(25, 25, 1.1, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    20.3
  );
  // the test belows are test Federico has implemented to check that both the pythermalcomfort and CBE TCT gives same results
  expect(comf.pierceSET(25, 25, 1.1, 50, 2, 0.5, 0, true).set).toBeCloseTo(
    24.1
  );
  expect(comf.pierceSET(25, 25, 1.1, 50, 3, 0.5, 0, true).set).toBeCloseTo(
    27.5
  );
  expect(comf.pierceSET(25, 25, 1.1, 50, 4, 0.5, 0, true).set).toBeCloseTo(
    30.4
  );
  expect(comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.5, 0, true).set).toBeCloseTo(
    22.4
  );
  expect(comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.75, 0, true).set).toBeCloseTo(
    25.0
  );
  expect(comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.1, 0, true).set).toBeCloseTo(
    17.6
  );
  expect(comf.pierceSET(29, 25, 1.1, 50, 1.5, 0.5, 0, true).set).toBeCloseTo(
    25.1
  );
  expect(comf.pierceSET(27, 25, 1.1, 50, 1.5, 0.75, 0, true).set).toBeCloseTo(
    26.3
  );
  expect(comf.pierceSET(20, 25, 1.1, 50, 1.5, 0.1, 0, true).set).toBeCloseTo(
    13.5
  );
  expect(comf.pierceSET(25, 27, 1.1, 50, 1.5, 0.5, 0, true).set).toBeCloseTo(
    23.0
  );
  expect(comf.pierceSET(25, 29, 1.1, 50, 1.5, 0.5, 0, true).set).toBeCloseTo(
    23.6
  );
  expect(comf.pierceSET(25, 31, 1.1, 50, 1.5, 0.5, 0, true).set).toBeCloseTo(
    24.2
  );
  expect(comf.pierceSET(25, 27, 1.3, 50, 1.5, 0.5, 0, true).set).toBeCloseTo(
    22.7
  );
  expect(comf.pierceSET(25, 29, 1.5, 50, 1.5, 0.5, 0, true).set).toBeCloseTo(
    22.9
  );
  expect(comf.pierceSET(25, 31, 1.7, 50, 1.5, 0.5, 0, true).set).toBeCloseTo(
    23.2
  );
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
      true
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
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(66.7).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(68),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(70.8).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(86),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true
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
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(93.4).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      10,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(73.9).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      90,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(76.7).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      19.7 / 196.9,
      50,
      1,
      0.5,
      0,
      true
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
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(70.5).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      216.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(68.6).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      590.6 / 196.9,
      50,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(65.8).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(50),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(59.3).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(104),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(89.2).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      1,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(81.1).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      2,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(90.5).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      4,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(100.1).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      0.8,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(73.9).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(77),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.1,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(69.3).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(50),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(62.55).toFixed(1)));
  expect(
    comf.pierceSET(
      util.FtoC(32),
      util.FtoC(77),
      29.5 / 196.9,
      50,
      1,
      0.5,
      0,
      true
    ).set
  ).toBeCloseTo(parseFloat(util.FtoC(54.1).toFixed(1)));
});

test("SET equation to calculate Cooling effect", () => {
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 2, 0.5, 0, true, true).set
  ).toBeCloseTo(20.8);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 3, 0.5, 0, true, true).set
  ).toBeCloseTo(21.3);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.5, 0, true, true).set
  ).toBeCloseTo(20.6);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.75, 0, true, true).set
  ).toBeCloseTo(23.3);
  expect(
    comf.pierceSET(25, 25, 1.1, 50, 1.5, 0.1, 0, true, true).set
  ).toBeCloseTo(15.8);
  expect(
    comf.pierceSET(29, 25, 1.1, 50, 1.5, 0.5, 0, true, true).set
  ).toBeCloseTo(23.4);
  expect(
    comf.pierceSET(27, 25, 1.1, 50, 1.5, 0.75, 0, true, true).set
  ).toBeCloseTo(24.7);
  expect(
    comf.pierceSET(20, 25, 1.1, 50, 1.5, 0.1, 0, true, true).set
  ).toBeCloseTo(11.4);
  expect(
    comf.pierceSET(25, 27, 1.1, 50, 1.5, 0.5, 0, true, true).set
  ).toBeCloseTo(21.3);
  expect(
    comf.pierceSET(25, 29, 1.1, 50, 1.5, 0.5, 0, true, true).set
  ).toBeCloseTo(21.9);
  expect(
    comf.pierceSET(25, 31, 1.1, 50, 1.5, 0.5, 0, true, true).set
  ).toBeCloseTo(22.5);
  expect(
    comf.pierceSET(25, 27, 1.3, 50, 1.5, 0.5, 0, true, true).set
  ).toBeCloseTo(20.9);
  expect(
    comf.pierceSET(25, 29, 1.5, 50, 1.5, 0.5, 0, true, true).set
  ).toBeCloseTo(21.3);
  expect(
    comf.pierceSET(25, 31, 1.7, 50, 1.5, 0.5, 0, true, true).set
  ).toBeCloseTo(21.6);
});
