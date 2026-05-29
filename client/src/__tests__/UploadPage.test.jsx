import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UploadPage from '../pages/UploadPage';
import { MemoryRouter } from 'react-router-dom';

// Mock the context
vi.mock('../context/NotificationContext', () => ({
  useNotifications: () => ({
    showToast: vi.fn(),
  }),
}));

// Mock API
vi.mock('../services/api', () => ({
  uploadFile: vi.fn().mockResolvedValue({ data: { success: true } }),
  notifyBulkComplete: vi.fn(),
}));

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('UploadPage Component', () => {
  it('renders upload instructions', () => {
    renderWithRouter(<UploadPage />);
    expect(screen.getByText(/Click or drag files here/i)).toBeInTheDocument();
  });

  it('handles file selection', () => {
    renderWithRouter(<UploadPage />);
    
    // Check initial state
    expect(screen.queryByText('Start Upload')).not.toBeInTheDocument();

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input') || document.querySelector('input[type="file"]');
    
    Object.defineProperty(input, 'files', {
      value: [file]
    });
    
    fireEvent.change(input);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText(/Start Upload/i)).toBeInTheDocument();
  });
});
