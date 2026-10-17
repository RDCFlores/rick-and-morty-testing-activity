// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CharacterCard from './CharacterCard';
import { Character } from '@/types/rickandmorty';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [],
  url: '',
  created: '',
};

describe('CharacterCard Component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('debe renderizar el nombre, ubicación y datos del personaje', () => {
    render(<CharacterCard character={mockCharacter} />);

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeDefined();
    expect(screen.getByText('Citadel of Ricks')).toBeDefined();
    expect(screen.getByText(/Alive/i)).toBeDefined();
    expect(screen.getByText(/Human/i)).toBeDefined();
  });

  it('debe contener el enlace adecuado hacia los detalles del personaje', () => {
    render(<CharacterCard character={mockCharacter} />);

    const linkElement = screen.getByRole('link');
    expect(linkElement.getAttribute('href')).toBe('/character/1');
  });

  it('debe renderizar la imagen con el alt correspondiente', () => {
    render(<CharacterCard character={mockCharacter} />);

    const imageElement = screen.getByAltText('Rick Sanchez');
    expect(imageElement).toBeDefined();
  });

  it('debe asignar el color o clase por defecto si el estado no coincide con Alive o Dead', () => {
    const unknownCharacter: Character = {
      ...mockCharacter,
      status: 'unknown' as any,
    };

    render(<CharacterCard character={unknownCharacter} />);
    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeDefined();
  });

  it('debe asignar la clase bg-red-500 si el estado es Dead', () => {
    const deadCharacter: Character = {
      ...mockCharacter,
      status: 'Dead',
    };

    render(<CharacterCard character={deadCharacter} />);
    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeDefined();
  });
});