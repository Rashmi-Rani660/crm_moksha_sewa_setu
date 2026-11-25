import HeroPanel from "@/components/login/HeroPanel";
import LoginForm from "@/components/login/LoginForm";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center bg-[linear-gradient(95deg,#dcedfd_0%,#cfe8fd_55%,#c9e5fd_100%)] p-4 sm:p-8 lg:block lg:h-screen lg:min-h-0 lg:overflow-hidden lg:p-0">
      {/* Fixed 1320x794 card, scaled to the viewport on desktop */}
      <div className="mx-auto grid w-full max-w-[1320px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(20,70,150,0.35)] lg:absolute lg:left-1/2 lg:top-1/2 lg:h-[794px] lg:w-[1320px] lg:max-w-none lg:grid-cols-[804px_516px] lg:[transform:translate(-50%,-50%)_scale(var(--stage-scale,1))]">
        <HeroPanel />
        <LoginForm />
      </div>
    </main>
  );
}
