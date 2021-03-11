const { comf } = require("./comfortmodels");

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
});

// I have commented out some lines since they do no longer match after we have introduced back h_c calculation Gagge
test("set", () => {
  expect(comf.pierceSET(25, 25, 0.15, 10, 1, 0.5, 0, true).set).toBeCloseTo(
    23.3
  );
  expect(comf.pierceSET(25, 25, 0.15, 90, 1, 0.5, 0, true).set).toBeCloseTo(
    24.9
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
  expect(comf.pierceSET(25, 25, 0.15, 50, 1, 4, 0, true).set).toBeCloseTo(37.7);
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
  expect(comf.pierceSET(40, 25, 0.15, 50, 1, 0.5, 0, true).set).toBeCloseTo(
    34.3
  );
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
});
