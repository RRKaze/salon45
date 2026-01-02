export class AppointmentsConfiguration {
  maxAppointmentsPerMonth: number;
  appointmentTimeMinutes: number;

  constructor(maxAppointmentsPerMonth: number, appointmentTimeMinutes: number) {
    this.maxAppointmentsPerMonth = maxAppointmentsPerMonth;
    this.appointmentTimeMinutes = appointmentTimeMinutes;
  }
}
