import Image from "next/image";

/**
 * Sidebar footer artwork: diya photo, the Moksha Sewa motto (live text) and
 * blue waves; the motto is live text so it stays sharp at every screen density.
 */
export default function SidebarMotto({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none relative h-[232px] w-full select-none ${className}`} role="img" aria-label="Serving Humanity, Preserving Nature, Awakening Divinity">
      {/* diya photo (high resolution), edges faded into the sidebar colour */}
      <Image
        src="/images/sidebar-diya.png"
        alt=""
        width={660}
        height={422}
        sizes="222px"
        className="absolute left-1/2 top-[28px] h-[92px] w-[68%] -translate-x-1/2 object-cover [mask-image:radial-gradient(ellipse_62%_58%_at_50%_50%,#000_55%,transparent_100%)]"
      />

      <p className="absolute inset-x-0 top-[128px] text-center text-[11.5px] font-medium leading-[16px] tracking-[0.1px] text-white">
        Serving Humanity
        <br />
        Preserving Nature
        <br />
        Awakening Divinity
      </p>

      <Image
        src="/images/sidebar-waves.png"
        alt=""
        width={880}
        height={150}
        sizes="222px"
        className="absolute inset-x-0 bottom-0 h-auto w-full [mask-image:linear-gradient(transparent,#000_20%)]"
      />
    </div>
  );
}
