import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_20px_60px_rgba(17,24,39,0.08)]">
        <div>
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
            Access the operator dashboard.
          </p>
        </div>
        <LoginForm />
        <MagicLinkForm />
        <GoogleSignInButton />
      </div>
    </main>
  );
}
