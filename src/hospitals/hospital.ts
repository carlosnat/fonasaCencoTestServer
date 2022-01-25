type hospitalPatient = {
    name: string;
    age: number;
    historyId: number;
    gender: string;
    type: string;
    hasDiet: boolean;
    priority: number;
    risk: number;
}

interface IHopsital {
    pediatria: hospitalPatient[];
    urgencia: hospitalPatient[];
    consultaGeneral: hospitalPatient[];
    consults: consult[];
    addPatientToQueue(patient: hospitalPatient): void;
    attendPatients(): void;
    freeConsults(): void;
    topConsults():consult | null;
}

type consult = {
    id: string;
    totalPatients: number;
    specialistName: string;
    state: 'open' | 'close';
    type: 'pediatric' | 'general' | 'urgency'
}

class Hospital implements IHopsital {
    pediatria: hospitalPatient[] = []
    urgencia: hospitalPatient[] = []
    consultaGeneral: hospitalPatient[] = []
    consults: consult[] = [];
    constructor() {
        this.configConsults()
    }

    configConsults() {
        this.consults.push({
            id: "1",
            totalPatients: 0,
            specialistName: 'carlos',
            state: 'open',
            type: 'pediatric'
        })
        this.consults.push({
            id: "2",
            totalPatients: 0,
            specialistName: 'elised',
            state: 'open',
            type: 'general'
        })
        this.consults.push({
            id: "3",
            totalPatients: 0,
            specialistName: 'ana',
            state: 'open',
            type: 'urgency'
        })
    }

    addPatientToQueue(patient: hospitalPatient) {
        if (patient.type === 'child' && patient.priority <= 4)
            this.pediatria.push(patient)
        else if (patient.priority <= 4)
            this.consultaGeneral.push(patient)
        else
            this.urgencia.push(patient)
    }

    attendPatients() {
        for (let consult of this.consults) {
            if (consult.state === 'open') {
                switch (consult.type) {
                    case 'general':
                        if (this.consultaGeneral.length) {
                            this.consultaGeneral.pop()
                            consult.state = 'close'
                            consult.totalPatients++
                        }
                        break;
                    case 'pediatric':
                        if (this.pediatria.length) {
                            this.pediatria.pop()
                            consult.state = 'close'
                            consult.totalPatients++
                        }
                        break;
                    case 'urgency':
                        if (this.urgencia.length) {
                            this.urgencia.pop()
                            consult.state = 'close'
                            consult.totalPatients++
                        }
                        break;
                }
            }
        }
    }

    freeConsults() {
        for (let consult of this.consults) {
            consult.state = 'open'
        }
    }

    topConsults():consult | null {
        let top: consult | null = null;
        for (let consult of this.consults) {
            if(!top || top.totalPatients < consult.totalPatients)
                top = consult
        }
        return top
    }
}

let myHospital: IHopsital = new Hospital()

export default myHospital