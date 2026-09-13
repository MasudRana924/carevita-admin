import { CONFIG } from 'src/config-global';

import { SalesReportsView } from 'src/sections/sales-reports/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sales Reports - ${CONFIG.appName}`}</title>

      <SalesReportsView />
    </>
  );
}
