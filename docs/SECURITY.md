# Security Policy

## Overview

Security is not treated as an add-on in PassVault; it is the underlying principle that shapes every design decision. The application is built as a local-first password manager with a deliberate focus on minimizing exposure, protecting sensitive data, and ensuring that users retain complete control over their credentials. By avoiding unnecessary dependencies on external systems, PassVault reduces the attack surface and enforces a model where sensitive data remains confined to the user’s device.

At a fundamental level, the system follows a simple but effective philosophy: data that is never transmitted cannot be intercepted. This approach informs both the architectural design and the operational behavior of the application.

---

## Supported Versions

Security updates and fixes are actively maintained for the most recent release of PassVault. While limited support may be extended to the immediately preceding stable version, older versions are no longer considered secure and should not be used. Users are strongly encouraged to stay up to date, as each release may include critical improvements to encryption handling, data protection mechanisms, and overall system resilience.

---

## Security Architecture

PassVault is designed around a local-only security model in which all sensitive operations, including encryption, decryption, and storage, occur directly on the device. Credentials are never stored in plaintext. Instead, they are encrypted using AES-256 prior to being written to persistent storage. Decryption is performed only when necessary and only within the application’s runtime memory, ensuring that sensitive data is not unnecessarily exposed.

Encryption keys are generated and managed through the Android Keystore system. This provides a secure and isolated environment for key storage, often backed by hardware-level protection depending on the device capabilities. As a result, even if application storage is accessed or extracted, the underlying data remains unintelligible without access to the protected keys.

All vault data is stored locally using a structured database. The application does not rely on cloud services, remote APIs, or background synchronization mechanisms for handling user credentials. This intentional design choice eliminates risks associated with server-side breaches, unauthorized data transmission, and network-based attacks.

---

## Authentication and Access Control

Access to stored credentials is gated by user authentication, which may include a master PIN, password, or biometric verification. Authentication is required before any sensitive operation is performed, including viewing, modifying, or exporting stored data. Biometric authentication leverages platform-provided secure APIs, ensuring that biometric data itself is never exposed to the application.

This layered access model ensures that even if a device is accessible, the vault remains protected behind an additional authentication boundary.

---

## Backup and Data Handling

PassVault provides functionality for exporting stored data to support user-controlled backups. While export options are designed to preserve encryption wherever possible, it is important to recognize that exported files exist outside the application’s security boundary. Once data is exported, its safety depends entirely on how and where it is stored.

Users are expected to handle backups responsibly, ensuring that exported files are stored in secure, trusted environments and are not left exposed in unencrypted or publicly accessible locations. The application validates imported data to prevent malformed or tampered inputs from compromising the integrity of the system.

---

## Offline-First Design

The application is intentionally designed to operate without requiring internet connectivity. By removing network dependencies, PassVault eliminates entire categories of vulnerabilities, including man-in-the-middle attacks, API exploitation, and remote data exfiltration. This design significantly strengthens the overall security posture by ensuring that all sensitive operations remain confined to the local environment.

---

## Threat Model

PassVault is built to protect against unauthorized access to stored credentials through strong encryption and controlled access mechanisms. It effectively mitigates risks such as data leakage through network channels, exposure of plaintext credentials, and basic storage compromise scenarios where encryption keys remain secure.

However, like any local application, it does not fully protect against scenarios involving compromised devices, such as rooted or jailbroken environments, or situations where an attacker has physical access to an already unlocked device. The strength of user-defined authentication credentials and the overall security of the device play a critical role in the effectiveness of the protection provided.

---

## Vulnerability Reporting

Security issues are taken seriously, and responsible disclosure is encouraged. If a vulnerability is identified, it should be reported in a manner that allows it to be addressed before public disclosure. Non-sensitive issues may be reported through GitHub, while sensitive vulnerabilities should be communicated privately.

Reports should include a clear description of the issue, steps to reproduce it, and an explanation of the potential impact. Providing additional context or suggested mitigations can help accelerate the resolution process. Once a report is received, it will be acknowledged and investigated within a reasonable timeframe, with fixes prioritized based on severity.

---

## Security Practices

The security of PassVault is maintained through careful design, manual code review, and validation of critical components such as encryption workflows and data handling processes. Particular attention is given to ensuring that sensitive data is never exposed unnecessarily and that all inputs are properly validated before being processed.

As the project evolves, additional security measures such as automated analysis and formal testing methodologies may be introduced to further strengthen the system.

---

## Limitations and Trade-offs

PassVault deliberately avoids certain features commonly found in cloud-based password managers, such as automatic synchronization, remote recovery, or centralized account management. While these features can improve convenience, they also introduce additional attack vectors. Their absence is a conscious trade-off made in favor of stronger privacy and reduced exposure.

Users should be aware that the security of their data ultimately depends not only on the application but also on the security of their device and their own practices, including the strength of their authentication credentials and the handling of backups.

---

## Final Note

No software system can guarantee absolute security. PassVault is designed to provide strong, practical protection through a combination of encryption, local-first architecture, and minimal exposure. Its effectiveness, however, is closely tied to the environment in which it operates and the choices made by its users.

Security is a shared responsibility, and PassVault is built to provide a solid and trustworthy foundation for managing sensitive information.
