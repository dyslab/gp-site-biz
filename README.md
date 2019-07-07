# APPNAME: gp-site-biz

Gulp Small Biz Website Demo.

MIT Licensed.


## News Update Memo:

- Step 1, Create a new file for news content. (File name and content refer to *news_20190701.json*)

- Step 2, Add the file_id(same as filename without extension) to the news list file *news_list.json*.

- Step 3, Use `gulp news` generate all html files related to news.

**Note: json files locate in the folder 'src/news/', and image files save to the folder 'dist/assets/imgs/news/' is recomended.**


## Brief Intro:

- `gulp` Generate index/about pages, and process babel js files.

- `gulp news` Generate news-related pages.

- `gulp products` Generate products-related pages.

- `gulp services` Generate services-related pages.

- `gulp all` Generate all pages.
