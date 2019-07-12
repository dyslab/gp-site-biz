## News Update Memo:

- Step 1, Create a new file for news content. (File name and content refer to *news_20190701.json*)

- Step 2, Add the file_id(same as filename without extension) to the news list file *news_list.json*.

- Step 3, Add the file_id(And you could remove the old has-been-generated file_id from the list as well) to the news generate-file list file *news_docs_generate_list.json*.

- Step 4, Use `gulp news` generate all html files related to news.

**Note: json files locate in the folder 'src/news/', and image files save to the folder 'dist/assets/imgs/news/' is recomended.**
