import { Router } from "express";
import { sequelize } from "../database/connection";
import myHospital from "../hospitals/hospital";

const router = Router()

router.get('/report', async (req, res) => {
    res.send({
        pediatria: myHospital.pediatria.length,
        general: myHospital.consultaGeneral.length,
        urgencia: myHospital.urgencia.length
    })
})

router.post('/consultation', async (req, res) => {
    try {
        const { specialistName, type, hospitalId } = req.body
        const newConsultation = sequelize.models.Consultation.build({ specialistName, type, HospitalId: hospitalId })
        await newConsultation.save()
        res.send(newConsultation)
    } catch (error) {
        res.send(error)
    }
})

router.post('/', async (req, res) => {
    const { name, address } = req.body
    const newHospital = sequelize.models.Hospital.build({
        name,
        address
    })
    await newHospital.save()
    res.send(newHospital)
})

export default router