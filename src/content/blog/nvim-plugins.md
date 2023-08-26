---
author: Anoj Perera
pubDatetime: 2023-08-26 00:52:58
title: Life after Emacs and Vim Plugins.
postSlug: life-after-emacs-and-vim-plugins
featured: true
draft: false
tags:
  - plugins
  - article
  - opinion
  - vim
ogImage: ""
description:
  Been using Vim / Nvim for a while and after 14 years of emacs do I miss it?.
  I guess Vim plugins do an awesome job I don't really need it.
---

Its been over two years since I switched over to Nvim. Do I miss Emacs. I don't think so.
I was not religious about emacs or vim. I always knew them as great editors. A must have
tool for a software engineer. After using emacs for over 14 plus years, I dont think I miss
emacs at all. May be Vim does a pretty good job of replacing all the features I'd using in emacs
which is not alot. I used `org-mode` for organisation. Various major mode for the myriad of languages
I was using, namely `C, Python, Javascript`. `LSP` was non existing or at its infancy at the time, so
`yasnippets` on emacs for completion and `magit` for `git` integration. All those have been replaced by
a great list of plugins in Nvim. And I really enjoy having to work in the terminal.

Here are the short list of plugins I use on a daily basis.

| Plugin                                                                                  |
| --------------------------------------------------------------------------------------- |
| packer - Plugin Manager                                                                 |
| telescope - Finding files                                                               |
| netrtw - File browsing                                                                  |
| onedark - Darkmode theme                                                                |
| treesitter - Parsing code and code highlight                                            |
| undotree - Undo tree                                                                    |
| lspzero - zero config language server. This plug in avoids the complecated setup of LSP |
| autopairs - Must have clever completion of quotes, parenthesis and curly brackets etc   |
| Lualine - Gives a cool status bar                                                       |
| gitsins - Must have tool for git operations.                                            |
| vim-fugitive - Git operations                                                           |
| vim-commentary - Git commits                                                            |
| ripgrep - Extreamly fast grepping                                                       |
| null-ls - I use this mainly for typescript / javascript linting                         |

Well that is in a nutshell. Below is the detail packer file.

```lua
-- Only required if you have packer configured as `opt`
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  -- Packer can manage itself
  use('wbthomason/packer.nvim')

  -- Telescope for navigation
  use({
    'nvim-telescope/telescope.nvim', tag = '0.1.0',
    -- or                            , branch = '0.1.x',
    requires = { { 'nvim-lua/plenary.nvim' } }
  })

  use({ "nvim-telescope/telescope-file-browser.nvim" })

  -- Using Packer
  use('navarasu/onedark.nvim')

  -- Tree sitter
  use('nvim-treesitter/nvim-treesitter', { run = ':TSUpdate' })
  use 'nvim-treesitter/nvim-treesitter-context'

  use('mbbill/undotree')
  use('tpope/vim-fugitive')
  use('tpope/vim-commentary')
  use {
    'VonHeikemen/lsp-zero.nvim',
    requires = {
      -- LSP Support
      { 'neovim/nvim-lspconfig' },
      { 'williamboman/mason.nvim' },
      { 'williamboman/mason-lspconfig.nvim' },

      -- Autocompletion
      { 'hrsh7th/nvim-cmp' },
      { 'hrsh7th/cmp-buffer' },
      { 'hrsh7th/cmp-path' },
      { 'saadparwaiz1/cmp_luasnip' },
      { 'hrsh7th/cmp-nvim-lsp' },
      { 'hrsh7th/cmp-nvim-lua' },

      -- Snippets
      { 'L3MON4D3/LuaSnip' },
      { 'rafamadriz/friendly-snippets' },
    }
  }

  use {
    "windwp/nvim-autopairs",
    config = function() require("nvim-autopairs").setup {} end
  }

  use('nvim-lualine/lualine.nvim')

  use ('lewis6991/gitsigns.nvim')

  use('jremmen/vim-ripgrep')

  use('jose-elias-alvarez/null-ls.nvim')

  -- install without yarn or npm
  use({
      "iamcco/markdown-preview.nvim",
      run = function() vim.fn["mkdp#util#install"]() end,
  })

end)
```
