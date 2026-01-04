**The situation where the user creates a new note using the single-page version of the app:**

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: The browser starts executing the JavaScript code that updates the current page on the side of browser and sends new JSON data to the server
    server-->>browser: responds with status code 201 created
	Note right of browser: This time the server does not ask for a redirect, the browser stays on the same page, and it sends no further HTTP requests.

```

