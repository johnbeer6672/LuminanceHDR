// ============================================================================
// HDR-Sharp-lum-ui.js — Pure Graphical Front-End Dashboard Shell
// ============================================================================
#feature-id    Utilities > HDRSharpenSuite
#feature-info  An advanced graphical interface to adjust configurations and generate custom dynamic micro-contrast blend profiles.
#feature-menu  Utilities

#include <pjsr/DataType.jsh>
#include <pjsr/StdButton.jsh>
#include <pjsr/FrameStyle.jsh>
#include <pjsr/TextAlign.jsh>
#include <pjsr/NumericControl.jsh>

// Include the isolated processing core safely away from the preprocessor layout compiler
#include "HDR_Sharpen_Engine_Core.js"

function HDRSharpenUIDialog() {
    this.__base__ = Dialog;
    this.__base__();
    
    var self = this;
    this.windowTitle = "HDR & Sharpening Suite Dashboard";

    this.mainSizer = new VerticalSizer();
    this.mainSizer.margin = 12;
    this.mainSizer.spacing = 10;

    this.helpLabel = new Label(this);
    this.helpLabel.margin = 8;
    this.helpLabel.wordWrapping = true;
    this.helpLabel.text = "Adjust configurations below to generate custom dynamic micro-contrast blend profiles.";
    this.mainSizer.add(this.helpLabel);

    // Group 1: HDR Sub-panel
    this.hdrBox = new GroupBox(this);
    this.hdrBox.title = "HDR Multiscale Transform Options";
    this.hdrBox.sizer = new VerticalSizer();
    this.hdrBox.margin = 6;
    this.hdrBox.spacing = 6;

    this.ctrlWHdr = new NumericControl(this);
    this.ctrlWHdr.label.text = "HDR Mix Weight (Global):";
    this.ctrlWHdr.setRange(0.0, 1.0);
    this.ctrlWHdr.setValue(0.35);
    this.ctrlWHdr.precision = 2;
    this.hdrBox.sizer.add(this.ctrlWHdr);
    this.mainSizer.add(this.hdrBox);

    // Group 2: Sharpening Sub-panel
    this.sharpBox = new GroupBox(this);
    this.sharpBox.title = "Advanced Sharpening Details";
    this.sharpBox.sizer = new VerticalSizer();
    this.sharpBox.margin = 6;
    this.sharpBox.spacing = 6;

    this.ctrlMmt3 = new NumericControl(this);
    this.ctrlMmt3.label.text = "MMT Layer 3 Detail Bias:";
    this.ctrlMmt3.setRange(0.0, 0.5);
    this.ctrlMmt3.setValue(0.100);
    this.ctrlMmt3.precision = 3;
    this.sharpBox.sizer.add(this.ctrlMmt3);

    this.ctrlMmt4 = new NumericControl(this);
    this.ctrlMmt4.label.text = "MMT Layer 4 Detail Bias:";
    this.ctrlMmt4.setRange(0.0, 0.5);
    this.ctrlMmt4.setValue(0.200);
    this.ctrlMmt4.precision = 3;
    this.sharpBox.sizer.add(this.ctrlMmt4);

    this.ctrlUsmSigma = new NumericControl(this);
    this.ctrlUsmSigma.label.text = "Unsharp Mask Radius (Sigma):";
    this.ctrlUsmSigma.setRange(1.0, 30.0);
    this.ctrlUsmSigma.setValue(14.0);
    this.ctrlUsmSigma.precision = 1;
    this.sharpBox.sizer.add(this.ctrlUsmSigma);

    this.ctrlUsmAmt = new NumericControl(this);
    this.ctrlUsmAmt.label.text = "Unsharp Mask Amplitude (Amt):";
    this.ctrlUsmAmt.setRange(0.0, 2.0);
    this.ctrlUsmAmt.setValue(0.80);
    this.ctrlUsmAmt.precision = 2;
    this.sharpBox.sizer.add(this.ctrlUsmAmt);
    this.mainSizer.add(this.sharpBox);

    // Group 3: Mastering Blend panel
    this.mixBox = new GroupBox(this);
    this.mixBox.title = "Final Master Blend Percentage Composition";
    this.mixBox.sizer = new VerticalSizer();
    this.mixBox.margin = 6;
    this.mixBox.spacing = 6;

    this.ctrlWSharp = new NumericControl(this);
    this.ctrlWSharp.label.text = "Sharpened Component Mix:";
    this.ctrlWSharp.setRange(0.0, 1.0);
    this.ctrlWSharp.setValue(0.20);
    this.ctrlWSharp.precision = 2;
    this.mixBox.sizer.add(this.ctrlWSharp);

    this.ctrlWOrig = new NumericControl(this);
    this.ctrlWOrig.label.text = "Original Baseline Mix:";
    this.ctrlWOrig.setRange(0.0, 1.0);
    this.ctrlWOrig.setValue(0.35);
    this.ctrlWOrig.precision = 2;
    this.mixBox.sizer.add(this.ctrlWOrig);
    this.mainSizer.add(this.mixBox);

    // Lower Window Command Action Row Buttons using standard native PushButton
    this.btnSizer = new HorizontalSizer();
    this.btnSizer.spacing = 10;

    this.okBtn = new PushButton(this);
    this.okBtn.text = "Execute Process";
    this.okBtn.onClick = function() { self.ok(); };

    this.cancelBtn = new PushButton(this);
    this.cancelBtn.text = "Close Control Panel";
    this.cancelBtn.onClick = function() { self.cancel(); };

    this.btnSizer.addStretch();
    this.btnSizer.add(this.okBtn);
    this.btnSizer.add(this.cancelBtn);

    this.mainSizer.addSpacing(6);
    this.mainSizer.add(this.btnSizer);
    this.sizer = this.mainSizer;
    this.adjustToContents();
}

HDRSharpenUIDialog.prototype = new Dialog();

function main() {
    var win = ImageWindow.activeWindow;
    if (win.isNull) {
        var msg = new MessageBox("Error: No active destination window opened. Open an image first.", "HDRSharpenSuite", 2, 1);
        msg.execute();
        return;
    }

    var dashboard = new HDRSharpenUIDialog();
    if (dashboard.execute()) {
        console.show();
        
        // Pass configurations straight out of UI variables across to the backend engine file layer
        RunEnginePipeline(
            dashboard.ctrlWHdr.value,
            dashboard.ctrlMmt3.value,
            dashboard.ctrlMmt4.value,
            dashboard.ctrlUsmSigma.value,
            dashboard.ctrlUsmAmt.value,
            dashboard.ctrlWSharp.value,
            dashboard.ctrlWOrig.value
        );
    }
}

main();
