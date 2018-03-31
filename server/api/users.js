const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.post('/event', (req, res, next) => {
  User.findById(req.session.passport.user)
  .then(user => {
    user.update({
      appointment:[...user.appointment, req.body.date]
    })
    .then(()=>{
      res.send("UPDATED")
    })
  })
})

router.get('/mentor',(req,res,next)=>{
  User.findAll({
    where:{
      mentor:true,
    }
  })
  .then(foundUsers=>{
    res.json(foundUsers);
  })
})
