let _widgetId = "_by_denzel";

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const getDom = async (selector) => {
  if (selector instanceof HTMLElement) {
    return selector;
  }
  let dom = document.querySelector(selector);
  let n = 10;
  while (!dom && n--) {
    dom = document.querySelector(selector);
    await sleep(500);
  }
  return dom || null;
};

const initL2DWidget = async (
  options = {},
  targetQuery,
  widgetStyle = {},
  canvaStyle = {},
  dialogStyle = {}
) => {
  const widgetId = "live2d-widget" + _widgetId;
  if (!(options.model && options.model.jsonPath)) {
    console.error("model.jsonPath not found");
    return;
  }
  L2Dwidget.init(
    Object.assign(
      {
        name: {
          div: widgetId,
        },
      },
      options
    )
  );

  try {
    const target = await getDom(targetQuery);

    if (target && target !== document.body) {
      let widget = await getDom(`body #${widgetId}`);
      widget.removeAttribute("style");
      if (widget && widgetStyle instanceof Object) {
        const keys = Object.keys(widgetStyle);
        for (const k of keys) {
          widget.style[k] = widgetStyle[k];
        }
      }

      const dialog = widget.querySelector(".live2d-widget-dialog-container");
      if (dialog && dialogStyle instanceof Object) {
        const keys = Object.keys(dialogStyle);
        for (const k of keys) {
          dialog.style[k] = dialogStyle[k];
        }
      }

      const canvas = widget.querySelector("#live2dcanvas");
      if (canvas) {
        canvas.removeAttribute("style");
      }

      if (canvas && canvaStyle instanceof Object) {
        const keys = Object.keys(canvaStyle);
        for (const k of keys) {
          canvas.style[k] = canvaStyle[k];
        }
      }

      if (target) {
        target.append(widget);
      }
    }
  } catch (error) {
    console.error("[initL2DWidget Error]: ", error);
  }
};

initL2DWidget(
  {
    model: {
      jsonPath: "packages/小埋/13.json",
      scale: 0.6,
    },
    dialog: {
      enable: true,
      script: {
        "tap body": "Coding!!!",
        "tap face": "你在认真写代码吗？",
      },
    },
    display: {
      width: 200,
      height: 200,
      // vOffset: 20,
    },
  },
  "#workbench\\.parts\\.editor",
  {
    position: "absolute",
    "z-index": 1,
    width: "200px",
    height: "200px",
    right: 0,
    bottom: 0,
    "pointer-events": "none",
  },
  {
    width: "100%",
    height: "100%",
  },
  {
    top: "-50px",
  }
);
