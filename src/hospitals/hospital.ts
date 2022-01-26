import { findOpenConsultations } from "../consultants/consultantModel";
import { findPatientByHistoryNumber } from "../patients/patientModel";
import {
    findNextPatientWaiting,
    findOlderPatientWaiting,
    findPatientInHospitalById,
    findPatientsWithRiskGreaterThan,
    findSmokerWithUrgency,
    pendingPatientToWaiting
} from "./hospitalPatientModel";

type hospitalPatient = {
    name: string;
    age: number;
    historyId: number;
    gender: string;
    type: string;
    hasDiet: boolean;
    priority: number;
    risk: number;
    smoker: boolean;
}

interface IHopsital {
    addPatientToQueue(patient: hospitalPatient, patientDbInstance: any): void;
    attendPatients(): void;
    findOlder(): any;
    smokerUrgency(): any;
    greaterRisk(historyNumber: any): any;
}

class Hospital implements IHopsital {
    constructor() { }

    async addPatientToQueue(patient: hospitalPatient, patientDbInstance: any) {
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
        pendingPatientToWaiting()
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