import { sequelize, DataTypes } from "../../database/connection";

let youngPatient:any
export const defineyoungPatientModel = () => {
    youngPatient = sequelize.define('youngPatient', {
        smoker: {
            type: DataTypes.BOOLEAN
        },
        timeSmoking: {
            type: DataTypes.INTEGER
        }
    });
    sequelize.models.Patient.hasMany(youngPatient)
}

export default youngPatient;