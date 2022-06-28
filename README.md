# Pizza Planet Server Portal

## Features
1. Login screen to accept a username (string) and password (string).
  - Use the following to return an access token:
  
  ```json
  { 
    "password": "test",
    "username": "test"
  }
  ```
  
2. User interface which allows the user to configure:
  - Crust (string)
  - Flavor (string)
  - Size (string)
  - Table_No (integer)
3. Successfully submits the pizza configuration to the /orders endpoint.
4. Display a successful confirmation to the user interface.
5. Delete function that cancels an order.
6. Ability to create more than one pizza order.
7. Create a page that pulls a list of orders you created and displays them in the user interface.
8. Search feature to allow the user to filter the returned orders.
9. Containerize the application.


### Code Features
This codebase comes with (not all used, but for future usage):
- Server side rendering setup for Mantine
- Color scheme is stored in cookie to avoid color scheme mismatch after hydration
- Storybook with color scheme toggle
- Jest with react testing library
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## npm scripts

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `export` – exports static website to `out` folder
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
