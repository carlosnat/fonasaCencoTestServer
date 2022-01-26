import { Router } from "express";
import { 
    CreateConsultation, 
    findConsultantsByHospitalId, 
    findTopConsultation, 
    freeSpotConsultations 
} from "./consultantModel";

const router = Router()

router.get('/', async(req, res) => {
    console.log('req.query.hospitalId', req.query.hospitalId)
    const consultants = await findConsultantsByHospitalId(req.query.hospitalId)
    res.send(consultants)
})

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