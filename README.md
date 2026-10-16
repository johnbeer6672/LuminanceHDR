# LuminanceHDR
A script for PixInsight that allows you to extract a synthetic luminance, and add HDR and sharpening effects to it.
Luminance -HDR and Sharpening Script

What is it? What can it do?
By using and manipulating a synthetic luminance channel you can add an extra layer of depth to your images. HDR allows you to increase the range of brightnesses that can be conveyed in an image and by including a level of sharpening you can tighten up some of the details in your image also.
When should I use the script
It is to be used at the final stages of your starless image but before you add your stars back. 
Sharpening, what are the downsides to this?
When it comes to astrophotography, integration time is king, if you do not have enough data, it is very easy to overstretch your image and it can break down. At low integration time there is also more noise. If you add sharpening to an already noisy image it is going to amplify this noise.
How do I install it
Until I sort out an online repository then the two files (HDR_Sharpen_Engine_Core.js and HDR-Sharp-lum-ui.js) should be placed in a folder where you can easily locate them (I have mine in a folder in C:\Program Files\PixInsight\src\scripts and I have called it JohnB-HDR).
Once I have the repository completed then you can load it the same way as any other PixInsight script, but until then you will need to follow these simple steps.
How do I run it?
In PixInsight navigate to Scripts\Execute Scripts and once there locate to the folder you created above and click on the HDR-Sharp-lum-ui.js file and press open. The user interface then opens for the script.
 
HDR Multiscale Transform Options
 
The first section of the program (in the background) creates a file that is a blend of the original synthetic luminance and the HDR mix (The HDR mix creates 5 different images, each with varying levels of HDR, this is then blended with Pixel Math with the original luminance file to create the HDR blend file).
By increasing the amount of HDR in your image it will increase the HDR effect in the final luminance channel. The baseline setting of 0.35 is a good starting point so you get a nice even mix. The outlying 0.65 is comprised of the original synthetic luminance channel.

Advanced Sharpening Details
 
Much like the HDR section, this creates two files, one is sharpened using Multiscale Linear Transform (MLT) and another is utilizing the Unsharp Mask (USM). I have found the setting for these 2 sharpening modules gives an overall good effectiveness. You can alter these directly from the dialogue boxes here but the third section is where I would recommend you fine tune them (please see below for the final mix)

Final Master Blend Percentage Composition
 
This final section is where you can tune how much HDR and Sharpening is applied to the final luminance output.
The sharpened Component mix can be altered if you are finding that there is too much sharpening to your luminance channel or that it is introduce artifacts if you have a noisy or low integration time. The higher the slider, the more sharpening is applied. 0.2 is the standard setting but I will normally run this at a lower figure. It is very image dependant. Some images really benefit from this effect whilst others do not suit it. 
The original baseline mix is the amount of the HDR is present in the final image. I find that 0.35 is a good overall setting and I rarely alter this, but if you want more HDR then increase this figure.
	
Once you have chosen your parameters you can press the execute process button to start the script, or close control panel to exit the script.
The program will run and create a series of files, these are used to blend the above options and once it has created the lumfinal it will delete extraneous files, leaving the one lumfinal image and your original colour image.
To apply this to your image simply use the LRGB process and drag it to your image 

 


John Beer.
