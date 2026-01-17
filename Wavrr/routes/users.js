const controller = require('../controllers/user')
const router = require("express").Router()



router.get('/', controller.getUser)
router.get('/:userId', controller.getUser)
router.post('/', controller.createUser)
router.get('/:userId', controller.updateUser)
router.get('/:userId', controller.deleteUser)



module.exports = router;