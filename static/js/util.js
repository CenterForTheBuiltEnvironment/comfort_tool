var util = util || {};

util.STATIC_URL = '/static';

if (typeof module !== 'undefined' && module.exports) {
  module.exports.util = util
}

util.bisect = function(a, b, fn, epsilon, target) {
    var a_T, b_T, midpoint, midpoint_T;
    while (Math.abs(b - a) > 2 * epsilon) {
        midpoint = (b + a) / 2;
        a_T = fn(a);
        b_T = fn(b);
        midpoint_T = fn(midpoint);
        if ((a_T - target) * (midpoint_T - target) < 0) b = midpoint;
        else if ((b_T - target) * (midpoint_T - target) < 0) a = midpoint;
        else return -999;
    }
    return midpoint;
}

util.secant = function(a, b, fn, epsilon) {
  // root-finding only
  var f1 = fn(a);
  if (Math.abs(f1) <= epsilon) return a;
  var f2 = fn(b);
  if (Math.abs(f2) <= epsilon) return b;
  var slope, c, f3;
  for (var i = 0; i < 100; i++){
    slope = (f2 - f1) / (b - a);
    c = b - f2/slope;
    f3 = fn(c);
    if (Math.abs(f3) < epsilon) return c;
    a = b;
    b = c;
    f1 = f2;
    f2 = f3
  }
  return NaN
};

util.getSensation = function(pmv) {
    if (pmv < -2.5) return '<span>Cold</span>';
    else if (pmv < -1.5) return '<span">Cool</span>';
    else if (pmv < -0.5) return '<span>Slightly Cool</span>';
    else if (pmv < 0.5) return '<span>Neutral</span>';
    else if (pmv < 1.5) return '<span>Slightly Warm</span>';
    else if (pmv < 2.5) return '<span">Warm</span>';
    else return '<span">Hot</span>';
};

util.CtoF = function(x){
    return x * 9 / 5 + 32;
}

util.FtoC = function(x) {
    return (x - 32) * 5 / 9;
}

/*
def secant_solve(f,x1,x2,ftol,xtol):
    f1 = f(x1)
      if abs(f1) <= ftol : return x1        # already effectively zero
      f2 = f(x2)
      if abs(f2) <= ftol : return x2        # already effectively zero
      while abs(x2 - x1) > xtol :
        slope = (f2 - f1)/(x2 - x1)
        if slope == 0 :
          sys.stderr.write("Division by 0 due to vanishing slope - exit!\n")
          sys.exit(1)
        x3 = x2 - f2/slope               # the new approximate zero
        f3 = f(x3)                       # and its function value
        if abs(f3) <= ftol : break
        x1,f1 = x2,f2                    # copy x2,f2 to x1,f1
        x2,f2 = x3,f3                    # copy x3,f3 to x2,f2
      return x3
*/
