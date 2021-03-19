/* eslint-disable */
class App {
    constructor(canvas) {
        this.canvas = canvas;
        this.frames = 0;
        this.fps = 0;
        this.lastFPSUpdate = 0;
        this.ctx = canvas.getContext('2d');
        this.shapes = [];
        this.render();
    }

    addShape(shape) {
        if (shape && !this.shapes.includes(shape)) {
            this.shapes.push(shape);
        }
    }

    setCurrentShape(shape) {
        this.currentShape = shape;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderShape(shape) {
        if (shape.canRender()) {
            this.ctx.save();
            this.ctx.translate(shape.x, shape.y);
            shape.render(this.ctx);
            this.ctx.restore();
        }
    }

    render() {
        requestAnimationFrame(() => {
            this.clear();

            this.shapes.forEach(shape => {
                this.renderShape(shape);
            });

            if (this.currentShape) {
                this.renderShape(this.currentShape);
            }

            this.render();

            // ///////////////////

            this.frames++;

            const now = performance.now();

            if (now - this.lastFPSUpdate >= 1000) {
                this.lastFPSUpdate = now;

                this.fps = this.frames;
                this.frames = 0;
            }

            this.renderFPS();
        });
    }

    renderFPS() {
        this.ctx.save();
        this.ctx.font = '12px Helvetica';
        this.ctx.fillText(`${this.fps} FPS`, 10, 30);
        this.ctx.restore();
    }
}
