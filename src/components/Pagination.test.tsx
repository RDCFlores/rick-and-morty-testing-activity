// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  beforeEach(() => {
    cleanup(); 
  });

  it('debe mostrar el texto de la página actual y total correctamente', () => {
    render(<Pagination currentPage={2} totalPages={10} />);

    expect(screen.getByText('Page 2 of 10')).toBeDefined();
  });

  it('debe deshabilitar el botón Previous si estamos en la primera página', () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    const prevElement = screen.getByText(/Previous/i);
    expect(prevElement.tagName).toBe('SPAN');

    const nextLink = screen.getByText(/Next/i);
    expect(nextLink.tagName).toBe('A');
    expect(nextLink.getAttribute('href')).toBe('/?page=2');
  });

  it('debe deshabilitar el botón Next si estamos en la última página', () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    const nextElement = screen.getByText(/Next/i);
    expect(nextElement.tagName).toBe('SPAN');

    const prevLink = screen.getByText(/Previous/i);
    expect(prevLink.tagName).toBe('A');
    expect(prevLink.getAttribute('href')).toBe('/?page=4');
  });

  it('debe activar ambos botones cuando estamos en una página intermedia', () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    const prevLink = screen.getByText(/Previous/i);
    const nextLink = screen.getByText(/Next/i);

    expect(prevLink.tagName).toBe('A');
    expect(prevLink.getAttribute('href')).toBe('/?page=2');

    expect(nextLink.tagName).toBe('A');
    expect(nextLink.getAttribute('href')).toBe('/?page=4');
  });
});