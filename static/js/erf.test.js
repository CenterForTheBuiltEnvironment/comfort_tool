/*
The file is used to test the various functions in erf.js
Always run the following tests before publishing a new version of the comfort tool.
These tests use the data data as in pythermalcomfort/tests/test_models.py
*/

const { radians_to_degrees, degrees_to_radians, ERF } = require("./erf");

test("converts degree to radians", () => {
  expect(degrees_to_radians(60)).toBeCloseTo(1.0472);
  expect(degrees_to_radians(180)).toBeCloseTo(3.14159);
});

test("converts radians to degree", () => {
  expect(radians_to_degrees(1)).toBeCloseTo(57.2958);
});

test("ERF function", () => {
  // testing ERF results
  expect(ERF(0, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    43.3,
    1
  );
  expect(ERF(60, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    63.2,
    1
  );
  expect(ERF(90, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    65.3,
    1
  );
  expect(ERF(30, 0, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    63.1,
    1
  );
  expect(ERF(30, 30, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    62.4,
    1
  );
  expect(ERF(30, 60, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    60.5,
    1
  );
  expect(ERF(30, 90, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    57.2,
    1
  );
  expect(ERF(30, 150, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    51.7,
    1
  );
  expect(ERF(30, 180, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    49.0,
    1
  );
  expect(ERF(30, 120, "standing", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    59.3,
    1
  );
  expect(ERF(30, 120, "seated", 400, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    27.4,
    1
  );
  expect(ERF(30, 120, "seated", 600, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    41.1,
    1
  );
  expect(ERF(30, 120, "seated", 1000, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    68.5,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.1, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    11.0,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.3, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    32.9,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.7, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    76.7,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.1, 0.5, 0.7).ERF).toBeCloseTo(
    29.3,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.3, 0.5, 0.7).ERF).toBeCloseTo(
    42.1,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.7, 0.5, 0.7).ERF).toBeCloseTo(
    67.5,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.1, 0.7).ERF).toBeCloseTo(
    36.4,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.3, 0.7).ERF).toBeCloseTo(
    45.6,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.7, 0.7).ERF).toBeCloseTo(
    64.0,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.3).ERF).toBeCloseTo(
    23.5,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.5).ERF).toBeCloseTo(
    39.1,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.9).ERF).toBeCloseTo(
    70.4,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    54.8,
    1
  );
  // testing delta mean radiant temperature results
  expect(ERF(45, 0, "seated", 700, 0.8, 0.2, 0.5, 0.7).dMRT).toBeCloseTo(
    15.5,
    1
  );
  expect(ERF(0, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    10.4,
    1
  );
  expect(ERF(60, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    15.1,
    1
  );
  expect(ERF(90, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    15.6,
    1
  );
  expect(ERF(30, 0, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    15.1,
    1
  );
  expect(ERF(30, 30, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    14.9,
    1
  );
  expect(ERF(30, 60, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    14.5,
    1
  );
  expect(ERF(30, 90, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    13.7,
    1
  );
  expect(ERF(30, 150, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    12.4,
    1
  );
  expect(ERF(30, 180, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    11.7,
    1
  );
  expect(ERF(30, 120, "standing", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    13.6,
    1
  );
  expect(ERF(30, 120, "seated", 400, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    6.6,
    1
  );
  expect(ERF(30, 120, "seated", 600, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    9.8,
    1
  );
  expect(ERF(30, 120, "seated", 1000, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    16.4,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.1, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    2.6,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.3, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    7.9,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.7, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    18.4,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.1, 0.5, 0.7).dMRT).toBeCloseTo(
    7.0,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.3, 0.5, 0.7).dMRT).toBeCloseTo(
    10.1,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.7, 0.5, 0.7).dMRT).toBeCloseTo(
    16.2,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.1, 0.7).dMRT).toBeCloseTo(
    8.7,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.3, 0.7).dMRT).toBeCloseTo(
    10.9,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.7, 0.7).dMRT).toBeCloseTo(
    15.3,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.3).dMRT).toBeCloseTo(
    5.6,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.5).dMRT).toBeCloseTo(
    9.4,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.9).dMRT).toBeCloseTo(
    16.9,
    1
  );
  expect(ERF(30, 120, "seated", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    13.1,
    1
  );
  expect(ERF(45, 0, "seated", 700, 0.8, 0.2, 0.5, 0.7).ERF).toBeCloseTo(
    64.9,
    1
  );
  // testing supine
  expect(ERF(45, 0, "supine", 700, 0.8, 0.2, 0.5, 0.7).ERF).toBeCloseTo(
    60.9,
    1
  );
  expect(ERF(45, 0, "supine", 700, 0.8, 0.2, 0.5, 0.7).dMRT).toBeCloseTo(
    14.0,
    1
  );
  expect(ERF(45, 45, "supine", 700, 0.8, 0.2, 0.5, 0.7).ERF).toBeCloseTo(
    65.8,
    1
  );
  expect(ERF(45, 45, "supine", 700, 0.8, 0.2, 0.5, 0.7).dMRT).toBeCloseTo(
    15.1,
    1
  );
  expect(ERF(45, 45, "supine", 800, 0.5, 0.5, 0.5, 0.7).ERF).toBeCloseTo(
    70.9,
    1
  );
  expect(ERF(45, 45, "supine", 800, 0.5, 0.5, 0.5, 0.7).dMRT).toBeCloseTo(
    16.3,
    1
  );
});
