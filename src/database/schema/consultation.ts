import { sequelize, DataTypes } from "../../database/connection";

let Consultation: any
export const defineConsultationModel = () => {
    Consultation = sequelize.define('Consultation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        specialisName: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.ENUM('open', 'close')
        },
        type: {
            type: DataTypes.ENUM('pediatry', 'general', 'urgency')
        }
    });
    Consultation.belongsTo(sequelize.models.Hospital)
}

export default Consultation;