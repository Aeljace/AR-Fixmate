# Backup and public repository preparation

A private pre-restoration backup was created before source changes:

- File: `.local-backups/AR-FixMate-before-assembly-20261103-192403.zip`
- Size: 11,175,841 bytes
- Archive SHA-256: `7ACBF6F49B0881D8CD29ECB19982CF70E6D326E72FC88382A35B70D79DA28C2E`
- Verification: all 121 entries were read back and their SHA-256 hashes matched the source files. The per-file manifest is beside the archive.
- Scope: authored project, scene, scripts, assets, packages and brief. Private keys, confidential local configuration, generated caches and editor workspace data were deliberately omitted. This is a source-project recovery backup, not a backup of private credentials.

The project `.gitignore` excludes `spk_debug_key.pem`, PEM/key files, environment secrets, named secret/credential files, local assistant configuration, generated Lens Studio data, logs, and private backups. Required authored Assets, Packages, the project manifest, and devpost brief remain eligible for version control.

Ignore rules were checked with `git check-ignore --no-index` using an isolated bare repository under `.local-backups/ignore-check.git`. Ten representative private/generated paths were excluded. Five representative authored project/package/document paths were not excluded (the expected exit status for that negative check is 1).

No Git repository was present at the project root during review. No public repository was created and nothing was pushed. These exclusions prevent accidental future additions; they do not prove an existing external repository or its history is free of secrets. Before publication, review the exact staged file list and secret-scan the candidate repository/history without displaying secret values. Do not upload the backup archive.

Submission also needs the verified assembly acceptance results and the brief's public demonstration video under three minutes. Real-glasses comfort and hand tracking remain feel unproven because no physical device is available.
