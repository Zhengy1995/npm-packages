export default class Times {
  private useTimes = 0

  get times() {
    return this.useTimes
  }

  public addTimes() {
    this.useTimes++
  }
}
