import React from "react";

function PublicationList({ publications }) {
  return (
 
   <div className="space-y-6">
      {publications.map((publication, index) => (
        <div className="card p-4" key={index}>
          <h2 className="font-bold text-xl mb-4">{publication.title}</h2>
          <div>
            <strong>Authors:</strong> {publication.authors.join(", ")}
          </div>
          <div>
            <strong>Published:</strong> {publication.published}
          </div>
          <div>
            <strong>Summary:</strong> {publication.summary}
          </div>
          <div>
            <a href={publication.pdf_url} target="_blank" rel="noopener noreferrer">
              PDF Link
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PublicationList;
