import { px } from "./utils";

export const Logo = ({ className }: { className?: string }) => {
  const polyRoundness = 16;
  const hypotenuse = polyRoundness * 2;
  const hypotenuseHalf = polyRoundness / 2 - 1.5;

  return (
    <div
      className={`inline-flex relative uppercase border font-mono cursor-pointer items-center font-medium justify-center gap-2 whitespace-nowrap ease-out transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background border-primary text-primary [&>[data-border]]:bg-primary [box-shadow:inset_0_0_54px_0px_var(--tw-shadow-color)] shadow-primary/60 hover:shadow-primary/80 hover:text-primary-foreground hover:bg-primary/10 h-16 px-6 text-base ${className}`}
      style={
        {
          "--poly-roundness": px(polyRoundness),
          clipPath:
            "polygon(var(--poly-roundness) 0, calc(100% - var(--poly-roundness)) 0, 100% 0, 100% calc(100% - var(--poly-roundness)), calc(100% - var(--poly-roundness)) 100%, 0 100%, 0 calc(100% - var(--poly-roundness)), 0 var(--poly-roundness))",
        } as React.CSSProperties
      }
    >
      <span
        data-border="top-left"
        style={
          {
            "--h": px(hypotenuse),
            "--hh": px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className="absolute inline-block w-[var(--h)] top-[var(--hh)] left-[var(--hh)] h-[2px] -rotate-45 origin-top -translate-x-1/2 animate-pulse"
      />
      <span
        data-border="bottom-right"
        style={
          {
            "--h": px(hypotenuse),
            "--hh": px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className="absolute w-[var(--h)] bottom-[var(--hh)] right-[var(--hh)] h-[2px] -rotate-45 translate-x-1/2 animate-pulse"
      />

      <span className="font-sentient font-light text-md">
        Future
        <span className="font-sentient font-bold text-md text-blue-700">
          Base
        </span>
      </span>
    </div>
  );
};
