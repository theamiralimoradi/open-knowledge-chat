# Security notes

This repository includes **code only**. It does not include production settings or customer records.

## Secrets

- Configure API credentials in the plugin's WordPress administrator page, never in tracked source files.
- Ensure WordPress salts and server backups are protected. The stored API key is encrypted using a key derived from WordPress salts; changing the salts may require re-entering the API key.
- Do not upload `wp-config.php`, `.env`, database backups, exports, debug logs, production screenshots, or full WordPress site archives to the repository.
- Rotate any API key that was previously exposed, including one pasted into a chat or accidentally committed. Purge of history alone is not sufficient.

## Live deployments

- Use HTTPS for the website and API provider.
- Publish a privacy notice before collecting names, phone numbers and conversation logs. Define access, retention and deletion workflows appropriate to the deployment jurisdiction.
- Add a separate opt-in before sending marketing messages.
- Set strict API usage limits and use a server/network edge bot mitigation strategy. Current limits are basic IP-based WordPress transients.
- Review the publicly available WordPress post types that the search indexes; do not place confidential content in publicly accessible pages or exposed custom post types.
- Test model-instruction injection, insufficient-context questions, lead form abuse, and access-control boundaries on staging before production.
- Keep WordPress, the plugin, PHP and the hosting environment patched and backed up.

## Reporting

Before enabling public security reports, configure a private contact or GitHub Security Advisories for your repository. Do not post exploit details or credentials in public issues.