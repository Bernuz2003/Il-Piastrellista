// node_modules/d3-array/src/ascending.js
function ascending(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-array/src/descending.js
function descending(a, b) {
  return a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

// node_modules/d3-array/src/bisector.js
function bisector(f) {
  let compare1, compare2, delta;
  if (f.length !== 2) {
    compare1 = ascending;
    compare2 = (d, x) => ascending(f(d), x);
    delta = (d, x) => f(d) - x;
  } else {
    compare1 = f === ascending || f === descending ? f : zero;
    compare2 = f;
    delta = f;
  }
  function left(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0) return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function right(a, x, lo = 0, hi = a.length) {
    if (lo < hi) {
      if (compare1(x, x) !== 0) return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a[mid], x) <= 0) lo = mid + 1;
        else hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function center(a, x, lo = 0, hi = a.length) {
    const i = left(a, x, lo, hi - 1);
    return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
  }
  return { left, center, right };
}
function zero() {
  return 0;
}

// node_modules/d3-array/src/number.js
function number(x) {
  return x === null ? NaN : +x;
}
function* numbers(values, valueof) {
  if (valueof === void 0) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        yield value;
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && (value = +value) >= value) {
        yield value;
      }
    }
  }
}

// node_modules/d3-array/src/bisect.js
var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
var bisectLeft = ascendingBisect.left;
var bisectCenter = bisector(number).center;
var bisect_default = bisectRight;

// node_modules/d3-array/src/blur.js
function blur(values, r) {
  if (!((r = +r) >= 0)) throw new RangeError("invalid r");
  let length3 = values.length;
  if (!((length3 = Math.floor(length3)) >= 0)) throw new RangeError("invalid length");
  if (!length3 || !r) return values;
  const blur3 = blurf(r);
  const temp = values.slice();
  blur3(values, temp, 0, length3, 1);
  blur3(temp, values, 0, length3, 1);
  blur3(values, temp, 0, length3, 1);
  return values;
}
var blur2 = Blur2(blurf);
var blurImage = Blur2(blurfImage);
function Blur2(blur3) {
  return function(data, rx, ry = rx) {
    if (!((rx = +rx) >= 0)) throw new RangeError("invalid rx");
    if (!((ry = +ry) >= 0)) throw new RangeError("invalid ry");
    let { data: values, width, height } = data;
    if (!((width = Math.floor(width)) >= 0)) throw new RangeError("invalid width");
    if (!((height = Math.floor(height !== void 0 ? height : values.length / width)) >= 0)) throw new RangeError("invalid height");
    if (!width || !height || !rx && !ry) return data;
    const blurx = rx && blur3(rx);
    const blury = ry && blur3(ry);
    const temp = values.slice();
    if (blurx && blury) {
      blurh(blurx, temp, values, width, height);
      blurh(blurx, values, temp, width, height);
      blurh(blurx, temp, values, width, height);
      blurv(blury, values, temp, width, height);
      blurv(blury, temp, values, width, height);
      blurv(blury, values, temp, width, height);
    } else if (blurx) {
      blurh(blurx, values, temp, width, height);
      blurh(blurx, temp, values, width, height);
      blurh(blurx, values, temp, width, height);
    } else if (blury) {
      blurv(blury, values, temp, width, height);
      blurv(blury, temp, values, width, height);
      blurv(blury, values, temp, width, height);
    }
    return data;
  };
}
function blurh(blur3, T, S, w, h) {
  for (let y = 0, n = w * h; y < n; ) {
    blur3(T, S, y, y += w, 1);
  }
}
function blurv(blur3, T, S, w, h) {
  for (let x = 0, n = w * h; x < w; ++x) {
    blur3(T, S, x, x + n, w);
  }
}
function blurfImage(radius) {
  const blur3 = blurf(radius);
  return (T, S, start, stop, step) => {
    start <<= 2, stop <<= 2, step <<= 2;
    blur3(T, S, start + 0, stop + 0, step);
    blur3(T, S, start + 1, stop + 1, step);
    blur3(T, S, start + 2, stop + 2, step);
    blur3(T, S, start + 3, stop + 3, step);
  };
}
function blurf(radius) {
  const radius0 = Math.floor(radius);
  if (radius0 === radius) return bluri(radius);
  const t = radius - radius0;
  const w = 2 * radius + 1;
  return (T, S, start, stop, step) => {
    if (!((stop -= step) >= start)) return;
    let sum2 = radius0 * S[start];
    const s0 = step * radius0;
    const s1 = s0 + step;
    for (let i = start, j = start + s0; i < j; i += step) {
      sum2 += S[Math.min(stop, i)];
    }
    for (let i = start, j = stop; i <= j; i += step) {
      sum2 += S[Math.min(stop, i + s0)];
      T[i] = (sum2 + t * (S[Math.max(start, i - s1)] + S[Math.min(stop, i + s1)])) / w;
      sum2 -= S[Math.max(start, i - s0)];
    }
  };
}
function bluri(radius) {
  const w = 2 * radius + 1;
  return (T, S, start, stop, step) => {
    if (!((stop -= step) >= start)) return;
    let sum2 = radius * S[start];
    const s = step * radius;
    for (let i = start, j = start + s; i < j; i += step) {
      sum2 += S[Math.min(stop, i)];
    }
    for (let i = start, j = stop; i <= j; i += step) {
      sum2 += S[Math.min(stop, i + s)];
      T[i] = sum2 / w;
      sum2 -= S[Math.max(start, i - s)];
    }
  };
}

// node_modules/d3-array/src/count.js
function count(values, valueof) {
  let count2 = 0;
  if (valueof === void 0) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        ++count2;
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && (value = +value) >= value) {
        ++count2;
      }
    }
  }
  return count2;
}

// node_modules/d3-array/src/cross.js
function length(array2) {
  return array2.length | 0;
}
function empty(length3) {
  return !(length3 > 0);
}
function arrayify(values) {
  return typeof values !== "object" || "length" in values ? values : Array.from(values);
}
function reducer(reduce2) {
  return (values) => reduce2(...values);
}
function cross(...values) {
  const reduce2 = typeof values[values.length - 1] === "function" && reducer(values.pop());
  values = values.map(arrayify);
  const lengths = values.map(length);
  const j = values.length - 1;
  const index2 = new Array(j + 1).fill(0);
  const product = [];
  if (j < 0 || lengths.some(empty)) return product;
  while (true) {
    product.push(index2.map((j2, i2) => values[i2][j2]));
    let i = j;
    while (++index2[i] === lengths[i]) {
      if (i === 0) return reduce2 ? product.map(reduce2) : product;
      index2[i--] = 0;
    }
  }
}

// node_modules/d3-array/src/cumsum.js
function cumsum(values, valueof) {
  var sum2 = 0, index2 = 0;
  return Float64Array.from(values, valueof === void 0 ? (v) => sum2 += +v || 0 : (v) => sum2 += +valueof(v, index2++, values) || 0);
}

// node_modules/d3-array/src/variance.js
function variance(values, valueof) {
  let count2 = 0;
  let delta;
  let mean2 = 0;
  let sum2 = 0;
  if (valueof === void 0) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        delta = value - mean2;
        mean2 += delta / ++count2;
        sum2 += delta * (value - mean2);
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && (value = +value) >= value) {
        delta = value - mean2;
        mean2 += delta / ++count2;
        sum2 += delta * (value - mean2);
      }
    }
  }
  if (count2 > 1) return sum2 / (count2 - 1);
}

// node_modules/d3-array/src/deviation.js
function deviation(values, valueof) {
  const v = variance(values, valueof);
  return v ? Math.sqrt(v) : v;
}

// node_modules/d3-array/src/extent.js
function extent(values, valueof) {
  let min2;
  let max2;
  if (valueof === void 0) {
    for (const value of values) {
      if (value != null) {
        if (min2 === void 0) {
          if (value >= value) min2 = max2 = value;
        } else {
          if (min2 > value) min2 = value;
          if (max2 < value) max2 = value;
        }
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null) {
        if (min2 === void 0) {
          if (value >= value) min2 = max2 = value;
        } else {
          if (min2 > value) min2 = value;
          if (max2 < value) max2 = value;
        }
      }
    }
  }
  return [min2, max2];
}

// node_modules/d3-array/src/fsum.js
var Adder = class {
  constructor() {
    this._partials = new Float64Array(32);
    this._n = 0;
  }
  add(x) {
    const p = this._partials;
    let i = 0;
    for (let j = 0; j < this._n && j < 32; j++) {
      const y = p[j], hi = x + y, lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
      if (lo) p[i++] = lo;
      x = hi;
    }
    p[i] = x;
    this._n = i + 1;
    return this;
  }
  valueOf() {
    const p = this._partials;
    let n = this._n, x, y, lo, hi = 0;
    if (n > 0) {
      hi = p[--n];
      while (n > 0) {
        x = hi;
        y = p[--n];
        hi = x + y;
        lo = y - (hi - x);
        if (lo) break;
      }
      if (n > 0 && (lo < 0 && p[n - 1] < 0 || lo > 0 && p[n - 1] > 0)) {
        y = lo * 2;
        x = hi + y;
        if (y == x - hi) hi = x;
      }
    }
    return hi;
  }
};
function fsum(values, valueof) {
  const adder = new Adder();
  if (valueof === void 0) {
    for (let value of values) {
      if (value = +value) {
        adder.add(value);
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if (value = +valueof(value, ++index2, values)) {
        adder.add(value);
      }
    }
  }
  return +adder;
}
function fcumsum(values, valueof) {
  const adder = new Adder();
  let index2 = -1;
  return Float64Array.from(
    values,
    valueof === void 0 ? (v) => adder.add(+v || 0) : (v) => adder.add(+valueof(v, ++index2, values) || 0)
  );
}

// node_modules/internmap/src/index.js
var InternMap = class extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } });
    if (entries != null) for (const [key2, value] of entries) this.set(key2, value);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value) {
    return super.set(intern_set(this, key), value);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
};
var InternSet = class extends Set {
  constructor(values, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } });
    if (values != null) for (const value of values) this.add(value);
  }
  has(value) {
    return super.has(intern_get(this, value));
  }
  add(value) {
    return super.add(intern_set(this, value));
  }
  delete(value) {
    return super.delete(intern_delete(this, value));
  }
};
function intern_get({ _intern, _key }, value) {
  const key = _key(value);
  return _intern.has(key) ? _intern.get(key) : value;
}
function intern_set({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key)) return _intern.get(key);
  _intern.set(key, value);
  return value;
}
function intern_delete({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key)) {
    value = _intern.get(key);
    _intern.delete(key);
  }
  return value;
}
function keyof(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

// node_modules/d3-array/src/identity.js
function identity(x) {
  return x;
}

// node_modules/d3-array/src/group.js
function group(values, ...keys) {
  return nest(values, identity, identity, keys);
}
function groups(values, ...keys) {
  return nest(values, Array.from, identity, keys);
}
function flatten(groups2, keys) {
  for (let i = 1, n = keys.length; i < n; ++i) {
    groups2 = groups2.flatMap((g) => g.pop().map(([key, value]) => [...g, key, value]));
  }
  return groups2;
}
function flatGroup(values, ...keys) {
  return flatten(groups(values, ...keys), keys);
}
function flatRollup(values, reduce2, ...keys) {
  return flatten(rollups(values, reduce2, ...keys), keys);
}
function rollup(values, reduce2, ...keys) {
  return nest(values, identity, reduce2, keys);
}
function rollups(values, reduce2, ...keys) {
  return nest(values, Array.from, reduce2, keys);
}
function index(values, ...keys) {
  return nest(values, identity, unique, keys);
}
function indexes(values, ...keys) {
  return nest(values, Array.from, unique, keys);
}
function unique(values) {
  if (values.length !== 1) throw new Error("duplicate key");
  return values[0];
}
function nest(values, map3, reduce2, keys) {
  return function regroup(values2, i) {
    if (i >= keys.length) return reduce2(values2);
    const groups2 = new InternMap();
    const keyof2 = keys[i++];
    let index2 = -1;
    for (const value of values2) {
      const key = keyof2(value, ++index2, values2);
      const group2 = groups2.get(key);
      if (group2) group2.push(value);
      else groups2.set(key, [value]);
    }
    for (const [key, values3] of groups2) {
      groups2.set(key, regroup(values3, i));
    }
    return map3(groups2);
  }(values, 0);
}

// node_modules/d3-array/src/permute.js
function permute(source, keys) {
  return Array.from(keys, (key) => source[key]);
}

// node_modules/d3-array/src/sort.js
function sort(values, ...F) {
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  values = Array.from(values);
  let [f] = F;
  if (f && f.length !== 2 || F.length > 1) {
    const index2 = Uint32Array.from(values, (d, i) => i);
    if (F.length > 1) {
      F = F.map((f2) => values.map(f2));
      index2.sort((i, j) => {
        for (const f2 of F) {
          const c = ascendingDefined(f2[i], f2[j]);
          if (c) return c;
        }
      });
    } else {
      f = values.map(f);
      index2.sort((i, j) => ascendingDefined(f[i], f[j]));
    }
    return permute(values, index2);
  }
  return values.sort(compareDefined(f));
}
function compareDefined(compare = ascending) {
  if (compare === ascending) return ascendingDefined;
  if (typeof compare !== "function") throw new TypeError("compare is not a function");
  return (a, b) => {
    const x = compare(a, b);
    if (x || x === 0) return x;
    return (compare(b, b) === 0) - (compare(a, a) === 0);
  };
}
function ascendingDefined(a, b) {
  return (a == null || !(a >= a)) - (b == null || !(b >= b)) || (a < b ? -1 : a > b ? 1 : 0);
}

// node_modules/d3-array/src/groupSort.js
function groupSort(values, reduce2, key) {
  return (reduce2.length !== 2 ? sort(rollup(values, reduce2, key), ([ak, av], [bk, bv]) => ascending(av, bv) || ascending(ak, bk)) : sort(group(values, key), ([ak, av], [bk, bv]) => reduce2(av, bv) || ascending(ak, bk))).map(([key2]) => key2);
}

// node_modules/d3-array/src/array.js
var array = Array.prototype;
var slice = array.slice;
var map = array.map;

// node_modules/d3-array/src/constant.js
function constant(x) {
  return () => x;
}

// node_modules/d3-array/src/ticks.js
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function tickSpec(start, stop, count2) {
  const step = (stop - start) / Math.max(0, count2), power = Math.floor(Math.log10(step)), error = step / Math.pow(10, power), factor = error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1;
  let i1, i2, inc;
  if (power < 0) {
    inc = Math.pow(10, -power) / factor;
    i1 = Math.round(start * inc);
    i2 = Math.round(stop * inc);
    if (i1 / inc < start) ++i1;
    if (i2 / inc > stop) --i2;
    inc = -inc;
  } else {
    inc = Math.pow(10, power) * factor;
    i1 = Math.round(start / inc);
    i2 = Math.round(stop / inc);
    if (i1 * inc < start) ++i1;
    if (i2 * inc > stop) --i2;
  }
  if (i2 < i1 && 0.5 <= count2 && count2 < 2) return tickSpec(start, stop, count2 * 2);
  return [i1, i2, inc];
}
function ticks(start, stop, count2) {
  stop = +stop, start = +start, count2 = +count2;
  if (!(count2 > 0)) return [];
  if (start === stop) return [start];
  const reverse2 = stop < start, [i1, i2, inc] = reverse2 ? tickSpec(stop, start, count2) : tickSpec(start, stop, count2);
  if (!(i2 >= i1)) return [];
  const n = i2 - i1 + 1, ticks2 = new Array(n);
  if (reverse2) {
    if (inc < 0) for (let i = 0; i < n; ++i) ticks2[i] = (i2 - i) / -inc;
    else for (let i = 0; i < n; ++i) ticks2[i] = (i2 - i) * inc;
  } else {
    if (inc < 0) for (let i = 0; i < n; ++i) ticks2[i] = (i1 + i) / -inc;
    else for (let i = 0; i < n; ++i) ticks2[i] = (i1 + i) * inc;
  }
  return ticks2;
}
function tickIncrement(start, stop, count2) {
  stop = +stop, start = +start, count2 = +count2;
  return tickSpec(start, stop, count2)[2];
}
function tickStep(start, stop, count2) {
  stop = +stop, start = +start, count2 = +count2;
  const reverse2 = stop < start, inc = reverse2 ? tickIncrement(stop, start, count2) : tickIncrement(start, stop, count2);
  return (reverse2 ? -1 : 1) * (inc < 0 ? 1 / -inc : inc);
}

// node_modules/d3-array/src/nice.js
function nice(start, stop, count2) {
  let prestep;
  while (true) {
    const step = tickIncrement(start, stop, count2);
    if (step === prestep || step === 0 || !isFinite(step)) {
      return [start, stop];
    } else if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
    }
    prestep = step;
  }
}

// node_modules/d3-array/src/threshold/sturges.js
function thresholdSturges(values) {
  return Math.max(1, Math.ceil(Math.log(count(values)) / Math.LN2) + 1);
}

// node_modules/d3-array/src/bin.js
function bin() {
  var value = identity, domain = extent, threshold = thresholdSturges;
  function histogram(data) {
    if (!Array.isArray(data)) data = Array.from(data);
    var i, n = data.length, x, step, values = new Array(n);
    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }
    var xz = domain(values), x0 = xz[0], x1 = xz[1], tz = threshold(values, x0, x1);
    if (!Array.isArray(tz)) {
      const max2 = x1, tn = +tz;
      if (domain === extent) [x0, x1] = nice(x0, x1, tn);
      tz = ticks(x0, x1, tn);
      if (tz[0] <= x0) step = tickIncrement(x0, x1, tn);
      if (tz[tz.length - 1] >= x1) {
        if (max2 >= x1 && domain === extent) {
          const step2 = tickIncrement(x0, x1, tn);
          if (isFinite(step2)) {
            if (step2 > 0) {
              x1 = (Math.floor(x1 / step2) + 1) * step2;
            } else if (step2 < 0) {
              x1 = (Math.ceil(x1 * -step2) + 1) / -step2;
            }
          }
        } else {
          tz.pop();
        }
      }
    }
    var m = tz.length, a = 0, b = m;
    while (tz[a] <= x0) ++a;
    while (tz[b - 1] > x1) --b;
    if (a || b < m) tz = tz.slice(a, b), m = b - a;
    var bins = new Array(m + 1), bin2;
    for (i = 0; i <= m; ++i) {
      bin2 = bins[i] = [];
      bin2.x0 = i > 0 ? tz[i - 1] : x0;
      bin2.x1 = i < m ? tz[i] : x1;
    }
    if (isFinite(step)) {
      if (step > 0) {
        for (i = 0; i < n; ++i) {
          if ((x = values[i]) != null && x0 <= x && x <= x1) {
            bins[Math.min(m, Math.floor((x - x0) / step))].push(data[i]);
          }
        }
      } else if (step < 0) {
        for (i = 0; i < n; ++i) {
          if ((x = values[i]) != null && x0 <= x && x <= x1) {
            const j = Math.floor((x0 - x) * step);
            bins[Math.min(m, j + (tz[j] <= x))].push(data[i]);
          }
        }
      }
    } else {
      for (i = 0; i < n; ++i) {
        if ((x = values[i]) != null && x0 <= x && x <= x1) {
          bins[bisect_default(tz, x, 0, m)].push(data[i]);
        }
      }
    }
    return bins;
  }
  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
  };
  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
  };
  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : constant(Array.isArray(_) ? slice.call(_) : _), histogram) : threshold;
  };
  return histogram;
}

// node_modules/d3-array/src/max.js
function max(values, valueof) {
  let max2;
  if (valueof === void 0) {
    for (const value of values) {
      if (value != null && (max2 < value || max2 === void 0 && value >= value)) {
        max2 = value;
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && (max2 < value || max2 === void 0 && value >= value)) {
        max2 = value;
      }
    }
  }
  return max2;
}

// node_modules/d3-array/src/maxIndex.js
function maxIndex(values, valueof) {
  let max2;
  let maxIndex2 = -1;
  let index2 = -1;
  if (valueof === void 0) {
    for (const value of values) {
      ++index2;
      if (value != null && (max2 < value || max2 === void 0 && value >= value)) {
        max2 = value, maxIndex2 = index2;
      }
    }
  } else {
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && (max2 < value || max2 === void 0 && value >= value)) {
        max2 = value, maxIndex2 = index2;
      }
    }
  }
  return maxIndex2;
}

// node_modules/d3-array/src/min.js
function min(values, valueof) {
  let min2;
  if (valueof === void 0) {
    for (const value of values) {
      if (value != null && (min2 > value || min2 === void 0 && value >= value)) {
        min2 = value;
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && (min2 > value || min2 === void 0 && value >= value)) {
        min2 = value;
      }
    }
  }
  return min2;
}

// node_modules/d3-array/src/minIndex.js
function minIndex(values, valueof) {
  let min2;
  let minIndex2 = -1;
  let index2 = -1;
  if (valueof === void 0) {
    for (const value of values) {
      ++index2;
      if (value != null && (min2 > value || min2 === void 0 && value >= value)) {
        min2 = value, minIndex2 = index2;
      }
    }
  } else {
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && (min2 > value || min2 === void 0 && value >= value)) {
        min2 = value, minIndex2 = index2;
      }
    }
  }
  return minIndex2;
}

// node_modules/d3-array/src/quickselect.js
function quickselect(array2, k, left = 0, right = Infinity, compare) {
  k = Math.floor(k);
  left = Math.floor(Math.max(0, left));
  right = Math.floor(Math.min(array2.length - 1, right));
  if (!(left <= k && k <= right)) return array2;
  compare = compare === void 0 ? ascendingDefined : compareDefined(compare);
  while (right > left) {
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp(2 * z / 3);
      const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      quickselect(array2, k, newLeft, newRight, compare);
    }
    const t = array2[k];
    let i = left;
    let j = right;
    swap(array2, left, k);
    if (compare(array2[right], t) > 0) swap(array2, left, right);
    while (i < j) {
      swap(array2, i, j), ++i, --j;
      while (compare(array2[i], t) < 0) ++i;
      while (compare(array2[j], t) > 0) --j;
    }
    if (compare(array2[left], t) === 0) swap(array2, left, j);
    else ++j, swap(array2, j, right);
    if (j <= k) left = j + 1;
    if (k <= j) right = j - 1;
  }
  return array2;
}
function swap(array2, i, j) {
  const t = array2[i];
  array2[i] = array2[j];
  array2[j] = t;
}

// node_modules/d3-array/src/greatest.js
function greatest(values, compare = ascending) {
  let max2;
  let defined = false;
  if (compare.length === 1) {
    let maxValue;
    for (const element of values) {
      const value = compare(element);
      if (defined ? ascending(value, maxValue) > 0 : ascending(value, value) === 0) {
        max2 = element;
        maxValue = value;
        defined = true;
      }
    }
  } else {
    for (const value of values) {
      if (defined ? compare(value, max2) > 0 : compare(value, value) === 0) {
        max2 = value;
        defined = true;
      }
    }
  }
  return max2;
}

// node_modules/d3-array/src/quantile.js
function quantile(values, p, valueof) {
  values = Float64Array.from(numbers(values, valueof));
  if (!(n = values.length) || isNaN(p = +p)) return;
  if (p <= 0 || n < 2) return min(values);
  if (p >= 1) return max(values);
  var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = max(quickselect(values, i0).subarray(0, i0 + 1)), value1 = min(values.subarray(i0 + 1));
  return value0 + (value1 - value0) * (i - i0);
}
function quantileSorted(values, p, valueof = number) {
  if (!(n = values.length) || isNaN(p = +p)) return;
  if (p <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = +valueof(values[i0], i0, values), value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
}
function quantileIndex(values, p, valueof = number) {
  if (isNaN(p = +p)) return;
  numbers2 = Float64Array.from(values, (_, i2) => number(valueof(values[i2], i2, values)));
  if (p <= 0) return minIndex(numbers2);
  if (p >= 1) return maxIndex(numbers2);
  var numbers2, index2 = Uint32Array.from(values, (_, i2) => i2), j = numbers2.length - 1, i = Math.floor(j * p);
  quickselect(index2, i, 0, j, (i2, j2) => ascendingDefined(numbers2[i2], numbers2[j2]));
  i = greatest(index2.subarray(0, i + 1), (i2) => numbers2[i2]);
  return i >= 0 ? i : -1;
}

// node_modules/d3-array/src/threshold/freedmanDiaconis.js
function thresholdFreedmanDiaconis(values, min2, max2) {
  const c = count(values), d = quantile(values, 0.75) - quantile(values, 0.25);
  return c && d ? Math.ceil((max2 - min2) / (2 * d * Math.pow(c, -1 / 3))) : 1;
}

// node_modules/d3-array/src/threshold/scott.js
function thresholdScott(values, min2, max2) {
  const c = count(values), d = deviation(values);
  return c && d ? Math.ceil((max2 - min2) * Math.cbrt(c) / (3.49 * d)) : 1;
}

// node_modules/d3-array/src/mean.js
function mean(values, valueof) {
  let count2 = 0;
  let sum2 = 0;
  if (valueof === void 0) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        ++count2, sum2 += value;
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && (value = +value) >= value) {
        ++count2, sum2 += value;
      }
    }
  }
  if (count2) return sum2 / count2;
}

// node_modules/d3-array/src/median.js
function median(values, valueof) {
  return quantile(values, 0.5, valueof);
}
function medianIndex(values, valueof) {
  return quantileIndex(values, 0.5, valueof);
}

// node_modules/d3-array/src/merge.js
function* flatten2(arrays) {
  for (const array2 of arrays) {
    yield* array2;
  }
}
function merge(arrays) {
  return Array.from(flatten2(arrays));
}

// node_modules/d3-array/src/mode.js
function mode(values, valueof) {
  const counts = new InternMap();
  if (valueof === void 0) {
    for (let value of values) {
      if (value != null && value >= value) {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index2, values)) != null && value >= value) {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    }
  }
  let modeValue;
  let modeCount = 0;
  for (const [value, count2] of counts) {
    if (count2 > modeCount) {
      modeCount = count2;
      modeValue = value;
    }
  }
  return modeValue;
}

// node_modules/d3-array/src/pairs.js
function pairs(values, pairof = pair) {
  const pairs2 = [];
  let previous;
  let first = false;
  for (const value of values) {
    if (first) pairs2.push(pairof(previous, value));
    previous = value;
    first = true;
  }
  return pairs2;
}
function pair(a, b) {
  return [a, b];
}

// node_modules/d3-array/src/range.js
function range(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  var i = -1, n = Math.max(0, Math.ceil((stop - start) / step)) | 0, range2 = new Array(n);
  while (++i < n) {
    range2[i] = start + i * step;
  }
  return range2;
}

// node_modules/d3-array/src/rank.js
function rank(values, valueof = ascending) {
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  let V = Array.from(values);
  const R = new Float64Array(V.length);
  if (valueof.length !== 2) V = V.map(valueof), valueof = ascending;
  const compareIndex = (i, j) => valueof(V[i], V[j]);
  let k, r;
  values = Uint32Array.from(V, (_, i) => i);
  values.sort(valueof === ascending ? (i, j) => ascendingDefined(V[i], V[j]) : compareDefined(compareIndex));
  values.forEach((j, i) => {
    const c = compareIndex(j, k === void 0 ? j : k);
    if (c >= 0) {
      if (k === void 0 || c > 0) k = j, r = i;
      R[j] = r;
    } else {
      R[j] = NaN;
    }
  });
  return R;
}

// node_modules/d3-array/src/least.js
function least(values, compare = ascending) {
  let min2;
  let defined = false;
  if (compare.length === 1) {
    let minValue;
    for (const element of values) {
      const value = compare(element);
      if (defined ? ascending(value, minValue) < 0 : ascending(value, value) === 0) {
        min2 = element;
        minValue = value;
        defined = true;
      }
    }
  } else {
    for (const value of values) {
      if (defined ? compare(value, min2) < 0 : compare(value, value) === 0) {
        min2 = value;
        defined = true;
      }
    }
  }
  return min2;
}

// node_modules/d3-array/src/leastIndex.js
function leastIndex(values, compare = ascending) {
  if (compare.length === 1) return minIndex(values, compare);
  let minValue;
  let min2 = -1;
  let index2 = -1;
  for (const value of values) {
    ++index2;
    if (min2 < 0 ? compare(value, value) === 0 : compare(value, minValue) < 0) {
      minValue = value;
      min2 = index2;
    }
  }
  return min2;
}

// node_modules/d3-array/src/greatestIndex.js
function greatestIndex(values, compare = ascending) {
  if (compare.length === 1) return maxIndex(values, compare);
  let maxValue;
  let max2 = -1;
  let index2 = -1;
  for (const value of values) {
    ++index2;
    if (max2 < 0 ? compare(value, value) === 0 : compare(value, maxValue) > 0) {
      maxValue = value;
      max2 = index2;
    }
  }
  return max2;
}

// node_modules/d3-array/src/scan.js
function scan(values, compare) {
  const index2 = leastIndex(values, compare);
  return index2 < 0 ? void 0 : index2;
}

// node_modules/d3-array/src/shuffle.js
var shuffle_default = shuffler(Math.random);
function shuffler(random) {
  return function shuffle(array2, i0 = 0, i1 = array2.length) {
    let m = i1 - (i0 = +i0);
    while (m) {
      const i = random() * m-- | 0, t = array2[m + i0];
      array2[m + i0] = array2[i + i0];
      array2[i + i0] = t;
    }
    return array2;
  };
}

// node_modules/d3-array/src/sum.js
function sum(values, valueof) {
  let sum2 = 0;
  if (valueof === void 0) {
    for (let value of values) {
      if (value = +value) {
        sum2 += value;
      }
    }
  } else {
    let index2 = -1;
    for (let value of values) {
      if (value = +valueof(value, ++index2, values)) {
        sum2 += value;
      }
    }
  }
  return sum2;
}

// node_modules/d3-array/src/transpose.js
function transpose(matrix) {
  if (!(n = matrix.length)) return [];
  for (var i = -1, m = min(matrix, length2), transpose2 = new Array(m); ++i < m; ) {
    for (var j = -1, n, row = transpose2[i] = new Array(n); ++j < n; ) {
      row[j] = matrix[j][i];
    }
  }
  return transpose2;
}
function length2(d) {
  return d.length;
}

// node_modules/d3-array/src/zip.js
function zip() {
  return transpose(arguments);
}

// node_modules/d3-array/src/every.js
function every(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  let index2 = -1;
  for (const value of values) {
    if (!test(value, ++index2, values)) {
      return false;
    }
  }
  return true;
}

// node_modules/d3-array/src/some.js
function some(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  let index2 = -1;
  for (const value of values) {
    if (test(value, ++index2, values)) {
      return true;
    }
  }
  return false;
}

// node_modules/d3-array/src/filter.js
function filter(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  const array2 = [];
  let index2 = -1;
  for (const value of values) {
    if (test(value, ++index2, values)) {
      array2.push(value);
    }
  }
  return array2;
}

// node_modules/d3-array/src/map.js
function map2(values, mapper) {
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  if (typeof mapper !== "function") throw new TypeError("mapper is not a function");
  return Array.from(values, (value, index2) => mapper(value, index2, values));
}

// node_modules/d3-array/src/reduce.js
function reduce(values, reducer2, value) {
  if (typeof reducer2 !== "function") throw new TypeError("reducer is not a function");
  const iterator = values[Symbol.iterator]();
  let done, next, index2 = -1;
  if (arguments.length < 3) {
    ({ done, value } = iterator.next());
    if (done) return;
    ++index2;
  }
  while ({ done, value: next } = iterator.next(), !done) {
    value = reducer2(value, next, ++index2, values);
  }
  return value;
}

// node_modules/d3-array/src/reverse.js
function reverse(values) {
  if (typeof values[Symbol.iterator] !== "function") throw new TypeError("values is not iterable");
  return Array.from(values).reverse();
}

// node_modules/d3-array/src/difference.js
function difference(values, ...others) {
  values = new InternSet(values);
  for (const other of others) {
    for (const value of other) {
      values.delete(value);
    }
  }
  return values;
}

// node_modules/d3-array/src/disjoint.js
function disjoint(values, other) {
  const iterator = other[Symbol.iterator](), set2 = new InternSet();
  for (const v of values) {
    if (set2.has(v)) return false;
    let value, done;
    while ({ value, done } = iterator.next()) {
      if (done) break;
      if (Object.is(v, value)) return false;
      set2.add(value);
    }
  }
  return true;
}

// node_modules/d3-array/src/intersection.js
function intersection(values, ...others) {
  values = new InternSet(values);
  others = others.map(set);
  out: for (const value of values) {
    for (const other of others) {
      if (!other.has(value)) {
        values.delete(value);
        continue out;
      }
    }
  }
  return values;
}
function set(values) {
  return values instanceof InternSet ? values : new InternSet(values);
}

// node_modules/d3-array/src/superset.js
function superset(values, other) {
  const iterator = values[Symbol.iterator](), set2 = /* @__PURE__ */ new Set();
  for (const o of other) {
    const io = intern(o);
    if (set2.has(io)) continue;
    let value, done;
    while ({ value, done } = iterator.next()) {
      if (done) return false;
      const ivalue = intern(value);
      set2.add(ivalue);
      if (Object.is(io, ivalue)) break;
    }
  }
  return true;
}
function intern(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

// node_modules/d3-array/src/subset.js
function subset(values, other) {
  return superset(other, values);
}

// node_modules/d3-array/src/union.js
function union(...others) {
  const set2 = new InternSet();
  for (const other of others) {
    for (const o of other) {
      set2.add(o);
    }
  }
  return set2;
}

export {
  ascending,
  descending,
  bisector,
  bisectRight,
  bisectLeft,
  bisectCenter,
  bisect_default,
  blur,
  blur2,
  blurImage,
  count,
  cross,
  cumsum,
  variance,
  deviation,
  extent,
  Adder,
  fsum,
  fcumsum,
  InternMap,
  InternSet,
  group,
  groups,
  flatGroup,
  flatRollup,
  rollup,
  rollups,
  index,
  indexes,
  permute,
  sort,
  groupSort,
  ticks,
  tickIncrement,
  tickStep,
  nice,
  thresholdSturges,
  bin,
  max,
  maxIndex,
  min,
  minIndex,
  quickselect,
  greatest,
  quantile,
  quantileSorted,
  quantileIndex,
  thresholdFreedmanDiaconis,
  thresholdScott,
  mean,
  median,
  medianIndex,
  merge,
  mode,
  pairs,
  range,
  rank,
  least,
  leastIndex,
  greatestIndex,
  scan,
  shuffle_default,
  shuffler,
  sum,
  transpose,
  zip,
  every,
  some,
  filter,
  map2 as map,
  reduce,
  reverse,
  difference,
  disjoint,
  intersection,
  superset,
  subset,
  union
};
//# sourceMappingURL=chunk-42OJMDOU.js.map
