export function convertToEnumName(str) {
  return str.replaceAll("'", '').replaceAll(' ', '_').toUpperCase()
}
