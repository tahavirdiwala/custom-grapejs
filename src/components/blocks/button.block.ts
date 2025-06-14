import type { Editor } from "grapesjs";

const CustomButtonPlugin = (editor: Editor) => {
  // Define the custom button component
  editor.DomComponents.addType("custom-button", {
    // Define the model
    model: {
      defaults: {
        tagName: "button",
        classes: ["custom-btn"],
        attributes: {
          type: "button",
        },
        content: "Click Me!",
        "button-text": "Click Me!",
        "icon-type": "none",
        "icon-position": "left",
        "icon-size": 16,
        style: {
          "background-color": "#007bff",
          color: "#ffffff",
          border: "none",
          padding: "12px 24px",
          "border-radius": "6px",
          cursor: "pointer",
          "font-size": "16px",
          "font-weight": "500",
          transition: "all 0.3s ease",
          display: "inline-flex",
          "align-items": "center",
          gap: "8px",
        },
        // Define editable traits/properties
        traits: [
          {
            type: "text",
            name: "button-text",
            label: "Button Text",
            changeProp: true,
          },
          {
            type: "select",
            name: "icon-type",
            label: "Icon Type",
            options: [
              { id: "none", name: "No Icon" },
              { id: "svg", name: "SVG Icon" },
            ],
            changeProp: true,
          },
          {
            type: "textarea",
            name: "svg-code",
            label: "SVG Code",
            placeholder: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>`,
            changeProp: true,
          },
          {
            type: "select",
            name: "icon-position",
            label: "Icon Position",
            options: [
              { id: "left", name: "Left" },
              { id: "right", name: "Right" },
            ],
            changeProp: true,
          },
          {
            type: "number",
            name: "icon-size",
            label: "Icon Size (px)",
            placeholder: "16",
            min: 8,
            max: 64,
            changeProp: true,
          },
          {
            type: "color",
            name: "icon-color",
            label: "Icon Color",
            changeProp: true,
          },
          {
            type: "select",
            name: "type",
            label: "Button Type",
            options: [
              { id: "button", name: "Button" },
              { id: "submit", name: "Submit" },
              { id: "reset", name: "Reset" },
            ],
          },
          {
            type: "text",
            name: "onclick",
            label: "onClick Event",
            placeholder: 'alert("Button clicked!")',
          },
          {
            type: "checkbox",
            name: "disabled",
            label: "Disabled",
          },
          {
            type: "select",
            name: "button-style",
            label: "Button Style",
            options: [
              { id: "primary", name: "Primary" },
              { id: "secondary", name: "Secondary" },
              { id: "success", name: "Success" },
              { id: "danger", name: "Danger" },
              { id: "warning", name: "Warning" },
              { id: "info", name: "Info" },
              { id: "custom", name: "Custom" },
            ],
            changeProp: true,
          },
          {
            type: "color",
            name: "custom-bg-color",
            label: "Custom Background",
            changeProp: true,
          },
          {
            type: "color",
            name: "custom-text-color",
            label: "Custom Text Color",
            changeProp: true,
          },
          {
            type: "select",
            name: "button-size",
            label: "Button Size",
            options: [
              { id: "small", name: "Small" },
              { id: "medium", name: "Medium" },
              { id: "large", name: "Large" },
              { id: "custom", name: "Custom" },
            ],
            changeProp: true,
          },
          {
            type: "text",
            name: "custom-padding",
            label: "Custom Padding",
            placeholder: "12px 24px",
            changeProp: true,
          },
          {
            type: "number",
            name: "custom-font-size",
            label: "Custom Font Size (px)",
            placeholder: "16",
            changeProp: true,
          },
          {
            type: "number",
            name: "border-radius",
            label: "Border Radius (px)",
            placeholder: "6",
            changeProp: true,
          },
        ],
      },

      // Process and validate SVG code
      processSVG(svgCode: string, size?: number, color?: string) {
        if (!svgCode || !svgCode.trim()) return "";

        try {
          // Clean up the SVG code
          const cleanSVG = svgCode.trim();

          // If it doesn't start with <svg, it might be malformed
          if (!cleanSVG.toLowerCase().startsWith("<svg")) {
            console.warn("SVG code must start with <svg tag");
            return "";
          }

          // Create a temporary div to parse the SVG
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = cleanSVG;
          const svgElement = tempDiv.querySelector("svg");

          if (!svgElement) {
            console.warn("No valid SVG element found");
            return "";
          }

          // Apply size if provided
          if (size && size > 0) {
            svgElement.setAttribute("width", size.toString());
            svgElement.setAttribute("height", size.toString());
          }

          // Apply color if provided
          if (color) {
            // Set color as CSS custom property
            svgElement.style.color = color;

            // Handle fill attribute
            const currentFill = svgElement.getAttribute("fill");
            if (
              !currentFill ||
              currentFill === "currentColor" ||
              currentFill === "none"
            ) {
              svgElement.setAttribute("fill", color);
            }

            // Handle stroke attribute
            const currentStroke = svgElement.getAttribute("stroke");
            if (currentStroke === "currentColor") {
              svgElement.setAttribute("stroke", color);
            }

            // Also apply to child elements that use currentColor
            const paths = svgElement.querySelectorAll(
              "path, circle, rect, polygon, line"
            );
            paths.forEach((path) => {
              if (path.getAttribute("fill") === "currentColor") {
                path.setAttribute("fill", color);
              }
              if (path.getAttribute("stroke") === "currentColor") {
                path.setAttribute("stroke", color);
              }
            });
          }

          // Ensure proper styling for inline display
          svgElement.style.display = "inline-block";
          svgElement.style.verticalAlign = "middle";
          svgElement.style.flexShrink = "0";

          return svgElement.outerHTML;
        } catch (error) {
          console.error("Error processing SVG:", error);
          return "";
        }
      },

      // Handle trait changes
      init() {
        // Listen for trait changes
        this.on("change:button-style", this.handleStyleChange);
        this.on("change:button-size", this.handleSizeChange);
        this.on(
          "change:custom-bg-color change:custom-text-color",
          this.handleCustomColors
        );
        this.on("change:border-radius", this.handleBorderRadius);
        this.on("change:disabled", this.handleDisabled);
        this.on("change:type change:onclick", this.handleButtonAttributes);
        this.on(
          "change:button-text change:icon-type change:svg-code change:icon-position change:icon-size change:icon-color",
          this.updateContent
        );

        // Initial content update - use timeout to ensure traits are loaded
        setTimeout(() => {
          this.updateContent();
        }, 0);
      },

      // Handle disabled state
      handleDisabled() {
        const isDisabled = this.get("disabled");
        if (isDisabled) {
          this.addAttributes({ disabled: "disabled" });
          this.addStyle({
            opacity: "0.6",
            cursor: "not-allowed",
            "pointer-events": "none",
          });
        } else {
          this.removeAttributes("disabled");
          this.addStyle({
            opacity: "1",
            cursor: "pointer",
            "pointer-events": "auto",
          });
        }
      },

      // Handle button type and onclick attributes
      handleButtonAttributes() {
        const type = this.get("type");
        const onclick = this.get("onclick");

        const attrs: Record<string, string> = {};

        if (type) {
          attrs.type = type;
        }

        if (onclick) {
          attrs.onclick = onclick;
        }

        if (Object.keys(attrs).length > 0) {
          this.addAttributes(attrs);
        }
      },

      handleStyleChange() {
        const style = this.get("button-style");

        if (style === "custom") {
          return;
        }

        const styleMap = {
          primary: { "background-color": "#007bff", color: "#ffffff" },
          secondary: { "background-color": "#6c757d", color: "#ffffff" },
          success: { "background-color": "#28a745", color: "#ffffff" },
          danger: { "background-color": "#dc3545", color: "#ffffff" },
          warning: { "background-color": "#ffc107", color: "#212529" },
          info: { "background-color": "#17a2b8", color: "#ffffff" },
        } as Record<string, object>;

        if (styleMap[style]) {
          this.addStyle(styleMap[style]);
        }
      },

      handleCustomColors() {
        const style = this.get("button-style");
        if (style === "custom") {
          const bgColor = this.get("custom-bg-color");
          const textColor = this.get("custom-text-color");

          const customStyle: Record<string, string> = {};
          if (bgColor) customStyle["background-color"] = bgColor;
          if (textColor) customStyle["color"] = textColor;

          if (Object.keys(customStyle).length > 0) {
            this.addStyle(customStyle);
          }
        }
      },

      handleBorderRadius() {
        const radius = this.get("border-radius");
        if (radius) {
          this.addStyle({ "border-radius": `${radius}px` });
        }
      },

      handleSizeChange() {
        const size = this.get("button-size");

        if (size === "custom") {
          const customPadding = this.get("custom-padding");
          const customFontSize = this.get("custom-font-size");

          const customStyle: Record<string, string> = {};
          if (customPadding) customStyle["padding"] = customPadding;
          if (customFontSize) customStyle["font-size"] = `${customFontSize}px`;

          if (Object.keys(customStyle).length > 0) {
            this.addStyle(customStyle);
          }
          return;
        }

        const sizeMap = {
          small: { padding: "8px 16px", "font-size": "14px" },
          medium: { padding: "12px 24px", "font-size": "16px" },
          large: { padding: "16px 32px", "font-size": "18px" },
        } as Record<string, object>;

        if (sizeMap[size]) {
          this.addStyle(sizeMap[size]);
        }
      },

      updateContent() {
        // Prevent recursive calls
        if (this._isUpdatingContent) return;
        this._isUpdatingContent = true;

        try {
          const buttonText = this.get("button-text") || "Click Me!";
          const iconType = this.get("icon-type") || "none";
          const iconPosition = this.get("icon-position") || "left";

          console.log("Updating content:", {
            buttonText,
            iconType,
            iconPosition,
          });

          if (iconType === "svg") {
            const svgCode = this.get("svg-code");
            const iconSize = this.get("icon-size") || 16;
            const iconColor = this.get("icon-color");

            console.log("SVG details:", { svgCode, iconSize, iconColor });

            if (svgCode && svgCode.trim()) {
              const processedSVG = this.processSVG(
                svgCode,
                iconSize,
                iconColor
              );

              console.log("Processed SVG:", processedSVG);

              if (processedSVG) {
                let finalContent = "";

                if (iconPosition === "left") {
                  finalContent = `<span class="btn-icon" style="margin-right: 8px; display: inline-flex; align-items: center; line-height: 0;">${processedSVG}</span><span class="btn-text">${buttonText}</span>`;
                } else {
                  finalContent = `<span class="btn-text">${buttonText}</span><span class="btn-icon" style="margin-left: 8px; display: inline-flex; align-items: center; line-height: 0;">${processedSVG}</span>`;
                }

                // Ensure flexbox styling when icon is present
                this.addStyle({
                  display: "inline-flex",
                  "align-items": "center",
                  "justify-content": "center",
                  gap: "0px", // Remove gap since we're using margins
                });

                console.log("Final content with icon:", finalContent);
                this.components(finalContent);
                return;
              }
            }
          }

          // No icon or invalid SVG - just show text
          this.addStyle({
            display: "inline-block",
          });

          console.log("Final content without icon:", buttonText);
          this.components(buttonText);
        } finally {
          this._isUpdatingContent = false;
        }
      },
    },

    // Define the view
    view: {
      event: {
        dblclick: "editContent",
      },

      editContent(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        const currentText = this.model.get("button-text") || "Click Me!";
        const newText = prompt("Enter button text:", currentText);

        if (newText !== null && newText !== currentText) {
          this.model.set("button-text", newText);
          // Force content update
          this.model.trigger("change:button-text");
        }
      },

      // Optional: Add visual feedback during editing
      onRender() {
        // Add a data attribute to indicate this is editable
        if (this.el) {
          this.el.setAttribute("data-editable", "true");
          this.el.style.cursor = "pointer";
          this.el.title = "Double-click to edit text";
        }
      },
    },
  });

  // Add the custom button to the block manager
  editor.BlockManager.add("custom-button", {
    label: "Custom Button",
    content: {
      type: "custom-button",
    },
    media: `<svg fill="#000000" width="40px" height="40px" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M31.9981689,11.9995104 C33.4659424,11.9985117 34.998291,13.1328 34.998291,16.1348 L34.998291,16.1348 L34.998291,26 C34.998291,27.5134277 36.3779053,28.1114014 36.9779053,28.3114014 L36.9779053,28.3114014 L43.8,30.8 C46.7,31.9 48.5,35 47.7,38.2 L47.7,38.2 L44.5,48.5995 C44.3,49.3995 43.6,49.9995 42.7,49.9995 L42.7,49.9995 L26.6,49.9995 C25.8,49.9995 25.1,49.5995 24.8,48.8995 C20.9318685,39.9190553 18.7869873,34.9395752 18.3653564,33.9610596 C17.9437256,32.9825439 18.2219401,32.1955241 19.2,31.6 C21,30.3 23.7,31.6395508 24.8,33.5395508 L24.8,33.5395508 L26.4157715,35.7431828 C27.0515137,36.9508 29,36.9508 29,35.1508 L29,35.1508 L29,16.1348 C29,13.1328 30.5303955,12.0005117 31.9981689,11.9995104 Z M46,2 C48.2,2 50,3.8 50,6 L50,6 L50,21 C50,22.882323 48.1813389,25.0030348 46,25 L46,25 L40.010437,25 C39,25 39,24.1881157 39,24.059082 L39,15.5 C39,11.6547018 37.0187988,8 32,8 C26.9812012,8 25,11.1879783 25,15.5 L25,15.5 L25,24.059082 C25,24.4078007 24.7352295,25 23.987793,25 L23.987793,25 L6,25 C3.8,25 2,23.2 2,21 L2,21 L2,6 C2,3.8 3.8,2 6,2 L6,2 Z"></path> </g></svg>`,
    category: "Custom Components",
  });

  console.log(
    "Custom button component with dynamic SVG support added successfully!"
  );
};

export default CustomButtonPlugin;
