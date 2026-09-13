import { CONFIG } from 'src/config-global';

import { PurchaseOrdersView } from 'src/sections/purchase-orders/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Purchase Orders - ${CONFIG.appName}`}</title>

      <PurchaseOrdersView />
    </>
  );
}
