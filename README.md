# Team Weather Project & Shared Azure VM Setup

A full-stack Node.js/Express weather application hosted on an Azure Linux Virtual Machine. This project demonstrates multi-user Linux collaboration, secure SSH key management, Nginx reverse proxying, PM2 process management, and automated continuous deployment using GitHub Actions.

---

## Live Site & Infrastructure Overview

* **Application URL:** `http://102.37.137.54`
* **Hosting Environment:** Azure Virtual Machine (Ubuntu 24.04 LTS)
* **Web Server / Proxy:** Nginx 1.24.0 (Reverse Proxy to Node.js port 3000)
* **Process Manager:** PM2 (Daemonized Node.js runtime)
* **Repository:** [Guy0Kana/Git-azure-lab](https://github.com/Guy0Kana/Git-azure-lab)

---

##  Tech Stack & Architecture

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **API Integration:** OpenWeatherMap API (Proxied server-side via Node.js to keep API keys secure)
* **Server Management:** Nginx, PM2, systemd
* **CI/CD Pipeline:** GitHub Actions over SSH (`appleboy/ssh-action`)

---

##  Part 1: Shared Azure VM Setup & Administration

As per project guidelines, our team operates on a single shared Azure VM host with individual user accounts, key-based authentication, and shared repository permissions.

### 1. Multi-User Linux Provisioning
To prevent sharing account credentials or private SSH keys:
* **Team Group:** Created a dedicated system group `teamdev`.
* **User Accounts:** Provisioned separate user accounts (`guyokana`, `okeke`, `lincoln`) with individual public SSH keys appended to `~/.ssh/authorized_keys`.
* **Shared Workspace:** Created `/srv/team-project` set to `2775` permissions with `setgid` bit enabled so all newly created files automatically inherit `teamdev` group ownership.

### 2. Git & GitHub SSH Setup
Each team member generated an Ed25519 SSH key pair on the VM and registered their public key with their personal GitHub account:
```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub
ssh -T git@github.com
