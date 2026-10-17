// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary from './error';

describe('Error Component', () => {
  const mockError = new Error('Test error message');
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    cleanup();
    
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('debe renderizar el título, el mensaje y el botón correctamente', () => {
    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(screen.getByText('Something went wrong!')).toBeDefined();
    expect(
      screen.getByText("We couldn't load the characters. Please try again later.")
    ).toBeDefined();
    expect(screen.getByRole('button', { name: /try again/i })).toBeDefined();
  });

  it('debe registrar el error en console.error al montarse', () => {
    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it('debe llamar a la función reset cuando el usuario hace clic en el botón Try again', () => {
    render(<ErrorBoundary error={mockError} reset={mockReset} />);

    const button = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});