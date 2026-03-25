import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Базовые рекомендованные правила JS
  js.configs.recommended,

  // TypeScript: строгие правила с проверкой типов
  ...tseslint.configs.recommended,

  // Отключает правила ESLint, конфликтующие с Prettier
  prettier,

  // Игнорируемые директории
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/coverage/**',
    ],
  },

  // Общие правила для всех .ts файлов
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
