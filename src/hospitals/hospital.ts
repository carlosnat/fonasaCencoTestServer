import { sequelize } from "../database/connection"

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
    pediatria: hospitalPatient[];
    urgencia: hospitalPatient[];
    consultaGeneral: hospitalPatient[];
    consults: consult[];
    addPatientToQueue(patient: hospitalPatient, patientDbInstance: any): void;
    attendPatients(): void;
    freeConsults(): void;
    topConsults(): consult | null;
    findOlder(): any;
    smokerUgency(): string[];
}

type consult = {
    id: string;
    totalPatients: number;
    specialistName: string;
    state: 'open' | 'close';
    type: 'pediatric' | 'general' | 'urgency'
}

class Hospital implements IHopsital {
    pediatria: hospitalPatient[] = []
    urgencia: hospitalPatient[] = []
    consultaGeneral: hospitalPatient[] = []
    consults: consult[] = [];
    constructor() {
        this.configConsults()
    }

    configConsults() {
        this.consults.push({
            id: "1",
            totalPatients: 0,
            specialistName: 'carlos',
            state: 'open',
            type: 'pediatric'
        })
        this.consults.push({
            id: "2",
            totalPatients: 0,
            specialistName: 'elised',
            state: 'open',
            type: 'general'
        })
        this.consults.push({
            id: "3",
            totalPatients: 0,
            specialistName: 'ana',
            state: 'open',
            type: 'urgency'
        })
    }

    async addPatientToQueue(patient: hospitalPatient, patientDbInstance:any) {
        if (patient.type === 'child' && patient.priority <= 4) {
            this.pediatria.push(patient)
            patientDbInstance.consultType = 'pediatry'
        }
        else if (patient.priority <= 4) {
            this.consultaGeneral.push(patient)
            patientDbInstance.consultType = 'general'
        }
        else {
            this.urgencia.push(patient)
            patientDbInstance.consultType = 'urgency'
        }
        patientDbInstance.status = 'waiting'
        await patientDbInstance.save()
    }

    async attendPatients() {
        const consultationsAvailable:any[] = await sequelize.models.Consultation.findAll({
            where: {
                state: 'open'
            }
        })

        for(let consultant of consultationsAvailable) {
            const patientToAttend:any = await sequelize.models.HospitalPatient.findOne({
                where: {
                   HospitalId: consultant.HospitalId,
                   consultType: consultant.type,
                   status: 'waiting'
                },
                order: [
                    ['priority', 'DESC'],
                    ['risk', 'DESC']
                ],
                include: sequelize.models.Patient
            })
            if(patientToAttend) {
                patientToAttend.status = 'attended'
                await patientToAttend.save()
                consultant.state = 'close'
                consultant.totalAttended++
                await consultant.save()
            }
        }
    }

    async freeConsults() {
        const consultationsAvailable:any[] = await sequelize.models.Consultation.findAll({
            where: {
                state: 'close'
            }
        })

        for(let consultant of consultationsAvailable) {
            consultant.state = 'open'
            await consultant.save()
        }
    }

    topConsults(): consult | null {
        let top: consult | null = null;
        for (let consult of this.consults) {
            if (!top || top.totalPatients < consult.totalPatients)
                top = consult
        }
        return top
    }

    findOlder(): any {
        let older: any = { age: 0 };
        for (let patient of this.consultaGeneral) {
            if (patient.age > older.age)
                older = patient
        }
        for (let patient of this.urgencia) {
            if (patient.age > older.age)
                older = patient
        }
        return older
    }

    smokerUgency(): string[] {
        let patients: any[] = []
        for (let patient of this.urgencia) {
            if (patient.smoker)
                patients.push(patient.name)
        }
        return patients
    }
}

let myHospital: IHopsital = new Hospital()

export default myHospital