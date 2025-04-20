# game
A 2d rogue-like shooter

## Development
### Requirements
- git
- Node.js
- npm

### Familiarity with tools
- Quick git overview: <https://rogerdudler.github.io/git-guide/>
- Quick JavaScript tutorial: <https://learnxinyminutes.com/javascript/>
- Quick TypeScript tutorial: <https://learnxinyminutes.com/typescript>
- GitHub Markdown overview (for `.md` files):
  <https://github.com/lifeparticle/Markdown-Cheatsheet/blob/main/README.md>

### Initial setup
1. Clone the repository.
2. Install dependencies with `npm install`
3. Run `npm run dev` to start a development server (auto reload
   website, secure environment, etc.)

### Project structure
- **Folders**
  - `public/` contains the front-end of the website (e.g. html, css,
    image assets, sound files, etc.)
  - `src/` contains the main game code (i.e. classes, initialization of
    framework, etc.)
- **Git branches**
  - `mother`: the main git branch that holds the latest stable copy of
    the game

### General development process
1. Begin development by doing `git pull` (update your current copy of
   the project) and possibly fix any merge conflicts
2. Create a new git branch to implement a new feature
3. Start development server (`npm run dev`) and open in your browser
4. Make code changes
5. Add and commit your changes (`git add` and `git commit`) (*make
   frequent commits and pushes*)
6. Push changes to github (`git push origin <your branch name>`)
  (*make frequent commits and pushes*)
7. When you have completed your feature, merge the branch back into
   the `mother` branch
