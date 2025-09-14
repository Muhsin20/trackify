"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useState } from "react";




type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // optional hook to refresh UI, etc.
  userEmail?: string;   // <-- add this
  userId?: string; 
};



const PasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Current password is required"),
  password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(25, "Password must be at max 25 characters long"),
  confirmPassword: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function ChangePasswordModal({ open, onClose, onSuccess, userEmail, userId }: Props) {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  async function handlePasswordChange(values: { oldPassword: string; password: string; confirmPassword: string }) {
    setLoading(true);
    try {
      const res = await fetch(
        "https://tm89rn3opa.execute-api.us-east-1.amazonaws.com/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            // send whichever your backend expects:
            email: userEmail,          // <- use the actual value
            // userId,                 // <- or this, if needed instead
            oldPassword: values.oldPassword,
            newPassword: values.password,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to change password");
      }

      toast.success("Password updated successfully");
      onSuccess?.();
      onClose();
    } catch (e: any) {
      toast.error(e?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => (!loading ? onClose() : null)}
      />
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
            <button
              type="button"
              onClick={() => (!loading ? onClose() : null)}
              className="p-2 rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Body: Form */}
          <div className="p-5">
            <Formik
              initialValues={{ oldPassword: "", password: "", confirmPassword: "" }}
              validationSchema={PasswordSchema}
              onSubmit={handlePasswordChange}
            >
              {({ isValid, dirty }) => (
                <Form className="space-y-4">
                  {/* Current password */}
                  <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-700">
                      Current password
                    </label>
                    <Field
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      autoComplete="current-password"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter current password"
                    />
                    <ErrorMessage name="oldPassword" component="div" className="mt-1 text-sm text-rose-600" />
                  </div>

                  {/* New password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      New password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="At least 8 characters"
                    />
                    <ErrorMessage name="password" component="div" className="mt-1 text-sm text-rose-600" />
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                      Confirm new password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Re-enter new password"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-rose-600" />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => (!loading ? onClose() : null)}
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-2.5 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-60"
                      disabled={!isValid || !dirty || loading}
                    >
                      {loading ? (
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
