const createUserToken = require('../helpers/create-user-token')
const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class UserController{
    static async register(req,res) {
        // res.json('Ola')

        const {name, password, email, role, confirmpassword} = req.body

        //validations
        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatorio' })
            return   
        }

        if(!password) {
            res.status(422).json({ message: 'A senha é obrigatoria' })
            return   
        }

        if(!email) {
            res.status(422).json({ message: 'O email é obrigatorio' })
            return   
        }
        
        if(!role) {
            res.status(422).json({ message: 'O cargo é obrigatorio' })
            return   
        }

        if(!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatoria' })
            return   
        }

        if(password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e a confirmação de senha precisão ser iguais'})
            return
        }

        const userExists = await User.findOne({ email: email })

        if(userExists) {
            res.status(422).json({message: "Esse email já esta em uso"})
            return
        } 

        //criar senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //criar Usuario
        const User = new User({
            name,
            password:passwordHash,
            email,
            role,
        })

        try {
            const newUser = await User.save()
            
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({message:error})
        }
    }

    static async login(req,res) {
        const {email, password} = req.body

        if(!password) {
            res.status(422).json({ message: 'A senha é obrigatoria' })
            return   
        }

        if(!email) {
            res.status(422).json({ message: 'O email é obrigatorio' })
            return   
        }

        const user = await User.findOne({ email: email })

        if(!user) {
            res.status(422).json({message: "Não há usuario com este email"})
            return
        } 
        
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: "Senha incorreta"})
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {

        let currentUser

        if(req.headers.authorization) {

        }else{
            currentUser = null
        }
    }
}
