import Axios from 'axios';
import {
    ChildPatient,
    YoungPatient,
    ElderlyPatient,
    TPatient,
} from './patient';
import utils from '../utils/utils';

class PatientController {
    async fetchRandomUser() {
        const { data } = await Axios.get('https://randomuser.me/api/?results=1&inc=gender,name,dob,id,picture');
        const [userData] = data.results;
        return userData
    }

    buildPatientData(userData: any) {
        const { name: { first, last }, gender } = userData;
        const age = utils.generateRandomNumber(100)
        return {
            name: `${first} ${last}`,
            age,
            historyId: new Date().getTime().toString(),
            gender
        };
    }

    async generate(): Promise<any> {
        const randomData = await this.fetchRandomUser()
        const newPatientData = this.buildPatientData(randomData)
        return this.buildPatient(newPatientData);
    }

    buildPatient(patientData: TPatient) {
        const { age } = patientData;
        if (age <= 15) {
            return new ChildPatient(patientData);
        }
        if (age >= 16 && age <= 40) {
            return new YoungPatient(patientData);
        }
        if (age >= 41) {
            return new ElderlyPatient(patientData);
        }
    }
}

export default PatientController;