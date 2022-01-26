import { findOpenConsultations } from "../consultants/consultantModel";
import { findPatientByHistoryNumber } from "../patients/patientModel";
import {
    findNextPatientWaiting,
    findOlderPatientWaiting,
    findPatientInHospitalById,
    findPatientsWithRiskGreaterThan,
    findSmokerWithUrgency,
    updatePendingPatientToWaiting
} from "./hospitalPatientModel";
import { IHopsital } from "./interfaces";
import { hospitalPatient } from "./types";

class Hospital implements IHopsital {
    constructor() { }

    async asignPatientToConsultation(patient: hospitalPatient, patientDbInstance: any) {
        if (patient.type === 'child' && patient.priority <= 4) {
            patientDbInstance.consultType = 'pediatry'
        }
        else if (patient.priority <= 4) {
            patientDbInstance.consultType = 'general'
        }
        else {
            patientDbInstance.consultType = 'urgency'
        }
        // patientDbInstance.status = 'waiting'
        await patientDbInstance.save()
    }

    async attendPatients() {
        const consultationsAvailable: any[] = await findOpenConsultations()
        for (let consultant of consultationsAvailable) {
            const nextPatientToAttend: any = await findNextPatientWaiting(consultant.HospitalId, consultant.type)
            if (nextPatientToAttend) {
                // set patient as attended
                nextPatientToAttend.status = 'attended'
                await nextPatientToAttend.save()
                // use open consultantion
                consultant.state = 'close'
                consultant.totalAttended++
                await consultant.save()
            }
        }
        updatePendingPatientToWaiting()
    }

    async findOlder(): Promise<any> {
        return findOlderPatientWaiting()
    }

    async smokerUrgency(): Promise<any[]> {
        return findSmokerWithUrgency()
    }

    async greaterRisk(historyNumber: number): Promise<any[]> {
        const patient: any = await findPatientByHistoryNumber(historyNumber)
        const patientRecord: any = await findPatientInHospitalById(patient.id)
        const { risk: riskLimit } = patientRecord
        const patientsWithGreaterRisk: any[] = await findPatientsWithRiskGreaterThan(riskLimit)
        return patientsWithGreaterRisk
    }
}

let myHospital: IHopsital = new Hospital()

export default myHospital