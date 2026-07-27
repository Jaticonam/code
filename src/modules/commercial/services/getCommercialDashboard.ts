import {
  ExternalHttpRequestError,
  requestJson,
} from "@/shared/infrastructure/http";

export async function getCommercialDashboard() {
  const result =
    await requestJson<unknown>(
      "/api/dashboard/commercial.json",
      {
        source:
          "Commercial Dashboard",
      },
    );

  if (result.ok === false) {
    throw new ExternalHttpRequestError(
      result.error,
    );
  }

  return result.data;
}
