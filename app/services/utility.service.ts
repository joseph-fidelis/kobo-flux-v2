import { useApi } from "~/composables/util/useApi";
import type { ApiResponse, HealthResponse, TaskResponse } from "~/lib/models/util";

export const useUtilityApi = () => {
    const api = useApi();

    return {

        getTaskStatus: (taskId: string) =>
            api.get<ApiResponse<TaskResponse>>(`/api/v1/utility/task/${taskId}`),

        getServerHealth: () =>
            api.get<HealthResponse>(`/health`),
    };
};
