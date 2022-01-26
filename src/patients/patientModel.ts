import { sequelize } from "../database/connection"

export const createPatient = async(newPatientData: any) => {
    const newPatient = await sequelize.models.Patient.build(newPatientData)
    await newPatient.save()
    return newPatient
}

export const findPatientByHistoryNumber = async(historyNumber: number) => {
    return await sequelize.models.Patient.findOne({
        where: {
            historyNumber
        }
    })
}