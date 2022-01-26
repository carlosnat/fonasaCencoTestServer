import { Router } from "express";
import myHospital from "./hospital";
import { createHospital } from "./hospitalModel";

const router = Router()

router.post('/', async (req, res) => {
    const { name, address } = req.body
    const newHospital = await createHospital({ name, address })
    res.send(newHospital)
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
        console.log('patientHistoryNumber', patientHistoryNumber)
        res.send(await myHospital.greaterRisk(patientHistoryNumber))
    } catch (error) {
        res.send(error)
    }
})

router.get('/attend', async (req, res) => {
    myHospital.attendPatients()
    res.send({ msg: 'attend' })
})

export default router