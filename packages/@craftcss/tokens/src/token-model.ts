import type { TokenModel } from "./types";

export const tokenModel = {
  primitive: {
    color: {
      neutral: {
        0: "#fff",
        100: "#f6f7f9",
        200: "#e8ecf1",
        700: "#3c4857",
        900: "#1a212b",
      },
      brand: {
        500: "#2f6fed",
        600: "#1f5ad2",
      },
      success: {
        500: "#167a4d",
      },
      danger: {
        500: "#bf2f44",
      },
    },
    space: {
      0: "0rem",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      6: "1.5rem",
      8: "2rem",
    },
    radius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      pill: "9999px",
    },
    font: {
      family: {
        sans: '"Segoe UI", "Inter", system-ui, sans-serif',
      },
      weight: {
        regular: "400",
        medium: "500",
        semibold: "600",
      },
    },
  },
  semantic: {
    color: {
      bg: {
        canvas: "{primitive.color.neutral.0}",
        subtle: "{primitive.color.neutral.100}",
      },
      fg: {
        default: "{primitive.color.neutral.900}",
        muted: "{primitive.color.neutral.700}",
        onBrand: "{primitive.color.neutral.0}",
      },
      border: {
        default: "{primitive.color.neutral.200}",
      },
      brand: {
        solid: "{primitive.color.brand.500}",
        solidHover: "{primitive.color.brand.600}",
      },
      status: {
        success: "{primitive.color.success.500}",
        danger: "{primitive.color.danger.500}",
      },
    },
    space: {
      inline: {
        sm: "{primitive.space.2}",
        md: "{primitive.space.4}",
      },
      block: {
        sm: "{primitive.space.2}",
        md: "{primitive.space.4}",
        lg: "{primitive.space.6}",
      },
    },
    radius: {
      control: "{primitive.radius.md}",
      surface: "{primitive.radius.lg}",
      pill: "{primitive.radius.pill}",
    },
    typography: {
      family: {
        body: "{primitive.font.family.sans}",
      },
      weight: {
        body: "{primitive.font.weight.regular}",
        emphasis: "{primitive.font.weight.medium}",
      },
      size: {
        body: "clamp(0.95rem, 0.92rem + 0.15cqi, 1.05rem)",
        title: "clamp(1.35rem, 1.2rem + 0.7cqi, 1.8rem)",
      },
      lineHeight: {
        body: "1.5",
        title: "1.25",
      },
    },
  },
  component: {
    button: {
      bg: {
        default: "{semantic.color.brand.solid}",
        hover: "{semantic.color.brand.solidHover}",
      },
      fg: {
        default: "{semantic.color.fg.onBrand}",
      },
      radius: "{semantic.radius.control}",
      paddingInline: "{semantic.space.inline.md}",
      paddingBlock: "{semantic.space.block.sm}",
      fontWeight: "{semantic.typography.weight.emphasis}",
    },
    card: {
      bg: "{semantic.color.bg.canvas}",
      borderColor: "{semantic.color.border.default}",
      radius: "{semantic.radius.surface}",
      padding: "{semantic.space.block.md}",
    },
    field: {
      bg: "{semantic.color.bg.canvas}",
      borderColor: "{semantic.color.border.default}",
      radius: "{semantic.radius.control}",
      paddingInline: "{semantic.space.inline.sm}",
      paddingBlock: "{semantic.space.block.sm}",
    },
  },
  theme: {
    artisan: {
      semantic: {
        color: {
          brand: {
            solid: "#2a67dc",
            solidHover: "#1d52b8",
          },
          bg: {
            canvas: "#fdfefe",
          },
        },
      },
      component: {
        button: {
          radius: "0.625rem",
        },
      },
    },
  },
} satisfies TokenModel;
