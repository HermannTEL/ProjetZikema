import { z } from "zod";

export const instruments = [
  "Piano", "Guitare", "Violon", "Batterie", "Flûte",
  "Saxophone", "Trompette", "Violoncelle", "Clarinette", "Harpe"
];

export const instrumentOptions = instruments.map(i => ({ label: i, value: i }));

export const schema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(1, "Confirmation requise"),
  role: z.enum(["professor", "student"]),
  phone: z.string().optional(),
  studentType: z.enum(["regular", "occasional", "online-only"]).optional().nullable(),
  level: z.enum(["Débutant", "Intermédiaire", "Avancé"]).optional().nullable(),
  preferredInstruments: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});
