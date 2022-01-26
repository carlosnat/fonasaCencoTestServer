import { sequelize, Op } from "../database/connection"

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
    consults: consult[];
    addPatientToQueue(patient: hospitalPatient, patientDbInstance: any): void;
    attendPatients(): void;
    findOlder(): any;
    smokerUgency(): any;
    greaterRisk(historyNumber:any):any;
}

type consult = {
    id: string;
    totalPatients: number;
    specialistName: string;
    state: 'open' | 'close';
    type: 'pediatric' | 'general' | 'urgency'
}

class Hospital implements IHopsital {
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
        // query open consultants
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
                    ['risk', 'DESC'],
                    ['createdAt', 'ASC']
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

        await sequelize.models.HospitalPatient.update({ status: 'waiting'}, {
            where: {
                status: 'pending'
            }
        })
    }

    async findOlder(): Promise<any> {
        const olderWaiting:any = await sequelize.models.HospitalPatient.findOne({
            attributes: ['priority', 'risk', 'status'],
            where: {
                status: 'waiting'
            }, 
            include: [
                {
                    model: sequelize.models.Patient,
                    attributes: ['name', 'age'],
                    where: {
                        group: 'elder'
                    },
                }
            ],
            order: [
                [sequelize.models.Patient, 'age', 'DESC']
            ]
        })
        return olderWaiting
    }

    async smokerUgency(): Promise<any[]> {
        const urgencySmoker:any = await sequelize.models.HospitalPatient.findAll({
            attributes: ['priority', 'risk'],
            where: {
                status: 'waiting',
                consultType: 'urgency'
            }, 
            include: [
                {
                    model: sequelize.models.Patient,
                    attributes: ['name', 'age'],
                    where: {
                        group: 'young',

                    },
                    include: [
                        {
                            model: sequelize.models.youngPatient,
                            where: {
                                smoker: true
                            },
                        }
                    ]
                }
            ],
            order: [
                ['priority', 'DESC']
            ]
        })
        return urgencySmoker
    }

    async greaterRisk(historyNumber: any) {
        const patient:any = await sequelize.models.Patient.findOne({
            where: {
                historyNumber
            }
        })

        const patientRecord:any = await sequelize.models.HospitalPatient.findOne({
            where: {
                PatientId: patient.id
            }
        })

        const patientsWithGreaterRisk:any = await sequelize.models.HospitalPatient.findAll({
            where: {
                status: 'waiting',
                risk: {
                    [Op.gt]: patientRecord.risk
                }
            },
            order: [
                ['risk', 'DESC'],
                ['createdAt', 'ASC']
            ]
        })
        return patientsWithGreaterRisk
    }
}

let myHospital: IHopsital = new Hospital()

export default myHospital