export default class MyString {
  static formatNumberWithLeadingZeroes(num: number, length: number): string {
    return String(num).padStart(length, '0');
  }
}
