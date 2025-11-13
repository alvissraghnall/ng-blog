
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../server/src/schema.gql",
  //documents: "./src/**/*.ts",
  generates: {
    "./src/gql-types.ts": {
      plugins: ['typescript', 'typescript-resolvers', 'typescript-operations', "typescript-apollo-angular"]
    }
  }
};

export default config;
