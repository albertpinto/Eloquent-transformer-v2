import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

const ScrapeHackerNews = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const scrapeHackerNews = async () => {
      try {
        const response = await axios.get('https://news.ycombinator.com/');
        const $ = cheerio.load(response.data);

        const results = [];
        $('span.titleline').each((index, element) => {
          const articleTitle = $(element).text();
          const articleUrl = $(element).find('a').attr('href');

          const article = {
            title: articleTitle,
            url: articleUrl,
          };
          results.push(article);
        });

        setArticles(results);
      } catch (error) {
        console.error('Error scraping Hacker News:', error);
      }
    };

    scrapeHackerNews();
  }, []);

  return (
    <div>
      <h1>Hacker News Articles</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScrapeHackerNews;
