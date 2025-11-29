import { apiFetch } from "./api";

export type WebhookJobInput = {
  modelImage?: string;
  modelPrompt?: string;
  apparelImage?: string;
  apparelPrompt?: string;
  scenePrompt?: string;
  negativePrompt?: string;
  numImages?: number;
  aspectRatio?: string;
  imageQuality?: string;
  transparentBg?: boolean;
  upscale?: boolean;
  selectedScene?: any;
  selectedLighting?: any;
  selectedBackground?: any;
  selectedProps?: any[];
};

export type WebhookJobResponse = {
  success: boolean;
  jobId: string;
  webhookPayload: {
    jobId: string;
    userId?: string;
    input: WebhookJobInput;
    output: {
      imageUrls: string[];
      status: "pending" | "processing" | "completed" | "failed";
      error?: string;
    };
    metadata?: {
      createdAt: string;
      updatedAt?: string;
      processingTime?: number;
    };
  };
  message: string;
  webhookUrl: string;
};

export type WebhookJobStatus = {
  jobId: string;
  status: string;
  imageUrls: string[];
  createdAt: string;
  completedAt?: string;
};

/**
 * Create a webhook job for image generation
 */
export async function createWebhookJob(input: WebhookJobInput): Promise<WebhookJobResponse> {
  const response = await apiFetch("/api/webhook/jobs", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to create webhook job" }));
    throw new Error(error.message || "Failed to create webhook job");
  }

  return response.json();
}

/**
 * Get webhook job status
 */
export async function getWebhookJobStatus(jobId: string): Promise<WebhookJobStatus> {
  const response = await apiFetch(`/api/webhook/jobs/${jobId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to get job status" }));
    throw new Error(error.message || "Failed to get job status");
  }

  return response.json();
}

/**
 * Poll webhook job status until completion
 */
export async function pollWebhookJobStatus(
  jobId: string,
  onUpdate?: (status: WebhookJobStatus) => void,
  maxAttempts: number = 60,
  interval: number = 2000
): Promise<WebhookJobStatus> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const status = await getWebhookJobStatus(jobId);
      
      if (onUpdate) {
        onUpdate(status);
      }

      if (status.status === "completed" || status.status === "failed") {
        return status;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
      attempts++;
    } catch (error) {
      console.error("Error polling job status:", error);
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  throw new Error("Job polling timeout");
}

