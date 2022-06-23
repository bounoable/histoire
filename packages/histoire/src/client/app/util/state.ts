import { unref, isRef } from 'vue'

const isObject = (val) => val !== null && typeof val === 'object'

export function toRawDeep(val, seen = new Set()) {
  const unwrappedValue = isRef(val) ? unref(val) : val
  const valueType = typeof unwrappedValue

  if (valueType === 'symbol') {
    return unwrappedValue.toString()
  }

  if (valueType === 'function') {
    return unwrappedValue.toString()
  }

  if (!isObject(unwrappedValue)) {
    return unwrappedValue
  }

  if (seen.has(unwrappedValue)) {
    return Array.isArray(unwrappedValue) ? [] : {}
  }

  seen.add(unwrappedValue)

  if (Array.isArray(unwrappedValue)) {
    return unwrappedValue
      .map((value) => toRawDeep(value, seen))
      .filter((val) => val !== void 0)
  }

  return toRawObject(unwrappedValue, seen)
}

const toRawObject = (obj: Record<any, any>, seen = new Set()) =>
  Object.keys(obj).reduce((raw, key) => {
    raw[key] = toRawDeep(obj[key], seen)
    return raw
  }, {})
