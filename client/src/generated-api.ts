

import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { gql } from 'graphql-tag'

/* tslint:disable */
/* eslint-disable */

const VariableName = ' $1fcbcbff-3e78-462f-b45c-668a3e09bfd8'

const ScalarBrandingField = ' $1fcbcbff-3e78-462f-b45c-668a3e09bfd9'

type CustomScalar<T> = { [ScalarBrandingField]: T }

class Variable<T, Name extends string> {
  private [VariableName]: Name
  // @ts-ignore
  private _type?: T

  // @ts-ignore
  constructor(name: Name, private readonly isRequired?: boolean) {
    this[VariableName] = name
  }
}

type ArrayInput<I> = [I] extends [$Atomic] ? never : ReadonlyArray<VariabledInput<I>>

type AllowedInlineScalars<S> = S extends string | number ? S : never

export type UnwrapCustomScalars<T> = T extends CustomScalar<infer S>
  ? S
  : T extends ReadonlyArray<infer I>
  ? ReadonlyArray<UnwrapCustomScalars<I>>
  : T extends Record<string, any>
  ? { [K in keyof T]: UnwrapCustomScalars<T[K]> }
  : T

type VariableWithoutScalars<T, Str extends string> = Variable<UnwrapCustomScalars<T>, Str>

// the array wrapper prevents distributive conditional types
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type VariabledInput<T> = [T] extends [CustomScalar<infer S> | null | undefined]
  ? // scalars only support variable input
    Variable<S | null | undefined, any> | AllowedInlineScalars<S> | null | undefined
  : [T] extends [CustomScalar<infer S>]
  ? Variable<S, any> | AllowedInlineScalars<S>
  : [T] extends [$Atomic]
  ? Variable<T, any> | T
  : T extends ReadonlyArray<infer I>
  ? VariableWithoutScalars<T, any> | T | ArrayInput<I>
  : T extends Record<string, any> | null | undefined
  ?
      | VariableWithoutScalars<T | null | undefined, any>
      | null
      | undefined
      | { [K in keyof T]: VariabledInput<T[K]> }
      | T
  : T extends Record<string, any>
  ? VariableWithoutScalars<T, any> | { [K in keyof T]: VariabledInput<T[K]> } | T
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

/**
 * Creates a new query variable
 *
 * @param name The variable name
 */
export const $ = <Type, Name extends string>(name: Name): Variable<Type, Name> => {
  return new Variable(name)
}

/**
 * Creates a new query variable. A value will be required even if the input is optional
 *
 * @param name The variable name
 */
export const $$ = <Type, Name extends string>(name: Name): Variable<NonNullable<Type>, Name> => {
  return new Variable(name, true)
}

type SelectOptions = {
  argTypes?: { [key: string]: string }
  args?: { [key: string]: any }
  selection?: Selection<any>
}

class $Field<Name extends string, Type, Vars = {}> {
  public kind: 'field' = 'field'
  public type!: Type

  public vars!: Vars
  public alias: string | null = null

  constructor(public name: Name, public options: SelectOptions) {}

  as<Rename extends string>(alias: Rename): $Field<Rename, Type, Vars> {
    const f = new $Field(this.name, this.options)
    f.alias = alias
    return f as any
  }
}

class $Base<Name extends string> {
  // @ts-ignore
  constructor(private $$name: Name) {}

  protected $_select<Key extends string>(
    name: Key,
    options: SelectOptions = {}
  ): $Field<Key, any, any> {
    return new $Field(name, options)
  }
}

// @ts-ignore
class $Union<T, Name extends String> extends $Base<Name> {
  // @ts-ignore
  private $$type!: T
  // @ts-ignore
  private $$name!: Name

  constructor(private selectorClasses: { [K in keyof T]: { new (): T[K] } }, $$name: Name) {
    super($$name)
  }

  $on<Type extends keyof T, Sel extends Selection<T[Type]>>(
    alternative: Type,
    selectorFn: (selector: T[Type]) => [...Sel]
  ): $UnionSelection<GetOutput<Sel>, GetVariables<Sel>> {
    const selection = selectorFn(new this.selectorClasses[alternative]())

    return new $UnionSelection(alternative as string, selection)
  }
}

// @ts-ignore
class $Interface<T, Name extends string> extends $Base<Name> {
  // @ts-ignore
  private $$type!: T
  // @ts-ignore
  private $$name!: Name

  constructor(private selectorClasses: { [K in keyof T]: { new (): T[K] } }, $$name: Name) {
    super($$name)
  }
  $on<Type extends keyof T, Sel extends Selection<T[Type]>>(
    alternative: Type,
    selectorFn: (selector: T[Type]) => [...Sel]
  ): $UnionSelection<GetOutput<Sel>, GetVariables<Sel>> {
    const selection = selectorFn(new this.selectorClasses[alternative]())

    return new $UnionSelection(alternative as string, selection)
  }
}

class $UnionSelection<T, Vars> {
  public kind: 'union' = 'union'
  // @ts-ignore
  private vars!: Vars
  constructor(public alternativeName: string, public alternativeSelection: Selection<T>) {}
}

type Selection<_any> = ReadonlyArray<$Field<any, any, any> | $UnionSelection<any, any>>

type NeverNever<T> = [T] extends [never] ? {} : T

type Simplify<T> = { [K in keyof T]: T[K] } & {}

type LeafType<T> = T extends CustomScalar<infer S> ? S : T

export type GetOutput<X extends Selection<any>> = Simplify<
  UnionToIntersection<
    {
      [I in keyof X]: X[I] extends $Field<infer Name, infer Type, any>
        ? { [K in Name]: LeafType<Type> }
        : never
    }[keyof X & number]
  > &
    NeverNever<
      {
        [I in keyof X]: X[I] extends $UnionSelection<infer Type, any> ? LeafType<Type> : never
      }[keyof X & number]
    >
>

type PossiblyOptionalVar<VName extends string, VType> = null extends VType
  ? { [key in VName]?: VType }
  : { [key in VName]: VType }

type ExtractInputVariables<Inputs> = Inputs extends Variable<infer VType, infer VName>
  ? PossiblyOptionalVar<VName, VType>
  : // Avoid generating an index signature for possibly undefined or null inputs.
  // The compiler incorrectly infers null or undefined, and we must force access the Inputs
  // type to convince the compiler its "never", while still retaining {} as the result
  // for null and undefined cases
  // Works around issue 79
  Inputs extends null | undefined
  ? { [K in keyof Inputs]: Inputs[K] }
  : Inputs extends $Atomic
  ? {}
  : Inputs extends any[] | readonly any[]
  ? UnionToIntersection<
      { [K in keyof Inputs]: ExtractInputVariables<Inputs[K]> }[keyof Inputs & number]
    >
  : UnionToIntersection<{ [K in keyof Inputs]: ExtractInputVariables<Inputs[K]> }[keyof Inputs]>

export type GetVariables<Sel extends Selection<any>, ExtraVars = {}> = UnionToIntersection<
  {
    [I in keyof Sel]: Sel[I] extends $Field<any, any, infer Vars>
      ? Vars
      : Sel[I] extends $UnionSelection<any, infer Vars>
      ? Vars
      : never
  }[keyof Sel & number]
> &
  ExtractInputVariables<ExtraVars>

type ArgVarType = {
  type: string
  isRequired: boolean
  array: {
    isRequired: boolean
  } | null
}

const arrRegex = /\[(.*?)\]/

/**
 * Converts graphql string type to `ArgVarType`
 * @param input
 * @returns
 */
function getArgVarType(input: string): ArgVarType {
  const array = input.includes('[')
    ? {
        isRequired: input.endsWith('!'),
      }
    : null

  const type = array ? arrRegex.exec(input)![1]! : input
  const isRequired = type.endsWith('!')

  return {
    array,
    isRequired: isRequired,
    type: type.replace('!', ''),
  }
}

function fieldToQuery(prefix: string, field: $Field<any, any, any>) {
  const variables = new Map<string, { variable: Variable<any, any>; type: ArgVarType }>()

  function stringifyArgs(
    args: any,
    argTypes: { [key: string]: string },
    argVarType?: ArgVarType
  ): string {
    switch (typeof args) {
      case 'string':
        const cleanType = argVarType!.type
        if ($Enums.has(cleanType!)) return args
        else return JSON.stringify(args)
      case 'number':
      case 'boolean':
        return JSON.stringify(args)
      default:
        if (args == null) return 'null'
        if (VariableName in (args as any)) {
          if (!argVarType)
            throw new globalThis.Error('Cannot use variabe as sole unnamed field argument')
          const variable = args as Variable<any, any>
          const argVarName = variable[VariableName]
          variables.set(argVarName, { type: argVarType, variable: variable })
          return '$' + argVarName
        }
        if (Array.isArray(args))
          return '[' + args.map(arg => stringifyArgs(arg, argTypes, argVarType)).join(',') + ']'
        const wrapped = (content: string) => (argVarType ? '{' + content + '}' : content)
        return wrapped(
          Array.from(Object.entries(args))
            .map(([key, val]) => {
              let argTypeForKey = argTypes[key]
              if (!argTypeForKey) {
                throw new globalThis.Error(`Argument type for ${key} not found`)
              }
              const cleanType = argTypeForKey.replace('[', '').replace(']', '').replace(/!/g, '')
              return (
                key +
                ':' +
                stringifyArgs(val, $InputTypes[cleanType]!, getArgVarType(argTypeForKey))
              )
            })
            .join(',')
        )
    }
  }

  function extractTextAndVars(field: $Field<any, any, any> | $UnionSelection<any, any>) {
    if (field.kind === 'field') {
      let retVal = field.name
      if (field.alias) retVal = field.alias + ':' + retVal
      const args = field.options.args,
        argTypes = field.options.argTypes
      if (args && Object.keys(args).length > 0) {
        retVal += '(' + stringifyArgs(args, argTypes!) + ')'
      }
      let sel = field.options.selection
      if (sel) {
        retVal += '{'
        for (let subField of sel) {
          retVal += extractTextAndVars(subField)
        }
        retVal += '}'
      }
      return retVal + ' '
    } else if (field.kind === 'union') {
      let retVal = '... on ' + field.alternativeName + ' {'
      for (let subField of field.alternativeSelection) {
        retVal += extractTextAndVars(subField)
      }
      retVal += '}'

      return retVal + ' '
    } else {
      throw new globalThis.Error('Uknown field kind')
    }
  }

  const queryRaw = extractTextAndVars(field)!

  const queryBody = queryRaw.substring(queryRaw.indexOf('{'))

  const varList = Array.from(variables.entries())
  let ret = prefix
  if (varList.length) {
    ret +=
      '(' +
      varList
        .map(([name, { type: kind, variable }]) => {
          let type = kind.array ? '[' : ''
          type += kind.type
          if (kind.isRequired) type += '!'
          if (kind.array) type += kind.array.isRequired ? ']!' : ']'

          if (!type.endsWith('!') && (variable as any).isRequired === true) {
            type += '!'
          }

          return '$' + name + ':' + type
        })
        .join(',') +
      ')'
  }
  ret += queryBody

  return ret
}

export type OutputTypeOf<T> = T extends $Interface<infer Subtypes, any>
  ? { [K in keyof Subtypes]: OutputTypeOf<Subtypes[K]> }[keyof Subtypes]
  : T extends $Union<infer Subtypes, any>
  ? { [K in keyof Subtypes]: OutputTypeOf<Subtypes[K]> }[keyof Subtypes]
  : T extends $Base<any>
  ? { [K in keyof T]?: OutputTypeOf<T[K]> }
  : [T] extends [$Field<any, infer FieldType, any>]
  ? FieldType
  : [T] extends [(selFn: (arg: infer Inner) => any) => any]
  ? OutputTypeOf<Inner>
  : [T] extends [(args: any, selFn: (arg: infer Inner) => any) => any]
  ? OutputTypeOf<Inner>
  : never

export type QueryOutputType<T extends TypedDocumentNode<any>> = T extends TypedDocumentNode<
  infer Out
>
  ? Out
  : never

export type QueryInputType<T extends TypedDocumentNode<any>> = T extends TypedDocumentNode<
  any,
  infer In
>
  ? In
  : never

export function fragment<T, Sel extends Selection<T>>(
  GQLType: { new (): T },
  selectFn: (selector: T) => [...Sel]
) {
  return selectFn(new GQLType())
}

type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
  ? R
  : never

// TS4.0+
type Push<T extends any[], V> = [...T, V]

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
  ? []
  : Push<TuplifyUnion<Exclude<T, L>>, L>

type AllFieldProperties<I> = {
  [K in keyof I]: I[K] extends $Field<infer Name, infer Type, any> ? $Field<Name, Type, any> : never
}

type ValueOf<T> = T[keyof T]

export type AllFields<T> = TuplifyUnion<ValueOf<AllFieldProperties<T>>>

export function all<I extends $Base<any>>(instance: I) {
  const prototype = Object.getPrototypeOf(instance)
  const allFields = Object.getOwnPropertyNames(prototype)
    .map(k => prototype[k])
    .filter(o => o?.kind === 'field')
    .map(o => o?.name) as (keyof typeof instance)[]
  return allFields.map(fieldName => instance?.[fieldName]) as any as AllFields<I>
}

// We use a dummy conditional type that involves GenericType to defer the compiler's inference of
// any possible variables nested in this type. This addresses a problem where variables are
// inferred with type unknown
// @ts-ignore
type ExactArgNames<GenericType, Constraint> = GenericType extends never
  ? never
  : [Constraint] extends [$Atomic | CustomScalar<any>]
  ? GenericType
  : Constraint extends ReadonlyArray<infer InnerConstraint>
  ? GenericType extends ReadonlyArray<infer Inner>
    ? ReadonlyArray<ExactArgNames<Inner, InnerConstraint>>
    : GenericType
  : GenericType & {
      [Key in keyof GenericType]: Key extends keyof Constraint
        ? ExactArgNames<GenericType[Key], Constraint[Key]>
        : never
    }


export type NameOf<T> = 
  T extends $Interface<any, infer Name>
  ? Name
  : T extends $Union<any, infer Name>
  ? Name
  : T extends $Base<infer Name>
  ? Name
  : never
type $Atomic = Category | EntityOwnsLike | number | string | boolean | null | undefined

let $Enums = new Set<string>(["Category","EntityOwnsLike"])


  
export enum Category {
  
  CINEMA = "CINEMA",

  CUISINE = "CUISINE",

  DIY = "DIY",

  FASHION = "FASHION",

  LIFESTYLE = "LIFESTYLE",

  TECHNOLOGY = "TECHNOLOGY",

  TRAVEL = "TRAVEL"
}
  


export class Comment extends $Base<"Comment"> {
  constructor() {
    super("Comment")
  }

  
      
/**
 * Author of blog comment
 */
      author<Sel extends Selection<User>>(selectorFn: (s: User) => [...Sel]):$Field<"author", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new User)
      };
      return this.$_select("author", options as any) as any
    }
  

      
/**
 * Date Entity was created.
 */
      get createdAt(): $Field<"createdAt", DateTime>  {
       return this.$_select("createdAt") as any
      }

      
/**
 * Comment ID
 */
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
      get likeCount(): $Field<"likeCount", number>  {
       return this.$_select("likeCount") as any
      }

      
/**
 * Post that was commented on
 */
      post<Sel extends Selection<Post>>(selectorFn: (s: Post) => [...Sel]):$Field<"post", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Post)
      };
      return this.$_select("post", options as any) as any
    }
  

      
      get text(): $Field<"text", string>  {
       return this.$_select("text") as any
      }

      
/**
 * Date Entity was last updated.
 */
      get updatedAt(): $Field<"updatedAt", DateTime>  {
       return this.$_select("updatedAt") as any
      }
}


export type CreateCommentInput = {
  postId: number,
text: string
}
    


export type CreateLikeInput = {
  commentId?: number | null,
postId?: number | null
}
    


export type CreatePostInput = {
  category: Category,
content: string,
desc: string,
image: string,
tags?: Readonly<Array<string>> | null,
title: string
}
    


export type CreateUserInput = {
  avatar?: string | null,
confirmPassword: string,
email: string,
password: string,
username: string
}
    


/**
 * A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
 */
export type DateTime = string


  
export enum EntityOwnsLike {
  
  COMMENT = "COMMENT",

  POST = "POST"
}
  


export class Like extends $Base<"Like"> {
  constructor() {
    super("Like")
  }

  
      
/**
 * Comment that was liked
 */
      comment<Sel extends Selection<Comment>>(selectorFn: (s: Comment) => [...Sel]):$Field<"comment", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Comment)
      };
      return this.$_select("comment", options as any) as any
    }
  

      
/**
 * Date Entity was created.
 */
      get createdAt(): $Field<"createdAt", DateTime>  {
       return this.$_select("createdAt") as any
      }

      
/**
 * Likes Collection ID
 */
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
/**
 * User who liked post.
 */
      owner<Sel extends Selection<User>>(selectorFn: (s: User) => [...Sel]):$Field<"owner", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new User)
      };
      return this.$_select("owner", options as any) as any
    }
  

      
/**
 * Post that was liked
 */
      post<Sel extends Selection<Post>>(selectorFn: (s: Post) => [...Sel]):$Field<"post", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Post)
      };
      return this.$_select("post", options as any) as any
    }
  

      
/**
 * Date Entity was last updated.
 */
      get updatedAt(): $Field<"updatedAt", DateTime>  {
       return this.$_select("updatedAt") as any
      }
}


export class LoginResponse extends $Base<"LoginResponse"> {
  constructor() {
    super("LoginResponse")
  }

  
      
      get access_token(): $Field<"access_token", string>  {
       return this.$_select("access_token") as any
      }

      
      user<Sel extends Selection<User>>(selectorFn: (s: User) => [...Sel]):$Field<"user", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new User)
      };
      return this.$_select("user", options as any) as any
    }
  
}


export type LoginUserInput = {
  password: string,
username: string
}
    


export class Mutation extends $Base<"Mutation"> {
  constructor() {
    super("Mutation")
  }

  
      
      createComment<Args extends VariabledInput<{
        createCommentInput: CreateCommentInput,
      }>,Sel extends Selection<Comment>>(args: ExactArgNames<Args, {
        createCommentInput: CreateCommentInput,
      }>, selectorFn: (s: Comment) => [...Sel]):$Field<"createComment", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              createCommentInput: "CreateCommentInput!"
            },
        args,

        selection: selectorFn(new Comment)
      };
      return this.$_select("createComment", options as any) as any
    }
  

      
      createPost<Args extends VariabledInput<{
        createPostInput: CreatePostInput,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        createPostInput: CreatePostInput,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"createPost", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              createPostInput: "CreatePostInput!"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("createPost", options as any) as any
    }
  

      
      followUser<Args extends VariabledInput<{
        userToBeFollowedId: string,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        userToBeFollowedId: string,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"followUser", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              userToBeFollowedId: "String!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("followUser", options as any) as any
    }
  

      
      getOAuthUrl<Args extends VariabledInput<{
        provider: string,
      }>>(args: ExactArgNames<Args, {
        provider: string,
      }>):$Field<"getOAuthUrl", string , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              provider: "String!"
            },
        args,

        
      };
      return this.$_select("getOAuthUrl", options as any) as any
    }
  

      
      login<Args extends VariabledInput<{
        loginUserInput: LoginUserInput,
      }>,Sel extends Selection<LoginResponse>>(args: ExactArgNames<Args, {
        loginUserInput: LoginUserInput,
      }>, selectorFn: (s: LoginResponse) => [...Sel]):$Field<"login", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              loginUserInput: "LoginUserInput!"
            },
        args,

        selection: selectorFn(new LoginResponse)
      };
      return this.$_select("login", options as any) as any
    }
  

      
      get markAllNotificationsAsRead(): $Field<"markAllNotificationsAsRead", boolean>  {
       return this.$_select("markAllNotificationsAsRead") as any
      }

      
      markNotificationAsRead<Args extends VariabledInput<{
        id: string,
      }>,Sel extends Selection<Notification>>(args: ExactArgNames<Args, {
        id: string,
      }>, selectorFn: (s: Notification) => [...Sel]):$Field<"markNotificationAsRead", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "String!"
            },
        args,

        selection: selectorFn(new Notification)
      };
      return this.$_select("markNotificationAsRead", options as any) as any
    }
  

      
      oauthLogin<Args extends VariabledInput<{
        oauthInput: OAuthInput,
      }>,Sel extends Selection<LoginResponse>>(args: ExactArgNames<Args, {
        oauthInput: OAuthInput,
      }>, selectorFn: (s: LoginResponse) => [...Sel]):$Field<"oauthLogin", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              oauthInput: "OAuthInput!"
            },
        args,

        selection: selectorFn(new LoginResponse)
      };
      return this.$_select("oauthLogin", options as any) as any
    }
  

      
      removeComment<Args extends VariabledInput<{
        id: number,
      }>,Sel extends Selection<Comment>>(args: ExactArgNames<Args, {
        id: number,
      }>, selectorFn: (s: Comment) => [...Sel]):$Field<"removeComment", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "Int!"
            },
        args,

        selection: selectorFn(new Comment)
      };
      return this.$_select("removeComment", options as any) as any
    }
  

      
      removeLike<Args extends VariabledInput<{
        id: number,
      }>,Sel extends Selection<Like>>(args: ExactArgNames<Args, {
        id: number,
      }>, selectorFn: (s: Like) => [...Sel]):$Field<"removeLike", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "Int!"
            },
        args,

        selection: selectorFn(new Like)
      };
      return this.$_select("removeLike", options as any) as any
    }
  

      
      removePost<Args extends VariabledInput<{
        id: number,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        id: number,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"removePost", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "Int!"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("removePost", options as any) as any
    }
  

      
      removeUser<Args extends VariabledInput<{
        id: string,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        id: string,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"removeUser", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "String!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("removeUser", options as any) as any
    }
  

      
      signup<Args extends VariabledInput<{
        createUserInput: CreateUserInput,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        createUserInput: CreateUserInput,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"signup", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              createUserInput: "CreateUserInput!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("signup", options as any) as any
    }
  

      
      toggleLike<Args extends VariabledInput<{
        createLikeInput: CreateLikeInput,
      }>,Sel extends Selection<Like>>(args: ExactArgNames<Args, {
        createLikeInput: CreateLikeInput,
      }>, selectorFn: (s: Like) => [...Sel]):$Field<"toggleLike", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              createLikeInput: "CreateLikeInput!"
            },
        args,

        selection: selectorFn(new Like)
      };
      return this.$_select("toggleLike", options as any) as any
    }
  

      
      trackPostView<Args extends VariabledInput<{
        slug: string,
      }>>(args: ExactArgNames<Args, {
        slug: string,
      }>):$Field<"trackPostView", boolean , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              slug: "String!"
            },
        args,

        
      };
      return this.$_select("trackPostView", options as any) as any
    }
  

      
      unFollowUser<Args extends VariabledInput<{
        userToBeUnfollowedId: string,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        userToBeUnfollowedId: string,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"unFollowUser", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              userToBeUnfollowedId: "String!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("unFollowUser", options as any) as any
    }
  

      
      updateComment<Args extends VariabledInput<{
        updateCommentInput: UpdateCommentInput,
      }>,Sel extends Selection<Comment>>(args: ExactArgNames<Args, {
        updateCommentInput: UpdateCommentInput,
      }>, selectorFn: (s: Comment) => [...Sel]):$Field<"updateComment", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              updateCommentInput: "UpdateCommentInput!"
            },
        args,

        selection: selectorFn(new Comment)
      };
      return this.$_select("updateComment", options as any) as any
    }
  

      
      updatePost<Args extends VariabledInput<{
        updatePostInput: UpdatePostInput,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        updatePostInput: UpdatePostInput,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"updatePost", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              updatePostInput: "UpdatePostInput!"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("updatePost", options as any) as any
    }
  

      
      updateUser<Args extends VariabledInput<{
        updateUserInput: UpdateUserInput,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        updateUserInput: UpdateUserInput,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"updateUser", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              updateUserInput: "UpdateUserInput!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("updateUser", options as any) as any
    }
  
}


export class Notification extends $Base<"Notification"> {
  constructor() {
    super("Notification")
  }

  
      
      actor<Sel extends Selection<User>>(selectorFn: (s: User) => [...Sel]):$Field<"actor", GetOutput<Sel> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new User)
      };
      return this.$_select("actor", options as any) as any
    }
  

      
/**
 * Date Entity was created.
 */
      get createdAt(): $Field<"createdAt", DateTime>  {
       return this.$_select("createdAt") as any
      }

      
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
      get message(): $Field<"message", string>  {
       return this.$_select("message") as any
      }

      
      get read(): $Field<"read", boolean>  {
       return this.$_select("read") as any
      }

      
      recipient<Sel extends Selection<User>>(selectorFn: (s: User) => [...Sel]):$Field<"recipient", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new User)
      };
      return this.$_select("recipient", options as any) as any
    }
  

      
      get resourceId(): $Field<"resourceId", number | null>  {
       return this.$_select("resourceId") as any
      }

      
      get type(): $Field<"type", string>  {
       return this.$_select("type") as any
      }

      
/**
 * Date Entity was last updated.
 */
      get updatedAt(): $Field<"updatedAt", DateTime>  {
       return this.$_select("updatedAt") as any
      }
}


export type OAuthInput = {
  code: string,
provider: string,
redirectUri?: string | null
}
    


export class Post extends $Base<"Post"> {
  constructor() {
    super("Post")
  }

  
      
      author<Sel extends Selection<User>>(selectorFn: (s: User) => [...Sel]):$Field<"author", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new User)
      };
      return this.$_select("author", options as any) as any
    }
  

      
      get category(): $Field<"category", Category>  {
       return this.$_select("category") as any
      }

      
      get commentCount(): $Field<"commentCount", number>  {
       return this.$_select("commentCount") as any
      }

      
      comments<Sel extends Selection<Comment>>(selectorFn: (s: Comment) => [...Sel]):$Field<"comments", Array<GetOutput<Sel>> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Comment)
      };
      return this.$_select("comments", options as any) as any
    }
  

      
      get content(): $Field<"content", string>  {
       return this.$_select("content") as any
      }

      
/**
 * Date Entity was created.
 */
      get createdAt(): $Field<"createdAt", DateTime>  {
       return this.$_select("createdAt") as any
      }

      
/**
 * Date Entity was deleted.
 */
      get deletedAt(): $Field<"deletedAt", DateTime>  {
       return this.$_select("deletedAt") as any
      }

      
      get desc(): $Field<"desc", string>  {
       return this.$_select("desc") as any
      }

      
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
      get image(): $Field<"image", string>  {
       return this.$_select("image") as any
      }

      
      get likeCount(): $Field<"likeCount", number>  {
       return this.$_select("likeCount") as any
      }

      
      get slug(): $Field<"slug", string>  {
       return this.$_select("slug") as any
      }

      
      tags<Sel extends Selection<Tag>>(selectorFn: (s: Tag) => [...Sel]):$Field<"tags", Array<GetOutput<Sel>> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Tag)
      };
      return this.$_select("tags", options as any) as any
    }
  

      
      get title(): $Field<"title", string>  {
       return this.$_select("title") as any
      }

      
/**
 * Date Entity was last updated.
 */
      get updatedAt(): $Field<"updatedAt", DateTime>  {
       return this.$_select("updatedAt") as any
      }

      
      get views(): $Field<"views", number>  {
       return this.$_select("views") as any
      }
}


export class PostAnalytics extends $Base<"PostAnalytics"> {
  constructor() {
    super("PostAnalytics")
  }

  
      
      get comments(): $Field<"comments", number>  {
       return this.$_select("comments") as any
      }

      
      get engagementRate(): $Field<"engagementRate", number>  {
       return this.$_select("engagementRate") as any
      }

      
      get likes(): $Field<"likes", number>  {
       return this.$_select("likes") as any
      }

      
      get views(): $Field<"views", number>  {
       return this.$_select("views") as any
      }
}


export class Query extends $Base<"Query"> {
  constructor() {
    super("Query")
  }

  
      
      get auth(): $Field<"auth", string>  {
       return this.$_select("auth") as any
      }

      
      get checkJwt(): $Field<"checkJwt", boolean>  {
       return this.$_select("checkJwt") as any
      }

      
      comment<Args extends VariabledInput<{
        id: number,
      }>,Sel extends Selection<Comment>>(args: ExactArgNames<Args, {
        id: number,
      }>, selectorFn: (s: Comment) => [...Sel]):$Field<"comment", GetOutput<Sel> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "Int!"
            },
        args,

        selection: selectorFn(new Comment)
      };
      return this.$_select("comment", options as any) as any
    }
  

      
      comments<Args extends VariabledInput<{
        limit?: number
offset?: number
postId: number,
      }>,Sel extends Selection<Comment>>(args: ExactArgNames<Args, {
        limit?: number
offset?: number
postId: number,
      }>, selectorFn: (s: Comment) => [...Sel]):$Field<"comments", Array<GetOutput<Sel>> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              limit: "Int!",
offset: "Int!",
postId: "Int!"
            },
        args,

        selection: selectorFn(new Comment)
      };
      return this.$_select("comments", options as any) as any
    }
  

      
      findUserById<Args extends VariabledInput<{
        id: string,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        id: string,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"findUserById", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "String!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("findUserById", options as any) as any
    }
  

      
      followers<Args extends VariabledInput<{
        limit?: number | null
offset?: number | null
username: string,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        limit?: number | null
offset?: number | null
username: string,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"followers", Array<GetOutput<Sel>> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              limit: "Int",
offset: "Int",
username: "String!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("followers", options as any) as any
    }
  

      
      following<Args extends VariabledInput<{
        limit?: number
offset?: number
username: string,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        limit?: number
offset?: number
username: string,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"following", Array<GetOutput<Sel>> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              limit: "Int!",
offset: "Int!",
username: "String!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("following", options as any) as any
    }
  

      
      hasUserLiked<Args extends VariabledInput<{
        entity: EntityOwnsLike
entityId: number,
      }>>(args: ExactArgNames<Args, {
        entity: EntityOwnsLike
entityId: number,
      }>):$Field<"hasUserLiked", boolean , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              entity: "EntityOwnsLike!",
entityId: "Int!"
            },
        args,

        
      };
      return this.$_select("hasUserLiked", options as any) as any
    }
  

      
      like<Args extends VariabledInput<{
        id: number,
      }>,Sel extends Selection<Like>>(args: ExactArgNames<Args, {
        id: number,
      }>, selectorFn: (s: Like) => [...Sel]):$Field<"like", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              id: "Int!"
            },
        args,

        selection: selectorFn(new Like)
      };
      return this.$_select("like", options as any) as any
    }
  

      
      likeCount<Args extends VariabledInput<{
        entity: EntityOwnsLike
id: number,
      }>>(args: ExactArgNames<Args, {
        entity: EntityOwnsLike
id: number,
      }>):$Field<"likeCount", number , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              entity: "EntityOwnsLike!",
id: "Int!"
            },
        args,

        
      };
      return this.$_select("likeCount", options as any) as any
    }
  

      
      likes<Args extends VariabledInput<{
        entity: EntityOwnsLike
id: number,
      }>,Sel extends Selection<Like>>(args: ExactArgNames<Args, {
        entity: EntityOwnsLike
id: number,
      }>, selectorFn: (s: Like) => [...Sel]):$Field<"likes", Array<GetOutput<Sel>> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              entity: "EntityOwnsLike!",
id: "Int!"
            },
        args,

        selection: selectorFn(new Like)
      };
      return this.$_select("likes", options as any) as any
    }
  

      
      notifications<Args extends VariabledInput<{
        limit?: number
offset?: number,
      }>,Sel extends Selection<Notification>>(args: ExactArgNames<Args, {
        limit?: number
offset?: number,
      }>, selectorFn: (s: Notification) => [...Sel]):$Field<"notifications", Array<GetOutput<Sel>> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              limit: "Int!",
offset: "Int!"
            },
        args,

        selection: selectorFn(new Notification)
      };
      return this.$_select("notifications", options as any) as any
    }
  

      
/**
 * Get most popular posts ordered by likes
 */
      popularPosts<Args extends VariabledInput<{
        limit?: number | null,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        limit?: number | null,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"popularPosts", Array<GetOutput<Sel>> | null , GetVariables<Sel, Args>>
popularPosts<Sel extends Selection<Post>>(selectorFn: (s: Post) => [...Sel]):$Field<"popularPosts", Array<GetOutput<Sel>> | null , GetVariables<Sel>>
popularPosts(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              limit: "Int"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("popularPosts", options as any) as any
    }
  

      
      post<Args extends VariabledInput<{
        id?: number | null
slug?: string | null,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        id?: number | null
slug?: string | null,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"post", GetOutput<Sel> , GetVariables<Sel, Args>>
post<Sel extends Selection<Post>>(selectorFn: (s: Post) => [...Sel]):$Field<"post", GetOutput<Sel> , GetVariables<Sel>>
post(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              id: "Int",
slug: "String"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("post", options as any) as any
    }
  

      
      postAnalytics<Args extends VariabledInput<{
        slug: string,
      }>,Sel extends Selection<PostAnalytics>>(args: ExactArgNames<Args, {
        slug: string,
      }>, selectorFn: (s: PostAnalytics) => [...Sel]):$Field<"postAnalytics", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              slug: "String!"
            },
        args,

        selection: selectorFn(new PostAnalytics)
      };
      return this.$_select("postAnalytics", options as any) as any
    }
  

      
/**
 * Get total count of posts with optional filtering
 */
      postCount<Args extends VariabledInput<{
        authorId?: string | null
category?: Category | null,
      }>>(args: ExactArgNames<Args, {
        authorId?: string | null
category?: Category | null,
      }>):$Field<"postCount", number , GetVariables<[], Args>> {
      
      const options = {
        argTypes: {
              authorId: "String",
category: "Category"
            },
        args,

        
      };
      return this.$_select("postCount", options as any) as any
    }
  

      
/**
 * Get posts with optional filtering by category and/or author
 */
      posts<Args extends VariabledInput<{
        authorId?: string | null
category?: Category | null
limit?: number | null
offset?: number | null,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        authorId?: string | null
category?: Category | null
limit?: number | null
offset?: number | null,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"posts", Array<GetOutput<Sel>> , GetVariables<Sel, Args>>
posts<Sel extends Selection<Post>>(selectorFn: (s: Post) => [...Sel]):$Field<"posts", Array<GetOutput<Sel>> , GetVariables<Sel>>
posts(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              authorId: "String",
category: "Category",
limit: "Int",
offset: "Int"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("posts", options as any) as any
    }
  

      
/**
 * Get all posts by a specific author
 */
      postsByAuthor<Args extends VariabledInput<{
        authorId: string
limit?: number | null,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        authorId: string
limit?: number | null,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"postsByAuthor", Array<GetOutput<Sel>> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              authorId: "String!",
limit: "Int"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("postsByAuthor", options as any) as any
    }
  

      
/**
 * Get all posts in a specific category
 */
      postsByCategory<Args extends VariabledInput<{
        category: Category
limit?: number | null,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        category: Category
limit?: number | null,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"postsByCategory", Array<GetOutput<Sel>> | null , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              category: "Category!",
limit: "Int"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("postsByCategory", options as any) as any
    }
  

      
/**
 * Get most recent posts
 */
      recentPosts<Args extends VariabledInput<{
        limit?: number | null,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        limit?: number | null,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"recentPosts", Array<GetOutput<Sel>> | null , GetVariables<Sel, Args>>
recentPosts<Sel extends Selection<Post>>(selectorFn: (s: Post) => [...Sel]):$Field<"recentPosts", Array<GetOutput<Sel>> | null , GetVariables<Sel>>
recentPosts(arg1: any, arg2?: any) {
      const { args, selectorFn } = !arg2 ? { args: {}, selectorFn: arg1 } : { args: arg1, selectorFn: arg2 };

      const options = {
        argTypes: {
              limit: "Int"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("recentPosts", options as any) as any
    }
  

      
      searchPosts<Args extends VariabledInput<{
        limit?: number
offset?: number
query: string,
      }>,Sel extends Selection<Post>>(args: ExactArgNames<Args, {
        limit?: number
offset?: number
query: string,
      }>, selectorFn: (s: Post) => [...Sel]):$Field<"searchPosts", Array<GetOutput<Sel>> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              limit: "Int!",
offset: "Int!",
query: "String!"
            },
        args,

        selection: selectorFn(new Post)
      };
      return this.$_select("searchPosts", options as any) as any
    }
  

      
      searchTags<Args extends VariabledInput<{
        limit?: number
query: string,
      }>,Sel extends Selection<Tag>>(args: ExactArgNames<Args, {
        limit?: number
query: string,
      }>, selectorFn: (s: Tag) => [...Sel]):$Field<"searchTags", Array<GetOutput<Sel>> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              limit: "Int!",
query: "String!"
            },
        args,

        selection: selectorFn(new Tag)
      };
      return this.$_select("searchTags", options as any) as any
    }
  

      
      searchUsers<Args extends VariabledInput<{
        limit?: number
offset?: number
query: string,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        limit?: number
offset?: number
query: string,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"searchUsers", Array<GetOutput<Sel>> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              limit: "Int!",
offset: "Int!",
query: "String!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("searchUsers", options as any) as any
    }
  

      
      tags<Sel extends Selection<Tag>>(selectorFn: (s: Tag) => [...Sel]):$Field<"tags", Array<GetOutput<Sel>> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Tag)
      };
      return this.$_select("tags", options as any) as any
    }
  

      
      trendingTags<Args extends VariabledInput<{
        limit?: number
timeRange?: string,
      }>,Sel extends Selection<TrendingTag>>(args: ExactArgNames<Args, {
        limit?: number
timeRange?: string,
      }>, selectorFn: (s: TrendingTag) => [...Sel]):$Field<"trendingTags", Array<GetOutput<Sel>> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              limit: "Int!",
timeRange: "String!"
            },
        args,

        selection: selectorFn(new TrendingTag)
      };
      return this.$_select("trendingTags", options as any) as any
    }
  

      
      get unreadNotificationsCount(): $Field<"unreadNotificationsCount", number>  {
       return this.$_select("unreadNotificationsCount") as any
      }

      
      user<Args extends VariabledInput<{
        username: string,
      }>,Sel extends Selection<User>>(args: ExactArgNames<Args, {
        username: string,
      }>, selectorFn: (s: User) => [...Sel]):$Field<"user", GetOutput<Sel> , GetVariables<Sel, Args>> {
      
      const options = {
        argTypes: {
              username: "String!"
            },
        args,

        selection: selectorFn(new User)
      };
      return this.$_select("user", options as any) as any
    }
  

      
      userAnalytics<Sel extends Selection<UserAnalytics>>(selectorFn: (s: UserAnalytics) => [...Sel]):$Field<"userAnalytics", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new UserAnalytics)
      };
      return this.$_select("userAnalytics", options as any) as any
    }
  

      
      whoami<Sel extends Selection<User>>(selectorFn: (s: User) => [...Sel]):$Field<"whoami", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new User)
      };
      return this.$_select("whoami", options as any) as any
    }
  
}


export class Subscription extends $Base<"Subscription"> {
  constructor() {
    super("Subscription")
  }

  
      
      notificationAdded<Sel extends Selection<Notification>>(selectorFn: (s: Notification) => [...Sel]):$Field<"notificationAdded", GetOutput<Sel> , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Notification)
      };
      return this.$_select("notificationAdded", options as any) as any
    }
  
}


export class Tag extends $Base<"Tag"> {
  constructor() {
    super("Tag")
  }

  
      
/**
 * Date Entity was created.
 */
      get createdAt(): $Field<"createdAt", DateTime>  {
       return this.$_select("createdAt") as any
      }

      
      get id(): $Field<"id", number>  {
       return this.$_select("id") as any
      }

      
      get name(): $Field<"name", string>  {
       return this.$_select("name") as any
      }

      
      posts<Sel extends Selection<Post>>(selectorFn: (s: Post) => [...Sel]):$Field<"posts", Array<GetOutput<Sel>> | null , GetVariables<Sel>> {
      
      const options = {
        
        

        selection: selectorFn(new Post)
      };
      return this.$_select("posts", options as any) as any
    }
  

      
/**
 * Date Entity was last updated.
 */
      get updatedAt(): $Field<"updatedAt", DateTime>  {
       return this.$_select("updatedAt") as any
      }
}


export class TrendingTag extends $Base<"TrendingTag"> {
  constructor() {
    super("TrendingTag")
  }

  
      
      get count(): $Field<"count", number>  {
       return this.$_select("count") as any
      }

      
      get name(): $Field<"name", string>  {
       return this.$_select("name") as any
      }
}


export type UpdateCommentInput = {
  id: number,
text: string
}
    


export type UpdatePostInput = {
  category?: Category | null,
content?: string | null,
desc?: string | null,
id: number,
image?: string | null,
tags?: Readonly<Array<string>> | null,
title?: string | null
}
    


export type UpdateUserInput = {
  avatar?: string | null,
confirmPassword?: string | null,
email?: string | null,
id: string,
password?: string | null,
username?: string | null
}
    


export class User extends $Base<"User"> {
  constructor() {
    super("User")
  }

  
      
      get avatar(): $Field<"avatar", string | null>  {
       return this.$_select("avatar") as any
      }

      
      get bio(): $Field<"bio", string | null>  {
       return this.$_select("bio") as any
      }

      
/**
 * Date Entity was created.
 */
      get createdAt(): $Field<"createdAt", DateTime>  {
       return this.$_select("createdAt") as any
      }

      
      get email(): $Field<"email", string>  {
       return this.$_select("email") as any
      }

      
/**
 * Email verification status
 */
      get emailVerified(): $Field<"emailVerified", boolean>  {
       return this.$_select("emailVerified") as any
      }

      
      get followerCount(): $Field<"followerCount", number>  {
       return this.$_select("followerCount") as any
      }

      
      get followingCount(): $Field<"followingCount", number>  {
       return this.$_select("followingCount") as any
      }

      
/**
 * ID
 */
      get id(): $Field<"id", string>  {
       return this.$_select("id") as any
      }

      
      get isFollowing(): $Field<"isFollowing", boolean>  {
       return this.$_select("isFollowing") as any
      }

      
/**
 * OAuth2 ID
 */
      get oauthId(): $Field<"oauthId", string | null>  {
       return this.$_select("oauthId") as any
      }

      
/**
 * OAuth2 Provider name, e.g. Google, GitHub..
 */
      get oauthProvider(): $Field<"oauthProvider", string | null>  {
       return this.$_select("oauthProvider") as any
      }

      
      get password(): $Field<"password", string | null>  {
       return this.$_select("password") as any
      }

      
/**
 * Date Entity was last updated.
 */
      get updatedAt(): $Field<"updatedAt", DateTime>  {
       return this.$_select("updatedAt") as any
      }

      
      get username(): $Field<"username", string>  {
       return this.$_select("username") as any
      }
}


export class UserAnalytics extends $Base<"UserAnalytics"> {
  constructor() {
    super("UserAnalytics")
  }

  
      
      get engagementRate(): $Field<"engagementRate", number>  {
       return this.$_select("engagementRate") as any
      }

      
      get postViews(): $Field<"postViews", number>  {
       return this.$_select("postViews") as any
      }

      
      get totalComments(): $Field<"totalComments", number>  {
       return this.$_select("totalComments") as any
      }

      
      get totalFollowers(): $Field<"totalFollowers", number>  {
       return this.$_select("totalFollowers") as any
      }

      
      get totalFollowing(): $Field<"totalFollowing", number>  {
       return this.$_select("totalFollowing") as any
      }

      
      get totalLikes(): $Field<"totalLikes", number>  {
       return this.$_select("totalLikes") as any
      }

      
      get totalPosts(): $Field<"totalPosts", number>  {
       return this.$_select("totalPosts") as any
      }
}


export type userInputType = {
  avatar?: string | null,
bio?: string | null,
email: string,
emailVerified?: boolean,
followerCount?: number,
followingCount?: number,
id: string,
oauthId?: string | null,
oauthProvider?: string | null,
password?: string | null,
username: string
}
    

  const $Root = {
    query: Query,
mutation: Mutation
  }

  namespace $RootTypes {
    export type query = Query
export type mutation = Mutation
  }
  

export function query<Sel extends Selection<$RootTypes.query>>(
  name: string,
  selectFn: (q: $RootTypes.query) => [...Sel]
): TypedDocumentNode<GetOutput<Sel>, GetVariables<Sel>>
export function query<Sel extends Selection<$RootTypes.query>>(
  selectFn: (q: $RootTypes.query) => [...Sel]
): TypedDocumentNode<GetOutput<Sel>, Simplify<GetVariables<Sel>>>
export function query<Sel extends Selection<$RootTypes.query>>(name: any, selectFn?: any) {
  if (!selectFn) {
    selectFn = name
    name = ''
  }
  let field = new $Field<'query', GetOutput<Sel>, GetVariables<Sel>>('query', {
    selection: selectFn(new $Root.query()),
  })
  const str = fieldToQuery(`query ${name}`, field)

  return gql(str) as any
}


export function mutation<Sel extends Selection<$RootTypes.mutation>>(
  name: string,
  selectFn: (q: $RootTypes.mutation) => [...Sel]
): TypedDocumentNode<GetOutput<Sel>, GetVariables<Sel>>
export function mutation<Sel extends Selection<$RootTypes.mutation>>(
  selectFn: (q: $RootTypes.mutation) => [...Sel]
): TypedDocumentNode<GetOutput<Sel>, Simplify<GetVariables<Sel>>>
export function mutation<Sel extends Selection<$RootTypes.query>>(name: any, selectFn?: any) {
  if (!selectFn) {
    selectFn = name
    name = ''
  }
  let field = new $Field<'mutation', GetOutput<Sel>, GetVariables<Sel>>('mutation', {
    selection: selectFn(new $Root.mutation()),
  })
  const str = fieldToQuery(`mutation ${name}`, field)

  return gql(str) as any
}


const $InputTypes: {[key: string]: {[key: string]: string}} = {
    CreateCommentInput: {
    postId: "Int!",
text: "String!"
  },
  CreateLikeInput: {
    commentId: "Int",
postId: "Int"
  },
  CreatePostInput: {
    category: "Category!",
content: "String!",
desc: "String!",
image: "String!",
tags: "[String!]",
title: "String!"
  },
  CreateUserInput: {
    avatar: "String",
confirmPassword: "String!",
email: "String!",
password: "String!",
username: "String!"
  },
  LoginUserInput: {
    password: "String!",
username: "String!"
  },
  OAuthInput: {
    code: "String!",
provider: "String!",
redirectUri: "String"
  },
  UpdateCommentInput: {
    id: "Int!",
text: "String!"
  },
  UpdatePostInput: {
    category: "Category",
content: "String",
desc: "String",
id: "Int!",
image: "String",
tags: "[String!]",
title: "String"
  },
  UpdateUserInput: {
    avatar: "String",
confirmPassword: "String",
email: "String",
id: "ID!",
password: "String",
username: "String"
  },
  userInputType: {
    avatar: "String",
bio: "String",
email: "String!",
emailVerified: "Boolean!",
followerCount: "Int!",
followingCount: "Int!",
id: "String!",
oauthId: "String",
oauthProvider: "String",
password: "String",
username: "String!"
  }
}

