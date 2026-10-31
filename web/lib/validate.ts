import { demo, errors } from "./copy";

export type FieldErrors = Record<string, string>;

const controlChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

export function readText(value: unknown, max: number): { text: string; tooLong: boolean } {
  if (typeof value !== "string") return { text: "", tooLong: false };
  const text = value.replace(controlChars, "").trim();
  if (text.length > max) return { text: text.slice(0, max), tooLong: true };
  return { text, tooLong: false };
}

export function isEmail(value: string): boolean {
  return value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value: string): boolean {
  if (!/^[+0-9][0-9\s()-]{6,24}$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function honeypot(body: Record<string, unknown>): boolean {
  return typeof body.safestep_leave_blank === "string" && body.safestep_leave_blank.trim().length > 0;
}

export type ContactValue = {
  name: string | null;
  email: string;
  message: string;
};

export function validateContact(input: unknown): { ok: true; honeypot: true } | { ok: true; honeypot: false; value: ContactValue } | { ok: false; fields: FieldErrors } {
  if (!input || typeof input !== "object") return { ok: false, fields: { form: errors.checkForm } };
  const body = input as Record<string, unknown>;
  if (honeypot(body)) return { ok: true, honeypot: true };
  const fields: FieldErrors = {};
  const name = readText(body.name, 80);
  const email = readText(body.email, 120);
  const message = readText(body.message, 2000);
  if (name.tooLong) fields.name = errors.tooLong;
  if (!email.text) fields.email = errors.replyMissing;
  else if (email.tooLong || !isEmail(email.text)) fields.email = errors.replyBad;
  if (message.tooLong) fields.message = errors.tooLong;
  else if (!message.text) fields.message = errors.messageMissing;
  if (body.consent !== true) fields.consent = errors.consent;
  if (Object.keys(fields).length) return { ok: false, fields };
  return { ok: true, honeypot: false, value: { name: name.text || null, email: email.text, message: message.text } };
}

export type DemoValue = {
  name: string;
  email: string;
  organisation: string;
  organisationType: (typeof demo.types)[number];
  organisationSize: (typeof demo.sizes)[number];
  role: string;
  phone: string | null;
  message: string | null;
};

function normalSize(value: string): string {
  return value.replaceAll("-", "–");
}

export function validateDemo(input: unknown): { ok: true; honeypot: true } | { ok: true; honeypot: false; value: DemoValue } | { ok: false; fields: FieldErrors } {
  if (!input || typeof input !== "object") return { ok: false, fields: { form: errors.checkForm } };
  const body = input as Record<string, unknown>;
  if (honeypot(body)) return { ok: true, honeypot: true };
  const fields: FieldErrors = {};
  const name = readText(body.name, 80);
  const email = readText(body.email, 120);
  const organisation = readText(body.organisation, 120);
  const organisationType = readText(body.organisationType, 40);
  const organisationSize = readText(body.organisationSize, 20);
  const role = readText(body.role, 80);
  const phone = readText(body.phone, 40);
  const message = readText(body.message, 2000);
  if (!name.text) fields.name = errors.nameMissing;
  else if (name.tooLong) fields.name = errors.tooLong;
  if (!email.text) fields.email = errors.emailMissing;
  else if (email.tooLong || !isEmail(email.text)) fields.email = errors.emailBad;
  if (!organisation.text) fields.organisation = errors.orgMissing;
  else if (organisation.tooLong) fields.organisation = errors.tooLong;
  const type = demo.types.find((item) => item === organisationType.text);
  if (!type) fields.organisationType = errors.typeMissing;
  const size = demo.sizes.find((item) => item === normalSize(organisationSize.text));
  if (!size) fields.organisationSize = errors.sizeMissing;
  if (!role.text) fields.role = errors.roleMissing;
  else if (role.tooLong) fields.role = errors.tooLong;
  if (phone.tooLong || (phone.text && !isPhone(phone.text))) fields.phone = errors.phoneBad;
  if (message.tooLong) fields.message = errors.tooLong;
  if (body.consent !== true) fields.consent = errors.consent;
  if (Object.keys(fields).length || !type || !size) return { ok: false, fields };
  return {
    ok: true,
    honeypot: false,
    value: {
      name: name.text,
      email: email.text,
      organisation: organisation.text,
      organisationType: type,
      organisationSize: size,
      role: role.text,
      phone: phone.text || null,
      message: message.text || null,
    },
  };
}
