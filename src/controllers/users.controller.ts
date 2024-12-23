import { Request, Response } from "express";
import { query } from "../db";

class UsersController {
  async createUser(req: Request, res: Response) {
    const { name, email, age } = req.body;
    try {
      const newPerson = await query(
        "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *",
        [name, email, age]
      );
      res.status(201).json(newPerson.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка при добавлении пользователя");
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await query("SELECT * FROM users");
      res.status(200).json(users.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка при получении данных");
    }
  }

  //   async getOneUser(req: Request, res: Response) {
  //     const { id } = req.params;
  //     const user = await query(`SELECT * FROM person WHERE id = $1`, [id]);

  //     res.json(user.rows[0]);
  //   }
  //   async updateUser(req: Request, res: Response) {
  //     const { id, name, surname } = req.body;
  //     const user = await query(
  //       `UPDATE person SET name = $1, surname = $2 WHERE id = $3 RETURNING *`,
  //       [name, surname, id]
  //     );

  //     res.json(user.rows[0]);
  //   }
  //   async deleteUser(req: Request, res: Response) {
  //     const { id } = req.params;
  //     const user = await query(`DELETE FROM person WHERE id = $1 RETURNING *`, [
  //       id,
  //     ]);

  //     res.json(user.rows[0]);
  //   }
}

export default new UsersController();
