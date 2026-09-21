const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:6001";

let refreshPromise: Promise<boolean> | null = null;

const isPublicRequest = (url: string) =>
  url.includes("/auth/") ||
  url.includes("/verify") ||
  url.includes("/check-username") ||
  url === "/";

const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${AUTH_API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const redirectToLogin = () => {
  if (typeof window === "undefined" || window.location.pathname === "/login") {
    return;
  }

  void fetch(`${AUTH_API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).finally(() => {
    window.location.assign("/login");
  });
};

export const fetchapi = async (
  url: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status !== 401 || isRetry || isPublicRequest(url)) {
    return response;
  }

  const refreshed = await refreshSession();
  if (refreshed) {
    return fetchapi(url, options, true);
  }

  redirectToLogin();
  return response;
};
