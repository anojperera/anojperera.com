---
author: Anoj Perera
pubDatetime: 2023-04-04 15:04:54Z
title: My editor of choice
postSlug: editor-of-choice
featured: true
draft: false
tags:
  - docs
ogImage: ""
description: How and why I use nvim as my editor of choice.
---

Here's tale of how I switched from a long term `Emacs` user to vim.

## Long time ago

Long long time ago when I started development it was in VBA IDE which came with Excel / Office automation. At the time linux was getting noticed and I
was just getting started with the `LAMP` stack. `Nano` editor which is packed with most linux distros was godsend, as I couldn't workout how vim worked.
Editing config files on the server or fixing code was always an apprehensive task. Then I find my way in to the world of Emacs and stuck with it for the
next 15+ years. `Org-mode` is the best thing since sliced bread. I've tried taking notes and scheduling with outlook, Excel spreadsheets nothing comes close
to the dexterity offered by `Org-mode` and `Emacs`. I used yasnippets for code completion and suggestion (not that I relied too much). Major modes provided
code highlighting etc.

## LSP

In 2021 language server protocol known as `LSP` is popular. I thought I will give it a try to reduce the complexity of my config file. I don't know why
because emacs major mode provided everything I needed. Jumping to definitions and quick look ups in javascript was not so snappy. Once LSP was configured
everything seemed alright however javascript/typescript even python jumping to definitions had noticable delays. In an effort to fix it, as anyone would
do I scoured the internet and came across youtube videos on `nvim` and `LSP` from [ThePrimeagen](https://www.youtube.com/@ThePrimeagen). I was amazed
at the speed at which everything just worked. After a few efforts to get the perfect set up, I finally switched vim/nvim. These days, I use nvim
exclusively and really enjoy it.

## Emacs vs vim

As for the editor wars, having used both, I can say that its not a like for like comparison. `Vim` is just an editor and really good one if not the best.
Emacs is a very good editor, email client, file browser chat client, coffee maker, dating app plus more. I switched to nvim not because emacs is a less of
a product. I was too lazy to fix the issue I had.
