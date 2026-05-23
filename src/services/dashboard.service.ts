import { api } from '../libs/api-client';
import { DashboardResponse } from '../types/dashboard';

export class DashboardService {
  static async getMe(year?: number, month?: number): Promise<DashboardResponse> {
    const params = new URLSearchParams();

    if (year) params.set('year', String(year));
    if (month) params.set('month', String(month));

    const query = params.toString();

    return api.get<DashboardResponse>(`/dashboard/me${query ? `?${query}` : ''}`);
  }
}
