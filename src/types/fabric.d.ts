declare module 'fabric' {
  export const fabric: {
    Canvas: any;
    Text: any;
    Textbox: any;
    Image: fabric.ImageConstructor;
    Rect: any;
    Circle: any;
    [key: string]: any;
  };
}

// Declaración global del namespace fabric
declare namespace fabric {
  interface Canvas {
    clear(): void;
    add(object: any): void;
    remove(object: any): void;
    renderAll(): void;
    toDataURL(options?: any): string;
    getObjects(): any[];
    setWidth(value: number): void;
    setHeight(value: number): void;
    dispose(): void;
    setActiveObject(object: any): void;
    sendToBack(object: any): void;
  }
  interface Text {
    setText(text: string): void;
    setFontSize(size: number): void;
    setFontFamily(family: string): void;
    setFill(color: string): void;
  }
  interface Textbox {
    setText(text: string): void;
    setFontSize(size: number): void;
    setFontFamily(family: string): void;
    setFill(color: string): void;
    set(options: any): void;
  }
  interface Image {
    setSrc(src: string, callback?: () => void): void;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
    left: number;
    top: number;
    setScaleX(value: number): void;
    setScaleY(value: number): void;
    scale(value: number): void;
    set(options: any): void;
  }
  
  interface ImageConstructor {
    fromURL(url: string, callback: (img: fabric.Image) => void): void;
  }
  interface Rect {
    setWidth(value: number): void;
    setHeight(value: number): void;
    setFill(color: string): void;
  }
  interface Circle {
    setRadius(radius: number): void;
    setFill(color: string): void;
  }
}
