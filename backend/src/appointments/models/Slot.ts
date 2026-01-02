export class Slot {
  public occupancy: number;

  constructor(
    public startTime: Date,
    public endTime: Date,
    occupancy: number,
  ) {
    this.occupancy = occupancy;
  }

  public increaseOccupancy() {
    this.occupancy += 1;
  }
}
