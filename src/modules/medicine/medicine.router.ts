import express,{Router} from 'express'
import { MedicineController } from './medicine.controller'
import auth, { Role } from '../../middlewares/auth'


const router = express.Router()
router.post("/seller/medicines",auth(Role.SELLER),MedicineController.createMedicine)
router.get("/medicines",MedicineController.getAllMedicine)
router.get('/medicines/:medicineId',MedicineController. getMedicineById)
router.patch('/seller/medicines/:medicineId',auth(Role.SELLER),MedicineController.updateMedicineById)
router.delete('/seller/medicines/:medicineId',auth(Role.SELLER),MedicineController.deleteMedicineById)
export const medicineRouter:Router = router