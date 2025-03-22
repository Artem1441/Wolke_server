import queryDB from ".";
import { bcryptCompare } from "../helpers/bcrypt.helper";

export const createVerificatioCodeQuery = async ({
  login,
  type,
  value,
  code,
  expiresAt,
}: {
  login: string;
  type: any;
  value: any;
  code: any;
  expiresAt: any;
}) => {
  await queryDB(
    `INSERT INTO verification_codes (user_login, type, value, code, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [login, type, value, code, expiresAt]
  );
};

export const getUserQuery = async (id: any) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await queryDB(query, [id]);
  return result.rows[0];
};

export const getUserBy = async (key: string, value: string) => {
  const query = `SELECT * FROM users WHERE ${key} = $1`;
  const result = await queryDB(query, [value]);
  return result.rows[0];
};

export const signUpQuery = async (
  name: string,
  email: string,
  phone: string,
  login: string,
  password: string
) => {
  const query = `INSERT INTO users (name, email, phone, login, password) VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
  const result = await queryDB(query, [name, email, phone, login, password]);
  return result.rows[0].id;
};

export const signInQuery = async (login: string, password: string) => {
  const query = `SELECT * FROM users WHERE login = $1`;
  const result = await queryDB(query, [login]);
  const user = result.rows[0];

  if (!user)
    return { status: false, message: "Нет пользователя с таким логином" };

  console.log(password, user.password);

  const isCorrectPassword = await bcryptCompare(password, user.password);

  if (!isCorrectPassword)
    return { status: false, message: "Пароль не подходит" };

  return { status: true, data: user.id };
};
