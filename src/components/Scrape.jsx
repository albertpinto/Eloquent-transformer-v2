import React from 'react';
const Scrape = ({ links }) => {
    return (
      <div className="p-4">
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  export default Scrape;

