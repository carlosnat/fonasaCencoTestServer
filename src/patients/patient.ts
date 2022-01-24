import utils from "../utils/utils";

export type TPatient = {
    name: string;
    age: number;
    historyId: string;
    gender: string;
    type?: string;
}

export interface IPatient {
    patientData?: TPatient;
    calculateExtraProp():void;
}

class Patient implements IPatient {
    patientData: TPatient;
    constructor(patientData: TPatient) {
        this.patientData = patientData;
    }
    calculateExtraProp() { }
}

export class ChildPatient extends Patient {
    weightRatio: number = 0;
    constructor(patientData: TPatient) {
        super({ ...patientData, type: 'child' })
    }
    calculateExtraProp() {
        console.log('calculat peso ratio')
        this.weightRatio = utils.generateRandomNumber(4, 1)
    }
}

export class YoungPatient extends Patient {
    smoker: boolean = false;
    timeSmoking: number = 0;
    constructor(patientData: TPatient) {
        super({ ...patientData, type: 'young' })
    }
    calculateExtraProp() {
        this.smoker = utils.generateRandomNumber(2) === 1 ? true : false
        this.timeSmoking = Math.floor(Math.random() * this.patientData.age)
    }
}

export class ElderlyPatient extends Patient {
    hasDiet: boolean = false;
    constructor(patientData: TPatient) {
        super({ ...patientData, type: 'elder' })
    }
    calculateExtraProp() {
        this.hasDiet = utils.generateRandomNumber(2) === 1 ? true : false
    }
}