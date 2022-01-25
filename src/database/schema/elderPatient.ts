import { sequelize, DataTypes } from "../../database/connection";

let elderPatient:any
export const defineElderPatient = () => {
    elderPatient = sequelize.define('elderPatient', {
        hasDiet: {
            type: DataTypes.BOOLEAN
        }
    });
    sequelize.models.Patient.hasMany(elderPatient)
}

export default elderPatient;