import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { _posts, _tasks, _traffic, _timeline, _inventory, _suppliers, _customers, _employees, _orders, _salesReports, _attendance } from 'src/_mock';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  // Calculate ERP-specific metrics
  const totalInventoryValue = _inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = _inventory.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = _inventory.filter(item => item.status === 'Out of Stock').length;
  const totalSuppliers = _suppliers.length;
  const activeSuppliers = _suppliers.filter(supplier => supplier.status === 'Active').length;
  const totalCustomers = _customers.length;
  const activeCustomers = _customers.filter(customer => customer.status === 'Active').length;
  const totalEmployees = _employees.length;
  const activeEmployees = _employees.filter(employee => employee.status === 'Active').length;
  const totalOrders = _orders.length;
  const pendingOrders = _orders.filter(order => order.status === 'pending').length;
  const totalRevenue = _orders.reduce((sum, order) => sum + order.total, 0);

  // Calculate Sales Reports metrics
  const totalSalesRevenue = _salesReports.reduce((sum, report) => sum + report.totalRevenue, 0);
  const totalSalesOrders = _salesReports.reduce((sum, report) => sum + report.totalOrders, 0);
  const averageGrowthRate = _salesReports.reduce((sum, report) => sum + parseFloat(report.growthRate), 0) / _salesReports.length;

  // Calculate Attendance metrics
  const totalAttendanceRecords = _attendance.length;
  const presentEmployees = _attendance.filter(record => record.status === 'Present').length;
  const lateEmployees = _attendance.filter(record => record.status === 'Late').length;
  const absentEmployees = _attendance.filter(record => record.status === 'Absent').length;
  const totalOvertimeHours = _attendance.reduce((sum, record) => sum + record.overtime, 0);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        {/* ERP Summary Widgets */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Revenue"
            percent={2.6}
            total={totalRevenue}
            icon={<img alt="Revenue" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Orders"
            percent={-0.1}
            total={totalOrders}
            color="secondary"
            icon={<img alt="Orders" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Inventory Value"
            percent={2.8}
            total={totalInventoryValue}
            color="warning"
            icon={<img alt="Inventory" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Active Customers"
            percent={3.6}
            total={activeCustomers}
            color="error"
            icon={<img alt="Customers" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        {/* Sales Reports Widgets */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Sales Revenue"
            percent={averageGrowthRate}
            total={totalSalesRevenue}
            color="info"
            icon={<img alt="Sales" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [65, 78, 90, 81, 56, 55, 40, 45],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Sales Orders"
            percent={1.2}
            total={totalSalesOrders}
            color="success"
            icon={<img alt="Sales Orders" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [32, 45, 67, 89, 43, 56, 78, 34],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Present Today"
            percent={4.2}
            total={presentEmployees}
            color="primary"
            icon={<img alt="Attendance" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              series: [85, 88, 92, 87, 90, 45, 30],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Overtime Hours"
            percent={-2.1}
            total={totalOvertimeHours}
            color="warning"
            icon={<img alt="Overtime" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              series: [12, 15, 8, 20, 18, 10, 5],
            }}
          />
        </Grid>

        {/* Inventory Status */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Inventory Status"
            chart={{
              series: [
                { label: 'In Stock', value: _inventory.filter(item => item.status === 'In Stock').length },
                { label: 'Low Stock', value: lowStockItems },
                { label: 'Out of Stock', value: outOfStockItems },
                { label: 'Discontinued', value: _inventory.filter(item => item.status === 'Discontinued').length },
              ],
            }}
          />
        </Grid>

        {/* Attendance Status */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Attendance Status"
            chart={{
              series: [
                { label: 'Present', value: presentEmployees },
                { label: 'Late', value: lateEmployees },
                { label: 'Absent', value: absentEmployees },
                { label: 'Half Day', value: _attendance.filter(record => record.status === 'Half Day').length },
              ],
            }}
          />
        </Grid>

        {/* Sales Growth */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Sales Growth by Month"
            chart={{
              categories: _salesReports.map(report => report.month),
              series: [
                { name: 'Revenue', data: _salesReports.map(report => report.totalRevenue / 1000) },
              ],
            }}
          />
        </Grid>

        {/* Orders Overview */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Orders Overview"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Total Orders', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Completed', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        {/* Customer Distribution */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Customer Distribution"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Individual', 'Business', 'VIP'],
              series: [
                { name: '2022', data: [44, 55, 41] },
                { name: '2023', data: [53, 32, 33] },
              ],
            }}
          />
        </Grid>

        {/* Department Distribution */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Employee Distribution"
            chart={{
              categories: ['Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations'],
              series: [
                { name: 'Employees', data: [80, 50, 30, 40, 100, 20] },
              ],
            }}
          />
        </Grid>

        {/* Recent Orders */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsNews title="Recent Orders" list={_orders.slice(0, 5).map(order => ({
            id: order.id,
            title: `Order ${order.orderNumber}`,
            description: `${order.customerName} - ${order.total}`,
            coverUrl: order.items[0]?.image || '/assets/images/product/product-1.webp',
            totalViews: 0,
            totalComments: 0,
            totalShares: 0,
            totalFavorites: 0,
            postedAt: order.orderDate,
            author: {
              name: order.customerName,
              avatarUrl: '/assets/images/avatar/avatar-1.webp',
            },
          }))} />
        </Grid>

        {/* Recent Sales Reports */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsNews title="Recent Sales Reports" list={_salesReports.slice(0, 5).map(report => ({
            id: report.id,
            title: `${report.month} ${report.year}`,
            description: `Revenue: ${report.totalRevenue} | Orders: ${report.totalOrders}`,
            coverUrl: '/assets/images/product/product-1.webp',
            totalViews: 0,
            totalComments: 0,
            totalShares: 0,
            totalFavorites: 0,
            postedAt: report.generatedDate,
            author: {
              name: 'Sales Team',
              avatarUrl: '/assets/images/avatar/avatar-1.webp',
            },
          }))} />
        </Grid>

        {/* Order Timeline */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        {/* Supplier Performance */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsTrafficBySite title="Supplier Performance" list={_suppliers.slice(0, 4).map(supplier => ({
            value: supplier.name,
            label: supplier.name,
            total: supplier.totalSpent,
          }))} />
        </Grid>

        {/* Tasks */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
