import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotificationBell from '../components/NotificationBell';

// Mock the context
vi.mock('../context/NotificationContext', () => ({
  useNotifications: () => ({
    unreadCount: 3,
    markAllRead: vi.fn(),
    notifications: [],
  }),
}));

describe('NotificationBell Component', () => {
  it('renders unread count badge correctly', () => {
    render(<NotificationBell />);
    
    // Check if badge with count 3 exists
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<NotificationBell />);
    
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument();
    
    // Click the bell button
    const button = screen.getByRole('button', { name: '' }); // Bell has no aria-label, but it's the main button
    fireEvent.click(button);
    
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Mark all read')).toBeInTheDocument();
  });
});
