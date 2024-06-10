# Paste

A simple pastebin service. Running at [paste.fascinated.cc](https://paste.fascinated.cc).

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
