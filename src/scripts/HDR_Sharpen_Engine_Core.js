// ============================================================================
// HDR_Sharpen_Engine_Core.js — Backend Processing Engine
// ============================================================================

#feature-id    Utilities > HDRSharpenEngine
#feature-info  A backend processing engine for unrolled HDR levels and multiscale sharpening.
#feature-menu  Utilities > HDR Sharpen Engine Core

function RunEnginePipeline(wHdr, mmt3, mmt4, usmS, usmA, wSharp, wOrig) {
    var activeWin = ImageWindow.activeWindow;
    if (activeWin.isNull) {
        console.writeln("Error: No active image workspace open.");
        return;
    }

    console.writeln("=== Starting Backend Processing Pipeline ===");
    
    // Extract or Clone Luminance
    var baseLumWin;
    if (activeWin.currentView.image.isColor) {
        var ccie = new ChannelExtraction;
        ccie.colorSpace = ChannelExtraction.prototype.CIELab;
        ccie.channels = [[true, ""], [false, ""], [false, ""]];
        ccie.executeOn(activeWin.mainView);
        baseLumWin = ImageWindow.activeWindow;
        baseLumWin.mainView.id = "Original_Luminance";
    } else {
        baseLumWin = new ImageWindow(
            activeWin.mainView.image.width, activeWin.mainView.image.height,
            activeWin.mainView.image.numberOfChannels, activeWin.bitsPerSample,
            activeWin.isFloatSample, activeWin.mainView.image.isColor, "Original_Luminance"
        );
        baseLumWin.mainView.beginProcess(0); 
        baseLumWin.mainView.image.apply(activeWin.mainView.image);
        baseLumWin.mainView.endProcess();
        baseLumWin.show();
    }
    
    var baseLumId = baseLumWin.mainView.id;
    var processedWins = [];
    var processedObjects = [];

    // Helper function for explicit structural cloning
    function clone(src, id) {
        var cl = new ImageWindow(src.mainView.image.width, src.mainView.image.height, src.mainView.image.numberOfChannels, src.bitsPerSample, src.isFloatSample, src.mainView.image.isColor, id);
        cl.mainView.beginProcess(0); cl.mainView.image.apply(src.mainView.image); cl.mainView.endProcess();
        cl.show(); return cl;
    }

    // Process unrolled HDR levels
    for (var i = 5; i <= 9; i++) {
        console.writeln("\n--- Processing HDR Layer Level: " + i + " ---");
        var winL = clone(baseLumWin, "Lum_HDR_L" + i);
        var hdr = new HDRMultiscaleTransform;
        hdr.numberOfLayers = i;
        hdr.numberOfIterations = 1;
        hdr.scalingFunction = "B3 Spline (5)";
        hdr.executeOn(winL.mainView);
        processedWins.push(winL.mainView.id);
        processedObjects.push(winL);
    }

    var formulaHDR = "((Lum_HDR_L5 * 0.20) + (Lum_HDR_L6 * 0.20) + (Lum_HDR_L7 * 0.20) + (Lum_HDR_L8 * 0.20) + (Lum_HDR_L9 * 0.20)) * " + wHdr.toFixed(4) + " + (" + baseLumId + " * " + (1.0 - wHdr).toFixed(4) + ")";
    console.writeln("\n=== Generating Intermediate HDR Blend ===");
    var pm = new PixelMath; pm.expression = formulaHDR; pm.useSingleExpression = true; pm.createNewImage = true; pm.newImageId = "hdrblend";
    pm.executeOn(ImageWindow.windowById(baseLumId).mainView);
    var hdrBlendWin = ImageWindow.activeWindow;

    console.writeln("\n=== Processing Sharpening Stages ===");
    var mltWin = clone(hdrBlendWin, "Lum_MMT_Sharp");
    var mmt = new MultiscaleMedianTransform;
    mmt.layers = [[true, true, 0.000], [true, true, 0.000], [true, true, mmt3], [true, true, mmt4], [true, true, 0.100], [true, true, 0.100], [true, true, 0.100], [true, false, 0.000]];
    mmt.executeOn(mltWin.mainView);

    var usmWin = clone(hdrBlendWin, "Lum_USM_Sharp");
    var usm = new UnsharpMask; usm.sigma = usmS; usm.amount = usmA; usm.target = UnsharpMask.prototype.Lightness;
    usm.executeOn(usmWin.mainView);

    var formulaSharp = "(Lum_MMT_Sharp * 0.25) + (Lum_USM_Sharp * 0.25) + (" + baseLumId + " * 0.50)";
    console.writeln("\n=== Generating Intermediate Sharp Blend ===");
    var pmS = new PixelMath; pmS.expression = formulaSharp; pmS.useSingleExpression = true; pmS.createNewImage = true; pmS.newImageId = "sharpblend";
    pmS.executeOn(ImageWindow.windowById(baseLumId).mainView);
    var sharpBlendWin = ImageWindow.activeWindow;

    var finalFormula = "(hdrblend * " + wHdr.toFixed(4) + ") + (sharpblend * " + wSharp.toFixed(4) + ") + (" + baseLumId + " * " + wOrig.toFixed(4) + ")";
    console.writeln("\n=== Executing Final Master Combination ===");
    var pmF = new PixelMath; pmF.expression = finalFormula; pmF.useSingleExpression = true; pmF.createNewImage = true; pmF.newImageId = "lumfinal";
    pmF.executeOn(ImageWindow.windowById(baseLumId).mainView);

    console.writeln("\n=== Executing Workspace Clean-up ===");
    for (var j = 0; j < processedObjects.length; j++) { if (!processedObjects[j].isNull) processedObjects[j].forceClose(); }
    if (!mltWin.isNull) mltWin.forceClose();
    if (!usmWin.isNull) usmWin.forceClose();
    if (!hdrBlendWin.isNull) hdrBlendWin.forceClose();
    if (!sharpBlendWin.isNull) sharpBlendWin.forceClose();
    if (!baseLumWin.isNull) baseLumWin.forceClose();

    console.writeln("\n=== Script Completed Successfully ===");
}
