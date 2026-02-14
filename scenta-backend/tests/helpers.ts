import jwt from "jsonwebtoken";
import { User } from "../src/models/User";

export const createUser = async (role: "customer" | "admin" = "customer") => {
  const user = await User.create({
    email: `${role}@example.com`,
    passwordHash: "hash",
    name: role,
    role
  });
  const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET || "test-secret", {
    expiresIn: "15m"
  });
  return { user, token };
};
