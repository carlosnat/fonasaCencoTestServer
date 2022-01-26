import Axios from 'axios';
import {
    ChildPatient,
    YoungPatient,
    ElderlyPatient,
    TPatient,
} from './patient';
import utils from '../utils/utils';
import { createPatient } from './patientModel';
import { createPatientRecordInHospital, findWaitingPatients } from '../hospitals/hospitalPatientModel';
import { patientsType } from './types';
import myHospital from '../hospitals/hospital';

class PatientController {
    patientDb: any;
    patientTypeInstance: any;
    patientHospitalRecord: any;

    async generate(hospitalId: any): Promise<any> {
        const randomData = await this.fetchRandomPatientData()
        const newPatientData = this.organizePatientData(randomData)
        this.patientDb = await createPatient(newPatientData)
        this.patientTypeInstance = await this.buildPatient(newPatientData);
        await this.patientTypeInstance.calculateExtraProp()
        this.patientHospitalRecord = await createPatientRecordInHospital(this.patientDb.id, hospitalId)
        await this.assignPatientPriority()
        await this.calculatePatientRisk()
        await myHospital.asignPatientToConsultation(this.patientDb.group, this.patientHospitalRecord.priority , this.patientHospitalRecord)
        await this.validateNewPatientCanBeAttended()
        return { patient: this.patientDb, hospitalRecord: this.patientHospitalRecord }
    }

    async fetchRandomPatientData() {
        const { data } = await Axios.get('https://randomuser.me/api/?results=1&inc=gender,name,dob,id,picture');
        const [userData] = data.results;
        return userData
    }

    organizePatientData(userData: any) {
        const { name: { first, last }, gender, picture: { medium } } = userData;
        const maxAgeToGenerate: number = 100;
        const age = utils.generateRandomNumber(maxAgeToGenerate)
        return {
            name: `${first} ${last}`,
            age,
            historyNumber: new Date().getTime().toString(),
            gender,
            image: medium
        };
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

    async assignPatientPriority() {
        let priorityCalculated;
        switch (this.patientDb.group) {
            case patientsType.CHILD:
                if (this.patientDb.age <= 5)
                    priorityCalculated = this.patientTypeInstance.weightRatio + 3
                if (this.patientDb.age >= 6 && this.patientDb.age <= 12)
                    priorityCalculated = this.patientTypeInstance.weightRatio + 2
                if (this.patientDb.age >= 13 && this.patientDb.age <= 15)
                    priorityCalculated = this.patientTypeInstance.weightRatio + 1
                break;
            case patientsType.YOUNG:
                if (this.patientTypeInstance.smoker)
                    priorityCalculated = this.patientTypeInstance.timeSmoking + 2
                priorityCalculated = 2
            case patientsType.ELDER:
                if (this.patientTypeInstance.hasDiet && this.patientDb.age >= 60 && this.patientDb.age <= 100)
                    priorityCalculated = Math.floor((this.patientDb.age / 20) + 4)
                priorityCalculated = Math.floor((this.patientDb.age / 30) + 3)
        }
        this.patientHospitalRecord.priority = priorityCalculated
        await this.patientHospitalRecord.save()
    }

    async calculatePatientRisk() {
        let riskCalculated
        if (this.patientDb.group === patientsType.ELDER)
            riskCalculated = (((this.patientDb.age * this.patientHospitalRecord.priority) / 100) + 5.3).toFixed(1)
        riskCalculated = ((this.patientDb.age * this.patientHospitalRecord.priority) / 100).toFixed(1)
        this.patientHospitalRecord.risk = riskCalculated
        await this.patientHospitalRecord.save()
    }

    async validateNewPatientCanBeAttended() {
        const patientsWaiting = await findWaitingPatients()
        if (!patientsWaiting.length) {
            this.patientHospitalRecord.status = 'waiting'
            await this.patientHospitalRecord.save()
            await myHospital.attendPatients()
        }
    }
}

export default PatientController;