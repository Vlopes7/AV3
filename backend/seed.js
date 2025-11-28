"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/seed.ts
var client_1 = require("@prisma/client");
var bcrypt_1 = require("bcrypt");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var email, cpf, loginFuncionario, senhaTextoPuro, hashedPassword, existingUser, newFuncionario, newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Iniciando o script de Seeding...');
                    email = 'admin@aerocode.com';
                    cpf = '11122233344' // CPF obrigatório
                    ;
                    loginFuncionario = 'admin.master' // Login do Funcionario obrigatório
                    ;
                    senhaTextoPuro = '123';
                    return [4 /*yield*/, bcrypt_1.default.hash(senhaTextoPuro, 10)
                        // 2. Verificar se o usuário de login já existe
                    ];
                case 1:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: { email: email },
                        })];
                case 2:
                    existingUser = _a.sent();
                    if (existingUser) {
                        console.log("Usu\u00E1rio com o email ".concat(email, " j\u00E1 existe. Ignorando a cria\u00E7\u00E3o."));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, prisma.funcionario.create({
                            data: {
                                nome: 'Administrador Principal',
                                cpf: cpf,
                                cargo: client_1.Hierarquia.Administrador, // <--- Usando o Enum
                                login: loginFuncionario, // <--- Campo login
                                senha: hashedPassword, // Usamos o hash para o campo 'senha' do Funcionario
                                // enderecoId e telefoneId são opcionais (Int?) e não precisam ser fornecidos.
                            }
                        })];
                case 3:
                    newFuncionario = _a.sent();
                    console.log("Funcionario criado: ".concat(newFuncionario.nome, " (ID: ").concat(newFuncionario.id, ")"));
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: email,
                                password: hashedPassword,
                                funcionarioId: newFuncionario.id
                            }
                        })];
                case 4:
                    newUser = _a.sent();
                    console.log("\u2705 Novo usu\u00E1rio criado com sucesso:");
                    console.log("   Email (Login): ".concat(newUser.email));
                    console.log("   Login Funcionario: ".concat(newFuncionario.login));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
