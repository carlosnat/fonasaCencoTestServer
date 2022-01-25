import { sequelize, DataTypes } from "../../database/connection";

let HospitalPatient: any
export const defineHospitalPatientModel = () => {
    HospitalPatient = sequelize.define('HospitalPatient', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        priority: {
            type: DataTypes.INTEGER
        },
        risk: {
            type: DataTypes.FLOAT
        },
        consultType: {
            type: DataTypes.ENUM('pediatry', 'general', 'urgency')
        },
        status: {
            type: DataTypes.ENUM('pending', 'waiting', 'attended')
        }
    });
    HospitalPatient.belongsTo(sequelize.models.Hospital)
    HospitalPatient.belongsTo(sequelize.models.Patient)
    sequelize.models.Hospital.belongsToMany(sequelize.models.Patient, { through: HospitalPatient, uniqueKey: 'id' })
    sequelize.models.Patient.belongsToMany(sequelize.models.Hospital, { through: HospitalPatient, uniqueKey: 'id' })
}

export default HospitalPatient;