import { sequelize } from "../database/connection"

type paramsCreateHospital = { name: string, address: string }
export const createHospital = async({ name, address }:paramsCreateHospital) => {
    const newHospital = sequelize.models.Hospital.build({
        name,
        address
    })
    await newHospital.save()
    return newHospital
}