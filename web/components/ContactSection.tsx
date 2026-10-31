"use client";

import { useState, type FormEvent } from "react";
import { commandCentre, contact, phone } from "@/lib/copy";
import { ErrorText } from "./ErrorText";
import { Field } from "./Field";
import { postJson } from "./post-form";

const blank = { name: "", email: "", message: "", consent: false, safestep_leave_blank: "" };

export function ContactSection() {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError("");
    const result = await postJson("/api/contact", {
      name: form.name,
      email: form.email,
      message: form.message,
      consent: form.consent,
      safestep_leave_blank: form.safestep_leave_blank,
    });
    setPending(false);
    if (!result.ok) {
      setErrors(result.fields);
      setFormError(Object.keys(result.fields).length ? "" : result.message);
      return;
    }
    setDone(true);
  }

  return (
    <section className="section" id={contact.id}>
      <h2>{contact.heading}</h2>
      <p>{contact.sub}</p>
      <div className="pair">
        <article className="card">
          <a className="pill call" href={phone.tel}>
            {contact.call}
          </a>
          <p className="danger-line">
            {contact.danger}{" "}
            <a href={commandCentre.tel}>{contact.dangerRest}</a>
          </p>
        </article>
        <article className="card">
          {done ? (
            <p className="success" role="status">
              {contact.success}
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-busy={pending}>
              <div className="hp" aria-hidden="true">
                <label htmlFor="contact-leave">Leave blank</label>
                <input
                  id="contact-leave"
                  name="safestep_leave_blank"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.safestep_leave_blank}
                  onChange={(event) => setForm((current) => ({ ...current, safestep_leave_blank: event.target.value }))}
                />
              </div>
              <Field label={contact.nameLabel} hint={contact.nameHint} error={errors.name}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    name="name"
                    autoComplete="name"
                    placeholder={contact.namePlaceholder}
                    value={form.name}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    maxLength={80}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  />
                )}
              </Field>
              <Field label={contact.emailLabel} hint={contact.emailHint} error={errors.email}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    placeholder={contact.emailPlaceholder}
                    value={form.email}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    maxLength={120}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  />
                )}
              </Field>
              <Field label={contact.messageLabel} hint={contact.messageHint} error={errors.message}>
                {({ id, describedBy, invalid }) => (
                  <textarea
                    id={id}
                    name="message"
                    required
                    aria-required="true"
                    placeholder={contact.messagePlaceholder}
                    value={form.message}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    maxLength={2000}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  />
                )}
              </Field>
              <div className="field">
                <label className="check">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    aria-invalid={errors.consent ? true : undefined}
                    onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))}
                  />
                  <span>{contact.consent}</span>
                </label>
                {errors.consent ? <ErrorText>{errors.consent}</ErrorText> : null}
              </div>
              <p className="notice">{contact.privacy}</p>
              {formError ? <ErrorText>{formError}</ErrorText> : null}
              <button className="pill" type="submit" disabled={pending}>
                {pending ? contact.sending : contact.submit}
              </button>
              <noscript>
                <p className="notice">{contact.script}</p>
              </noscript>
            </form>
          )}
        </article>
      </div>
    </section>
  );
}
