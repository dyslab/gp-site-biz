# Small biz website demo - powered by _Gulp v4_

![GitHub package.json version](https://img.shields.io/github/package-json/v/dyslab/gp-site-biz) &nbsp; [![Gulp v4](./src/Gulp-v5-CF6667.svg)](https://gulpjs.com/) &nbsp; [![MIT License](./src/MIT-license.svg)](./LICENSE)

## Notes

- Click [HERE](https://dyslab.github.io/gp-site-biz/dist/) to check out Github page demo of this project

- Click [HERE](./src/news/README.md) to check out news update intro for this project

## Brief intro for beginner after cloned or downloaded

```bash

# Notes: following CLIs are a one-time installation
npm install gulp-cli -g # Install gulp command line interface
npm install pm2 -g # Install PM2 command line interface
npm install # Install all dependencies of this project

# Notes: following command lines use for test and development. and build
npm start   # Start local web server. Demo page link is `http://localhost:8060/dist/`
npm run start:pm2   # Start local web server by PM2. Web server address and port like above

# Notes: following command lines use for build and generation
gulp    # Generate index/about pages and process babel js files
gulp news   # Generate news-related pages
gulp products   # Generate products-related pages
gulp services   # Generate services-related pages

# Build ALL command
npm run build   # Equals to `gulp all`, Generate all pages
```
