import type { ReactElement } from 'react'

/**
 * The seven moods of the mascot, copied from the symbols `ms-*` of the canvas board `Retouche-4-mascotte` (200 x 220). Every
 * colour is a `--logo-*` variable set by `Mascot`, from the design tokens; the steam, the lid and the accessories are
 * hand-drawn polylines kept as the board has them. The party hat's stripes and the confetti use the six party colours
 * (`--logo-party-1` to `-6`). The hat's stripes are clipped to the hat, by a clip path whose id belongs to the `Mascot`
 * instance that draws it: ids must be unique in a page, and several mascots can be on one.
 */

/** Contente: lid open at 18°, three steam lines, a big smile. */
export const HAPPY: ReactElement = (
  <>
    <g transform="translate(110 134) scale(0.74) translate(-100 -100)">
      <g transform="rotate(0 100 190)">
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
        <g transform="rotate(0 30 122)">
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
        </g>
        <g transform="rotate(0 170 122)">
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
        </g>
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
        <ellipse cx="50" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
        <ellipse cx="150" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
        <circle cx="78" cy="142" r="7" fill="var(--logo-ink)" />
        <circle cx="122" cy="142" r="7" fill="var(--logo-ink)" />
        <circle cx="75.5" cy="139.5" r="2.3" fill="var(--logo-cream)" />
        <circle cx="119.5" cy="139.5" r="2.3" fill="var(--logo-cream)" />
        <path
          d="M64 152 Q100.0 160.3 136 152 C134 186.7 66 186.7 64 152 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="3.7"
          strokeLinejoin="round"
        />
        <path d="M85.0 171 Q100.0 157 115.0 171 Q100.0 177 85.0 171 Z" fill="var(--logo-blush)" />
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
    </g>
  </>
)

/** Dépitée: a lopsided lid sagging, a limp wisp of steam, drooping brows, a tear, a downturned mouth. */
export const DEJECTED: ReactElement = (
  <>
    <g transform="translate(110 134) scale(0.74) translate(-100 -100)">
      <g transform="rotate(0 100 190)">
        <path
          d="M36 100 C30 92 24 90 18 94 C12 98 16 106 22 104"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g transform="rotate(-26 30 122)">
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
        </g>
        <g transform="rotate(26 170 122)">
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
        </g>
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
        <circle cx="78" cy="146" r="7.5" fill="var(--logo-ink)" />
        <circle cx="75.5" cy="149" r="2.2" fill="var(--logo-cream)" />
        <circle cx="122" cy="146" r="7.5" fill="var(--logo-ink)" />
        <circle cx="119.5" cy="149" r="2.2" fill="var(--logo-cream)" />
        <path d="M69 134 H87 V143 H69 Z" fill="var(--logo-gold)" />
        <path d="M113 134 H131 V143 H113 Z" fill="var(--logo-gold)" />
        <path
          d="M69 143 H87"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M113 143 H131"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M66 137 L90 128"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M134 137 L110 128"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M70 174 C78 148 122 148 130 174 C118 163 82 163 70 174 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="3.7"
          strokeLinejoin="round"
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
        <g transform="translate(-6 6) rotate(-9 100 98)">
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
        <path
          d="M58 156.2 C59.0 160.9 63.2 164.5 63.2 168.7 A5.2 5.2 0 0 1 52.8 168.7 C52.8 164.5 57.0 160.9 58 156.2 Z"
          fill="var(--logo-cream)"
          stroke="var(--logo-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </>
)

/** Coup de cœur: the lid floating, steam as little hearts, heart eyes, a lolling tongue. */
export const SMITTEN: ReactElement = (
  <>
    <g transform="translate(110 134) scale(0.74) translate(-100 -100)">
      <g transform="rotate(-3 100 190)">
        <path
          d="M14 86.7 C2.1 79.3 7.0 71.2 14 77.5 C21.0 71.2 25.9 79.3 14 86.7 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(-12 14 80)"
        />
        <path
          d="M-8 57.7 C-18.2 51.4 -14.0 44.5 -8 49.9 C-2.0 44.5 2.2 51.4 -8 57.7 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(10 -8 52)"
        />
        <path
          d="M14 32.8 C5.5 27.5 9.0 21.8 14 26.2 C19.0 21.8 22.5 27.5 14 32.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(-8 14 28)"
        />
        <path
          d="M-22 22.3 C-29.6 17.6 -26.5 12.4 -22 16.4 C-17.5 12.4 -14.4 17.6 -22 22.3 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(14 -22 18)"
        />
        <path
          d="M40 -0.3 C29.8 -6.6 34.0 -13.5 40 -8.1 C46.0 -13.5 50.2 -6.6 40 -0.3 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(8 40 -6)"
        />
        <path
          d="M74 -17.2 C65.5 -22.5 69.0 -28.2 74 -23.8 C79.0 -28.2 82.5 -22.5 74 -17.2 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(-10 74 -22)"
        />
        <path
          d="M112 -6.4 C98.4 -14.8 104.0 -24.0 112 -16.8 C120.0 -24.0 125.6 -14.8 112 -6.4 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(6 112 -14)"
        />
        <path
          d="M150 -16.8 C140.7 -22.6 144.5 -28.9 150 -23.9 C155.5 -28.9 159.3 -22.6 150 -16.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(12 150 -22)"
        />
        <path
          d="M178 4.6 C166.1 -2.7 171.0 -10.8 178 -4.4 C185.0 -10.8 189.9 -2.7 178 4.6 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(-8 178 -2)"
        />
        <path
          d="M196 38.8 C187.5 33.5 191.0 27.8 196 32.2 C201.0 27.8 204.5 33.5 196 38.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(10 196 34)"
        />
        <path
          d="M-18 104.3 C-25.6 99.5 -22.5 94.4 -18 98.4 C-13.5 94.4 -10.4 99.5 -18 104.3 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(-6 -18 100)"
        />
        <path
          d="M44 87.8 C37.2 83.6 40.0 79.0 44 82.6 C48.0 79.0 50.8 83.6 44 87.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(8 44 84)"
        />
        <path
          d="M172 86.8 C163.5 81.5 167.0 75.8 172 80.2 C177.0 75.8 180.5 81.5 172 86.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(-10 172 82)"
        />
        <path
          d="M194 79.8 C187.2 75.6 190.0 71.0 194 74.6 C198.0 71.0 200.8 75.6 194 79.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(12 194 76)"
        />
        <path
          d="M92 83.8 C85.2 79.6 88.0 75.0 92 78.6 C96.0 75.0 98.8 79.6 92 83.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(-8 92 80)"
        />
        <path
          d="M130 81.8 C123.2 77.6 126.0 73.0 130 76.6 C134.0 73.0 136.8 77.6 130 81.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
          transform="rotate(10 130 78)"
        />
        <g transform="rotate(28 30 122)">
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
        </g>
        <g transform="rotate(-28 170 122)">
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
        </g>
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
        <ellipse cx="50" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
        <ellipse cx="150" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
        <path
          d="M78 149.1 C63.5 140.2 69.5 130.4 78 138.0 C86.5 130.4 92.5 140.2 78 149.1 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M122 149.1 C107.5 140.2 113.5 130.4 122 138.0 C130.5 130.4 136.4 140.2 122 149.1 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <circle cx="73" cy="136" r="2" fill="var(--logo-cream)" />
        <circle cx="117" cy="136" r="2" fill="var(--logo-cream)" />
        <path
          d="M66 152 Q100.0 159.7 134 152 C132 184.0 68 184.0 66 152 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="3.7"
          strokeLinejoin="round"
        />
        <path
          d="M92 170 Q100 196 108 170 Q100 176 92 170 Z"
          fill="var(--logo-blush)"
          stroke="var(--logo-ink)"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
        <path
          d="M104 188 L104 192"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M104 191.0 C104.8 194.6 108.0 197.4 108.0 200.6 A4 4 0 0 1 100.0 200.6 C100.0 197.4 103.2 194.6 104 191.0 Z"
          fill="var(--logo-cream)"
          stroke="var(--logo-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
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
        <g transform="translate(-4 -36) rotate(10 100 80)">
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
    </g>
  </>
)

/** Surprise: the lid thrown up, steam in rays, round eyes, raised brows, an « o » mouth. */
export const SURPRISED: ReactElement = (
  <>
    <g transform="translate(110 134) scale(0.74) translate(-100 -100)">
      <g transform="rotate(0 100 190)">
        <path
          d="M36 90 L20 66"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M66 86 L58 56"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M100 84 L100 50"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M134 86 L142 56"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M164 90 L180 66"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g transform="rotate(46 30 122)">
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
        </g>
        <g transform="rotate(-46 170 122)">
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
        </g>
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
        <circle
          cx="78"
          cy="140"
          r="12.5"
          fill="var(--logo-cream)"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
        />
        <circle cx="78" cy="141" r="5.2" fill="var(--logo-ink)" />
        <circle cx="76.2" cy="139" r="1.6" fill="var(--logo-cream)" />
        <circle
          cx="122"
          cy="140"
          r="12.5"
          fill="var(--logo-cream)"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
        />
        <circle cx="122" cy="141" r="5.2" fill="var(--logo-ink)" />
        <circle cx="120.2" cy="139" r="1.6" fill="var(--logo-cream)" />
        <path
          d="M64 120 Q78 112 92 120"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M108 120 Q122 112 136 120"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="100"
          cy="166"
          rx="11"
          ry="14"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="4"
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
        <g transform="translate(8 -50) rotate(-12 100 80)">
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
    </g>
  </>
)

/** Perdue: the lid almost fallen (34°), steam as a question mark, searching eyes, a bead of sweat. */
export const LOST: ReactElement = (
  <>
    <g transform="translate(110 134) scale(0.74) translate(-100 -100)">
      <g transform="rotate(5 100 190)">
        <path
          d="M-40 70 C-40 52 -14 52 -14 70 C-14 82 -27 82 -27 96"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="-27" cy="111" r="4.6" fill="var(--logo-ink)" />
        <g transform="rotate(0 30 122)">
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
        </g>
        <g transform="rotate(-62 170 122)">
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
        </g>
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
        <circle
          cx="78"
          cy="142"
          r="11"
          fill="var(--logo-cream)"
          stroke="var(--logo-ink)"
          strokeWidth="4"
        />
        <circle cx="74" cy="137.5" r="4.6" fill="var(--logo-ink)" />
        <circle
          cx="122"
          cy="142"
          r="11"
          fill="var(--logo-cream)"
          stroke="var(--logo-ink)"
          strokeWidth="4"
        />
        <circle cx="118" cy="137.5" r="4.6" fill="var(--logo-ink)" />
        <path
          d="M66 130 L90 122"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M110 122 L134 130"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M74 166 Q82 156 90 166 T106 166 T122 166"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
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
        <g transform="rotate(34 184 98)">
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
        <path
          d="M166 117.0 C167.2 122.4 172.0 126.6 172.0 131.4 A6 6 0 0 1 160.0 131.4 C160.0 126.6 164.8 122.4 166 117.0 Z"
          fill="var(--logo-cream)"
          stroke="var(--logo-ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </>
)

/** Endormie: the lid shut, closed eyes, little « z » instead of steam, a tiny mouth. */
export const ASLEEP: ReactElement = (
  <>
    <g transform="translate(110 134) scale(0.74) translate(-100 -100)">
      <g transform="rotate(0 100 190)">
        <path
          d="M0 62 H12 L0 74 H12"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M-12 34 H6 L-12 52 H6"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 4 H32 L8 28 H32"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 100 Q16 98 20 88"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g transform="rotate(-14 30 122)">
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
        </g>
        <g transform="rotate(14 170 122)">
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
        </g>
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
        <ellipse cx="50" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
        <ellipse cx="150" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
        <path
          d="M68 140 Q78 152 88 140"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M112 140 Q122 152 132 140"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M92 164 Q100 170 108 164"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="124"
          cy="168"
          rx="7"
          ry="9"
          fill="var(--logo-cream)"
          stroke="var(--logo-ink)"
          strokeWidth="3"
          opacity="0"
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
        <g transform="rotate(0 184 98)">
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
    </g>
  </>
)

/** En fête: a lopsided lid with a striped party hat, confetti, eyes squeezed with joy, a wide mouth. */
export function celebrating(hatClipId: string): ReactElement {
  return (
    <>
      <g transform="translate(110 134) scale(0.74) translate(-100 -100)">
        <g transform="rotate(-4 100 190)">
          <g transform="rotate(58 30 122)">
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
          </g>
          <g transform="rotate(-58 170 122)">
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
          </g>
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
          <ellipse cx="50" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
          <ellipse cx="150" cy="158" rx="9" ry="5.5" fill="var(--logo-blush)" />
          <path
            d="M68 146 Q78 132 88 146"
            fill="none"
            stroke="var(--logo-ink)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M112 146 Q122 132 132 146"
            fill="none"
            stroke="var(--logo-ink)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M60 150 Q100.0 159.6 140 150 C138 190.0 62 190.0 60 150 Z"
            fill="var(--logo-brick)"
            stroke="var(--logo-ink)"
            strokeWidth="3.7"
            strokeLinejoin="round"
          />
          <path d="M85.0 173 Q100.0 159 115.0 173 Q100.0 179 85.0 173 Z" fill="var(--logo-blush)" />
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
          <g transform="rotate(7 184 98)">
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
            <g transform="rotate(12 104 52)">
              <clipPath id={hatClipId}>
                <path d="M74 54 L106 -14 L132 54 Q103 67 74 54 Z" />
              </clipPath>
              <path d="M74 54 L106 -14 L132 54 Q103 67 74 54 Z" fill="var(--logo-party-1)" />
              <g clipPath={`url(#${hatClipId})`}>
                <path
                  d="M95.6 8 Q105.0 15.5 114.4 8.0 L116.7 14 Q104.8 23.6 92.8 14.0 Z"
                  fill="var(--logo-party-4)"
                />
                <path
                  d="M89.5 21 Q104.5 32.9 119.4 21.0 L122.1 28 Q104.1 42.3 86.2 28.0 Z"
                  fill="var(--logo-party-3)"
                />
                <path
                  d="M83.4 34 Q103.9 50.4 124.4 34.0 L127.0 41 Q103.6 59.8 80.1 41.0 Z"
                  fill="var(--logo-party-2)"
                />
                <path
                  d="M77.8 46 Q103.4 66.5 128.9 46.0 L131.2 52 Q103.1 74.5 74.9 52.0 Z"
                  fill="var(--logo-party-6)"
                />
              </g>
              <path
                d="M74 54 L106 -14 L132 54 Q103 67 74 54 Z"
                fill="none"
                stroke="var(--logo-ink)"
                strokeWidth="5.5"
                strokeLinejoin="round"
              />
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path
                  d="M106 -14 C100 -22 88 -22 88 -34"
                  stroke="var(--logo-ink)"
                  strokeWidth="8"
                />
                <path
                  d="M106 -14 C100 -22 88 -22 88 -34"
                  stroke="var(--logo-party-5)"
                  strokeWidth="4"
                />
                <path
                  d="M106 -14 C112 -22 124 -22 124 -34"
                  stroke="var(--logo-ink)"
                  strokeWidth="8"
                />
                <path
                  d="M106 -14 C112 -22 124 -22 124 -34"
                  stroke="var(--logo-party-2)"
                  strokeWidth="4"
                />
              </g>
            </g>
          </g>
          <rect
            x="-24"
            y="36"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-1)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(20 -18 39)"
          />
          <rect
            x="8"
            y="6"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-2)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(-30 14 9)"
          />
          <rect
            x="36"
            y="-22"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-3)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(55 42 -19)"
          />
          <rect
            x="-34"
            y="70"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-4)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(65 -28 73)"
          />
          <rect
            x="26"
            y="-44"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-5)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(-50 32 -41)"
          />
          <rect
            x="160"
            y="-20"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-6)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(-20 166 -17)"
          />
          <rect
            x="168"
            y="34"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-1)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(40 174 37)"
          />
          <rect
            x="186"
            y="-50"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-2)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(25 192 -47)"
          />
          <rect
            x="212"
            y="90"
            width="13"
            height="5.5"
            rx="2"
            fill="var(--logo-party-3)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            transform="rotate(-35 218 93)"
          />
          <g transform="rotate(0 -30 50)">
            <path
              d="M-30 50 q5 -9 10 0 t10 0 t10 0"
              fill="none"
              stroke="var(--logo-ink)"
              strokeWidth="6.4"
              strokeLinecap="round"
            />
            <path
              d="M-30 50 q5 -9 10 0 t10 0 t10 0"
              fill="none"
              stroke="var(--logo-party-2)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <g transform="rotate(40 -6 -14)">
            <path
              d="M-6 -14 q5 -9 10 0 t10 0 t10 0"
              fill="none"
              stroke="var(--logo-ink)"
              strokeWidth="6.4"
              strokeLinecap="round"
            />
            <path
              d="M-6 -14 q5 -9 10 0 t10 0 t10 0"
              fill="none"
              stroke="var(--logo-party-4)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <g transform="rotate(-15 150 -40)">
            <path
              d="M150 -40 q5 -9 10 0 t10 0 t10 0"
              fill="none"
              stroke="var(--logo-ink)"
              strokeWidth="6.4"
              strokeLinecap="round"
            />
            <path
              d="M150 -40 q5 -9 10 0 t10 0 t10 0"
              fill="none"
              stroke="var(--logo-party-4)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <g transform="rotate(70 196 14)">
            <path
              d="M196 14 q5 -9 10 0 t10 0 t10 0"
              fill="none"
              stroke="var(--logo-ink)"
              strokeWidth="6.4"
              strokeLinecap="round"
            />
            <path
              d="M196 14 q5 -9 10 0 t10 0 t10 0"
              fill="none"
              stroke="var(--logo-party-2)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <path
            d="M16 -30 l9 3 l-6 8 Z"
            fill="var(--logo-party-4)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            transform="rotate(20 20 -26)"
          />
          <path
            d="M188 -14 l9 3 l-6 8 Z"
            fill="var(--logo-party-1)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            transform="rotate(-25 192 -10)"
          />
          <path
            d="M-18 10 l9 3 l-6 8 Z"
            fill="var(--logo-party-1)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            transform="rotate(10 -14 14)"
          />
          <path
            d="M206 60 l9 3 l-6 8 Z"
            fill="var(--logo-party-4)"
            stroke="var(--logo-ink)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            transform="rotate(-15 210 64)"
          />
        </g>
      </g>
    </>
  )
}
