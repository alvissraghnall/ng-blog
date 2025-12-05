export type GraphQLOmitType<T, K extends keyof T = never> = Omit<T, 'updatedAt' | K>;
