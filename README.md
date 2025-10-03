# Mancala Game

This repo includes the C++ and SolidJS implementation of the African game *Mancala*. This is done as a project for the course AI.
It uses the Min-Max algorithm with alpha beta pruning to obtain the best possible move and play that.

## Usage

### C++ implementation

> This code supports only the CLI playthroughs.
- Clone the repo.
- Compile the C++ file
```bash
g++ -O2 mancala.cpp
```
- Run the file. (This was built on linux and has not been tested on other devices)
```bash
./a.out
```

### Java Script

> You can directly visit the [vedabahu.github.io/mancala_js](https://vedabahu.github.io/mancala_js/) website to play it online.

- This repo uses pnpm package manager.
- Clone the repo. 
- Run this:
```bash
cd mancala_solid_js
pnpm i 
pnpm run dev
```
- This will spin a development server at `http://localhost:3000`.

## Credits

This was a group project. It was possible thanks to the efforts of

- [@vedabahu](https://github.com/vedabahu)
- [@Sarthak-Goyal](https://github.com/Sarthak-G0yal)
- [@Shivambu Dev Pandey](https://github.com/shivsegv)
- [@Suvan Gururaj](https://www.linkedin.com/in/suvan-gururaj-404bb12aa/)
