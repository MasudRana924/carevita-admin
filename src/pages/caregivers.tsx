import { CONFIG } from 'src/config-global';

import { CaregiversView } from 'src/sections/admin/caregivers/caregivers-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Caregivers - ${CONFIG.appName}`}</title>

      <CaregiversView />
    </>
  );
}
