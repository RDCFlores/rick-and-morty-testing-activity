import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCharacters, getCharacter, getEpisodes } from './api';

describe('api.ts - Servicios de Rick and Morty', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getCharacters', () => {
    it('debe retornar la lista de personajes cuando la petición es exitosa', async () => {
      const mockResponse = {
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [{ id: 1, name: 'Rick Sanchez' }],
      };

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      }));

      const data = await getCharacters(1);
      expect(data).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');
    });

    it('debe usar la página 1 por defecto si no se le pasa argumento', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ results: [] }),
      }));

      await getCharacters();
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');
    });

    it('debe lanzar un error cuando res.ok sea false', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
      }));

      await expect(getCharacters(1)).rejects.toThrow('Failed to fetch characters');
    });
  });

  describe('getCharacter', () => {
    it('debe retornar un personaje por su ID', async () => {
      const mockCharacter = { id: 1, name: 'Rick Sanchez' };

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockCharacter),
      }));

      const data = await getCharacter('1');
      expect(data).toEqual(mockCharacter);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');
    });

    it('debe lanzar un error cuando no encuentra el personaje', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
      }));

      await expect(getCharacter('999')).rejects.toThrow('Failed to fetch character details');
    });
  });

  describe('getEpisodes', () => {
    it('debe retornar un array vacío si la lista de IDs está vacía sin hacer fetch', async () => {
      const fetchSpy = vi.fn();
      vi.stubGlobal('fetch', fetchSpy);

      const result = await getEpisodes([]);
      expect(result).toEqual([]);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('debe devolver un array con episodios cuando se consultan múltiples IDs', async () => {
      const mockEpisodes = [{ id: 1, name: 'Pilot' }, { id: 2, name: 'Lawnmower Dog' }];

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockEpisodes),
      }));

      const data = await getEpisodes(['1', '2']);
      expect(data).toEqual(mockEpisodes);
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,2');
    });

    it('debe envolver en un array la respuesta cuando la API devuelve un solo objeto de episodio', async () => {
      const mockSingleEpisode = { id: 1, name: 'Pilot' };

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockSingleEpisode),
      }));

      const data = await getEpisodes(['1']);
      expect(data).toEqual([mockSingleEpisode]);
    });

    it('debe lanzar un error cuando falle la petición de episodios', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
      }));

      await expect(getEpisodes(['1'])).rejects.toThrow('Failed to fetch episodes');
    });
  });
});