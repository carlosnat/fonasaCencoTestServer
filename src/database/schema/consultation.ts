import { sequelize, DataTypes } from "../../database/connection";

let Consultation: any
export const defineConsultationModel = () => {
    Consultation = sequelize.define('Consultation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        specialistName: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.ENUM('open', 'close'),
            defaultValue: 'open'
        },
        type: {
            type: DataTypes.ENUM('pediatry', 'general', 'urgency')
        },
        totalAttended: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });
    Consultation.belongsTo(sequelize.models.Hospital)
}

export default Consultation;