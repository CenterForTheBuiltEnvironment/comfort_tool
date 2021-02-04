const { radians_to_degrees, degrees_to_radians, ERF } = require("./erf");

test("converts degree to radians", () => {
  expect(degrees_to_radians(60)).toBeCloseTo(1.0472);
  expect(degrees_to_radians(180)).toBeCloseTo(3.14159);
});

test("converts radians to degree", () => {
  expect(radians_to_degrees(1)).toBeCloseTo(57.2958);
});

test("ERF function", () => {
  expect(ERF(45, 0, "seated", 700, 0.8, 0.2, 0.5, 0.7).ERF).toBeCloseTo(
    64.9,
    1
  );
  expect(ERF(45, 0, "seated", 700, 0.8, 0.2, 0.5, 0.7).dMRT).toBeCloseTo(
    15.5,
    1
  );
});
