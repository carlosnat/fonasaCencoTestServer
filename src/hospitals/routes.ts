import { Router } from "express";
import myHospital from "../hospitals/hospital";

const router = Router()

router.use('/report', async (req, res) => {
    res.send({
        pediatria: myHospital.pediatria.length,
        general: myHospital.consultaGeneral.length,
        urgencia: myHospital.urgencia.length
    })
})

export default router