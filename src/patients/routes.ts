import { Router } from "express";
import PatientsController from './patientsCtrl'

const router = Router()

router.use('/generate', async (req, res) => {
    try {
        const patient = new PatientsController()
        const generated: any = await patient.generate()
        res.send(generated)
    } catch (error) {
        res.status(500).send({ error: JSON.stringify(error) })
    }
})
export default router