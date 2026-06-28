import { z } from "zod";

const NAME_RE = /^[A-Za-z\u00C0-\u017F'\- ]{2,100}$/;
const MOBILE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const internshipSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(NAME_RE, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .regex(EMAIL_RE, "Please enter a valid email address")
    .max(254, "Email is too long"),
  mobile: z
    .string()
    .regex(MOBILE_RE, "Enter a valid 10-digit Indian mobile number"),
  college: z
    .string()
    .min(3, "College name must be at least 3 characters")
    .max(150, "College name must be at most 150 characters"),
  subdomain: z.string().min(1, "Please select an internship domain"),
  message: z.string().max(500, "Message must be at most 500 characters").nullable().optional(),
  resumeUrl: z.string().url("Invalid resume URL").nullable().optional(),
  agreement: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to proceed" }),
  }),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name")
    .max(100),
  email: z
    .string()
    .regex(EMAIL_RE, "Please enter a valid email address")
    .max(254),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(1000),
});

export const newsletterSchema = z.object({
  email: z
    .string()
    .regex(EMAIL_RE, "Please enter a valid email address")
    .max(254),
});

export type InternshipFormData = z.infer<typeof internshipSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
