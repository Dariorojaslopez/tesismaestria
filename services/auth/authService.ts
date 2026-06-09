import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  EmailConfigError,
  sendTemporaryPasswordEmail,
} from "@/services/integrations/email";
import type { LoginInput, PublicUser, RegisterInput } from "./types";

export class AuthError extends Error {
  constructor(
    message: string,
    public code: "VALIDATION" | "CONFLICT" | "INVALID_CREDENTIALS" | "EMAIL",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

function generateTemporaryPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicUser(user: {
  id: string;
  email: string;
  names: string;
  address: string;
  department: string;
  city: string;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    names: user.names,
    address: user.address,
    department: user.department,
    city: user.city,
  };
}

function validateRegister(input: RegisterInput) {
  if (!input.names.trim()) throw new AuthError("Indica tus nombres.", "VALIDATION");
  if (!input.address.trim()) throw new AuthError("Indica tu dirección.", "VALIDATION");
  if (!input.department.trim()) throw new AuthError("Indica tu departamento.", "VALIDATION");
  if (!input.city.trim()) throw new AuthError("Indica tu ciudad.", "VALIDATION");
  if (!input.email.trim() || !input.email.includes("@")) {
    throw new AuthError("Correo electrónico no válido.", "VALIDATION");
  }
  if (!input.password || input.password.length < 6) {
    throw new AuthError("La contraseña debe tener al menos 6 caracteres.", "VALIDATION");
  }
}

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  validateRegister(input);
  const email = normalizeEmail(input.email);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AuthError("Ya existe una cuenta con ese correo.", "CONFLICT");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      names: input.names.trim(),
      address: input.address.trim(),
      department: input.department.trim(),
      city: input.city.trim(),
    },
  });

  return toPublicUser(user);
}

export async function loginUser(input: LoginInput): Promise<PublicUser> {
  const email = normalizeEmail(input.email);
  if (!email || !input.password) {
    throw new AuthError("Correo y contraseña son obligatorios.", "VALIDATION");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AuthError("Correo o contraseña incorrectos.", "INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AuthError("Correo o contraseña incorrectos.", "INVALID_CREDENTIALS");
  }

  return toPublicUser(user);
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toPublicUser(user) : null;
}

/**
 * Genera contraseña temporal, actualiza el usuario y la envía por correo.
 * Por seguridad no revela si el email existe o no al llamador.
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (!currentPassword || !newPassword) {
    throw new AuthError("Completa la contraseña actual y la nueva.", "VALIDATION");
  }
  if (newPassword.length < 6) {
    throw new AuthError("La nueva contraseña debe tener al menos 6 caracteres.", "VALIDATION");
  }
  if (currentPassword === newPassword) {
    throw new AuthError("La nueva contraseña debe ser diferente a la actual.", "VALIDATION");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AuthError("Sesión no válida.", "INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new AuthError("La contraseña actual no es correcta.", "INVALID_CREDENTIALS");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function requestPasswordReset(emailRaw: string): Promise<void> {
  const email = normalizeEmail(emailRaw);
  if (!email || !email.includes("@")) {
    throw new AuthError("Correo electrónico no válido.", "VALIDATION");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  try {
    await sendTemporaryPasswordEmail(user.email, user.names, temporaryPassword);
  } catch (error) {
    if (error instanceof EmailConfigError) {
      throw new AuthError(
        "El envío de correo no está configurado. Contacta al administrador.",
        "EMAIL",
      );
    }
    console.error("[auth/requestPasswordReset]", error);
    throw new AuthError(
      "No se pudo enviar el correo. Inténtalo más tarde.",
      "EMAIL",
    );
  }
}
