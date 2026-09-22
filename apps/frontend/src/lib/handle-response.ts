export interface HandleResponseOptions {
  fallbackMessage?: string;
  rawSuccess?: boolean;
}

type ResponseBody = Awaited<ReturnType<Response["json"]>>;

export async function handleResponse<T = ResponseBody>(
  response: Response,
  options: HandleResponseOptions = {},
): Promise<T> {
  if (response.ok && options.rawSuccess) {
    return response as unknown as T;
  }

  const body = await response.text();
  let parsedBody: unknown;

  if (body.trim()) {
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = undefined;
    }
  }

  if (!response.ok) {
    const errorMessage =
      getMessage(parsedBody) ||
      body.trim() ||
      options.fallbackMessage ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  if (!body.trim()) {
    return undefined as T;
  }

  if (parsedBody !== undefined) {
    return parsedBody as T;
  }

  throw new Error("Server returned an invalid response");
}

function getMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const message = (body as { message?: unknown }).message;
  return typeof message === "string" && message.trim() ? message : undefined;
}
