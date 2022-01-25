import { Router } from "express";
import PatientsController from './patientsCtrl'
import myHospital from "../hospitals/hospital";
import { sequelize } from "../database/connection";

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
        const patient = new PatientsController()
        const generated = await patient.generate()
        //
        generated.calculateExtraProp()
        const hospitalPatientDbInstance:any = sequelize.models.HospitalPatient.build({
            PatientId: generated.patientDbInstace.id,
            status: 'pending',
            HospitalId: req.query.hospitalId,
        })

        await hospitalPatientDbInstance.save()
        const priority = assignPriority(generated)
        hospitalPatientDbInstance.priority = priority
        const risk = calculateRisk(generated, priority)
        hospitalPatientDbInstance.risk = risk
        await hospitalPatientDbInstance.save()
        myHospital.addPatientToQueue({ ...generated.patientData, ...generated.getExtraProp(), priority, risk }, hospitalPatientDbInstance)
        res.send({ ...generated.patientData, ...generated.getExtraProp(), priority, risk })
    } catch (error) {
        res.status(500).send({ error: JSON.stringify(error) })
    }
})

router.get('/attend', async (req, res) => {
    myHospital.attendPatients()
    res.send({ msg: 'attend', consults: myHospital.consults })
})

router.get('/free', async (req, res) => {
    myHospital.freeConsults()
    res.send({ msg: 'all free' })
})

router.get('/top', async (req, res) => {
    res.send({ top: myHospital.topConsults() })
})

router.get('/older', async (req, res) => {
    res.send({ top: await myHospital.findOlder() })
})

router.get('/top-smoker', async (req, res) => {
    res.send({ top: myHospital.smokerUgency() })
})

export default router