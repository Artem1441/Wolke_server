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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
class UsersController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, age } = req.body;
            try {
                const newPerson = yield (0, db_1.query)("INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *", [name, email, age]);
                res.status(201).json(newPerson.rows[0]);
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Ошибка при добавлении пользователя");
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield (0, db_1.query)("SELECT * FROM users");
                res.status(200).json(users.rows);
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Ошибка при получении данных");
            }
        });
    }
}
exports.default = new UsersController();
