import { CONFIG } from 'src/config-global';

import { UsersView } from 'src/sections/admin/users/users-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Users - ${CONFIG.appName}`}</title>

      <UsersView />
    </>
  );
}
