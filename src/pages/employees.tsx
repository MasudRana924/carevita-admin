import { CONFIG } from 'src/config-global';

import { EmployeesView } from 'src/sections/employees/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Employees - ${CONFIG.appName}`}</title>

      <EmployeesView />
    </>
  );
}
