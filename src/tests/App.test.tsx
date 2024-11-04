import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loads shop data on mount', async () => {
    const mockShopData = {
      data: {
        featured: { entries: [] },
        daily: { entries: [] }
      }
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockShopData)
    });

    render(<App />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/shop/br'),
        expect.any(Object)
      );
    });
  });
}); 