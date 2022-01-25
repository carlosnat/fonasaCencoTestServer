import { Sequelize } from 'sequelize';
import { definechildPatientModel } from './schema/childPatient';
import { defineConsultationModel } from './schema/consultation';
import { defineElderPatient } from './schema/elderPatient';
import { defineHospitalModel } from './schema/hospital';
import { defineHospitalPatientModel } from './schema/hospitalPatient';
import { definePatientlModel } from './schema/patient';
import { defineyoungPatientModel } from './schema/youngPatient';


export const sequelize = new Sequelize('fonasa', 'postgres', 'pass1234', {
    host: 'localhost',
    dialect: 'postgres'
});

export const connecToDataBase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export const closeConnection = () => {
    sequelize.close()
}

export * from 'sequelize'

(async () => {
    defineHospitalModel()
    definePatientlModel()
    defineConsultationModel()
    defineHospitalPatientModel()
    definechildPatientModel()
    defineyoungPatientModel()
    defineElderPatient()
    await sequelize.sync();
    // await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
})()