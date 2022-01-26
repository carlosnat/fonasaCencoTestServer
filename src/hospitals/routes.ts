import { Router } from "express";
import { sequelize } from "../database/connection";

const router = Router()

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