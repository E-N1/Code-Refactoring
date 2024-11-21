## Automated code change
Revisions in over 500 files in multiple lines, with Abstract Syntax Tree(TS) on existing code.

## Execute the script

To execute the script with the extensions specified in your .env (**.page.ts, .component.ts, ...**):
```sh
npm run start:env
```

To run the script with **all** that are contained in your CODE_LOCATION:
```sh
npm run start:all
```

## Environment variables

add in `.env`:
```
CODE_LOCATION = ‘path/to/your/files’

FILE_EXTENSIONS= .page.ts,.component.ts,.integration.ts,.integration.spec.ts

DELETE_EXTENSIONS = .integration.ts,.integration.spec.ts

```

Translated with www.DeepL.com/Translator (free version)