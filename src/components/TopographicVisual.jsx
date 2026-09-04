import React from 'react';

/**
 * TopographicVisual Component
 * Minimalist abstract topographic SVG visual representing mountainous terrain.
 * Adapts dynamically between light and dark modes while maintaining high refinement.
 */
export const TopographicVisual = () => {
  return (
    <div className="relative w-full h-full min-h-[260px] lg:min-h-[380px] flex items-center justify-center overflow-hidden">
      {/* Background subtle grid pattern fade */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

      {/* Main Topographic SVG */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full max-w-lg max-h-[440px] text-stone-400 dark:text-stone-600 select-none opacity-90 transition-colors duration-200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shaded landform elevation fills */}
        <path
          d="M 100 450 Q 250 350, 400 400 T 700 350 L 800 600 L 0 600 Z"
          className="fill-stone-200/20 dark:fill-stone-800/30"
        />
        <path
          d="M 150 400 Q 300 280, 480 320 T 720 280 L 800 600 L 50 600 Z"
          className="fill-emerald-900/[0.02] dark:fill-emerald-400/[0.03]"
        />
        <path
          d="M 220 340 Q 350 220, 520 260 T 680 230 L 800 600 L 150 600 Z"
          className="fill-emerald-900/[0.03] dark:fill-emerald-400/[0.04]"
        />

        {/* Contour lines */}
        <path
          d="M -50 500 C 150 480, 250 540, 450 490 C 650 440, 750 520, 850 480"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-stone-300 dark:text-stone-700"
        />
        <path
          d="M -50 450 C 120 410, 280 470, 420 420 C 580 370, 700 440, 850 400"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-stone-300 dark:text-stone-700"
        />
        <path
          d="M -30 390 C 100 350, 260 410, 400 360 C 540 310, 680 390, 830 340"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-stone-300 dark:text-stone-700"
        />

        {/* Mid-elevation mountain contours with subtle green accent */}
        <path
          d="M 50 340 C 160 290, 310 360, 440 300 C 570 240, 640 320, 780 280"
          stroke="currentColor"
          strokeWidth="1.4"
          className="text-stone-400 dark:text-stone-600"
        />
        <path
          d="M 100 290 C 200 240, 340 300, 460 250 C 580 200, 630 270, 730 230"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#2d5a44] dark:text-emerald-500 opacity-60 dark:opacity-70"
        />
        <path
          d="M 160 240 C 240 190, 370 250, 470 200 C 570 150, 610 220, 680 180"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-stone-400 dark:text-stone-600"
        />

        {/* High peak contours */}
        <path
          d="M 220 190 C 290 150, 390 200, 470 160 C 540 120, 580 180, 630 150"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#2d5a44] dark:text-emerald-500 opacity-75"
        />
        <path
          d="M 290 150 C 340 120, 410 160, 470 130 C 510 100, 540 140, 580 120"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#2d5a44] dark:text-emerald-400 opacity-90"
        />
        <path
          d="M 360 120 C 400 100, 430 130, 470 105 C 490 90, 510 110, 530 100"
          stroke="currentColor"
          strokeWidth="1.8"
          className="text-[#2d5a44] dark:text-emerald-400"
        />

        {/* Elevation marker line */}
        <path
          d="M 400 95 C 430 85, 450 100, 475 90 C 485 82, 495 95, 505 90"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#2d5a44] dark:text-emerald-400"
        />

        <text x="515" y="93" className="fill-[#2d5a44] dark:fill-emerald-400 text-[10px] font-mono font-semibold opacity-90">
          1420m
        </text>
        <text x="590" y="123" className="fill-stone-500 dark:fill-stone-400 text-[9px] font-mono opacity-70">
          1200m
        </text>

        {/* Active Monitoring Node */}
        <g transform="translate(470, 105)">
          <circle r="10" className="animate-ping fill-emerald-700/20 dark:fill-emerald-400/20 opacity-75" />
          <circle r="12" className="stroke-emerald-800/40 dark:stroke-emerald-400/40" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          <circle r="3.5" className="fill-[#2d5a44] dark:fill-emerald-400" />
          <circle r="1" className="fill-white dark:fill-stone-950" />
          <g transform="translate(18, -10)">
            <rect x="0" y="0" width="70" height="18" rx="3" className="fill-white dark:fill-stone-800 stroke-stone-200 dark:stroke-stone-700" strokeWidth="1" opacity="0.95" />
            <text x="6" y="12" className="fill-stone-900 dark:fill-stone-100 text-[8.5px] font-sans font-semibold">
              NODE-04 [ON]
            </text>
          </g>
        </g>

        {/* Location Marker 2 */}
        <g transform="translate(240, 240)">
          <circle r="3" className="fill-stone-600 dark:fill-stone-400" />
          <circle r="7" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" className="text-stone-500 dark:text-stone-500" />
        </g>

        {/* Coordinates text */}
        <g transform="translate(40, 540)">
          <text className="fill-stone-400 dark:fill-stone-500 text-[9.5px] font-mono letter-spacing-[0.5px]">
            LAT: 27°59'17"N | LON: 86°55'31"E
          </text>
        </g>
      </svg>
    </div>
  );
};
