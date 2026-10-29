import { useCallback, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import type { CaregiverDocument } from 'src/api/admin-types';

import { documentTypeLabel, fDateTimeOrDash, formatBytes } from './verification-utils';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

export function isPdfDocument(doc: CaregiverDocument) {
  return doc.resource_type === 'raw' || doc.mime_type === 'application/pdf';
}

export function documentTitle(doc: CaregiverDocument) {
  return doc.title || doc.original_name || documentTypeLabel(doc.document_type);
}

/** Opens a document URL without leaking the admin panel via `window.opener` or the Referer header. */
export function openDocumentInNewTab(doc: CaregiverDocument) {
  window.open(doc.file_url, '_blank', 'noopener,noreferrer');
}

// ----------------------------------------------------------------------

export function DocumentTile({
  doc,
  label,
  onOpen,
}: {
  doc: CaregiverDocument;
  label?: string;
  onOpen: (doc: CaregiverDocument) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const pdf = isPdfDocument(doc);
  const title = documentTitle(doc);

  return (
    <Card variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden', boxShadow: 'none' }}>
      <CardActionArea onClick={() => onOpen(doc)} aria-label={`Open ${label || title}`}>
        <Box
          sx={{
            height: 170,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
            color: 'text.secondary',
          }}
        >
          {pdf ? (
            <Stack alignItems="center" spacing={1}>
              <Iconify icon="solar:document-text-bold" width={44} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                PDF
              </Typography>
            </Stack>
          ) : imageFailed ? (
            <Stack alignItems="center" spacing={1}>
              <Iconify icon="solar:gallery-remove-bold" width={36} />
              <Typography variant="caption">Preview unavailable</Typography>
            </Stack>
          ) : (
            <Box
              component="img"
              src={doc.file_url}
              alt={label || title}
              loading="lazy"
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImageFailed(true)}
              sx={{ width: 1, height: 1, objectFit: 'cover' }}
            />
          )}
        </Box>
      </CardActionArea>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.5, py: 1.25 }}>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          {label && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
              {label}
            </Typography>
          )}
          <Typography variant="subtitle2" noWrap title={title}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
            {formatBytes(doc.size_bytes)} · {fDateTimeOrDash(doc.created_at)}
          </Typography>
        </Box>
        <Tooltip title="Open in new tab">
          <IconButton size="small" onClick={() => openDocumentInNewTab(doc)}>
            <Iconify icon="solar:square-arrow-right-up-linear" width={16} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
}

export function MissingDocumentTile({ label }: { label: string }) {
  return (
    <Box
      sx={{
        height: 1,
        minHeight: 230,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 1.5,
        border: '1px dashed',
        borderColor: 'warning.main',
        color: 'warning.dark',
        bgcolor: 'warning.lighter',
      }}
    >
      <Iconify icon="solar:gallery-remove-bold" width={32} />
      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        {label}
      </Typography>
      <Typography variant="caption">Not uploaded</Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export type LightboxItem = { doc: CaregiverDocument; label: string };

type DocumentLightboxProps = {
  items: LightboxItem[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function DocumentLightbox({ items, index, onIndexChange, onClose }: DocumentLightboxProps) {
  const open = index !== null && !!items[index];
  const current = open ? items[index] : null;
  const pdf = current ? isPdfDocument(current.doc) : false;

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const resetView = useCallback(() => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetView();
  }, [index, resetView]);

  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < items.length - 1;

  const goPrev = useCallback(() => {
    if (index !== null && index > 0) onIndexChange(index - 1);
  }, [index, onIndexChange]);

  const goNext = useCallback(() => {
    if (index !== null && index < items.length - 1) onIndexChange(index + 1);
  }, [index, items.length, onIndexChange]);

  const zoomBy = useCallback((delta: number) => {
    setZoom((value) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value + delta));
      if (next <= 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const rotateBy = useCallback((degrees: number) => setRotation((value) => (value + degrees + 360) % 360), []);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev();
      else if (event.key === 'ArrowRight') goNext();
      else if (pdf) return;
      else if (event.key === '+' || event.key === '=') zoomBy(ZOOM_STEP);
      else if (event.key === '-') zoomBy(-ZOOM_STEP);
      else if (event.key === 'r') rotateBy(90);
      else if (event.key === 'R') rotateBy(-90);
      else if (event.key === '0') resetView();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, pdf, goPrev, goNext, zoomBy, rotateBy, resetView]);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, originX: offset.x, originY: offset.y };
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({ x: drag.originX + event.clientX - drag.startX, y: drag.originY + event.clientY - drag.startY });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (pdf) return;
    zoomBy(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
  };

  const toolbarButtonSx = { color: 'common.white', '&.Mui-disabled': { color: 'grey.700' } };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { bgcolor: 'rgba(12, 14, 18, 0.96)', color: 'common.white' } }}
    >
      {current && (
        <Stack sx={{ height: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'rgba(255,255,255,0.12)' }}
          >
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="caption" sx={{ color: 'grey.400', display: 'block' }}>
                {current.label} · {index! + 1} / {items.length}
              </Typography>
              <Typography variant="subtitle1" noWrap>
                {documentTitle(current.doc)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.400' }}>
                {formatBytes(current.doc.size_bytes)} · Uploaded {fDateTimeOrDash(current.doc.created_at)}
                {current.doc.family_member_name
                  ? ` · ${current.doc.family_member_name}${
                      current.doc.family_member_relation ? ` (${current.doc.family_member_relation})` : ''
                    }`
                  : ''}
              </Typography>
            </Box>

            {!pdf && (
              <>
                <Tooltip title="Zoom out (-)">
                  <span>
                    <IconButton sx={toolbarButtonSx} disabled={zoom <= MIN_ZOOM} onClick={() => zoomBy(-ZOOM_STEP)}>
                      <Iconify icon="solar:magnifer-zoom-out-linear" width={20} />
                    </IconButton>
                  </span>
                </Tooltip>
                <Typography variant="caption" sx={{ minWidth: 44, textAlign: 'center' }}>
                  {Math.round(zoom * 100)}%
                </Typography>
                <Tooltip title="Zoom in (+)">
                  <span>
                    <IconButton sx={toolbarButtonSx} disabled={zoom >= MAX_ZOOM} onClick={() => zoomBy(ZOOM_STEP)}>
                      <Iconify icon="solar:magnifer-zoom-in-linear" width={20} />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Rotate left (Shift+R)">
                  <IconButton sx={toolbarButtonSx} onClick={() => rotateBy(-90)}>
                    <Iconify icon="solar:undo-left-round-linear" width={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Rotate right (R)">
                  <IconButton sx={toolbarButtonSx} onClick={() => rotateBy(90)}>
                    <Iconify icon="solar:undo-right-round-linear" width={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset view (0)">
                  <IconButton sx={toolbarButtonSx} onClick={resetView}>
                    <Iconify icon="solar:maximize-square-minimalistic-linear" width={20} />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:square-arrow-right-up-linear" width={16} />}
              onClick={() => openDocumentInNewTab(current.doc)}
              sx={{ ml: 1, flexShrink: 0 }}
            >
              Open in new tab
            </Button>
            <Tooltip title="Close (Esc)">
              <IconButton sx={toolbarButtonSx} onClick={onClose} aria-label="Close viewer">
                <Iconify icon="solar:close-linear" width={22} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box sx={{ position: 'relative', flexGrow: 1, minHeight: 0 }}>
            {pdf ? (
              <Box
                component="iframe"
                title={documentTitle(current.doc)}
                src={current.doc.file_url}
                referrerPolicy="no-referrer"
                sx={{ width: 1, height: 1, border: 0, bgcolor: 'common.white' }}
              />
            ) : (
              <Box
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                sx={{
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  touchAction: 'none',
                  cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
                }}
              >
                <Box
                  component="img"
                  key={current.doc.id}
                  src={current.doc.file_url}
                  alt={current.label}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  sx={{
                    maxWidth: '92%',
                    maxHeight: '92%',
                    objectFit: 'contain',
                    userSelect: 'none',
                    transition: dragging ? 'none' : 'transform 120ms ease-out',
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  }}
                />
              </Box>
            )}

            {hasPrev && (
              <IconButton
                onClick={goPrev}
                aria-label="Previous document"
                sx={{ ...navButtonSx, left: 16 }}
              >
                <Iconify icon="solar:alt-arrow-left-linear" width={28} />
              </IconButton>
            )}
            {hasNext && (
              <IconButton onClick={goNext} aria-label="Next document" sx={{ ...navButtonSx, right: 16 }}>
                <Iconify icon="solar:alt-arrow-right-linear" width={28} />
              </IconButton>
            )}
          </Box>
        </Stack>
      )}
    </Dialog>
  );
}

const navButtonSx = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'common.white',
  bgcolor: 'rgba(255,255,255,0.12)',
  '&:hover': { bgcolor: 'rgba(255,255,255,0.24)' },
} as const;
