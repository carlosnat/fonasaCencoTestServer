import { sequelize } from "../database/connection";
import utils from "../utils/utils";

export type TPatient = {
    name: string;
    age: number;
    historyNumber: string;
    gender: string;
    type?: string;
    image: string;
}

export interface IPatient {
    patientData?: TPatient;
    calculateExtraProp():void;
    getExtraProp(): any;
}

class Patient implements IPatient {
    patientData: TPatient;
    constructor(patientData: TPatient) {
        this.patientData = patientData;
    }
    calculateExtraProp() { }
    getExtraProp() {}
}

export class ChildPatient extends Patient {
    weightRatio: number = 0;
    patientDbInstace: any;
    constructor(patientData: TPatient, patientDbInstace:any) {
        super({ ...patientData, type: 'child' })
        this.patientDbInstace = patientDbInstace
    }
    async calculateExtraProp() {
        this.weightRatio = utils.generateRandomNumber(4, 1)
        const childInstance = sequelize.models.childPatient.build({
            weightHeightRelation: this.weightRatio,
            PatientId: this.patientDbInstace.id
        })
        await childInstance.save()
    }

    getExtraProp() {
        return {
            weightRatio: this.weightRatio,
        }
    }
}

export class YoungPatient extends Patient {
    smoker: boolean = false;
    timeSmoking: number = 0;
    patientDbInstace: any;
    constructor(patientData: TPatient, patientDbInstace:any) {
        super({ ...patientData, type: 'young' })
        this.patientDbInstace = patientDbInstace
    }
    async calculateExtraProp() {
        this.smoker = utils.generateRandomNumber(2) === 1 ? true : false
        this.timeSmoking = Math.floor(Math.random() * this.patientData.age)
        const youngInstance = sequelize.models.youngPatient.build({
            smoker: this.smoker,
            timeSmoking: this.timeSmoking,
            PatientId: this.patientDbInstace.id
        })
        await youngInstance.save()
    }

    getExtraProp() {
        return {
            smoker: this.smoker,
            timeSmoking: this.timeSmoking
        }
    }
}

export class ElderlyPatient extends Patient {
    hasDiet: boolean = false;
    patientDbInstace: any;
    constructor(patientData: TPatient, patientDbInstace:any) {
        super({ ...patientData, type: 'elder' })
        this.patientDbInstace = patientDbInstace
    }
    async calculateExtraProp() {
        this.hasDiet = utils.generateRandomNumber(10) < 4 ? true : false
        const elderInstance = sequelize.models.elderPatient.build({
            hasDiet: this.hasDiet,
            PatientId: this.patientDbInstace.id
        })
        await elderInstance.save()
    }

    getExtraProp() {
        return {
            hasDiet: this.hasDiet,
        }
    }
}