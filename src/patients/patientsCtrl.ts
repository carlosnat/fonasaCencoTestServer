import Axios from 'axios';
import {
    ChildPatient,
    YoungPatient,
    ElderlyPatient,
    TPatient
} from './patient';
import utils from '../utils/utils';

class PatientController {
    async fetchRandomUser() {
        const { data } = await Axios.get('https://randomuser.me/api/?results=1&inc=gender,name,dob,id,picture');
        const [userData] = data.results;
        return userData
    }

    buildPatientData(userData: any): TPatient {
        const { name: { first, last }, gender } = userData;
        const age = utils.generateRandomNumber(100)
        return {
            name: `${first} ${last}`,
            age,
            historyId: new Date().getTime().toString(),
            gender
        };
    }

    async generate() {
        try {
            const randomData = await this.fetchRandomUser()
            const newPatientData = this.buildPatientData(randomData)
            return this.classifyPatient(newPatientData);
        } catch (error) {
            return { error };
        }
    }

    classifyPatient(patientData: TPatient) {
        const { age } = patientData;
        let generatedPatient = undefined;
        if (age <= 15) {
            generatedPatient = new ChildPatient(patientData);
        }
        if (age >= 16 && age <= 40) {
            generatedPatient = new YoungPatient(patientData);
        }
        if (age >= 41) {
            generatedPatient = new ElderlyPatient(patientData);
        }
        return generatedPatient;
    }
}

export default PatientController;