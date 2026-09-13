import type { LinkProps } from '@mui/material/Link';

import { useId } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  const theme = useTheme();

  const gradientId = useId();

  const TEXT_PRIMARY = theme.vars.palette.text.primary;
  const PRIMARY_LIGHT = theme.vars.palette.primary.light;
  const PRIMARY_MAIN = theme.vars.palette.primary.main;
  const PRIMARY_DARKER = theme.vars.palette.primary.dark;

  const singleLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`${gradientId}-1`}
          x1="152"
          y1="167.79"
          x2="65.523"
          y2="259.624"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_DARKER} />
          <stop offset="1" stopColor={PRIMARY_MAIN} />
        </linearGradient>
        <linearGradient
          id={`${gradientId}-2`}
          x1="86"
          y1="128"
          x2="86"
          y2="384"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_MAIN} />
        </linearGradient>
        <linearGradient
          id={`${gradientId}-3`}
          x1="402"
          y1="288"
          x2="402"
          y2="384"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_MAIN} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${`${gradientId}-1`})`}
        d="M86.352 246.358C137.511 214.183 161.836 245.017 183.168 285.573C165.515 317.716 153.837 337.331 148.132 344.418C137.373 357.788 125.636 367.911 111.202 373.752C80.856 388.014 43.132 388.681 14 371.048L86.352 246.358Z"
      />
      <path
        fill={`url(#${`${gradientId}-2`})`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M444.31 229.726C398.04 148.77 350.21 72.498 295.267 184.382C287.751 198.766 282.272 226.719 270 226.719V226.577C257.728 226.577 252.251 198.624 244.735 184.24C189.79 72.356 141.96 148.628 95.689 229.584C92.207 235.69 88.862 241.516 86 246.58C192.038 179.453 183.11 382.247 270 383.858V384C356.891 382.389 347.962 179.595 454 246.72C451.139 241.658 447.794 235.832 444.31 229.726Z"
      />
      <path
        fill={`url(#${`${gradientId}-3`})`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M450 384C476.509 384 498 362.509 498 336C498 309.491 476.509 288 450 288C423.491 288 402 309.491 402 336C402 362.509 423.491 384 450 384Z"
      />
    </svg>
  );

  const fullLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 360 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={`${gradientId}-1`}
          x1="38"
          y1="41.9469"
          x2="16.381"
          y2="64.906"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_DARKER} />
          <stop offset="1" stopColor={PRIMARY_MAIN} />
        </linearGradient>
        <linearGradient
          id={`${gradientId}-2`}
          x1="21.5"
          y1="32"
          x2="21.5"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_MAIN} />
        </linearGradient>
        <linearGradient
          id={`${gradientId}-3`}
          x1="100.5"
          y1="72"
          x2="100.5"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_MAIN} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${`${gradientId}-1`})`}
        d="M21.588 61.59C34.378 53.546 40.458 61.254 45.792 71.393C41.379 79.429 38.459 84.333 37.032 86.105C34.343 89.447 31.409 91.978 27.8 93.438C20.214 97.004 10.783 97.17 3.5 92.762L21.588 61.59Z"
      />
      <path
        fill={`url(#${`${gradientId}-2`})`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M111.078 57.431C99.51 37.194 87.552 18.124 73.817 46.096C71.937 49.69 70.568 56.68 67.5 56.68V56.644C64.432 56.644 63.063 49.656 61.184 46.06C47.448 18.09 35.49 37.157 23.922 57.396C23.052 58.922 22.216 60.379 21.5 61.645C48.01 44.863 45.778 95.562 67.5 95.965V96C89.223 95.597 86.99 44.899 113.5 61.68C112.785 60.414 111.949 58.957 111.078 57.431Z"
      />
      <path
        fill={`url(#${`${gradientId}-3`})`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M112.5 96C119.127 96 124.5 90.627 124.5 84C124.5 77.373 119.127 72 112.5 72C105.873 72 100.5 77.373 100.5 84C100.5 90.627 105.873 96 112.5 96Z"
      />
      <text
        x="140"
        y="70"
        fill={TEXT_PRIMARY}
        fontSize="24"
        fontWeight="600"
        fontFamily="DM Sans Variable, sans-serif"
      >
        CareMate
      </text>
    </svg>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          ...(!isSingle && { width: 102, height: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
