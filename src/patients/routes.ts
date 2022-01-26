import { Router } from "express";
import PatientsController from './patientsCtrl'

const router = Router()

router.get('/generate', async (req, res) => {
    try {
        const { hospitalId } = req.query
        if (hospitalId) {
            const patient = new PatientsController()
            const generated = await patient.generate(hospitalId)
            res.send(generated)
        } else {
            res.status(400).send({ error: 'please send hospitalId query param'})
        }
    } catch (error) {
        res.send(error)
    }
})

export default router