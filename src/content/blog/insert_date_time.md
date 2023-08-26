---
author: Anoj Perera
pubDatetime: 2023-08-26 09:46:30
title: Adding date time in vim.
postSlug: adding-datetime-in-vim
featured: true
draft: false
tags:
  - vim
  - tricks
ogImage: ""
description: Trick for adding date time in vim.
---

Often times you need to add date time while you are authoring content or comments to your
code. Vim ships with `strftime` method. You can use that while in `insert-mode`, `C-r=strftime(`%F %T)`

Thats it. You can always add a keyboard shortcut.
<img src="/assets/insert_date_time.gif" alt=Inserting Date Time />
