import { CONFIG } from 'src/config-global';

import { HospitalsView } from 'src/sections/admin/hospitals/hospitals-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Hospitals - ${CONFIG.appName}`}</title>

      <HospitalsView />
    </>
  );
}
