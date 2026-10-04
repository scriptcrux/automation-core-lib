export class DateTimeHelper {
  /**
   * Generates custom future date offset string (Useful for booking/delivery validations)
   */
  static getFutureDateString(daysOffset: number): string {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysOffset);
    return targetDate.toLocaleDateString('en-US');
  }
}
