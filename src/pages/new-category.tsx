import { CONFIG } from 'src/config-global';

import { NewCategoryView } from 'src/sections/categories/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`New Category - ${CONFIG.appName}`}</title>

      <NewCategoryView />
    </>
  );
}
