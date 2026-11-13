import { test, expect } from '@playwright/test';
import { navigation, routes } from '../src/data/site';

test('external navigation links stay visible without becoming static pages', () => {
  expect(navigation.flatMap(group => group.links)).toContainEqual({
    label: 'Elections', href: 'https://elections.strukthq.com/amsul',
  });
  expect(routes.filter(route => !route.href.startsWith('/') || route.href.startsWith('//'))).toEqual([]);
});
