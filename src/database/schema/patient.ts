import { sequelize, DataTypes } from "../../database/connection";

let Patient
export const definePatientlModel = () => {
    Patient = sequelize.define('Patient', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        age: {
            type: DataTypes.INTEGER
        },
        group: {
            type: DataTypes.ENUM('child', 'young', 'elder')
        },
        name: {
            type: DataTypes.STRING
        },
        historyNumber: {
            type: DataTypes.STRING
        }
    });
}

export default Patient;