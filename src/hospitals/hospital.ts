interface IHopsital {
    pediatria: any[];
    urgencia: any[];
    consultaGeneral: any[];
    addPatientToQueue(patient:any):any;
}

class Hospital {
    pediatria: any[] = []
    urgencia: any[] = []
    consultaGeneral: any[] = []
    constructor() {}

    addPatientToQueue(patient: any) {
        if(patient.type === 'child' && patient.priority <= 4)
            this.pediatria.push(patient)
        else if(patient.priority <= 4)
            this.consultaGeneral.push(patient)
        else
            this.urgencia.push(patient)
    }
}

let myHospital: IHopsital = new Hospital()

export default myHospital