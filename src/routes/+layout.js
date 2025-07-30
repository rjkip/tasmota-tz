import { locales } from 'virtual:wuchale/locales';
import { loadCatalogs } from 'wuchale/run-client';
import { loadCatalog, loadIDs } from '../locales/loader.svelte.js';

export const prerender = true;

export const load = async ({ url }) => {
  const locale = url.searchParams.get('locale') ?? 'en';
  if (!(locale in locales)) {
    return;
  }
  return {
    locale,
    catalogs: await loadCatalogs(locale, loadIDs, loadCatalog),
  };
};
