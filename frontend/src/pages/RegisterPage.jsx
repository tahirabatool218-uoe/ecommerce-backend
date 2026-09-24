import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";

const INITIAL_FORM = { name: "", email: "", password: "", confirmPassword: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) {
    errors.name = "Full name is required.";
  }
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return errors;
}

export default function RegisterPage() {
  useDocumentTitle("Register");
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFormError("");
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;
      setFormError(message || getErrorMessage(error, "Unable to register right now. Please try again."));
    }
  }

  return (
    <section className="page page--auth">
      <div className="container">
        <div className="auth card">
          <h1 className="auth__title">Create an account</h1>
          <p className="auth__description">Register to save a cart and track your orders.</p>

          {formError && (
            <p className="auth__error" role="alert">
              {formError}
            </p>
          )}

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <fieldset className="auth__fieldset" disabled={loading}>
              <legend className="sr-only">Create an account form</legend>

              <div className="field">
                <label className="field__label" htmlFor="register-name">
                  Full name
                </label>
                <input
                  id="register-name"
                  name="name"
                  className="input"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "register-name-error" : undefined}
                />
                {fieldErrors.name && (
                  <p className="field__error" id="register-name-error">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="register-email">
                  Email
                </label>
                <input
                  id="register-email"
                  name="email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
                />
                {fieldErrors.email && (
                  <p className="field__error" id="register-email-error">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="register-password">
                  Password
                </label>
                <input
                  id="register-password"
                  name="password"
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "register-password-error" : undefined}
                />
                {fieldErrors.password && (
                  <p className="field__error" id="register-password-error">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="register-confirm-password">
                  Confirm password
                </label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  aria-describedby={fieldErrors.confirmPassword ? "register-confirm-password-error" : undefined}
                />
                {fieldErrors.confirmPassword && (
                  <p className="field__error" id="register-confirm-password-error">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn--primary btn--block">
                {loading ? "Creating account…" : "Create account"}
              </button>
            </fieldset>
          </form>

          <p className="auth__alternate">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
