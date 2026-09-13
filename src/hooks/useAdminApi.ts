// Custom hooks for admin API usage
import { useState, useEffect } from 'react';
import {
  adminProfileService,
  adminDashboardService,
  adminUsersService,
  adminCaregiversService,
  adminHospitalsService,
} from 'src/api/admin-services';
import type {
  AdminProfile,
  DashboardData,
  User,
  UsersQueryParams,
  Caregiver,
  CaregiversQueryParams,
  Hospital,
  HospitalsQueryParams,
} from 'src/api/admin-types';

// Hook for admin profile
export function useAdminProfile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminProfileService.getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
}

// Hook for dashboard data
export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminDashboardService.getDashboard();
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { dashboard, loading, error, refetch: fetchDashboard };
}

// Hook for users
export function useUsers(params?: UsersQueryParams) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0 });

  const fetchUsers = async (queryParams?: UsersQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminUsersService.getUsers(queryParams || params);
      setUsers(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [params?.role, params?.status, params?.page, params?.limit]);

  const blockUser = async (id: string) => {
    try {
      const updatedUser = await adminUsersService.blockUser(id);
      setUsers(users.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to block user');
    }
  };

  const unblockUser = async (id: string) => {
    try {
      const updatedUser = await adminUsersService.unblockUser(id);
      setUsers(users.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to unblock user');
    }
  };

  const updateUserStatus = async (id: string, status: 'active' | 'blocked') => {
    try {
      const updatedUser = await adminUsersService.updateUserStatus(id, { status });
      setUsers(users.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update user status');
    }
  };

  return { users, loading, error, meta, refetch: fetchUsers, blockUser, unblockUser, updateUserStatus };
}

// Hook for caregivers
export function useCaregivers(params?: CaregiversQueryParams) {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0 });

  const fetchCaregivers = async (queryParams?: CaregiversQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminCaregiversService.getCaregivers(queryParams || params);
      setCaregivers(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch caregivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregivers();
  }, [params?.verification_status, params?.is_available, params?.page, params?.limit]);

  const blockCaregiver = async (id: string) => {
    try {
      const result = await adminCaregiversService.blockCaregiver(id);
      await fetchCaregivers(); // Refresh list to get updated status
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to block caregiver');
    }
  };

  const unblockCaregiver = async (id: string) => {
    try {
      const result = await adminCaregiversService.unblockCaregiver(id);
      await fetchCaregivers(); // Refresh list to get updated status
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to unblock caregiver');
    }
  };

  return { caregivers, loading, error, meta, refetch: fetchCaregivers, blockCaregiver, unblockCaregiver };
}

// Hook for hospitals
export function useHospitals(params?: HospitalsQueryParams) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0 });

  const fetchHospitals = async (queryParams?: HospitalsQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminHospitalsService.getHospitals(queryParams || params);
      setHospitals(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [params?.district, params?.type, params?.page, params?.limit]);

  const createHospital = async (data: any) => {
    try {
      const newHospital = await adminHospitalsService.createHospital(data);
      setHospitals([...hospitals, newHospital]);
      return newHospital;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create hospital');
    }
  };

  const updateHospital = async (id: string, data: any) => {
    try {
      const updatedHospital = await adminHospitalsService.updateHospital(id, data);
      setHospitals(hospitals.map(h => h.id === id ? updatedHospital : h));
      return updatedHospital;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update hospital');
    }
  };

  const updateHospitalStatus = async (id: string, is_active: boolean) => {
    try {
      const updatedHospital = await adminHospitalsService.updateHospitalStatus(id, { is_active });
      setHospitals(hospitals.map(h => h.id === id ? updatedHospital : h));
      return updatedHospital;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update hospital status');
    }
  };

  return { hospitals, loading, error, meta, refetch: fetchHospitals, createHospital, updateHospital, updateHospitalStatus };
}
