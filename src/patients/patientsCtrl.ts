import Axios from 'axios';
import {
    ChildPatient,
    YoungPatient,
    ElderlyPatient,
    TPatient,
} from './patient';
import utils from '../utils/utils';
import { sequelize } from '../database/connection';

class PatientController {
    patientDb:any;
    async fetchRandomUser() {
        const { data } = await Axios.get('https://randomuser.me/api/?results=1&inc=gender,name,dob,id,picture');
        const [userData] = data.results;
        return userData
    }

    buildPatientData(userData: any) {
        const { name: { first, last }, gender } = userData;
        const maxAgeToGenerate: number = 100;
        const age = utils.generateRandomNumber(maxAgeToGenerate)
        return {
            name: `${first} ${last}`,
            age,
            historyNumber: new Date().getTime().toString(),
            gender
        };
    }

    async generate(): Promise<any> {
        const randomData = await this.fetchRandomUser()
        const newPatientData = this.buildPatientData(randomData)
        this.patientDb = sequelize.models.Patient.build(newPatientData)
        await this.patientDb.save()
        return this.buildPatient(newPatientData);
    }

    async buildPatient(patientData: TPatient) {
        const { age } = patientData;
        if (age <= 15) {
            this.patientDb.group = 'child'
            await this.patientDb.save()
            return new ChildPatient(patientData, this.patientDb);
        }
        if (age >= 16 && age <= 40) {
            this.patientDb.group = 'young'
            await this.patientDb.save()
            return new YoungPatient(patientData, this.patientDb);
        }
        if (age >= 41) {
            this.patientDb.group = 'elder'
            await this.patientDb.save()
            return new ElderlyPatient(patientData, this.patientDb);
        }
    }
}

export default PatientController;