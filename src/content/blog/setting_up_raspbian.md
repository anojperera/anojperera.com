---
author: Anoj Perera
pubDateTime: 2023-12-31T17:41:46 
title: Setting up a raspberry pi as a local mongo server
postSlug:-setting-up-a-raspberry-pi-as-a-local-mongo-server
featured: true
draft: false
tags:
  - raspberry-pi
  - tech
  - mac
ogImage: ""
description:
  How to set up a raspberry pi server for hosting MongoDB and connect with your 
  cloud provider.
___

# Challenge.
A little pet project I was working on needed a document db store. My solution was going to be in AWS therefore I looked 
around for technologies offered by AWS. However without having to pay large amounts of money I couldn't find anything cheap.
Then I tried to use Atlas free service with a peered connection to AWS account. However MongoDB Atlas requires and M10 and 
above which you have to pay again. So I resorted to using a raspberry-pi until I get my solution up and running. I bought the 
latest Pi from Pihut. Ordered a micro sd card and `USB-C` adapter from Amazon. Then downloaded the image from 
official `Raspberry-Pi` download site. Here's how a I went about putting the image into the sd card and set up `MongoDB`.

## Installing the image on to the Micro SD Card
I am using a mac, set up will be very similar in a `unix/linux` environment.
Plug the micro sd card into the USB-C adapter and into a USB-C port on the mac. If you have a SD card slot most micro sd 
cards are sold with SD card adaptors which you can plug directly into the Macs with SD card slots.
