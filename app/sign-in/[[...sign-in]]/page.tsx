import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0B] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-3xl font-black tracking-[-0.06em] text-[#C6FF00]">
            <span className="text-2xl">✣</span>
            FORGE
          </div>

          <p className="mt-2 text-sm text-white/40">
            Forge your body. Forge your life.
          </p>
        </div>

        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#C6FF00",
              colorBackground: "#151515",
              borderRadius: "12px",
            },

            elements: {
              rootBox: "w-full",

              card: "w-full rounded-2xl border border-white/10 bg-[#151515] shadow-none",

              headerTitle: "!text-white",
              headerSubtitle: "!text-white/50",

              socialButtonsBlockButton:
                "border-white/10 bg-white/5 text-white hover:bg-white/10",

              socialButtonsBlockButtonText:
                "!text-white",

              formFieldLabel:
                "!text-white/70",

              formFieldInput:
                "border-white/10 bg-[#0B0B0B] !text-white placeholder:!text-white/30",

              formFieldInputShowPasswordButton:
                "!text-white/40 hover:!text-white",

              formButtonPrimary:
                "bg-[#C6FF00] !text-black hover:bg-[#C6FF00]/90",

              footerActionText:
                "!text-white/50",

              footerActionLink:
                "!text-[#C6FF00] hover:!text-[#C6FF00]/80",

              identityPreviewText:
                "!text-white",

              identityPreviewEditButton:
                "!text-[#C6FF00]",

              dividerLine:
                "bg-white/10",

              dividerText:
                "!text-white/30",

              otpCodeFieldInput:
                "bg-[#0B0B0B] !text-white border-white/10",

              alert:
                "border-white/10 bg-white/5 !text-white",
            },
          }}
        />
      </div>
    </main>
  );
}