import { sequelize } from "../database/connection"

export const findPatientByHistoryNumber = async(historyNumber: number) => {
    return await sequelize.models.Patient.findOne({
        where: {
            historyNumber
        }
    })
}