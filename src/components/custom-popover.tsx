import type { PopoverProps } from '@mui/material/Popover';
import type { SxProps, Theme } from '@mui/material/styles';

import { useState, forwardRef, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';

// ----------------------------------------------------------------------

type ArrowDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom';

type Props = PopoverProps & {
  arrow?: ArrowDirection;
  disabledArrow?: boolean;
  sx?: SxProps<Theme>;
};

export const CustomPopover = forwardRef<HTMLDivElement, Props>(
  ({ children, arrow = 'top-right', disabledArrow, sx, ...other }, ref) => {
    const arrowSize = 12;

    const arrowStyle: Record<
      'top' | 'bottom' | 'left' | 'right',
      { width?: number; height?: number; top?: number; bottom?: number; left?: number; right?: number }
    > = {
      top: { height: arrowSize },
      bottom: { height: arrowSize },
      left: { width: arrowSize },
      right: { width: arrowSize },
    };

    const arrowPositionStyle: Record<ArrowDirection, Partial<Record<'top' | 'bottom' | 'left' | 'right', number>>> = {
      'top-left': { top: -arrowSize, left: 20 },
      'top-right': { top: -arrowSize, right: 20 },
      'bottom-left': { bottom: -arrowSize, left: 20 },
      'bottom-right': { bottom: -arrowSize, right: 20 },
      'left-top': { left: -arrowSize, top: 20 },
      'left-bottom': { left: -arrowSize, bottom: 20 },
      'right-top': { right: -arrowSize, top: 20 },
      'right-bottom': { right: -arrowSize, bottom: 20 },
    };

    const [arrowDirection] = arrow.split('-') as [
      keyof typeof arrowStyle,
      keyof typeof arrowPositionStyle
    ];

    const positionStyles = arrowPositionStyle[arrow] ?? arrowPositionStyle['top-right'];

    return (
      <Popover
        ref={ref}
        sx={{
          '& .MuiPopover-paper': {
            boxShadow: (theme) => theme.customShadows?.dropdown ?? theme.shadows[3],
            borderRadius: 2,
            ...(sx as object), // explicitly cast for TS
          },
        }}
        {...other}
      >
        {!disabledArrow && (
          <Box
            sx={{
              ...positionStyles,
              width: arrowStyle[arrowDirection]?.width,
              height: arrowStyle[arrowDirection]?.height,
              position: 'absolute',
              transform: 'rotate(45deg)',
              bgcolor: 'background.paper',
              borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
              borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
            }}
          />
        )}

        {children}
      </Popover>
    );
  }
);

CustomPopover.displayName = 'CustomPopover';

// ----------------------------------------------------------------------

export function usePopover() {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const onOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setOpen(null);
  }, []);

  return {
    open: !!open,
    anchorEl: open,
    onOpen,
    onClose,
  };
}