import express,{Router} from 'express'
import { MedicineController } from './medicine.controller'
import auth, { Role } from '../../middlewares/auth'


const router = express.Router()
router.post("/seller/medicines",auth(Role.SELLER),MedicineController.createMedicine)
router.get("/medicines",MedicineController.getAllMedicine)
export const medicineRouter:Router = router