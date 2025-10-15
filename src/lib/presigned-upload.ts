interface PresignedUploadOptions {
  uploadUrl: string;
  file: Blob;
  contentType?: string;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

/**
 * Uploads a file to a pre-signed S3 URL using a PUT request.
 * Throws an error when the upload fails so the caller can handle UI state.
 */
export const uploadFileToPresignedUrl = async (
  options: PresignedUploadOptions
) => {
  const { uploadUrl, file, contentType, signal, headers } = options;

  const requestHeaders = new Headers(headers);
  const resolvedContentType =
    contentType || (file instanceof File ? file.type : undefined);

  if (resolvedContentType) {
    requestHeaders.set("Content-Type", resolvedContentType);
  }

  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: requestHeaders,
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload file (status ${response.status} ${response.statusText})`
    );
  }
};

export type { PresignedUploadOptions };
