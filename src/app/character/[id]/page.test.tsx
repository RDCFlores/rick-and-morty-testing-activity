// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CharacterPage from './page';
import * as api from '../../../lib/api';

vi.mock('@/lib/api', () => ({
  getCharacter: vi.fn(),
  getEpisodes: vi.fn(),
}));

describe('CharacterPage Component', () => {
  const mockCharacter = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: 'Genius',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['https://rickandmortyapi.com/api/episode/1'],
    created: '2017-11-04T18:48:46.250Z',
  };

  const mockEpisodes = [
    { id: 1, name: 'Pilot', episode: 'S01E01', air_date: 'December 2, 2013' },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('debe renderizar correctamente los detalles del personaje y sus episodios', async () => {
    vi.mocked(api.getCharacter).mockResolvedValue(mockCharacter as any);
    vi.mocked(api.getEpisodes).mockResolvedValue(mockEpisodes as any);

    const params = Promise.resolve({ id: '1' });
    const jsx = await CharacterPage({ params });
    render(jsx);

    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeDefined();
    expect(screen.getByText(/Alive/i)).toBeDefined();
    expect(screen.getByText(/Human/i)).toBeDefined();
    expect(screen.getByText('Male')).toBeDefined();
    expect(screen.getByText('Genius')).toBeDefined();
    expect(screen.getByText('Earth (C-137)')).toBeDefined();
    expect(screen.getByText('Citadel of Ricks')).toBeDefined();
    expect(screen.getByText('Episodes (1)')).toBeDefined();
    expect(screen.getByText('S01E01')).toBeDefined();
  });

  it('debe mostrar "Unknown" si el personaje no tiene un tipo definido', async () => {
    const characterWithoutType = { ...mockCharacter, type: '' };
    vi.mocked(api.getCharacter).mockResolvedValue(characterWithoutType as any);
    vi.mocked(api.getEpisodes).mockResolvedValue(mockEpisodes as any);

    const params = Promise.resolve({ id: '1' });
    const jsx = await CharacterPage({ params });
    render(jsx);

    expect(screen.getByText('Unknown')).toBeDefined();
  });
  it('debe asignar el color adecuado si el personaje está muerto', async () => {
    const deadCharacter = { ...mockCharacter, status: 'Dead' };
    vi.mocked(api.getCharacter).mockResolvedValue(deadCharacter as any);
    vi.mocked(api.getEpisodes).mockResolvedValue(mockEpisodes as any);

    const params = Promise.resolve({ id: '1' });
    const jsx = await CharacterPage({ params });
    render(jsx);

    expect(screen.getByText(/Dead/i)).toBeDefined();
  });
});