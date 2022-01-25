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

router.post('/', async(req, res) => {
    const { name, address } = req.body
    const newHospital = sequelize.models.Hospital.build({
        name,
        address
    })
    await newHospital.save()
    res.send(newHospital)
})

export default router