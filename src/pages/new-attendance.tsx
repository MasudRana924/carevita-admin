import { CONFIG } from 'src/config-global';

import { NewAttendanceView } from 'src/sections/attendance/view/new-attendance-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Add Attendance - ${CONFIG.appName}`}</title>

      <NewAttendanceView />
    </>
  );
}
