import { hospitalPatient } from "../types";

export interface IHopsital {
    asignPatientToConsultation(patientGroup: string, patientPriority: number , patientDbInstance: any): void;
    attendPatients(): void;
    findOlder(): any;
    smokerUrgency(): any;
    greaterRisk(historyNumber: any): any;
}