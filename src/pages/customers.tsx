import { CONFIG } from 'src/config-global';

import { CustomersView } from 'src/sections/customers/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Customers - ${CONFIG.appName}`}</title>

      <CustomersView />
    </>
  );
}
