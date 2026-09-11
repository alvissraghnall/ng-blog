declare global {
  interface Window {
    __APP_CONFIG__?: {
      graphQLUrl?: string;
      graphQLStreamUrl?: string;
    };
  }
}

const win = typeof window !== 'undefined' ? window : ({} as Window);
const injected = win.__APP_CONFIG__;

export const environment = {
  production: true,
  graphQLUrl:
    injected?.graphQLUrl || 'https://ng-blog-api.onrender.com/graphql',
  graphQLStreamUrl:
    injected?.graphQLStreamUrl ||
    'https://ng-blog-api.onrender.com/graphql/stream',
};