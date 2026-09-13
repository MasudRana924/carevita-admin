import { CONFIG } from 'src/config-global';

import { SuppliersView } from 'src/sections/suppliers/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Suppliers - ${CONFIG.appName}`}</title>

      <SuppliersView />
    </>
  );
}
