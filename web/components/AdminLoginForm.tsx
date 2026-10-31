"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { adminCopy, errors } from "@/lib/copy";
import { ErrorText } from "./ErrorText";
import { Field } from "./Field";
import { postJson } from "./post-form";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError("");
    const result = await postJson("/api/admin/login", { email, password, safestep_leave_blank: honeypot });
    setPending(false);
    if (!result.ok) {
      setFieldErrors(result.fields);
      setFormError(Object.keys(result.fields).length ? "" : result.message || errors.signInMismatch);
      return;
    }
    window.location.replace("/admin");
  }

  return (
    <article className="card login-card">
      <h1>{adminCopy.title}</h1>
      <p className="lede-left">{adminCopy.signInLead}</p>
      <form onSubmit={onSubmit} noValidate aria-busy={pending}>
        <div className="hp" aria-hidden="true">
          <label htmlFor="admin-leave">Leave blank</label>
          <input id="admin-leave" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
        </div>
        <Field label={adminCopy.emailLabel} error={fieldErrors.email}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              onChange={(event) => setEmail(event.target.value)}
            />
          )}
        </Field>
        <Field label={adminCopy.passwordLabel} error={fieldErrors.password}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              onChange={(event) => setPassword(event.target.value)}
            />
          )}
        </Field>
        {formError ? <ErrorText>{formError}</ErrorText> : null}
        <button className="pill" type="submit" disabled={pending}>
          {pending ? adminCopy.opening : adminCopy.signIn}
        </button>
        <noscript>
          <p className="notice">{adminCopy.script}</p>
        </noscript>
      </form>
      <p className="back-link">
        <Link href="/">{adminCopy.back}</Link>
      </p>
    </article>
  );
}
