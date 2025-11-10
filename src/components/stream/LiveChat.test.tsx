import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import LiveChat from './LiveChat';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('LiveChat', () => {
  it('renders the chat interface', () => {
    renderWithRouter(<LiveChat />);
    
    // Check if chat header elements are present
    expect(screen.getByText(/chatting/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/send a message/i)).toBeInTheDocument();
    
    // Check if initial messages are rendered
    expect(screen.getByText('Welcome everyone to the stream! 🔥')).toBeInTheDocument();
  });

  it('allows sending messages', async () => {
    renderWithRouter(<LiveChat />);
    
    const input = screen.getByPlaceholderText(/send a message/i);
    const testMessage = 'Hello, chat!';
    
    fireEvent.change(input, { target: { value: testMessage } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText(testMessage)).toBeInTheDocument();
    });
  });

  it('toggles emoji picker', () => {
    renderWithRouter(<LiveChat />);
    
    const emojiButton = screen.getByRole('button', { name: /emoji/i });
    fireEvent.click(emojiButton);
    
    // Check if emoji picker is shown
    expect(screen.getByText('😀')).toBeInTheDocument();
    
    // Click again to close
    fireEvent.click(emojiButton);
    expect(screen.queryByText('😀')).not.toBeInTheDocument();
  });

  it('shows settings panel', () => {
    renderWithRouter(<LiveChat />);
    
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    expect(screen.getByText('Chat Settings')).toBeInTheDocument();
    expect(screen.getByText('Chat Mode')).toBeInTheDocument();
    expect(screen.getByText('Message Delay')).toBeInTheDocument();
  });

  it('shows notifications for user actions', () => {
    renderWithRouter(<LiveChat />);
    
    // Check if notifications are rendered
    expect(screen.getByText(/is live now/i)).toBeInTheDocument();
    expect(screen.getByText(/mentioned you/i)).toBeInTheDocument();
    expect(screen.getByText(/followed you/i)).toBeInTheDocument();
  });

  it('prevents sending empty messages', () => {
    renderWithRouter(<LiveChat />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
    
    const input = screen.getByPlaceholderText(/send a message/i);
    fireEvent.change(input, { target: { value: 'test' } });
    expect(sendButton).not.toBeDisabled();
  });
});