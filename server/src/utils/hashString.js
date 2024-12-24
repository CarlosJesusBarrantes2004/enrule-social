import bcrypt from 'bcryptjs';

export const hashString = async (string) => {
  const bcryptSalt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(string, bcryptSalt);
};

export const compareString = async (string, stringSaved) =>
  bcrypt.compareSync(string, stringSaved);
