---
author: Anoj Perera
pubDatetime: 2023-04-04 17:13:54Z
title: nvim config
postSlug: nvim-config
featured: true
draft: false
tags:
  - config
ogImage: ""
description: My nvim config.
---

Here's my nvim config.

## Folder Structure

Below folder structure in `~/.config/nvim`.

```
├── after
│   └── plugin
│       ├── color.lua
│       ├── fugitive.lua
│       ├── lsp.lua
│       ├── lualine.lua
│       ├── null-ls.lua
│       ├── telescope.lua
│       ├── treesitter.lua
│       └── undotree.lua
├── ftplugin
│   └── c.lua
├── init.lua
├── lua
│   └── ap
│       ├── init.lua
│       ├── packer.lua
│       ├── remap.lua
│       └── set.lua
└── plugin
    └── packer_compiled.lua
```

## Packer config

My packer config, full config can be found in my [GitHub](https://github.com/anojperera/emacs_config/tree/dev/.config/nvim)
I followed [Video from ThePrimegen](https://www.youtube.com/watch?v=w7i4amO_zaE&t=2s)

```lua
-- This file can be loaded by calling `lua require('plugins')` from your init.vim

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

  use {
    'lewis6991/gitsigns.nvim',
    config = function()
      require('gitsigns').setup()
    end
  }
  use('jremmen/vim-ripgrep')

  use('jose-elias-alvarez/null-ls.nvim')

  -- install without yarn or npm
  use({
      "iamcco/markdown-preview.nvim",
      run = function() vim.fn["mkdp#util#install"]() end,
  })
end)
```
