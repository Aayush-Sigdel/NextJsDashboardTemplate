"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Form, Input } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "../../../../i18n/navigation";
import { signInAction } from "./actions";

interface FormValues {
  email: string;
  password: string;
}

function SignInForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onFinish = (values: FormValues) => {
    setError(null);
    startTransition(async () => {
      const result = await signInAction(
        values.email,
        values.password,
        locale,
        callbackUrl ?? undefined,
      );
      if (result?.error) {
        setError(t("invalidCredentials"));
      }
    });
  };

  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/20 sm:p-8">
      <h1 className="font-display text-3xl font-medium">{t("signInTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{t("signInDescription")}</p>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mt-4"
        />
      )}

      <Form<FormValues>
        layout="vertical"
        requiredMark={false}
        className="mt-8"
        onFinish={onFinish}
      >
        <Form.Item
          label={t("email")}
          name="email"
          rules={[
            { required: true, message: t("required") },
            { type: "email" },
          ]}
        >
          <Input
            size="large"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
          />
        </Form.Item>

        <Form.Item
          label={t("password")}
          name="password"
          rules={[{ required: true, message: t("required") }]}
        >
          <Input.Password
            size="large"
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
          />
        </Form.Item>

        <Form.Item className="mb-0 mt-8">
          <Button
            type="primary"
            size="large"
            block
            htmlType="submit"
            loading={isPending}
          >
            {t("signInButton")}
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mx-auto block w-fit font-display text-3xl font-medium tracking-wide text-foreground"
        >
          Dashboard
        </Link>

        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
