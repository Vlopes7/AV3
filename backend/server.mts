// server.mts
import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors' 
import jwt from 'jsonwebtoken'

const app = express()
const prisma = new PrismaClient()
const PORT = 3000

app.use(express.json()) 
app.use(cors()) 

const JWT_SECRET = 'sua_chave_secreta_fixa_para_o_projeto_aerocode_dev'


app.get('/', (req, res) => {
    res.send('Servidor Express rodando.')
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { funcionario: true }
        })

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' })
        }

        if(user.password == password){
            const token = jwt.sign(
            { userId: user.id, email: user.email, funcionarioId: user.funcionarioId },
            JWT_SECRET,
            { expiresIn: '8h' })
        return res.json({ token, user: { id: user.id, email: user.email, funcionario: user.funcionario }, login: true })

        }else{
            return res.status(401).json({ error: 'Credenciais inválidas.' })

        }

    }catch(error){
        console.error('Erro no login:', error)
        return res.status(500).json({ error: 'Erro interno do servidor.' })
    }
})


app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})

process.on('beforeExit', async () => {
    console.log('Fechando conexão com o Prisma...')
    await prisma.$disconnect()
})