import { hospitalPatient } from "../types";

export interface IHopsital {
    asignPatientToConsultation(patient: hospitalPatient, patientDbInstance: any): void;
    attendPatients(): void;
    findOlder(): any;
    smokerUrgency(): any;
    greaterRisk(historyNumber: any): any;
}