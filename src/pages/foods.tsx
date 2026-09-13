import { CONFIG } from 'src/config-global';

import { FoodsView } from 'src/sections/foods/view';

// ----------------------------------------------------------------------

export default function FoodsPage() {
  return (
    <>
      <title>{`Foods - ${CONFIG.appName}`}</title>

      <FoodsView />
    </>
  );
}
