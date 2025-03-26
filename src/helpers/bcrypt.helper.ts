// helpers/bcrypt.helper.ts

import bcrypt from "bcrypt";

export const bcryptHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const bcryptCompare = async (
  password: string,
  hashPass: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPass);
};
