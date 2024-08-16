# reps-scanner

## Instalation

```
yarn
```

## Run server locally

```
yarn start
```

Visit http://localhost:4000/

## Queries example

Copy and paste to test it

### Get repos

```
query GetRepos($token: String!) {
  repos(token: $token) {
    id
    name
    size
    owner {
      id
      login
    }
  }
}
```

### Get repo

```
query GetRepo($token: String!, $name: String!) {
  repo(token: $token, name: $name) {
    id
    name
    size
    owner {
      id
      login
    }
    visibility
    filesCount
    ymlContent
    webhooks {
      id
      name
      active
    }
  }
}
```

## Testing

```
yarn test
```
