import { CONFIG } from 'src/config-global';

import { CategoriesView } from 'src/sections/categories/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Categories - ${CONFIG.appName}`}</title>

      <CategoriesView />
    </>
  );
}
