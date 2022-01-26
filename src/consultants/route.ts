import { Router } from "express";
import myHospital from "../hospitals/hospital";
import { CreateConsultation, findTopConsultation, freeSpotConsultations } from "./consultantModel";

const router = Router()

router.get('/freeSpots', async (req, res) => {
    res.send({ msg: 'action success', result: await freeSpotConsultations() })
})

router.get('/topTotalAttended', async (req, res) => {
    res.send({ top: await findTopConsultation() })
})

router.post('/', async (req, res) => {
    try {
        const { specialistName, type, hospitalId } = req.body
        const newConsultation = await CreateConsultation({ specialistName, type, hospitalId })
        res.send(newConsultation)
    } catch (error) {
        res.send(error)
    }
})

export default router