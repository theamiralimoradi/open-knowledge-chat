# Open Knowledge Chat

A **generic, Persian-first WordPress chatbot plugin** that answers questions using publicly published site content and a moderated knowledge base. The plugin supports any provider exposing an OpenAI-compatible `POST /chat/completions` endpoint.

**No live API credentials, provider endpoint, customer information, organization name, or production database data are included in this repository.** All provider settings are entered separately in each WordPress installation.

## Features

- Floating chat window (disabled by default) and full-page chat via shortcode `[okc_ai_chat]`.
- Lead form for name, phone number and chat-data consent before starting the session.
- Server-side API requests with configurable **HTTPS Base URL**, **API Key** and **Model ID**.
- Keyword retrieval from public/published WordPress pages, posts and other publicly queryable post types, plus a moderator-approved Q&A bank.
- Review queue for uncertain model responses, manual Q&A approval, and article-topic tracking.
- Source page links presented as buttons; up to three suggested follow-up questions in the same model response.
- Optional link to a consultation/contact page when the answer is uncertain.
- Admin-only export/delete of captured leads and conversations.
- API key encrypted with AES-256-GCM using WordPress salts where OpenSSL is present.

## Installation

1. Back up your website and test on a staging WordPress installation first.
2. Upload the **plugin ZIP** in **Plugins → Add New → Upload Plugin**, or place this repository in `wp-content/plugins/open-knowledge-chat/`.
3. Activate **Open Knowledge Chat**.
4. Open **Open Knowledge Chat** in the WordPress admin sidebar. Enter the API credentials, HTTPS Base URL, exact Model ID, and your own consultation link. Use the built-in connection test.
5. Review and **publish** the automatically created draft `/ai-chat/` page (or create a different page containing `[okc_ai_chat]`).
6. Enable the floating button only when the privacy notice, rate limits and chat flow are ready.

The plugin creates **new** tables and options prefixed `okc_ai_`. It does **not** copy production site settings or automatically migrate data from any other plugin.

### API configuration

| Setting | Default in source | Example description |
| --- | --- | --- |
| API Key | **Empty** | Enter only in the protected WordPress admin form |
| Base URL | **Empty** | Enter the HTTPS API base endpoint provided to you |
| Model ID | **Empty** | Exact model identifier from your API provider |
| Assistant display name | `دستیار هوشمند` | Can be customized per site |
| Consultation URL | **Empty** | Your own verified HTTPS page |
| Floating widget | **Off** | Enable after testing |

The request code adds `/chat/completions` to the configured Base URL unless it is already included. The API must return `choices[0].message.content` in a compatible response. **Do not commit API keys, values exported from WordPress options, or private API response logs.**

## Important limitations

- **Not a full semantic/vector RAG implementation:** retrieval is keyword-based and can miss content or match the wrong page.
- **Not fact-checking:** `NEEDS_REVIEW` is a model-reported indicator, not a certified confidence score. Review organizational claims manually.
- **Not phone verification:** the phone form only checks format; it does not prove ownership of a number.
- **No guaranteed hard quotas:** transient-based IP/day limits are basic abuse controls; production deployments should add edge rate limiting, anti-bot protection, and logging.
- **Contains personal data:** configure an adequate privacy notice, access policy, deletion/retention schedule and separate marketing opt-in before going live.
- **Not confirmed for every model:** run staging tests with your selected provider and verify response schemas and pricing.
- **Not a drop-in update to a branded version:** internal names and database tables are deliberately distinct. Do not replace a live customized plugin with this package expecting existing data to migrate.

## Security before making the repository public

Run `python3 scripts/check_release.py` and verify that neither this repository nor **its Git history** ever contained live secrets, real lead data, database dumps, raw chat logs or confidential company material. If a token has appeared anywhere public or in chat, revoke/rotate it at the provider; simply deleting it from the current file is insufficient.

See [SECURITY.md](SECURITY.md) for deployment requirements and vulnerability reporting recommendations.

## Tests

```bash
php -l open-knowledge-chat.php
node --check assets/chat.js
python3 scripts/check_release.py
```

These are **static checks**, not end-to-end WordPress/API tests.

## License

No license is selected in this redistribution-ready source bundle. **Before publicly licensing the project**, verify that you own or are authorized to redistribute the code, then select an appropriate license (typically GPL-compatible for a WordPress plugin). Public visibility on GitHub alone does not grant re-use rights.