import { keysToCamelCase, keysToSnakeCase } from './case-converter';

describe('case-converter', () => {
  it('converts nested snake_case keys to camelCase', () => {
    expect(
      keysToCamelCase({
        first_name: 'Ada',
        role_menu: {
          menu_id: 1,
        },
        access_tokens: [{ refresh_token: 'token' }],
      }),
    ).toEqual({
      firstName: 'Ada',
      roleMenu: {
        menuId: 1,
      },
      accessTokens: [{ refreshToken: 'token' }],
    });
  });

  it('converts nested camelCase keys to snake_case', () => {
    expect(
      keysToSnakeCase({
        firstName: 'Ada',
        roleMenu: {
          menuId: 1,
        },
        accessTokens: [{ refreshToken: 'token' }],
      }),
    ).toEqual({
      first_name: 'Ada',
      role_menu: {
        menu_id: 1,
      },
      access_tokens: [{ refresh_token: 'token' }],
    });
  });
});
