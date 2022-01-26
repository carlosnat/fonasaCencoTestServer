import { Op, sequelize } from "../database/connection"

// create
export const createPatientRecordInHospital = async(patientId: number, hospitalId: any) => {
    const hospitalPatientDbInstance: any = await sequelize.models.HospitalPatient.build({
        PatientId: patientId,
        status: 'pending',
        HospitalId: hospitalId,
    })
    await hospitalPatientDbInstance.save()
    return hospitalPatientDbInstance
}

// find
export const findPatientInHospitalById = async(patientId: number) => {
    return await sequelize.models.HospitalPatient.findOne({
        where: {
            PatientId: patientId
        }
    })
}

export const findWaitingPatients = async() => {
    const patientsWaiting = await sequelize.models.HospitalPatient.findAll({ where: { status: 'waiting' } })
    return patientsWaiting
}

export const findNextPatientWaiting = async(hospitalId: number, consultationType: string) => {
    const patientToAttend = await sequelize.models.HospitalPatient.findOne({
        where: {
           HospitalId: hospitalId,
           consultType: consultationType,
           status: 'waiting'
        },
        order: [
            ['priority', 'DESC'],
            ['risk', 'DESC'],
            ['createdAt', 'ASC']
        ],
        include: sequelize.models.Patient
    })
    return patientToAttend
}

export const findOlderPatientWaiting = async() => {
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

export const findSmokerWithUrgency= async() => {
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

export const findPatientsWithRiskGreaterThan = async(riskLimit: number) => {
    const patientsWithGreaterRiskLimit: any = await sequelize.models.HospitalPatient.findAll({
        where: {
            status: 'waiting',
            risk: {
                [Op.gt]: riskLimit
            }
        },
        order: [
            ['risk', 'DESC'],
            ['createdAt', 'ASC']
        ]
    })
    return patientsWithGreaterRiskLimit
}

//update
export const updatePendingPatientToWaiting = async() => {
    const patientsUpdated = await sequelize.models.HospitalPatient.update({ status: 'waiting'}, {
        where: {
            status: 'pending'
        }
    })
    return patientsUpdated
}