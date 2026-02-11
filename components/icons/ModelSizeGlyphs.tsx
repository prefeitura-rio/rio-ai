import type { SVGProps } from 'react';

type GlyphProps = SVGProps<SVGSVGElement>;

type SizeBadgeProps = GlyphProps & {
  value: string;
  moe?: string;
};

const SizeBadge = ({ value, moe, ...props }: SizeBadgeProps) => {
  const valueFontSize = value.length >= 4 ? 6 : 7.2;
  const valueY = moe ? 11.1 : 12.8;

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x={3} y={3} width={18} height={18} rx={4.2} fill="currentColor" opacity={0.08} />
      <rect x={3} y={3} width={18} height={18} rx={4.2} stroke="currentColor" strokeWidth={1.2} opacity={0.3} />

      <text
        x={12}
        y={valueY}
        textAnchor="middle"
        fill="currentColor"
        fontSize={valueFontSize}
        fontWeight={700}
        letterSpacing="-0.2"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
      >
        {value}
      </text>

      {moe ? (
        <>
          <path d="M7.6 13.2H16.4" stroke="currentColor" strokeWidth={1} opacity={0.25} />
          <text
            x={12}
            y={16.7}
            textAnchor="middle"
            fill="currentColor"
            fontSize={3.1}
            fontWeight={700}
            letterSpacing="0.2"
            opacity={0.82}
            fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
          >
            {moe}
          </text>
        </>
      ) : null}

      <text
        x={18.2}
        y={7.2}
        textAnchor="middle"
        fill="currentColor"
        fontSize={2.7}
        fontWeight={700}
        opacity={0.72}
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
      >
        B
      </text>
    </svg>
  );
};

export const ModelGlyphXL = (props: GlyphProps) => <SizeBadge {...props} value="235" moe="A22" />;

export const ModelGlyphL = (props: GlyphProps) => <SizeBadge {...props} value="30" moe="A3" />;

export const ModelGlyphM = (props: GlyphProps) => <SizeBadge {...props} value="4" />;

export const ModelGlyphS = (props: GlyphProps) => <SizeBadge {...props} value="1.7" />;
