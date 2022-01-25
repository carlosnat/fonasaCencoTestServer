import { sequelize, DataTypes } from "../../database/connection";

let HospitalPatient: any
export const defineHospitalPatientModel = () => {
    HospitalPatient = sequelize.define('HospitalPatient', {
        pritority: {
            type: DataTypes.INTEGER
        },
        risk: {
            type: DataTypes.FLOAT
        },
        state: {
            type: DataTypes.ENUM('open', 'close')
        },
        consultType: {
            type: DataTypes.ENUM('pediatry', 'general', 'urgency')
        },
        status: {
            type: DataTypes.ENUM('pending', 'waiting', 'attended')
        }
    });
    HospitalPatient.belongsTo(sequelize.models.Hospital)
    sequelize.models.Hospital.belongsToMany(sequelize.models.Patient, { through: HospitalPatient})
    sequelize.models.Patient.belongsToMany(sequelize.models.Hospital, { through: HospitalPatient})
}

export default HospitalPatient;