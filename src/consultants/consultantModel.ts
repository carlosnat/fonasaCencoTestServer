import { sequelize } from "../database/connection"

type ParamsCreateConsultation = {
    specialistName: string;
    type: string;
    hospitalId: number;
}

export const CreateConsultation = async ({ specialistName, type, hospitalId }: ParamsCreateConsultation) => {
    try {
        const newConsultation = sequelize.models.Consultation.build({ specialistName, type, HospitalId: hospitalId })
        await newConsultation.save()
        return newConsultation
    } catch (error) {
        throw new Error("error on create consultation:" + error);
    }
}

export const findTopConsultation = async () => {
    const topAttendedConsultant = await sequelize.models.Consultation.findOne({
        order: [
            ['totalAttended', 'DESC']
        ]
    })
    return topAttendedConsultant
}

export const freeSpotConsultations = async () => {
    const consultationsAvailable: any[] = await sequelize.models.Consultation.findAll({
        where: {
            state: 'close'
        }
    })

    for (let consultant of consultationsAvailable) {
        consultant.state = 'open'
        await consultant.save()
    }

    return consultationsAvailable
}

export const findOpenConsultations = async() => {
    const consultationOpens = await sequelize.models.Consultation.findAll({
        where: {
            state: 'open'
        }
    })
    return consultationOpens
}

export const findConsultantsByHospitalId = async(HospitalId: any) => {
    const hopsitalsConsultants = await sequelize.models.Consultation.findAll({
        where: {
            HospitalId: HospitalId
        }
    })
    return hopsitalsConsultants
}
