import { sequelize, DataTypes } from "../../database/connection";

let childPatient:any
export const definechildPatientModel = () => {
    childPatient = sequelize.define('childPatient', {
        weightHeightRelation: {
            type: DataTypes.INTEGER
        },
    });
    sequelize.models.Patient.hasMany(childPatient)
}

export default childPatient;