# YSWS Bot

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](./LICENSE)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0-blue)
![Slack Bolt](https://img.shields.io/badge/slack--bolt-4.x-orange)
![Status](https://img.shields.io/badge/status-active-brightgreen)

A Slack bot to access HackClub's YSWS (Your Space With Support) programs right inside Slack — no need to switch between your browser and Slack!

## 🚀 Features

- 📋 View **active**, **indefinite**, **inactive**, and **draft** YSWS programs
- 🔢 Paginated and numbered listings
- ⚡ Brings the YSWS web UI into Slack for a seamless experience

## 🛠️ Built With

- TypeScript
- Slack Bolt
- Node.js

## 📦 Setup & Installation

1. **Install dependencies** (don't forget to install `pnpm`)
    ```bash
    pnpm install
    ```

2. **Configure environment**

   Copy the sample environment file and fill in your credentials:

   ```bash
   cp .env.sample .env
   ```

3. **Start the bot**

   ```bash
   pnpm run dev
   ```

> Note: Make sure to set up your Slack app and add the necessary permissions for the bot to function correctly.
> You can find the setup instructions in the [Slack API documentation](https://api.slack.com/start/building/bolt).


## 📌 Usage

* Interact with the bot using Slack slash commands.
* Get a well-formatted, paginated list of YSWS programs directly in Slack.
* Button actions for pagination and links to program resources.

## 🪪 License

This project is licensed under the [GNU General Public License v3.0 (GPLv3)](./LICENSE).

---

**Author**: Krish ([@ikrishagarwal](https://github.com/ikrishagarwal))
