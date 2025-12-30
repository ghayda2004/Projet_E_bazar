import { API_BASE_URL } from './config';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Submit contact form
export const submitContact = async (data: ContactForm): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit contact form');
  }

  return response.json();
};
