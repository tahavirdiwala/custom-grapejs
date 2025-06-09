import { Editor } from "grapesjs";

// Custom Button Component Definition
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
        },
        // Define editable traits/properties
        traits: [
          {
            type: "text",
            name: "content",
            label: "Button Text",
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
            ],
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
            ],
            changeProp: true,
          },
        ],
      },

      // Handle trait changes
      init() {
        // Listen for trait changes
        this.on("change:attributes", this.handleAttributeChange);
        this.on("change:button-style", this.handleStyleChange);
        this.on("change:button-size", this.handleSizeChange);
        this.on("change:content", this.handleContentChange);
      },

      handleAttributeChange() {
        const attrs = this.getAttributes();
        this.addAttributes(attrs);
      },

      handleStyleChange() {
        const style = this.get("button-style");
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

      handleSizeChange() {
        const size = this.get("button-size");
        const sizeMap = {
          small: { padding: "8px 16px", "font-size": "14px" },
          medium: { padding: "12px 24px", "font-size": "16px" },
          large: { padding: "16px 32px", "font-size": "18px" },
        } as Record<string, object>;

        if (sizeMap[size]) {
          this.addStyle(sizeMap[size]);
        }
      },

      handleContentChange() {
        const content = this.get("content");
        this.components(content);
      },
    },

    // Define the view (optional - for custom behavior)
    view: {
      event: {
        dblclick: "editContent",
      },

      editContent() {
        const content = prompt("Enter button text:", this.model.get("content"));
        if (content !== null) {
          this.model.set("content", content);
          this.model.components(content);
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
    media: `<svg viewBox="0 0 24 24" width="24" height="24">
        <rect x="2" y="6" width="20" height="12" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
        <text x="12" y="14" text-anchor="middle" font-size="8" fill="currentColor">BTN</text>
      </svg>`,
    category: "Custom Components",
  });

  // Advanced Button with Icon
  editor.DomComponents.addType("icon-button", {
    model: {
      defaults: {
        tagName: "button",
        classes: ["icon-btn"],
        content: `
            <span class="btn-icon">🚀</span>
            <span class="btn-text">Launch</span>
          `,
        style: {
          display: "inline-flex",
          "align-items": "center",
          gap: "8px",
          "background-color": "#007bff",
          color: "#ffffff",
          border: "none",
          padding: "12px 24px",
          "border-radius": "6px",
          cursor: "pointer",
          "font-size": "16px",
          "font-weight": "500",
          transition: "all 0.3s ease",
        },
        traits: [
          {
            type: "text",
            name: "icon",
            label: "Icon (Emoji/Unicode)",
            changeProp: true,
          },
          {
            type: "text",
            name: "text",
            label: "Button Text",
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
        ],
      },

      init() {
        this.on(
          "change:icon change:text change:icon-position",
          this.updateContent
        );
      },

      updateContent() {
        const icon = this.get("icon") || "🚀";
        const text = this.get("text") || "Launch";
        const position = this.get("icon-position") || "left";

        const content =
          position === "left"
            ? `<span class="btn-icon">${icon}</span><span class="btn-text">${text}</span>`
            : `<span class="btn-text">${text}</span><span class="btn-icon">${icon}</span>`;

        this.components(content);
      },
    },
  });

  // Add icon button to block manager
  editor.BlockManager.add("icon-button", {
    label: "Icon Button",
    content: {
      type: "icon-button",
    },
    media: `<svg viewBox="0 0 24 24" width="24" height="24">
        <rect x="2" y="6" width="20" height="12" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
        <circle cx="8" cy="12" r="2" fill="currentColor"/>
        <text x="16" y="14" text-anchor="middle" font-size="6" fill="currentColor">TEXT</text>
      </svg>`,
    category: "Custom Components",
  });

  // CTA (Call to Action) Button
  editor.DomComponents.addType("cta-button", {
    model: {
      defaults: {
        tagName: "a",
        classes: ["cta-btn"],
        attributes: {
          href: "#",
          target: "_self",
        },
        content: "Get Started Now!",
        style: {
          display: "inline-block",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#ffffff",
          "text-decoration": "none",
          padding: "16px 32px",
          "border-radius": "50px",
          "font-size": "18px",
          "font-weight": "600",
          "text-transform": "uppercase",
          "letter-spacing": "1px",
          "box-shadow": "0 4px 15px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          cursor: "pointer",
        },
        traits: [
          {
            type: "text",
            name: "content",
            label: "CTA Text",
            changeProp: true,
          },
          {
            type: "text",
            name: "href",
            label: "Link URL",
          },
          {
            type: "select",
            name: "target",
            label: "Link Target",
            options: [
              { id: "_self", name: "Same Window" },
              { id: "_blank", name: "New Window" },
            ],
          },
          {
            type: "color",
            name: "bg-color",
            label: "Background Color",
            changeProp: true,
          },
        ],
      },

      init() {
        this.on("change:content", () => {
          this.components(this.get("content"));
        });
        this.on("change:bg-color", () => {
          const color = this.get("bg-color");
          if (color) {
            this.addStyle({ background: color });
          }
        });
      },
    },
  });

  // Add CTA button to block manager
  editor.BlockManager.add("cta-button", {
    label: "CTA Button",
    content: {
      type: "cta-button",
    },
    media: `<svg viewBox="0 0 24 24" width="24" height="24">
        <rect x="1" y="5" width="22" height="14" rx="7" stroke="currentColor" stroke-width="2" fill="none"/>
        <text x="12" y="14" text-anchor="middle" font-size="7" fill="currentColor">CTA</text>
      </svg>`,
    category: "Custom Components",
  });
};

export default CustomButtonPlugin;
