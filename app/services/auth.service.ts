import { useApi } from "~/composables/util/useApi";
import type { LoginResponse, RefreshToken, RequestOtp, VerifyOtp } from "~/lib/models/Auth";

const BASE = "/api/v1/auth";

export const useAuthApi = () => {
  const api = useApi();

  return {

    requestOtp: (payload: RequestOtp) =>
      api.post<{ message: string }>(`${BASE}/otp/request`, payload),

    verifyOtp: (payload: VerifyOtp) =>
      api.post<{ message: string }>(`${BASE}/otp/verify`, payload),

    refreshToken: (payload: RefreshToken) =>
      api.post<{ message: string }>(`${BASE}/refresh`, payload),

    login: (username: string, password: string) => {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      return api.post<LoginResponse>(
        `${BASE}/login`,
        formData,
      );
    },

    logout: () => {
      const refreshToken = useCookie<string | null>("refresh_token");
      return api.post<{ message: string }>(`${BASE}/logout`, {
        refresh_token: refreshToken.value,
      });
    },
  };
};
