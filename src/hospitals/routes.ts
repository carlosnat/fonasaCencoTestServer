import { Router } from "express";
import myHospital from "./hospital";
import { createHospital, findAllHospitals } from "./hospitalModel";
import { findPatientsByStatus } from "./hospitalPatientModel";

const router = Router()

router.post('/', async (req, res) => {
    const { name, address } = req.body
    const newHospital = await createHospital({ name, address })
    res.send(newHospital)
})

router.get('/', async(req, res) => {
    const hospitals = await findAllHospitals()
    res.send(hospitals)
})

router.get('/older', async (req, res) => {
    res.send({ top: await myHospital.findOlder() })
})

router.get('/urgency-smoker', async (req, res) => {
    try {
        res.send(await myHospital.smokerUrgency())
    } catch (error) {
        res.send(error)
    }
})

router.get('/greater-risk-than-patient', async (req, res) => {
    try {
        const { patientHistoryNumber } = req.query
        res.send(await myHospital.greaterRisk(patientHistoryNumber))
    } catch (error) {
        res.send(error)
    }
})

router.get('/attend', async (req, res) => {
    myHospital.attendPatients()
    res.send({ msg: 'attend' })
})

router.get('/patients', async(req, res) => {
    const { hospitalId, status } = req.query
    const patients = await findPatientsByStatus(hospitalId, status)
    res.send(patients)
})

export default router