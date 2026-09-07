import { ResumeParseResponse } from '../types';

function getApiBaseUrl(): string {
  let url = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
}

const API_BASE_URL = getApiBaseUrl();

export async function parseResumeFile(file: File): Promise<ResumeParseResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', file.name);

  try {
    const response = await fetch(`${API_BASE_URL}/resumes/parse-and-extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to parse resume' }));
      throw new Error(errorData.detail || `Server returned error ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('API Error parsing resume file:', err);
    throw err;
  }
}

export async function parseResumeText(rawText: string, filename: string = 'pasted_resume.txt'): Promise<ResumeParseResponse> {
  const formData = new FormData();
  formData.append('raw_text', rawText);
  formData.append('filename', filename);

  try {
    const response = await fetch(`${API_BASE_URL}/resumes/parse-and-extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to parse resume' }));
      throw new Error(errorData.detail || `Server returned error ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error('API Error parsing resume text:', err);
    throw err;
  }
}

export async function checkBackendHealth(): Promise<{ status: string; groq_configured?: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
      method: 'GET',
    });
    if (response.ok) {
      return await response.json();
    }
    return { status: 'offline' };
  } catch {
    return { status: 'offline' };
  }
}
