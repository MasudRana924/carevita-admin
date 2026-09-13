import { CONFIG } from 'src/config-global';

import { NewHospitalView } from 'src/sections/admin/hospitals';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`New Hospital - ${CONFIG.appName}`}</title>

      <NewHospitalView />
    </>
  );
}
