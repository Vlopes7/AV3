-- CreateTable
CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rua` VARCHAR(100) NOT NULL,
    `numero` INTEGER NOT NULL,
    `bairro` VARCHAR(50) NOT NULL,
    `cidade` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Telefone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ddd` VARCHAR(3) NOT NULL,
    `numero` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcionario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `cargo` ENUM('Administrador', 'Engenheiro', 'Operador') NOT NULL,
    `login` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `enderecoId` INTEGER NULL,
    `telefoneId` INTEGER NULL,

    UNIQUE INDEX `Funcionario_cpf_key`(`cpf`),
    UNIQUE INDEX `Funcionario_login_key`(`login`),
    UNIQUE INDEX `Funcionario_enderecoId_key`(`enderecoId`),
    UNIQUE INDEX `Funcionario_telefoneId_key`(`telefoneId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aeronave` (
    `codigo` INTEGER NOT NULL,
    `modelo` VARCHAR(100) NOT NULL,
    `tipo` ENUM('Comercial', 'Militar') NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `autonomia` INTEGER NOT NULL,
    `testes` JSON NULL,

    UNIQUE INDEX `Aeronave_codigo_key`(`codigo`),
    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `tipo` ENUM('Nacional', 'Importada') NOT NULL,
    `fornecedor` VARCHAR(100) NOT NULL,
    `status` ENUM('Em_producao', 'Em_transporte', 'Pronta_para_uso') NOT NULL,
    `aeronaveId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etapa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `dataPrevista` DATE NOT NULL,
    `status` ENUM('Pendente', 'Em_andamento', 'Concluido') NOT NULL,
    `aeronaveId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EtapaFuncionario` (
    `etapaId` INTEGER NOT NULL,
    `funcionarioId` INTEGER NOT NULL,

    PRIMARY KEY (`etapaId`, `funcionarioId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `funcionarioId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_funcionarioId_key`(`funcionarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_enderecoId_fkey` FOREIGN KEY (`enderecoId`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_telefoneId_fkey` FOREIGN KEY (`telefoneId`) REFERENCES `Telefone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peca` ADD CONSTRAINT `Peca_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `Aeronave`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etapa` ADD CONSTRAINT `Etapa_aeronaveId_fkey` FOREIGN KEY (`aeronaveId`) REFERENCES `Aeronave`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtapaFuncionario` ADD CONSTRAINT `EtapaFuncionario_etapaId_fkey` FOREIGN KEY (`etapaId`) REFERENCES `Etapa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtapaFuncionario` ADD CONSTRAINT `EtapaFuncionario_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
