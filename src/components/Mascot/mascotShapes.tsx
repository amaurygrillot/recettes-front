import type { ReactElement } from 'react'

/**
 * The seven moods of the mascot, copied from the symbols `ms-*` of the canvas board `Retouche-4-mascotte` (200 x 220). Every
 * colour is a `--logo-*` variable set by `Mascot`, from the design tokens; the steam, the lid and the accessories are
 * hand-drawn polylines kept as the board has them.
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
          d="M76 170 Q100 150 124 170"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M70 163 Q72 170 76 174"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M130 163 Q128 170 124 174"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.6"
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
          d="M14 84.7 C2.1 77.3 7.0 69.2 14 75.5 C21.0 69.2 25.9 77.3 14 84.7 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M-6 55.7 C-16.2 49.4 -12.0 42.5 -6 47.9 C0.0 42.5 4.2 49.4 -6 55.7 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M16 30.8 C7.5 25.5 11.0 19.8 16 24.2 C21.0 19.8 24.5 25.5 16 30.8 Z"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M30 100 Q8 96 12 86"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
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
        <path
          d="M56 84 L50 94"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M100 80 L100 92"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M144 84 L150 94"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
          d="M-8 64 C-8 46 18 46 18 64 C18 76 4 76 4 90"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4" cy="104" r="4.2" fill="var(--logo-ink)" />
        <path
          d="M40 100 Q22 98 24 84"
          fill="none"
          stroke="var(--logo-ink)"
          strokeWidth="3.6"
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

/** En fête: a lopsided lid with a party hat, confetti, eyes squeezed with joy, a wide mouth. */
export const CELEBRATING: ReactElement = (
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
          <path
            d="M100 22 L84 50 L116 50 Z"
            fill="var(--logo-brick)"
            stroke="var(--logo-ink)"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle
            cx="100"
            cy="20"
            r="5.5"
            fill="var(--logo-cream)"
            stroke="var(--logo-ink)"
            strokeWidth="3.5"
          />
          <path
            d="M91 40 L109 40 M95 31 L105 31"
            stroke="var(--logo-cream)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
        <circle
          cx="-20"
          cy="30"
          r="4.6"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
        />
        <rect
          x="6"
          y="4"
          width="9"
          height="9"
          rx="2"
          fill="var(--logo-herb)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
          transform="rotate(37 10 8)"
        />
        <circle
          cx="40"
          cy="-14"
          r="4.6"
          fill="var(--logo-gold-deep)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
        />
        <rect
          x="150"
          y="-6"
          width="9"
          height="9"
          rx="2"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
          transform="rotate(71 154 -2)"
        />
        <circle
          cx="176"
          cy="20"
          r="4.6"
          fill="var(--logo-herb)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
        />
        <rect
          x="196"
          y="56"
          width="9"
          height="9"
          rx="2"
          fill="var(--logo-gold-deep)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
          transform="rotate(105 200 60)"
        />
        <circle
          cx="-30"
          cy="84"
          r="4.6"
          fill="var(--logo-gold-deep)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
        />
        <rect
          x="206"
          y="96"
          width="9"
          height="9"
          rx="2"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
          transform="rotate(139 210 100)"
        />
        <circle
          cx="24"
          cy="-34"
          r="4.6"
          fill="var(--logo-brick)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
        />
        <rect
          x="170"
          y="-34"
          width="9"
          height="9"
          rx="2"
          fill="var(--logo-herb)"
          stroke="var(--logo-ink)"
          strokeWidth="2.2"
          transform="rotate(173 174 -30)"
        />
      </g>
    </g>
  </>
)
