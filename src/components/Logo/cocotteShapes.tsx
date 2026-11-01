import type { ReactElement } from 'react'

/**
 * The drawings of the cocotte logo, copied from the symbols of the canvas board `Retouche-2-cocotte` (`pb-L`, `pb-M`,
 * `pb-S`, `pb-XS`). Every colour is a `--logo-*` variable that `Logo` sets from the design tokens, so one drawing
 * serves every colourway; the highlights and the steam are polylines drawn by hand, kept as the board has them.
 */

/** The large logo, with everything: lid, knob, steam, eyes, cheeks, mouth, rivets, highlights and foot. */
export const COCOTTE_LARGE: ReactElement = (
  <>
    <g transform="translate(112 110) scale(0.8) translate(-100 -100)">
      <path
        d="M46.0 100.0 L45.9 98.7 L45.7 97.5 L45.3 96.2 L44.8 94.9 L44.2 93.7 L43.5 92.4 L42.7 91.1 L41.7 89.9 L40.7 88.6 L39.6 87.3 L38.4 86.1 L37.1 84.8 L35.7 83.5 L34.1 82.3 L32.5 81.0 L30.8 79.7 L28.9 78.5 L27.0 77.2 L25.1 75.9 L23.1 74.7 L21.1 73.4 L19.1 72.1 L17.2 70.9 L15.4 69.6 L13.7 68.3 L12.1 67.1 L10.8 65.8 L9.7 64.5 L8.7 63.3 L8.1 62.0 L7.6 60.7 L7.5 59.5 L7.5 58.2 L7.9 56.9 L8.4 55.7 L9.1 54.4 L9.9 53.1 L10.7 51.9 L11.4 50.6 L12.0 49.3 L12.5 48.1 L12.8 46.8 L13.0 45.5 L13.0 44.3 L12.8 43.0 L12.5 41.7 L12.0 40.5 L11.4 39.2 L10.7 37.9 L9.9 36.7 L9.0 35.4 L8.1 34.1 L7.2 32.9 L6.3 31.6 L5.5 30.3 L4.8 29.1 L4.1 27.8 L3.6 26.5 L3.3 25.3 L3.1 24.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.0 100.0 L33.9 98.5 L33.5 97.0 L32.9 95.5 L32.2 94.0 L31.2 92.5 L30.2 91.0 L28.9 89.5 L27.5 88.0 L26.0 86.5 L24.3 85.0 L22.5 83.5 L20.4 82.0 L18.3 80.5 L16.0 79.0 L13.6 77.5 L11.0 76.0 L8.5 74.5 L5.9 73.0 L3.4 71.5 L1.1 70.0 L-1.2 68.5 L-3.2 67.0 L-4.9 65.5 L-6.3 64.0 L-7.3 62.5 L-8.0 61.0 L-8.4 59.5 L-8.3 58.0 L-8.0 56.5 L-7.3 55.0 L-6.3 53.5 L-5.4 52.0 L-4.5 50.5 L-3.8 49.0 L-3.3 47.5 L-3.1 46.0 L-3.0 44.5 L-3.2 43.0 L-3.6 41.5 L-4.2 40.0 L-5.0 38.5 L-5.9 37.0 L-6.9 35.5 L-8.0 34.0 L-9.1 32.5 L-10.1 31.0 L-11.0 29.5 L-11.8 28.0 L-12.4 26.5 L-12.8 25.0 L-13.0 23.5 L-12.9 22.0 L-12.7 20.5 L-12.2 19.0 L-11.5 17.5 L-10.7 16.0 L-9.7 14.5 L-8.7 13.0 L-7.6 11.5 L-6.6 10.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.0 100.0 L21.9 98.8 L21.6 97.5 L21.2 96.3 L20.6 95.1 L19.9 93.8 L19.0 92.6 L18.1 91.4 L17.0 90.1 L15.8 88.9 L14.5 87.7 L13.1 86.4 L11.6 85.2 L9.9 84.0 L8.2 82.7 L6.3 81.5 L4.3 80.3 L2.3 79.0 L0.1 77.8 L-2.1 76.6 L-4.3 75.3 L-6.6 74.1 L-8.8 72.9 L-11.0 71.6 L-13.2 70.4 L-15.2 69.2 L-17.1 67.9 L-18.8 66.7 L-20.3 65.5 L-21.6 64.2 L-22.6 63.0 L-23.4 61.8 L-24.0 60.5 L-24.2 59.3 L-24.3 58.1 L-24.0 56.8 L-23.6 55.6 L-22.9 54.4 L-22.1 53.1 L-21.3 51.9 L-20.6 50.7 L-20.0 49.4 L-19.5 48.2 L-19.2 47.0 L-19.0 45.7 L-19.0 44.5 L-19.2 43.3 L-19.4 42.0 L-19.9 40.8 L-20.4 39.6 L-21.1 38.3 L-21.9 37.1 L-22.7 35.9 L-23.5 34.6 L-24.4 33.4 L-25.3 32.2 L-26.1 30.9 L-26.9 29.7 L-27.6 28.5 L-28.1 27.2 L-28.5 26.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 106 L12 106 Q4 106 4 122.0 Q4 138 12 138 L30 138"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 106 L12 106 Q4 106 4 122.0 Q4 138 12 138 L30 138"
        fill="none"
        stroke="var(--logo-gold-deep)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2.2 2.2)"
      />
      <path
        d="M170 106 L188 106 Q196 106 196 122.0 Q196 138 188 138 L170 138"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M170 106 L188 106 Q196 106 196 122.0 Q196 138 188 138 L170 138"
        fill="none"
        stroke="var(--logo-gold-deep)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2.2 2.2)"
      />
      <path
        d="M64 182 L136 182 L132 194 L68 194 Z"
        fill="var(--logo-gold-deep)"
        stroke="none"
        transform="translate(2.2 2.2)"
      />
      <path
        d="M64 182 L136 182 L132 194 L68 194 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 100 L168 100 C186 124 186 160 162 176 Q146 184 100 184 Q54 184 38 176 C14 160 14 124 32 100 Z"
        fill="var(--logo-gold)"
        stroke="none"
        transform="translate(2.2 2.2)"
      />
      <path
        d="M32 100 L168 100 C186 124 186 160 162 176 Q146 184 100 184 Q54 184 38 176 C14 160 14 124 32 100 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M20 97 L180 97 Q184 97 184 101 L184 106 Q184 110 180 110 L20 110 Q16 110 16 106 L16 101 Q16 97 20 97 Z"
        fill="var(--logo-gold-deep)"
        stroke="none"
        transform="translate(2.2 2.2)"
      />
      <path
        d="M20 97 L180 97 Q184 97 184 101 L184 106 Q184 110 180 110 L20 110 Q16 110 16 106 L16 101 Q16 97 20 97 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="78" cy="142" r="6.4" fill="var(--logo-ink)" />
      <circle cx="122" cy="142" r="6.4" fill="var(--logo-ink)" />
      <circle cx="76" cy="139.4" r="2.2" fill="var(--logo-cream)" />
      <circle cx="120" cy="139.4" r="2.2" fill="var(--logo-cream)" />
      <ellipse cx="50" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
      <ellipse cx="150" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
      <path
        d="M66 154 Q100.0 161.0 134 154 C132 183.3 68 183.3 66 154 Z"
        fill="var(--logo-brick)"
        stroke="none"
      />
      <path
        d="M66 154 Q100.0 161.0 134 154 C132 183.3 68 183.3 66 154 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="3.7"
        strokeLinejoin="round"
      />
      <path
        d="M64.0 147.0 L63.2 147.1 L62.5 147.4 L61.7 147.7 L61.1 148.0 L60.4 148.4 L59.8 148.8 L59.2 149.2 L58.7 149.7 L58.2 150.2 L57.7 150.7 L57.3 151.3 L56.9 151.8 L56.5 152.4 L56.2 153.0 L55.9 153.7 L55.7 154.3 L55.5 154.9 L55.4 155.6 L55.3 156.3 L55.2 156.9 L55.2 157.6 L55.3 158.3 L55.4 158.9 L55.5 159.6 L55.7 160.2 L55.9 160.9 L56.2 161.5 L56.5 162.1 L56.9 162.6 L57.2 163.2 L57.7 163.7 L58.1 164.2 L58.6 164.7 L59.2 165.1 L59.7 165.6 L60.3 165.9 L60.9 166.3 L61.6 166.6 L62.3 166.8 L63.0 167.0 L63.0 167.0 L62.6 166.4 L62.1 165.8 L61.7 165.3 L61.4 164.8 L61.0 164.3 L60.7 163.7 L60.5 163.2 L60.2 162.7 L60.0 162.2 L59.8 161.7 L59.6 161.3 L59.5 160.8 L59.3 160.3 L59.2 159.8 L59.2 159.4 L59.1 158.9 L59.1 158.4 L59.0 158.0 L59.0 157.5 L59.0 157.1 L59.0 156.6 L59.1 156.2 L59.1 155.7 L59.2 155.2 L59.3 154.8 L59.4 154.3 L59.6 153.8 L59.7 153.3 L59.9 152.8 L60.1 152.3 L60.4 151.8 L60.7 151.3 L61.0 150.8 L61.3 150.3 L61.7 149.8 L62.1 149.2 L62.5 148.7 L63.0 148.2 L63.5 147.6 L64.0 147.0 Z"
        fill="var(--logo-ink)"
      />
      <path
        d="M136.0 147.0 L136.5 147.6 L137.0 148.2 L137.5 148.7 L137.9 149.2 L138.3 149.8 L138.7 150.3 L139.0 150.8 L139.3 151.3 L139.6 151.8 L139.9 152.3 L140.1 152.8 L140.3 153.3 L140.4 153.8 L140.6 154.3 L140.7 154.8 L140.8 155.2 L140.9 155.7 L140.9 156.2 L141.0 156.6 L141.0 157.1 L141.0 157.5 L141.0 158.0 L140.9 158.4 L140.9 158.9 L140.8 159.4 L140.8 159.8 L140.7 160.3 L140.5 160.8 L140.4 161.3 L140.2 161.7 L140.0 162.2 L139.8 162.7 L139.5 163.2 L139.3 163.7 L139.0 164.3 L138.6 164.8 L138.3 165.3 L137.9 165.8 L137.4 166.4 L137.0 167.0 L137.0 167.0 L137.7 166.8 L138.4 166.6 L139.1 166.3 L139.7 165.9 L140.3 165.6 L140.8 165.1 L141.4 164.7 L141.9 164.2 L142.3 163.7 L142.8 163.2 L143.1 162.6 L143.5 162.1 L143.8 161.5 L144.1 160.9 L144.3 160.2 L144.5 159.6 L144.6 158.9 L144.7 158.3 L144.8 157.6 L144.8 156.9 L144.7 156.3 L144.6 155.6 L144.5 154.9 L144.3 154.3 L144.1 153.7 L143.8 153.0 L143.5 152.4 L143.1 151.8 L142.7 151.3 L142.3 150.7 L141.8 150.2 L141.3 149.7 L140.8 149.2 L140.2 148.8 L139.6 148.4 L138.9 148.0 L138.3 147.7 L137.5 147.4 L136.8 147.1 L136.0 147.0 Z"
        fill="var(--logo-ink)"
      />
      <path
        d="M85.0 169 Q100.0 155 115.0 169 Q100.0 175 85.0 169 Z"
        fill="var(--logo-blush)"
        stroke="none"
      />
      <circle
        cx="32"
        cy="103.5"
        r="3.3"
        fill="var(--logo-cream)"
        stroke="var(--logo-ink)"
        strokeWidth="2.2"
      />
      <circle
        cx="168"
        cy="103.5"
        r="3.3"
        fill="var(--logo-cream)"
        stroke="var(--logo-ink)"
        strokeWidth="2.2"
      />
      <path
        d="M30.0 124.0 L29.2 125.2 L28.6 126.5 L28.1 127.8 L27.7 129.1 L27.2 130.5 L26.9 131.8 L26.6 133.1 L26.3 134.4 L26.1 135.7 L26.0 137.1 L25.8 138.4 L25.8 139.7 L25.8 141.0 L25.8 142.3 L25.9 143.6 L26.1 144.9 L26.3 146.1 L26.5 147.4 L26.8 148.6 L27.2 149.8 L27.6 151.0 L28.1 152.2 L28.6 153.4 L29.1 154.5 L29.7 155.6 L30.4 156.7 L31.1 157.8 L31.8 158.8 L32.6 159.8 L33.5 160.7 L34.3 161.6 L35.3 162.5 L36.2 163.4 L37.2 164.2 L38.2 165.0 L39.3 165.7 L40.4 166.4 L41.5 167.0 L42.7 167.6 L44.0 168.0 L44.0 168.0 L43.2 166.9 L42.4 165.9 L41.6 164.9 L40.9 164.0 L40.1 163.0 L39.4 162.0 L38.8 161.1 L38.1 160.1 L37.5 159.1 L36.9 158.2 L36.4 157.2 L35.9 156.2 L35.4 155.2 L34.9 154.2 L34.5 153.2 L34.0 152.2 L33.6 151.2 L33.2 150.2 L32.9 149.2 L32.5 148.2 L32.2 147.1 L31.9 146.1 L31.6 145.0 L31.4 143.9 L31.2 142.8 L30.9 141.7 L30.7 140.6 L30.6 139.4 L30.4 138.3 L30.3 137.1 L30.2 135.9 L30.1 134.6 L30.0 133.4 L30.0 132.1 L29.9 130.8 L29.9 129.5 L30.0 128.2 L30.0 126.8 L30.0 125.4 L30.0 124.0 Z"
        fill="var(--logo-cream)"
      />
      <g transform="rotate(18 184 98)">
        <path
          d="M24 86 C24 56 62 48 100 48 C138 48 176 56 176 86 Z"
          fill="var(--logo-gold-deep)"
          stroke="none"
          transform="translate(2.2 2.2)"
        />
        <path
          d="M24 86 C24 56 62 48 100 48 C138 48 176 56 176 86 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M18 86 L182 86 Q186 86 186 90 L186 94 Q186 98 182 98 L18 98 Q14 98 14 94 L14 90 Q14 86 18 86 Z"
          fill="var(--logo-gold)"
          stroke="none"
          transform="translate(2.2 2.2)"
        />
        <path
          d="M18 86 L182 86 Q186 86 186 90 L186 94 Q186 98 182 98 L18 98 Q14 98 14 94 L14 90 Q14 86 18 86 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M93 50 L107 50 L105 43 L95 43 Z"
          fill="var(--logo-gold-deep)"
          stroke="none"
          transform="translate(2.2 2.2)"
        />
        <path
          d="M93 50 L107 50 L105 43 L95 43 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M90 34 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 Z"
          fill="var(--logo-gold)"
          stroke="none"
          transform="translate(2.2 2.2)"
        />
        <path
          d="M90 34 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M37.0 77.0 L37.5 76.2 L37.8 75.5 L38.2 74.8 L38.6 74.1 L39.0 73.4 L39.5 72.7 L39.9 72.1 L40.4 71.5 L40.9 70.9 L41.4 70.2 L41.9 69.7 L42.5 69.1 L43.1 68.5 L43.7 67.9 L44.4 67.4 L45.0 66.8 L45.7 66.2 L46.5 65.7 L47.2 65.1 L48.0 64.6 L48.9 64.0 L49.7 63.5 L50.6 62.9 L51.6 62.4 L52.5 61.8 L53.6 61.3 L54.6 60.7 L55.7 60.2 L56.8 59.7 L58.0 59.1 L59.2 58.6 L60.5 58.1 L61.8 57.6 L63.1 57.1 L64.5 56.6 L65.9 56.1 L67.4 55.6 L68.9 55.1 L70.4 54.6 L72.0 54.0 L72.0 54.0 L70.3 53.9 L68.7 53.9 L67.1 53.9 L65.5 54.1 L64.0 54.2 L62.4 54.4 L61.0 54.6 L59.5 54.9 L58.1 55.2 L56.8 55.5 L55.4 55.8 L54.1 56.2 L52.9 56.6 L51.7 57.1 L50.5 57.6 L49.4 58.1 L48.3 58.6 L47.2 59.2 L46.2 59.8 L45.2 60.4 L44.3 61.1 L43.4 61.8 L42.6 62.5 L41.8 63.2 L41.1 64.0 L40.4 64.8 L39.8 65.6 L39.2 66.4 L38.7 67.3 L38.2 68.1 L37.8 69.0 L37.4 69.9 L37.1 70.8 L36.9 71.7 L36.7 72.6 L36.6 73.5 L36.6 74.4 L36.6 75.2 L36.7 76.1 L37.0 77.0 Z"
          fill="var(--logo-cream)"
        />
        <circle cx="82.5" cy="53" r="1.9" fill="var(--logo-cream)" />
        <circle cx="95.5" cy="30.5" r="2.6" fill="var(--logo-cream)" />
      </g>
    </g>
  </>
)

/** The lockup's cocotte: no rivets, cheeks, tongue, lid band or foot, and a thicker line. */
export const COCOTTE_LOCKUP: ReactElement = (
  <>
    <g transform="translate(116 112) scale(0.76) translate(-100 -100)">
      <path
        d="M52.0 100.0 L51.9 98.7 L51.6 97.5 L51.2 96.2 L50.7 94.9 L50.0 93.7 L49.2 92.4 L48.3 91.1 L47.2 89.9 L46.1 88.6 L44.9 87.3 L43.5 86.1 L42.1 84.8 L40.5 83.5 L38.8 82.3 L37.0 81.0 L35.1 79.7 L33.1 78.5 L31.1 77.2 L28.9 75.9 L26.8 74.7 L24.6 73.4 L22.5 72.1 L20.4 70.9 L18.4 69.6 L16.6 68.3 L14.9 67.1 L13.4 65.8 L12.2 64.5 L11.2 63.3 L10.4 62.0 L9.9 60.7 L9.6 59.5 L9.6 58.2 L9.9 56.9 L10.4 55.7 L11.1 54.4 L11.9 53.1 L12.7 51.9 L13.4 50.6 L14.0 49.3 L14.5 48.1 L14.8 46.8 L15.0 45.5 L15.0 44.3 L14.8 43.0 L14.5 41.7 L14.0 40.5 L13.4 39.2 L12.7 37.9 L11.9 36.7 L11.0 35.4 L10.1 34.1 L9.2 32.9 L8.3 31.6 L7.5 30.3 L6.8 29.1 L6.1 27.8 L5.6 26.5 L5.3 25.3 L5.1 24.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36.0 100.0 L35.8 98.5 L35.4 96.9 L34.7 95.4 L33.8 93.9 L32.7 92.3 L31.4 90.8 L29.9 89.3 L28.2 87.7 L26.4 86.2 L24.4 84.7 L22.1 83.1 L19.8 81.6 L17.2 80.1 L14.5 78.5 L11.7 77.0 L8.8 75.5 L5.9 73.9 L3.0 72.4 L0.2 70.9 L-2.4 69.3 L-4.8 67.8 L-7.0 66.3 L-8.8 64.7 L-10.3 63.2 L-11.3 61.7 L-12.0 60.1 L-12.2 58.6 L-12.1 57.1 L-11.5 55.5 L-10.7 54.0 L-9.7 52.5 L-8.8 50.9 L-8.0 49.4 L-7.4 47.9 L-7.1 46.3 L-7.0 44.8 L-7.2 43.3 L-7.5 41.7 L-8.1 40.2 L-8.9 38.7 L-9.8 37.1 L-10.9 35.6 L-12.0 34.1 L-13.0 32.5 L-14.1 31.0 L-15.0 29.5 L-15.8 27.9 L-16.4 26.4 L-16.8 24.9 L-17.0 23.3 L-16.9 21.8 L-16.6 20.3 L-16.1 18.7 L-15.4 17.2 L-14.5 15.7 L-13.5 14.1 L-12.4 12.6 L-11.3 11.1 L-10.3 9.5 L-9.3 8.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.0 100.0 L19.9 98.8 L19.6 97.5 L19.0 96.3 L18.3 95.1 L17.5 93.8 L16.5 92.6 L15.3 91.4 L14.0 90.1 L12.6 88.9 L11.1 87.7 L9.4 86.4 L7.6 85.2 L5.7 84.0 L3.6 82.7 L1.5 81.5 L-0.8 80.3 L-3.2 79.0 L-5.6 77.8 L-8.2 76.6 L-10.7 75.3 L-13.3 74.1 L-15.9 72.9 L-18.4 71.6 L-20.8 70.4 L-23.1 69.2 L-25.3 67.9 L-27.3 66.7 L-29.0 65.5 L-30.6 64.2 L-31.8 63.0 L-32.8 61.8 L-33.5 60.5 L-33.9 59.3 L-34.1 58.1 L-33.9 56.8 L-33.5 55.6 L-32.9 54.4 L-32.1 53.1 L-31.3 51.9 L-30.6 50.7 L-30.0 49.4 L-29.5 48.2 L-29.2 47.0 L-29.0 45.7 L-29.0 44.5 L-29.2 43.3 L-29.4 42.0 L-29.9 40.8 L-30.4 39.6 L-31.1 38.3 L-31.9 37.1 L-32.7 35.9 L-33.5 34.6 L-34.4 33.4 L-35.3 32.2 L-36.1 30.9 L-36.9 29.7 L-37.6 28.5 L-38.1 27.2 L-38.5 26.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 106 L12 106 Q4 106 4 122.0 Q4 138 12 138 L30 138"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 106 L12 106 Q4 106 4 122.0 Q4 138 12 138 L30 138"
        fill="none"
        stroke="var(--logo-gold-deep)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M170 106 L188 106 Q196 106 196 122.0 Q196 138 188 138 L170 138"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M170 106 L188 106 Q196 106 196 122.0 Q196 138 188 138 L170 138"
        fill="none"
        stroke="var(--logo-gold-deep)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 100 L168 100 C186 124 186 160 162 176 Q146 190 100 190 Q54 190 38 176 C14 160 14 124 32 100 Z"
        fill="var(--logo-gold)"
        stroke="none"
      />
      <path
        d="M32 100 L168 100 C186 124 186 160 162 176 Q146 190 100 190 Q54 190 38 176 C14 160 14 124 32 100 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M20 97 L180 97 Q184 97 184 101 L184 106 Q184 110 180 110 L20 110 Q16 110 16 106 L16 101 Q16 97 20 97 Z"
        fill="var(--logo-gold-deep)"
        stroke="none"
      />
      <path
        d="M20 97 L180 97 Q184 97 184 101 L184 106 Q184 110 180 110 L20 110 Q16 110 16 106 L16 101 Q16 97 20 97 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="78" cy="142" r="8" fill="var(--logo-ink)" />
      <circle cx="122" cy="142" r="8" fill="var(--logo-ink)" />
      <path
        d="M62 154 Q100.0 162.3 138 154 C136 188.7 64 188.7 62 154 Z"
        fill="var(--logo-brick)"
        stroke="none"
      />
      <path
        d="M62 154 Q100.0 162.3 138 154 C136 188.7 64 188.7 62 154 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="5.0"
        strokeLinejoin="round"
      />
      <path
        d="M60.0 147.0 L59.1 147.1 L58.4 147.3 L57.6 147.5 L56.9 147.8 L56.2 148.2 L55.6 148.6 L55.0 149.0 L54.4 149.5 L53.8 149.9 L53.3 150.5 L52.8 151.0 L52.4 151.6 L52.0 152.2 L51.7 152.8 L51.4 153.5 L51.1 154.1 L50.9 154.8 L50.8 155.5 L50.7 156.2 L50.6 156.9 L50.6 157.6 L50.7 158.3 L50.8 159.0 L50.9 159.7 L51.1 160.4 L51.4 161.0 L51.7 161.7 L52.0 162.3 L52.4 162.9 L52.8 163.4 L53.3 164.0 L53.8 164.5 L54.3 164.9 L54.9 165.4 L55.5 165.8 L56.1 166.1 L56.8 166.4 L57.5 166.7 L58.2 166.9 L59.0 167.0 L59.0 167.0 L58.6 166.3 L58.2 165.7 L57.9 165.2 L57.5 164.6 L57.2 164.1 L57.0 163.5 L56.7 163.0 L56.5 162.5 L56.3 162.0 L56.2 161.5 L56.1 161.0 L55.9 160.6 L55.8 160.1 L55.8 159.7 L55.7 159.2 L55.7 158.8 L55.6 158.4 L55.6 157.9 L55.6 157.5 L55.6 157.1 L55.6 156.7 L55.7 156.2 L55.7 155.8 L55.8 155.4 L55.9 154.9 L56.0 154.5 L56.1 154.0 L56.2 153.6 L56.3 153.1 L56.5 152.6 L56.7 152.1 L57.0 151.6 L57.2 151.1 L57.5 150.5 L57.9 150.0 L58.2 149.4 L58.6 148.9 L59.1 148.3 L59.5 147.7 L60.0 147.0 Z"
        fill="var(--logo-ink)"
      />
      <path
        d="M140.0 147.0 L140.5 147.7 L140.9 148.3 L141.4 148.9 L141.8 149.4 L142.1 150.0 L142.5 150.5 L142.8 151.1 L143.0 151.6 L143.3 152.1 L143.5 152.6 L143.7 153.1 L143.8 153.6 L143.9 154.0 L144.0 154.5 L144.1 154.9 L144.2 155.4 L144.3 155.8 L144.3 156.2 L144.4 156.7 L144.4 157.1 L144.4 157.5 L144.4 157.9 L144.4 158.4 L144.3 158.8 L144.3 159.2 L144.2 159.7 L144.2 160.1 L144.1 160.6 L143.9 161.0 L143.8 161.5 L143.7 162.0 L143.5 162.5 L143.3 163.0 L143.0 163.5 L142.8 164.1 L142.5 164.6 L142.1 165.2 L141.8 165.7 L141.4 166.3 L141.0 167.0 L141.0 167.0 L141.8 166.9 L142.5 166.7 L143.2 166.4 L143.9 166.1 L144.5 165.8 L145.1 165.4 L145.7 164.9 L146.2 164.5 L146.7 164.0 L147.2 163.4 L147.6 162.9 L148.0 162.3 L148.3 161.7 L148.6 161.0 L148.9 160.4 L149.1 159.7 L149.2 159.0 L149.3 158.3 L149.4 157.6 L149.4 156.9 L149.3 156.2 L149.2 155.5 L149.1 154.8 L148.9 154.1 L148.6 153.5 L148.3 152.8 L148.0 152.2 L147.6 151.6 L147.2 151.0 L146.7 150.5 L146.2 149.9 L145.6 149.5 L145.0 149.0 L144.4 148.6 L143.8 148.2 L143.1 147.8 L142.4 147.5 L141.6 147.3 L140.9 147.1 L140.0 147.0 Z"
        fill="var(--logo-ink)"
      />
      <g transform="rotate(19 184 98)">
        <path
          d="M24 98 C24 68 62 60 100 60 C138 60 176 68 176 98 Z"
          fill="var(--logo-gold-deep)"
          stroke="none"
        />
        <path
          d="M24 98 C24 68 62 60 100 60 C138 60 176 68 176 98 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M90 54 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 Z"
          fill="var(--logo-gold)"
          stroke="none"
        />
        <path
          d="M90 54 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </g>
  </>
)

/** The compact mark: silhouette, lid with its knob, steam, eyes, small mouth and highlights. */
export const COCOTTE_COMPACT: ReactElement = (
  <>
    <g transform="translate(116 112) scale(0.76) translate(-100 -100)">
      <path
        d="M52.0 100.0 L51.9 98.7 L51.6 97.5 L51.2 96.2 L50.7 94.9 L50.0 93.7 L49.2 92.4 L48.3 91.1 L47.2 89.9 L46.1 88.6 L44.9 87.3 L43.5 86.1 L42.1 84.8 L40.5 83.5 L38.8 82.3 L37.0 81.0 L35.1 79.7 L33.1 78.5 L31.1 77.2 L28.9 75.9 L26.8 74.7 L24.6 73.4 L22.5 72.1 L20.4 70.9 L18.4 69.6 L16.6 68.3 L14.9 67.1 L13.4 65.8 L12.2 64.5 L11.2 63.3 L10.4 62.0 L9.9 60.7 L9.6 59.5 L9.6 58.2 L9.9 56.9 L10.4 55.7 L11.1 54.4 L11.9 53.1 L12.7 51.9 L13.4 50.6 L14.0 49.3 L14.5 48.1 L14.8 46.8 L15.0 45.5 L15.0 44.3 L14.8 43.0 L14.5 41.7 L14.0 40.5 L13.4 39.2 L12.7 37.9 L11.9 36.7 L11.0 35.4 L10.1 34.1 L9.2 32.9 L8.3 31.6 L7.5 30.3 L6.8 29.1 L6.1 27.8 L5.6 26.5 L5.3 25.3 L5.1 24.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36.0 100.0 L35.8 98.5 L35.4 96.9 L34.7 95.4 L33.8 93.9 L32.7 92.3 L31.4 90.8 L29.9 89.3 L28.2 87.7 L26.4 86.2 L24.4 84.7 L22.1 83.1 L19.8 81.6 L17.2 80.1 L14.5 78.5 L11.7 77.0 L8.8 75.5 L5.9 73.9 L3.0 72.4 L0.2 70.9 L-2.4 69.3 L-4.8 67.8 L-7.0 66.3 L-8.8 64.7 L-10.3 63.2 L-11.3 61.7 L-12.0 60.1 L-12.2 58.6 L-12.1 57.1 L-11.5 55.5 L-10.7 54.0 L-9.7 52.5 L-8.8 50.9 L-8.0 49.4 L-7.4 47.9 L-7.1 46.3 L-7.0 44.8 L-7.2 43.3 L-7.5 41.7 L-8.1 40.2 L-8.9 38.7 L-9.8 37.1 L-10.9 35.6 L-12.0 34.1 L-13.0 32.5 L-14.1 31.0 L-15.0 29.5 L-15.8 27.9 L-16.4 26.4 L-16.8 24.9 L-17.0 23.3 L-16.9 21.8 L-16.6 20.3 L-16.1 18.7 L-15.4 17.2 L-14.5 15.7 L-13.5 14.1 L-12.4 12.6 L-11.3 11.1 L-10.3 9.5 L-9.3 8.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.0 100.0 L19.9 98.8 L19.6 97.5 L19.0 96.3 L18.3 95.1 L17.5 93.8 L16.5 92.6 L15.3 91.4 L14.0 90.1 L12.6 88.9 L11.1 87.7 L9.4 86.4 L7.6 85.2 L5.7 84.0 L3.6 82.7 L1.5 81.5 L-0.8 80.3 L-3.2 79.0 L-5.6 77.8 L-8.2 76.6 L-10.7 75.3 L-13.3 74.1 L-15.9 72.9 L-18.4 71.6 L-20.8 70.4 L-23.1 69.2 L-25.3 67.9 L-27.3 66.7 L-29.0 65.5 L-30.6 64.2 L-31.8 63.0 L-32.8 61.8 L-33.5 60.5 L-33.9 59.3 L-34.1 58.1 L-33.9 56.8 L-33.5 55.6 L-32.9 54.4 L-32.1 53.1 L-31.3 51.9 L-30.6 50.7 L-30.0 49.4 L-29.5 48.2 L-29.2 47.0 L-29.0 45.7 L-29.0 44.5 L-29.2 43.3 L-29.4 42.0 L-29.9 40.8 L-30.4 39.6 L-31.1 38.3 L-31.9 37.1 L-32.7 35.9 L-33.5 34.6 L-34.4 33.4 L-35.3 32.2 L-36.1 30.9 L-36.9 29.7 L-37.6 28.5 L-38.1 27.2 L-38.5 26.0"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 106 L12 106 Q4 106 4 122.0 Q4 138 12 138 L30 138"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="34"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 106 L12 106 Q4 106 4 122.0 Q4 138 12 138 L30 138"
        fill="none"
        stroke="var(--logo-gold-deep)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M170 106 L188 106 Q196 106 196 122.0 Q196 138 188 138 L170 138"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="34"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M170 106 L188 106 Q196 106 196 122.0 Q196 138 188 138 L170 138"
        fill="none"
        stroke="var(--logo-gold-deep)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 100 L168 100 C186 124 186 160 162 176 Q146 192 100 192 Q54 192 38 176 C14 160 14 124 32 100 Z"
        fill="var(--logo-gold)"
        stroke="none"
      />
      <path
        d="M32 100 L168 100 C186 124 186 160 162 176 Q146 192 100 192 Q54 192 38 176 C14 160 14 124 32 100 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="11"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="78" cy="142" r="9.5" fill="var(--logo-ink)" />
      <circle cx="122" cy="142" r="9.5" fill="var(--logo-ink)" />
      <path
        d="M60 152 Q100.0 160.3 140 152 C138 186.7 62 186.7 60 152 Z"
        fill="var(--logo-brick)"
        stroke="none"
      />
      <path
        d="M60 152 Q100.0 160.3 140 152 C138 186.7 62 186.7 60 152 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="6.8"
        strokeLinejoin="round"
      />
      <path
        d="M36.0 118.0 L34.9 119.3 L34.1 120.7 L33.3 122.1 L32.7 123.6 L32.1 125.0 L31.5 126.5 L31.0 127.9 L30.6 129.4 L30.2 130.9 L29.9 132.4 L29.7 133.9 L29.5 135.4 L29.3 136.8 L29.3 138.3 L29.2 139.8 L29.3 141.3 L29.4 142.7 L29.6 144.2 L29.8 145.6 L30.1 147.0 L30.5 148.4 L30.9 149.8 L31.4 151.2 L31.9 152.5 L32.5 153.8 L33.2 155.0 L33.9 156.3 L34.7 157.5 L35.5 158.6 L36.4 159.7 L37.3 160.8 L38.3 161.8 L39.4 162.8 L40.4 163.8 L41.6 164.7 L42.7 165.5 L43.9 166.3 L45.2 167.0 L46.5 167.6 L48.0 168.0 L48.0 168.0 L47.4 166.6 L46.8 165.4 L46.1 164.1 L45.5 163.0 L44.9 161.8 L44.3 160.7 L43.8 159.5 L43.3 158.4 L42.8 157.2 L42.3 156.1 L41.9 155.0 L41.5 153.9 L41.1 152.8 L40.7 151.7 L40.4 150.6 L40.1 149.5 L39.7 148.4 L39.4 147.2 L39.2 146.1 L38.9 145.0 L38.6 143.8 L38.4 142.7 L38.1 141.5 L37.9 140.3 L37.7 139.1 L37.5 137.9 L37.3 136.6 L37.1 135.4 L37.0 134.1 L36.8 132.7 L36.7 131.4 L36.6 130.0 L36.5 128.7 L36.4 127.2 L36.4 125.8 L36.3 124.3 L36.3 122.8 L36.3 121.3 L36.2 119.7 L36.0 118.0 Z"
        fill="var(--logo-cream)"
      />
      <g transform="rotate(21 184 98)">
        <path
          d="M24 98 C24 68 62 60 100 60 C138 60 176 68 176 98 Z"
          fill="var(--logo-gold-deep)"
          stroke="none"
        />
        <path
          d="M24 98 C24 68 62 60 100 60 C138 60 176 68 176 98 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="11"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M89 53 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 Z"
          fill="var(--logo-gold)"
          stroke="none"
        />
        <path
          d="M89 53 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="11"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M44.0 88.0 L44.6 87.3 L45.1 86.5 L45.6 85.9 L46.0 85.2 L46.5 84.6 L47.0 84.1 L47.5 83.5 L48.0 83.0 L48.6 82.4 L49.1 81.9 L49.7 81.4 L50.3 80.9 L50.9 80.4 L51.6 80.0 L52.2 79.5 L52.9 79.0 L53.6 78.5 L54.4 78.0 L55.1 77.5 L56.0 77.0 L56.8 76.5 L57.7 76.0 L58.6 75.4 L59.5 74.9 L60.5 74.4 L61.5 73.9 L62.6 73.3 L63.7 72.8 L64.9 72.3 L66.0 71.7 L67.3 71.2 L68.5 70.7 L69.8 70.1 L71.2 69.6 L72.5 69.0 L74.0 68.5 L75.4 67.9 L76.9 67.3 L78.4 66.7 L80.0 66.0 L80.0 66.0 L78.3 65.7 L76.6 65.6 L75.0 65.6 L73.4 65.6 L71.8 65.7 L70.3 65.8 L68.8 65.9 L67.3 66.1 L65.8 66.3 L64.4 66.6 L63.1 66.9 L61.7 67.2 L60.4 67.5 L59.1 67.9 L57.9 68.4 L56.7 68.8 L55.5 69.3 L54.4 69.8 L53.3 70.4 L52.3 71.0 L51.3 71.7 L50.4 72.3 L49.5 73.0 L48.6 73.8 L47.8 74.5 L47.1 75.3 L46.4 76.1 L45.8 77.0 L45.3 77.9 L44.8 78.8 L44.3 79.7 L44.0 80.6 L43.7 81.5 L43.5 82.5 L43.3 83.4 L43.3 84.3 L43.3 85.3 L43.4 86.2 L43.6 87.1 L44.0 88.0 Z"
          fill="var(--logo-cream)"
        />
      </g>
    </g>
  </>
)

/** The favicon, the app icon and the mark under 40 px: silhouette, wide-open lid, eyes, small mouth and highlights. */
export const COCOTTE_ICON: ReactElement = (
  <>
    <g transform="translate(104 104) scale(0.94) translate(-100 -100)">
      <path
        d="M30 106 L12 106 Q4 106 4 122.0 Q4 138 12 138 L30 138"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="44"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 106 L12 106 Q4 106 4 122.0 Q4 138 12 138 L30 138"
        fill="none"
        stroke="var(--logo-gold-deep)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M170 106 L188 106 Q196 106 196 122.0 Q196 138 188 138 L170 138"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="44"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M170 106 L188 106 Q196 106 196 122.0 Q196 138 188 138 L170 138"
        fill="none"
        stroke="var(--logo-gold-deep)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 100 L168 100 C186 124 186 160 162 176 Q146 194 100 194 Q54 194 38 176 C14 160 14 124 32 100 Z"
        fill="var(--logo-gold)"
        stroke="none"
      />
      <path
        d="M32 100 L168 100 C186 124 186 160 162 176 Q146 194 100 194 Q54 194 38 176 C14 160 14 124 32 100 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="15"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="76" cy="130" r="10" fill="var(--logo-ink)" />
      <circle cx="124" cy="130" r="10" fill="var(--logo-ink)" />
      <path
        d="M64 152 Q100.0 159.7 136 152 C134 184.0 66 184.0 64 152 Z"
        fill="var(--logo-brick)"
        stroke="none"
      />
      <path
        d="M64 152 Q100.0 159.7 136 152 C134 184.0 66 184.0 64 152 Z"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="9.3"
        strokeLinejoin="round"
      />
      <path
        d="M40.0 118.0 L38.7 119.3 L37.7 120.6 L36.9 122.0 L36.1 123.4 L35.3 124.9 L34.7 126.3 L34.1 127.8 L33.6 129.3 L33.1 130.8 L32.8 132.3 L32.4 133.8 L32.2 135.4 L32.0 136.9 L31.9 138.4 L31.8 139.9 L31.9 141.4 L32.0 142.9 L32.1 144.4 L32.4 145.9 L32.7 147.4 L33.0 148.8 L33.5 150.2 L34.0 151.6 L34.6 153.0 L35.2 154.3 L35.9 155.6 L36.7 156.9 L37.6 158.1 L38.5 159.2 L39.4 160.3 L40.4 161.4 L41.5 162.4 L42.6 163.4 L43.8 164.3 L45.0 165.1 L46.3 165.9 L47.6 166.6 L48.9 167.2 L50.4 167.7 L52.0 168.0 L52.0 168.0 L51.6 166.4 L51.0 165.1 L50.5 163.8 L49.9 162.5 L49.4 161.3 L49.0 160.1 L48.5 159.0 L48.1 157.8 L47.7 156.7 L47.3 155.5 L47.0 154.4 L46.6 153.3 L46.3 152.2 L46.0 151.1 L45.7 150.0 L45.4 149.0 L45.1 147.9 L44.9 146.8 L44.6 145.7 L44.3 144.6 L44.1 143.5 L43.8 142.4 L43.6 141.3 L43.3 140.1 L43.1 139.0 L42.9 137.8 L42.6 136.6 L42.4 135.4 L42.2 134.1 L42.0 132.8 L41.8 131.5 L41.6 130.1 L41.4 128.8 L41.3 127.4 L41.1 125.9 L40.9 124.4 L40.8 122.9 L40.6 121.4 L40.4 119.7 L40.0 118.0 Z"
        fill="var(--logo-cream)"
      />
      <g transform="rotate(24 184 98)">
        <path
          d="M24 98 C24 68 62 60 100 60 C138 60 176 68 176 98 Z"
          fill="var(--logo-gold-deep)"
          stroke="none"
        />
        <path
          d="M24 98 C24 68 62 60 100 60 C138 60 176 68 176 98 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M89 53 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 Z"
          fill="var(--logo-gold)"
          stroke="none"
        />
        <path
          d="M89 53 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 Z"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M47.0 88.0 L47.8 87.3 L48.3 86.6 L48.9 86.0 L49.4 85.4 L50.0 84.8 L50.5 84.3 L51.1 83.8 L51.6 83.3 L52.2 82.8 L52.8 82.4 L53.3 81.9 L53.9 81.5 L54.6 81.1 L55.2 80.6 L55.8 80.2 L56.5 79.7 L57.2 79.3 L57.9 78.8 L58.7 78.3 L59.5 77.8 L60.3 77.3 L61.1 76.8 L62.0 76.3 L62.9 75.8 L63.9 75.3 L64.9 74.7 L65.9 74.2 L67.0 73.6 L68.1 73.0 L69.3 72.5 L70.5 71.9 L71.7 71.3 L73.0 70.7 L74.3 70.1 L75.6 69.5 L77.0 68.9 L78.5 68.2 L80.0 67.6 L81.5 66.9 L83.0 66.0 L83.0 66.0 L81.3 65.6 L79.6 65.4 L77.9 65.3 L76.3 65.2 L74.7 65.2 L73.2 65.3 L71.6 65.3 L70.1 65.5 L68.6 65.6 L67.2 65.8 L65.8 66.1 L64.4 66.4 L63.1 66.7 L61.8 67.1 L60.5 67.5 L59.3 67.9 L58.1 68.4 L56.9 69.0 L55.8 69.5 L54.8 70.2 L53.8 70.8 L52.8 71.5 L51.9 72.2 L51.0 73.0 L50.2 73.8 L49.5 74.7 L48.8 75.5 L48.2 76.4 L47.6 77.4 L47.1 78.3 L46.7 79.3 L46.4 80.3 L46.2 81.2 L46.0 82.2 L45.9 83.2 L45.9 84.2 L46.0 85.2 L46.1 86.1 L46.4 87.1 L47.0 88.0 Z"
          fill="var(--logo-cream)"
        />
      </g>
    </g>
  </>
)
