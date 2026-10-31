"use client";

import { useState, type FormEvent } from "react";
import { demo } from "@/lib/copy";
import { ErrorText } from "./ErrorText";
import { Field } from "./Field";
import { postJson } from "./post-form";

const blank = {
  name: "",
  email: "",
  organisation: "",
  organisationType: "",
  organisationSize: "",
  role: "",
  phone: "",
  message: "",
  consent: false,
  safestep_leave_blank: "",
};

export function DemoSection() {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError("");
    const result = await postJson("/api/demo", form);
    setPending(false);
    if (!result.ok) {
      setErrors(result.fields);
      setFormError(Object.keys(result.fields).length ? "" : result.message);
      return;
    }
    setDone(true);
  }

  return (
    <section className="section" id={demo.id}>
      <h2>{demo.heading}</h2>
      <p>{demo.sub}</p>
      <article className="card form-card">
        {done ? (
          <p className="success" role="status">
            {demo.success}
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate aria-busy={pending}>
            <div className="hp" aria-hidden="true">
              <label htmlFor="demo-leave">Leave blank</label>
              <input
                id="demo-leave"
                name="safestep_leave_blank"
                tabIndex={-1}
                autoComplete="off"
                value={form.safestep_leave_blank}
                onChange={(event) => setForm((current) => ({ ...current, safestep_leave_blank: event.target.value }))}
              />
            </div>
            <div className="form-grid">
              <Field label={demo.nameLabel} hint={demo.nameHint} error={errors.name}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    name="name"
                    autoComplete="name"
                    aria-required="true"
                    placeholder={demo.namePlaceholder}
                    value={form.name}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    maxLength={80}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  />
                )}
              </Field>
              <Field label={demo.emailLabel} error={errors.email}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    aria-required="true"
                    placeholder={demo.emailPlaceholder}
                    value={form.email}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    maxLength={120}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  />
                )}
              </Field>
              <Field label={demo.orgLabel} error={errors.organisation}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    name="organisation"
                    autoComplete="organization"
                    aria-required="true"
                    placeholder={demo.orgPlaceholder}
                    value={form.organisation}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    maxLength={120}
                    onChange={(event) => setForm((current) => ({ ...current, organisation: event.target.value }))}
                  />
                )}
              </Field>
              <Field label={demo.typeLabel} error={errors.organisationType}>
                {({ id, describedBy, invalid }) => (
                  <select
                    id={id}
                    name="organisationType"
                    aria-required="true"
                    value={form.organisationType}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    onChange={(event) => setForm((current) => ({ ...current, organisationType: event.target.value }))}
                  >
                    <option value="">{demo.typePlaceholder}</option>
                    {demo.types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label={demo.sizeLabel} error={errors.organisationSize}>
                {({ id, describedBy, invalid }) => (
                  <select
                    id={id}
                    name="organisationSize"
                    aria-required="true"
                    value={form.organisationSize}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    onChange={(event) => setForm((current) => ({ ...current, organisationSize: event.target.value }))}
                  >
                    <option value="">{demo.sizePlaceholder}</option>
                    {demo.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label={demo.roleLabel} error={errors.role}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    name="role"
                    autoComplete="organization-title"
                    aria-required="true"
                    placeholder={demo.rolePlaceholder}
                    value={form.role}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    maxLength={80}
                    onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                  />
                )}
              </Field>
              <Field label={demo.phoneLabel} hint={demo.phoneHint} error={errors.phone}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={demo.phonePlaceholder}
                    value={form.phone}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    maxLength={40}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  />
                )}
              </Field>
            </div>
            <Field label={demo.helpLabel} hint={demo.helpHint} error={errors.message}>
              {({ id, describedBy, invalid }) => (
                <textarea
                  id={id}
                  name="message"
                  placeholder={demo.helpPlaceholder}
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
                <span>{demo.consent}</span>
              </label>
              {errors.consent ? <ErrorText>{errors.consent}</ErrorText> : null}
            </div>
            <p className="notice">{demo.note}</p>
            {formError ? <ErrorText>{formError}</ErrorText> : null}
            <button className="pill" type="submit" disabled={pending}>
              {pending ? demo.sending : demo.submit}
            </button>
            <noscript>
              <p className="notice">{demo.script}</p>
            </noscript>
          </form>
        )}
      </article>
    </section>
  );
}
