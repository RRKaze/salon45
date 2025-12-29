import { Router } from "express";
import { type DependencyContainer } from "tsyringe";
import { AppointmentController } from "./controllers/AppointmentController.ts";
import { SaveAppointmentService } from "./services/SaveAppointmentService.ts";
import { GetAppointmentsService } from "./services/GetAppointments.ts";
import { AppointmentDataAccessor } from "./dataAccess/AppointmentDataAccessor.ts";

export class Appointments {
  public register(container: DependencyContainer): Router {
    const router = Router();

    container
      .register("IAppointmentDataAccessor", {
        useClass: AppointmentDataAccessor,
      })
      .register("ISaveAppointmentService", {
        useClass: SaveAppointmentService,
      })
      .register("IGetAppointmentsService", {
        useClass: GetAppointmentsService,
      });

    const appointmentController = container.resolve(AppointmentController);

    router.post("/", (req, res) =>
      appointmentController.createAppointment(req, res),
    );
    router.get("/", (req, res) =>
      appointmentController.getAppointments(req, res),
    );
    router.get("/availability", (req, res) =>
      appointmentController.getAvailability(req, res),
    );
    router.delete("/:appointmentId", (req, res) =>
      appointmentController.cancelAppointment(req, res),
    );

    return router;
  }
}

const appointments = new Appointments();
export default appointments;
