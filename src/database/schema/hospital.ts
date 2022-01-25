import { sequelize, DataTypes } from "../../database/connection";

let Hospital:any
export const defineHospitalModel = () => {
    Hospital = sequelize.define('Hospital', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        }
    });
}

export default Hospital;