# Paste

A simple pastebin service. Running at [paste.fascinated.cc](https://paste.fascinated.cc).

## Environment Variables

| Name                       | Description                               | Default                   |
| -------------------------- | ----------------------------------------- | ------------------------- |
| MONGO_URI                  | The MongoDB URI                           | mongodb://localhost:27017 |
| PASTE_ID_LENGTH            | The length of the paste ID                | 12                        |
| MAX_PASTE_LENGTH           | The maximum length of a paste             | 5000000                   |
| ENABLE_METRICS             | Whether to enable Prometheus metrics      | false                     |
| TEXTBOX_PLACEHOLDER        | The placeholder text for the textbox      | Enter your text here...   |
| HASTEBIN_COMPATIBILITY_URL | The URL to use for Hastebin compatibility | /documents                |
| SITE_TITLE                 | The title of the site                     | Paste                     |
| ENABLE_LOGGING             | Whether to enable logging                 | true                      |

## Javascript Utility

```js
/**
 * Uploads a paste to paste.fascinated.cc
 *
 * @param content the content of the paste
 * @returns the paste key and the URL
 */
async function uploadPaste(content: string) {
  const response = await fetch("https://paste.fascinated.cc/api/upload", {
    method: "POST",
    body: content,
  });
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return {
    ...json,
    url: `https://paste.fascinated.cc/${json.key}`,
  };
}

console.log(await uploadPaste("Hello, World!"));
```
