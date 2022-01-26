import { Router } from "express";
import PatientsController from './patientsCtrl'
import myHospital from "../hospitals/hospital";
import { createPatientRecordInHospital, findWaitingPatients } from "../hospitals/hospitalPatientModel";

const router = Router()

const patientsType = {
    CHILD: 'child',
    YOUNG: 'young',
    ELDER: 'elder'
}

const assignPriority = (data: any) => {
    const { type, age } = data.patientData
    switch (type) {
        case patientsType.CHILD:
            if (age <= 5)
                return data.weightRatio + 3
            if (age >= 6 && age <= 12)
                return data.weightRatio + 2
            if (age >= 13 && age <= 15)
                return data.weightRatio + 1
            break;
        case patientsType.YOUNG:
            if (data.smoker)
                return data.timeSmoking + 2
            return 2
        case patientsType.ELDER:
            if (data.hasDiet && age >= 60 && age <= 100)
                return Math.floor((age / 20) + 4)
            return Math.floor((age / 30) + 3)
    }
}

const calculateRisk = ({ patientData }: any, priority: number) => {
    const { type, age } = patientData
    if (type === patientsType.ELDER)
        return (((age * priority) / 100) + 5.3).toFixed(1)
    return ((age * priority) / 100).toFixed(1)
}

router.get('/generate', async (req, res) => {
    try {
        const { hospitalId } = req.query
        if(hospitalId) {
            const patient = new PatientsController()
            const generated = await patient.generate()
            generated.calculateExtraProp()
            // registro en tabla pacientes del hospital
            const patientRecord: any = await createPatientRecordInHospital(generated.patientDbInstace.id, hospitalId)
            // el hospital atiende al paciente para asignarle la prioridad y el riesgo
            const priority = assignPriority(generated)
            patientRecord.priority = priority
            const risk = calculateRisk(generated, priority)
            patientRecord.risk = risk
            await patientRecord.save()
    
            myHospital.asignPatientToConsultation({ ...generated.patientData, ...generated.getExtraProp(), priority, risk }, patientRecord)
    
            const patientsWaiting = await findWaitingPatients()
            if (!patientsWaiting.length) {
                patientRecord.status = 'waiting'
                await patientRecord.save()
                myHospital.attendPatients()
            }
    
            res.send({ ...generated.patientData, ...generated.getExtraProp(), priority, risk })
        }
    } catch (error) {
        res.status(500).send({ error: JSON.stringify(error) })
    }
})

export default router