// src/seed.ts
import { PrismaClient, Hierarquia } from '@prisma/client' 

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando o script de Seeding (SENHA PURA)...')

    const email = 'admin@aerocode.com'
    const cpf = '11122233344'         
    const loginFuncionario = 'admin.master' 
    const senhaTextoPuro = '123' 
    
    const existingUser = await prisma.user.findUnique({
        where: { email: email },
    })

    if (existingUser) {
        console.log(`Usuário com o email ${email} já existe. Ignorando a criação.`)
        return
    }

    const newFuncionario = await prisma.funcionario.create({
        data: {
            nome: 'Administrador Principal',
            cpf: cpf,
            cargo: Hierarquia.Administrador, 
            login: loginFuncionario,         
            senha: senhaTextoPuro, 
        }
    })
    
    console.log(`Funcionario criado: ${newFuncionario.nome} (ID: ${newFuncionario.id})`)
    
    const newUser = await prisma.user.create({
        data: {
            email: email,
            password: senhaTextoPuro, 
            funcionarioId: newFuncionario.id
        }
    })

    console.log(`   Novo usuário criado com sucesso:`)
    console.log(`   Email (Login): ${newUser.email}`)
    console.log(`   SENHA: ${senhaTextoPuro}`)

}

main()
    .catch(e => {
        console.error('Erro durante o seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })