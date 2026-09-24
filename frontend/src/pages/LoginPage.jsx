import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";

const INITIAL_FORM = { email: "", password: "" };

function validate(form) {
  const errors = {};
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

export default function LoginPage() {
  useDocumentTitle("Login");
  const { login, loading, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  // Already logged in (e.g. back button after login) — bounce onward.
  if (isAuthenticated) {
    const defaultPath = role === "admin" ? "/admin/dashboard" : "/dashboard";
    const redirectTo = location.state?.from?.pathname || defaultPath;
    return <Navigate to={redirectTo} replace />;
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
      const loggedInUser = await login(form);
      const defaultPath = loggedInUser?.role === "admin" ? "/admin/dashboard" : "/dashboard";
      const redirectTo = location.state?.from?.pathname || defaultPath;
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;
      setFormError(message || getErrorMessage(error, "Unable to log in right now. Please try again."));
    }
  }

  return (
    <section className="page page--auth">
      <div className="container">
        <div className="auth card">
          <h1 className="auth__title">Log in</h1>
          <p className="auth__description">Access your cart and order history.</p>

          {formError && (
            <p className="auth__error" role="alert">
              {formError}
            </p>
          )}

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            <fieldset className="auth__fieldset" disabled={loading}>
              <legend className="sr-only">Log in form</legend>

              <div className="field">
                <label className="field__label" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
                />
                {fieldErrors.email && (
                  <p className="field__error" id="login-email-error">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  className="input"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
                />
                {fieldErrors.password && (
                  <p className="field__error" id="login-password-error">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn--primary btn--block">
                {loading ? "Logging in…" : "Log in"}
              </button>
            </fieldset>
          </form>

          <p className="auth__alternate">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
