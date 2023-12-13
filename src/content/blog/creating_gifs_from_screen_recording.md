---
author: Anoj Perera
pubDatetime: 2023-12-12 23:11:17 
title: Creating Gif from a screen recording using `ffmpeg` 
postSlug: ffmpeg-gif
featured: true
draft: false
tags:
  - ffmpeg
  - gif
ogImage: ""
description: Creating Gif from a screen recording using `ffmpeg`
---
When you make pull requests are commenting on a case sometimes its easier to have a gif animation of your issue or the problem you solved rather than
describing in million words. You can do that pretty easily on a mac using couple of commands. Use quicktime player to do a screen recording.

Once the screen recording is done the run below command with input parameter to create a gif. 
Prequisite is to have `ffmpeg` installed which, you can do that from `brew install ffmpeg`.

`ffmpeg -i [input_file] -filter_complex 'fps=10,scale=[width]:-1:flags=lanczos,split [o1] [o2];[o1] palettegen [p]; [o2] fifo [o3];[o3] [p] paletteuse' [output_file].gif`

Don't forget to fill in the parameter in square brackets.
