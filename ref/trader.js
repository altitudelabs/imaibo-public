 //>>built
define("trader/charts/trader.charts", ["dojo", "dijit", "dojox"], function(fb, hb, ib) {
    (function(ja, fb) {
        function cb() {
            this.forceOneFrame = !1;
            this.animatedObjects = []
        }
        function ha(a, b) {
            return new v(a, b)
        }
        function ka() {
            this.isReady = !1;
            this.$parent = this.$container = this.$chartLayer = null;
            this.constructor === ka && Object.seal(this)
        }
        function v(a, b) {
            this.options = l.extend(b || {}, db);
            this.chart = this;
            this.animationInProgress = !1;
            this.animationDuration = this.options.animationDurationDefault;
            this.animationQueue = [];
            this.cAnim =
            new cb;
            this.cAnim.scope = this;
            v.superclass.constructor.call(this, this);
            this.chartType = a;
            this.options.period = +this.options.period;
            this.zoomOptions = l.getZoomOptions(this.options.zoomLevel);
            this.maxVisibleItems = this.getMaxVisibleItems();
            this.options.width = Math.max(this.options.width, this.options.minWidth);
            this.options.height = Math.max(this.options.height, this.options.minHeight);
            this.options.containerHeight = this.options.height;
            this.options.containerWidth = this.options.width;
            this.currentOffset = 0;
            this.activeTooltip =
            this.activeCrossHair = null;
            this.indicators = [];
            this.crossHairVLines = [];
            this.drawings = [];
            this._indicatorsCached = [];
            this._drawingsCached = [];
            this.$indicatorSep = null;
            this.indicatorSepDragPosition = 0;
            this.isReady = !0;
            this.init();
            this.priceBuy = new $(this, {type: "Buy",price: this.options.priceBuy});
            this.priceSell = new $(this, {type: "Sell",price: this.options.priceSell});
            this.openPosition = new B(this.chart);
            this._indicatorSepMouseDownHandler = this.handleIndicatorSepMouseDownEvent.bind(this);
            this._indicatorSepMouseMoveHandler =
            this.handleIndicatorSepMouseMoveEvent.bind(this);
            this._indicatorSepMouseUpHandler = this.handleIndicatorSepMouseUpEvent.bind(this);
            gb++;
            this.options.events.postInit.call(this);
            this.constructor === v && Object.seal(this)
        }
        function fa(a) {
            if (!(this instanceof fa))
                return new fa(a);
            this.chart = a || ea;
            this.$canvas = null;
            a = d.createElement("div", {"class": "layer canvasLayer unselectable"});
            this.$canvas = d.createElement("canvas", {width: this.chart.options.width ? this.chart.options.width : "100%",height: this.chart.options.height ?
                this.chart.options.height : "100%","class": "unselectable"});
            a.appendChild(this.$canvas);
            this.$canvasLayer = a;
            this.context = this.$canvas.getContext("2d");
            this.translateCanvas();
            this.constructor === fa && Object.seal(this)
        }
        function ba(a, b) {
            this.chart = a || ea;
            this.options = b || this.chart.options;
            var c = d.createElement("div", {"class": "layer canvasGridLayer unselectable"});
            this.$canvasGrid = d.createElement("canvas", {width: this.chart.options.width ? this.chart.options.width : "100%",height: this.chart.options.height ? this.chart.options.height :
                "100%","class": "unselectable"});
            c.appendChild(this.$canvasGrid);
            this.$canvasGridLayer = c;
            this.context = this.$canvasGrid.getContext("2d")
        }
        function ga(a, b) {
            if (!(this instanceof ga))
                return new ga(a, a.options);
            this.chart = a || ea;
            this.mainChart = this.chart instanceof D ? this.chart.chart : this.chart;
            this.options = b || this.chart.options;
            this.mouseXdragPos = this.mouseXposition = this.mouseYposition = 0;
            this.currentDrawingId = "";
            this.priceSnapshotEnabled = this.drawingSelected = this.moveDrawing = this.drawingEnabled = !1;
            this.$svg =
            this.$svgG = this.$svgGYlabel = this.$svgGXlabel = this.$svgCurrentGItem = this.$svgGdrawing = this.$svgGposition = this.$svgGLines = null;
            this._mouseDownHandler = this.handleMouseDownEvent.bind(this);
            this._mouseUpHandler = this.handleMouseUpEvent.bind(this);
            this._mouseMoveHandler = this.handleMouseMoveEvent.bind(this);
            this._mouseWheelHandler = this.handleMouseWheelEvent.bind(this);
            this.$svgLayer = this.renderSvgLayer();
            this.init();
            bb++;
            this.constructor === ga && Object.seal(this)
        }
        function na(a) {
            this.chart = a || ea;
            this.repeatTimer =
            null;
            this.currentPosition = this.sliderWidth = this.dragPosition = 0;
            this.$scrollLayer = d.createElement("div", {"class": "chart-scroller"});
            "auto" === this.chart.options.controls.scrollBar && d.addClass(this.$scrollLayer, "scroller-auto");
            this.$btnLeft = function() {
                var a = d.createElement("div", {"class": "scr-left"}), c = d.createElement("span");
                a.appendChild(c);
                return a
            }.call(this);
            this.$btnRight = function() {
                var a = d.createElement("div", {"class": "scr-right"}), c = d.createElement("span");
                a.appendChild(c);
                return a
            }.call(this);
            this.$sliderContainer = d.createElement("div", {"class": "scr_slider_container"});
            this.$scrollSlider = d.createElement("div", {"class": "scr_slider"});
            this.$sliderContainer.appendChild(this.$scrollSlider);
            this.$scrollLayer.appendChild(this.$btnLeft);
            this.$scrollLayer.appendChild(this.$sliderContainer);
            this.$scrollLayer.appendChild(this.$btnRight);
            this._mouseUpHandler = this.mouseUpHandler.bind(this);
            this._mouseMoveHandler = this.mouseMoveHandler.bind(this);
            this._handleScrollDocMouseUp = this.handleScrollDocMouseUp.bind(this);
            this.bindEvents();
            this.constructor === na && Object.seal(this)
        }
        function V(a) {
            this.chart = a;
            this.mainChart = this.chart instanceof D ? this.chart.chart : this.chart;
            this.$tooltip = this.tooltipMovingExtremes = this.mouseXPosition = this.mouseYPosition = this.tooltipXPosition = this.tooltipYPosition = this.svgOffset = null;
            this._tooltipUpdateHandler = this.update.bind(this);
            this._tooltipMouseOverHandler = this.handleMouseOverEvent.bind(this);
            this._tooltipMouseOutHandler = this.handleMouseOutEvent.bind(this);
            this._tooltipOverlayMouseMoveHandler =
            this.handleOverlayMouseMove.bind(this);
            !(this instanceof W) && this.bindEvents();
            this.constructor === V && Object.seal(this)
        }
        function I(a) {
            this.chart = a;
            this.mainChart = this.chart instanceof D ? this.chart.chart : this.chart;
            this.svg = this.chart.svg;
            this.crossPositionX = this.crossPositionY = this.$svgG = this.$svgYLine = this.$svgXLine = this.$svgTextXLabel = this.$svgGXlabel = this.$svgRectXLabel = this.$svgGYlabel = this.$svgRectYLabel = this.$svgTextYLabel = this.priceSnapshot = null;
            this.crossHairMoveExtremes = {minX: this.chart.options.marginLeft,
                maxX: this.chart.options.width - this.chart.options.marginRight,minY: this.chart.options.marginTop,maxY: this.chart.options.height - this.chart.options.marginBottom};
            this._mouseOverCrossHandler = this.handleMouseOverCrossEvent.bind(this);
            this._mouseMoveCrossHandler = this.handleMouseMoveCrossEvent.bind(this);
            this._mouseOutCrossHandler = this.handleMouseOutEvent.bind(this);
            this.bindEvents();
            this.chart.options.showCrossHair && this.render();
            this.constructor === I && Object.seal(this)
        }
        function oa(a) {
            this.chart = a;
            this.mainChart =
            this.chart instanceof D ? this.chart.chart : this.chart;
            this.scaleRect = this.pipsContainer = this.pipsLine = this.pipsBottomLine = this.pipsText = this.dragPosition = null;
            this.pipsArray = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1E3, 2E3, 2500, 5E3, 1E4, 2E4, 25E3, 5E4, 1E5];
            this._scaleMouseMove = this.scaleMouseMove.bind(this);
            this.render();
            this.bindEvents();
            this.constructor === oa && Object.seal(this)
        }
        function W(a) {
            W.superclass.constructor.call(this, a);
            this.$priceSnapshotG = this.$priceSnapshotLine = null;
            this.constructor === W && Object.seal(this)
        }
        function D(a) {
            this.chart = a;
            this.zoomOptions = this.chart.zoomOptions;
            this.maxVisibleItems = this.chart.maxVisibleItems;
            this.currentOffset = this.chart.currentOffset;
            "bottom" === this.params.type && D.superclass.constructor.call(this, a);
            this.constructor === D && Object.seal(this)
        }
        function y(a) {
            y.superclass.constructor.call(this, a);
            var b = this;
            a = this.chart.getAllDrawings();
            this.drawings = [];
            this.$layerSep = this.$indicatorTitle = this.$indicatorClose = null;
            this._closeButtonMouseUpEvent = this.destroy.bind(this);
            this._indicatorEdit =
            this.chart.options.events.indicatorEdit.bind(this, this);
            this.init();
            a.forEach(function(a) {
                ("vline" === a.params.code || "fibonacci-timezones" === a.params.code) && a.addExtensionLine(b)
            })
        }
        function pa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            pa.superclass.constructor.call(this, this.chart, this.params.type)
        }
        function qa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            qa.superclass.constructor.call(this, this.chart)
        }
        function ra(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            ra.superclass.constructor.call(this, this.chart)
        }
        function sa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            sa.superclass.constructor.call(this, this.chart)
        }
        function ta(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            ta.superclass.constructor.call(this, this.chart, this.params.type)
        }
        function ua(a, b) {
            this.chart = a ||
            l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            ua.superclass.constructor.call(this, a)
        }
        function va(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            va.superclass.constructor.call(this, a)
        }
        function wa(a,
        b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            wa.superclass.constructor.call(this, a)
        }
        function xa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            xa.superclass.constructor.call(this,
            a)
        }
        function ya(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            ya.superclass.constructor.call(this, this.chart)
        }
        function za(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            za.superclass.constructor.call(this,
            this.chart)
        }
        function Aa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Aa.superclass.constructor.call(this, this.chart)
        }
        function Ba(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ba.superclass.constructor.call(this, this.chart)
        }
        function Ca(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ca.superclass.constructor.call(this, a)
        }
        function Da(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Da.superclass.constructor.call(this, a)
        }
        function ia(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            ia.superclass.constructor.call(this, this.chart)
        }
        function Ea(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ea.superclass.constructor.call(this, a)
        }
        function Fa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Fa.superclass.constructor.call(this, this.chart)
        }
        function Ga(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ga.superclass.constructor.call(this, this.chart)
        }
        function Ha(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ha.superclass.constructor.call(this, a)
        }
        function Ia(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ia.superclass.constructor.call(this, a)
        }
        function Ja(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ja.superclass.constructor.call(this, a)
        }
        function Ka(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ka.superclass.constructor.call(this, a)
        }
        function La(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            La.superclass.constructor.call(this, a)
        }
        function Ma(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ma.superclass.constructor.call(this, a)
        }
        function Na(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Na.superclass.constructor.call(this, this.chart)
        }
        function Oa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Oa.superclass.constructor.call(this, this.chart)
        }
        function Pa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Pa.superclass.constructor.call(this, a)
        }
        function Qa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Qa.superclass.constructor.call(this, a)
        }
        function Ra(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ra.superclass.constructor.call(this, this.chart)
        }
        function Sa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Sa.superclass.constructor.call(this, this.chart)
        }
        function Ta(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ta.superclass.constructor.call(this, a)
        }
        function Ua(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ua.superclass.constructor.call(this, a)
        }
        function Va(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Va.superclass.constructor.call(this, a)
        }
        function Wa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Wa.superclass.constructor.call(this, a)
        }
        function Xa(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Xa.superclass.constructor.call(this, this.chart)
        }
        function Ya(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Ya.superclass.constructor.call(this, a)
        }
        function Za(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            Za.superclass.constructor.call(this, a)
        }
        function $a(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            $a.superclass.constructor.call(this, a)
        }
        function ab(a, b) {
            this.chart = a || l.error("Please supply reference to the current chart.");
            this.params = b || l.error("Please supply correct params object for the current Indicator.");
            this.setProperties();
            this.calcData(this.data);
            ab.superclass.constructor.call(this, a)
        }
        function A(a, b) {
            this.chart = a || ea;
            this.mainChart = this.chart instanceof D ? this.chart.chart : this.chart;
            this.params = b;
            this.minX = this.maxX = this.minY = this.maxY =
            this.heightY = this.minValue = this.maxValue = this.ratio = this.target = null;
            this.params.period = this.params.period || this.mainChart.options.period;
            this.snapped = !1;
            this._contextmenu = this.handleContextmenu.bind(this);
            this._drawingMouseDownHandler = this.handleDrawingMouseDownEvent.bind(this);
            this._drawingMoveHandler = this.handleDrawingMoveEvent.bind(this);
            this._mouseOverDrawingsHandler = this.handleMouseOverDrawingEvent.bind(this);
            this._mouseOutDrawingHandler = this.handleMouseOutDrawingEvent.bind(this);
            la++;
            this.updateValues();
            this.constructor === A && Object.seal(this)
        }
        function T(a, b, c, e) {
            T.superclass.constructor.call(this, a, e);
            this.lineYPosition = c || 0;
            this.drawing = {};
            c < this.maxY && c > this.minY && (a = q.getMousePositionCandleInfo(b, c, this.mainChart, this.chart.options), !this.params.price && (this.params.price = (+a.price).toFixed(this.chart.options.precision)), this.render(), this.bindEvents(), this.target = this.drawing.hoverLine);
            this.constructor === T && Object.seal(this)
        }
        function L(a, b, c, e) {
            a instanceof D ? L.superclass.constructor.call(this,
            a.chart, e) : L.superclass.constructor.call(this, a, e);
            a = q.getMousePositionCandleInfo(b, c, this.mainChart, this.chart.options);
            b = (a.candleNumber - this.mainChart.currentOffset) * (this.mainChart.zoomOptions.barWidth + this.mainChart.zoomOptions.barMargin) + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            this.extensionLines = [];
            this.drawing = {};
            b > this.minX && b < this.maxX && (this.xPosition = b, !this.params.timestamp && (this.params.timestamp = a.currentCandleTimestamp), this.render(), this.bindEvents(), this.target = this.drawing.hoverLine);
            this.constructor === L && Object.seal(this)
        }
        function G(a, b, c, e) {
            G.superclass.constructor.call(this, a, e);
            this.initialised = !1;
            this._mouseDoubleClick = this.handleMouseDoubleClickEvent.bind(this);
            q.isInVisibleArea.call(this, b, c) && (this.render(b, c), this.target = this.drawing.endHoverCircle, G.prototype.bindEvents.call(this));
            this.constructor === G && Object.seal(this)
        }
        function aa(a, b, c, e) {
            this.coeff = [0.382, 0.5, 0.618];
            aa.superclass.constructor.call(this, a, b, c, e);
            this.constructor === aa && Object.seal(this)
        }
        function ma(a,
        b, c, e) {
            ma.superclass.constructor.call(this, a, b, c, e);
            this.constructor === ma && Object.seal(this)
        }
        function ca(a, b, c, e) {
            this.coeff = [0.382, 0.5, 0.618];
            ca.superclass.constructor.call(this, a, b, c, e);
            this.constructor === ca && Object.seal(this)
        }
        function da(a, b, c, e) {
            this.coeff = [0, 0.114, 0.236, 0.382, 0.5, 0.618, 0.707, 0.764, 0.886, 1, 1.128, 1.236, 1.27, 1.382, 1.5, 1.618, 1.764, 2.618];
            da.superclass.constructor.call(this, a, b, c, e);
            this.constructor === da && Object.seal(this)
        }
        function Y(a, b, c, e) {
            this.coeff = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89,
                144, 233, 377, 610, 987];
            this.extensionLines = [];
            Y.superclass.constructor.call(this, a, b, c, e);
            if (q.isInVisibleArea.call(this, b, c))
                for (a = 0; a < this.coeff.length; a++)
                    this.drawing.fibonacciLabels[a].textContent = this.coeff[a];
            this.constructor === Y && Object.seal(this)
        }
        function P(a, b, c, e) {
            P.superclass.constructor.call(this, a, e);
            this.positioned = !1;
            q.isInVisibleArea.call(this, b, c) && (this.render(b, c), this.target = this.drawing.rightBottomHoverCircle);
            this.constructor === P && Object.seal(this)
        }
        function O(a, b, c, e) {
            O.superclass.constructor.call(this,
            a, e);
            this.positioned = !1;
            q.isInVisibleArea.call(this, b, c) && (this.render(b, c), this.target = this.drawing.rightBottomHoverCircle);
            this.constructor === O && Object.seal(this)
        }
        function C(a, b, c, e) {
            C.superclass.constructor.call(this, a, b, c, e);
            E.superclass.constructor.call(this, a, b, c, e);
            this._inputKeyUp = this.inputKeyUp.bind(this);
            this._inputKeyDown = this.inputKeyDown.bind(this);
            this._mouseDoubleClick = this.handleMouseDoubleClickEvent.bind(this);
            this.area_container = this.input = this.moved = null;
            this.editing = this.initialised =
            !1;
            this.constructor === C && Object.seal(this)
        }
        function E(a, b, c, e) {
            this._inputKeyUp = this.inputKeyUp.bind(this);
            this._inputKeyDown = this.inputKeyDown.bind(this);
            this._mouseDoubleClick = this.handleMouseDoubleClickEvent.bind(this);
            E.superclass.constructor.call(this, a, b, c, e);
            this.area_container = this.input = this.moved = null;
            this.initialised = !1;
            !this.params.text && (this.params.text = "");
            this.editing = !1;
            this.maxTextLength = 100;
            this.constructor === E && Object.seal(this)
        }
        function X(a, b, c, e) {
            X.superclass.constructor.call(this,
            a, b, c, e);
            this.constructor === X && Object.seal(this)
        }
        function S(a, b, c, e) {
            S.superclass.constructor.call(this, a, e);
            this.positioned = !1;
            q.isInVisibleArea.call(this, b, c) && (this.render(b, c), this.target = this.drawing.rightBottomHoverCircle, this.constructor === S && Object.seal(this))
        }
        function Z(a, b, c, e) {
            Z.superclass.constructor.call(this, a, b, c, e);
            this.constructor === Z && Object.seal(this)
        }
        function Q(a, b, c, e) {
            Q.superclass.constructor.call(this, a, e);
            this.initialised = !1;
            this._mouseDoubleClick = this.handleMouseDoubleClickEvent.bind(this);
            q.isInVisibleArea.call(this, b, c) && (this.render(b, c), this.target = this.drawing.thirdHoverCircle);
            this.constructor === Q && Object.seal(this)
        }
        function J(a, b, c, e) {
            J.superclass.constructor.call(this, a, b, c, e);
            this._mouseDoubleClick = this.handleMouseDoubleClickEvent.bind(this);
            this.constructor === J && Object.seal(this)
        }
        function M(a, b, c, e) {
            this.coeff = [0.618, 1, 1.128, 1.236, 1.382, 1.5, 1.618, 1.764, 2, 2.618];
            M.superclass.constructor.call(this, a, b, c, e);
            this.constructor === M && Object.seal(this)
        }
        function R(a, b, c, e) {
            R.superclass.constructor.call(this,
            a, b, c, e);
            this.target = this.drawing.endHoverCircle;
            this.constructor === R && Object.seal(this)
        }
        function B(a) {
            B.superclass.constructor.call(this, a, {});
            this._mouseDoubleClick = this.handleMouseDoubleClickEvent.bind(this);
            this._mouseUp = this.handleMouseUpEvent.bind(this);
            this._mouseOverPositionHandler = this.handleMouseOverPositionEvent.bind(this);
            this._mouseOutPositionHandler = this.handleMouseOutPositionEvent.bind(this);
            this.renderOpenPosition();
            this.constructor === A && Object.seal(this)
        }
        function $(a, b) {
            this.chart =
            a;
            this.options = b;
            this.$svgCurrentGItem = this.$svgCurrentLine = this.$svgCurrentText = this.$svgCurrentRect = null;
            this.render();
            this.constructor === $ && Object.seal(this)
        }
        var U = null, db = null, l = null, d = null, u = null, q = null, ea = null, w = null, x = ja.document, eb = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), z = {}, N = {}, gb = 0, bb = 0, la = 0, U = {debug: !0,idPrefix: "traderChart",scaleClass: "scaling",dragClass: "draggable",zoomOptions: [{zoomLevel: 1,barWidth: 1,barMargin: 0,candleWidth: 1,gridSkipX: 32,gridLabelSkipX: 64,scrollSkipX: 384},
                {zoomLevel: 2,barWidth: 1,barMargin: 1,candleWidth: 2,gridSkipX: 16,gridLabelSkipX: 32,scrollSkipX: 192}, {zoomLevel: 3,barWidth: 3,barMargin: 1,candleWidth: 4,gridSkipX: 8,gridLabelSkipX: 16,scrollSkipX: 96}, {zoomLevel: 4,barWidth: 5,barMargin: 3,candleWidth: 8,gridSkipX: 4,gridLabelSkipX: 8,scrollSkipX: 48}, {zoomLevel: 5,barWidth: 11,barMargin: 5,candleWidth: 16,gridSkipX: 2,gridLabelSkipX: 4,scrollSkipX: 24}, {zoomLevel: 6,barWidth: 25,barMargin: 7,candleWidth: 32,gridSkipX: 1,gridLabelSkipX: 2,scrollSkipX: 12}]}, db = {data: [],width: 900,
            height: 600,containerWidth: 900,containerHeight: 600,indicatorsHeight: 0,minWidth: 400,minHeight: 200,marginTop: 20,marginBottom: 50,marginLeft: 20,marginRight: 50,precision: 2,initialChartOffset: 10,additionalOffset: 0,lineChartCircleRadius: 4,dotsChartCircleRadius: 5,period: 6E4,moveBodyClasses: [],staticUrl: "",mouseWheel: !0,chartScale: !1,maxNumberItems: 1E3,maxOpenedIndicators: 6,maxOpenedDrawings: 10,priceBuy: 0,priceSell: 0,showGrid: !0,showCrossHair: !0,showTooltip: !0,showOpenPositions: !0,showBuyPrice: !1,showSellPrice: !0,
            showPriceSnapshot: !1,drawLineCircle: !0,chartTypes: "CandleStick HeikinAshi BarChart HlcChart AreaChart LineChart".split(" "),zoomLevel: 5,lineWidth: 1,areaLineWidth: 1,tooltipLabels: [],priceSnapshotLabels: [],animationDurationDefault: 350,indicatorCloudOpacity: 0.4,ichimokuCloudMaxDistance: 15,colors: {bullStrokeColor: "#7cc219",bullFillColor: "#7cc219",bearStrokeColor: "#f15a38",bearFillColor: "#f15a38",dojiStrokeColor: "grey",dojiFillColor: "grey",lineChartCircle: "#71aabe",lineColor: "#71aabe",lineColorUp: "#71aabe",
                lineColorDown: "#f15a38",lineColorDraw: "#grey",bullHeikinFillColor: "#71aabe",bullHeikinStrokeColor: "#71aabe",bearHeikinFillColor: "#f15a38",bearHeikinStrokeColor: "#f15a38",areaChartFill: "rgba(114, 124, 133, 0.1)",areaLineColor: "#727c85",drawableAreaColor: "",currentLine: "#71aabe",currentRect: "#71aabe",crossHair: "#e17575",crossHairText: "#fff",labels: "#7a7a7a",axisX: "#dfdfdf",axisY: "#dfdfdf",mainAxis: "#4c4c4c"},textColors: {},axisX: {showMainLine: !0,showTickLabels: !0,showLabels: !0},axisY: {numLines: 10,ratio: 0,
                range: 0,min: 0,max: 0,offsetTop: 40,minOffsetTop: 40,offsetBottom: 5,minOffsetBottom: 5,boldUpperMainLine: !1,upperMainLineThickness: 1,showLastLabel: !0,showMainLine: !0,showTickLabels: !0,showLabels: !0},controls: {zoom: !1,type: !1,scrollBar: "show",crossHair: {showTimestampLabel: !0,showPriceLabel: !0,color: "#e17575",style: "0",textColor: "#fff"},scaleControl: {maxLineHeight: 150,lineOffsetTop: 13.5,lineOffsetRight: 13.5}},events: {rendered: function() {
                },updated: function() {
                },resized: function() {
                },indicatorResized: function() {
                },
                preInit: function() {
                },postInit: function() {
                },typeSwitched: function() {
                },zoomChanged: function() {
                },scaleChanged: function() {
                },scaleToggled: function() {
                },tooltipToggled: function() {
                },priceSnapshotToggled: function() {
                },gridToggled: function() {
                },crossHairToggled: function() {
                },drawingCreated: function() {
                },drawingChanged: function() {
                },drawingEdit: function() {
                },drawingDeleted: function() {
                },indicatorPreInit: function() {
                },indicatorCreated: function() {
                },indicatorUpdated: function() {
                },indicatorEdit: function() {
                },indicatorDeleted: function() {
                },
                indicatorError: function() {
                },positionCreated: function() {
                },positionEdited: function() {
                },positionOpened: function() {
                },positionClosed: function() {
                },priceSellToggled: function() {
                },priceBuyToggled: function() {
                },maxOpenedDrawings: function() {
                },destroyed: function() {
                },error: function() {
                }}}, l = {error: function(a) {
                throw Error(a);
            },getWheelDelta: function(a) {
                return (a.wheelDelta || -a.detail || -a.deltaX || -a.deltaY) / Math.abs(a.wheelDelta || a.detail || a.deltaX || a.deltaY)
            },getMax: function(a, b) {
                var c = b || "high", e = -Infinity, d = a.length,
                f;
                for (f = 0; f < d; f++)
                    null !== a[f][c] && (a[f][c] >= e && !isNaN(a[f][c])) && (e = a[f][c]);
                return e
            },getMin: function(a, b) {
                var c = b || "low", e = Infinity, d = a.length, f;
                for (f = 0; f < d; f++)
                    null !== a[f][c] && (a[f][c] <= e && !isNaN(a[f][c])) && (e = a[f][c]);
                return e
            },getMinMax: function(a, b, c, e, d) {
                c = c || "low";
                e = e || "high";
                var f = Infinity, g = -Infinity, h = a.currentOffset + a.maxVisibleItems;
                for (a = a.currentOffset; a < h && b[a]; a++)
                    null !== b[a][c] && (b[a][c] < f && !isNaN(b[a][c])) && (f = b[a][c]), null !== b[a][e] && (b[a][e] > g && !isNaN(b[a][e])) && (g = b[a][e]);
                if (Infinity ===
                f || f === Number.MAX_VALUE || f === Number.MIN_VALUE) {
                    if (d)
                        return !1;
                    f = 0
                }
                if (-Infinity === g || g === Number.MIN_VALUE || g === Number.MAX_VALUE) {
                    if (d)
                        return !1;
                    g = 0
                }
                g === f && (g += 0.01 * (g || 1), f -= 0.01 * (f || 1));
                return {min: +f,max: +g}
            },getIndicatorExtremes: function(a) {
                var b, c, e, d, f = [], g = [];
                b = 0;
                for (c = a.indicatorData.length; b < c; b++)
                    e = a.indicatorData[b], "HorizontalLine" === e.type ? e.source[0] && (d.max = d.min = e.source[0].close) : d = this.getMinMax(a.chart, e.source, e.price, e.price, a.isUpper()), d && (f.push(d.max), g.push(d.min));
                return {max: Math.max.apply(null,
                    f),min: Math.min.apply(null, g)}
            },getZoomOptions: function(a) {
                return U.zoomOptions[!a ? 0 : a >= U.zoomOptions.length ? U.zoomOptions.length - 1 : a]
            },formatChartDate: function(a, b, c) {
                if (b) {
                    b = new Date(+b);
                    var e = b.getDate(b), d = 10 > e ? "0" + e : e, f = b.getMonth(b), g = b.getHours(b), g = 10 > g ? "0" + g : g, h = b.getMinutes(b), h = 10 > h ? "0" + h : h;
                    if (a) {
                        a = new Date(+a);
                        a = a.getDate(a);
                        if (0 !== c)
                            return a !== e ? d + ". " + eb[f] : g + ":" + h;
                        c = b.getSeconds(b);
                        return g + ":" + h + ":" + (10 > c ? "0" + c : c)
                    }
                    return g + ":" + h
                }
            },formatCrossHairDate: function(a, b) {
                if (!a)
                    return !1;
                var c =
                new Date(+a), e = c.getDate(c), e = 10 > e ? "0" + e : e, d = c.getMonth(c) + 1, d = 10 > d ? "0" + d : d, f = c.getFullYear(c), g = c.getHours(c), g = 10 > g ? "0" + g : g, h = c.getMinutes(c), h = 10 > h ? "0" + h : h;
                0 !== b ? c = e + "." + d + "." + f + " " + g + ":" + h : (c = c.getSeconds(c), c = e + "." + d + " " + g + ":" + h + ":" + (10 > c ? "0" + c : c));
                return c
            },handleKeyEvents: function(a) {
                var b = a.which || a.keyCode, c = ea, e = 0, e = c.scrollBar.$sliderContainer.offsetWidth / c.options.data.length;
                if (!d.hasSvgClass(a.target, "input-area"))
                    switch (b) {
                        case 37:
                            !a.ctrlKey ? e = -2 : e = -10;
                            c.move(e);
                            break;
                        case 39:
                            !a.ctrlKey ?
                            e = 2 : e = 10;
                            c.move(e);
                            break;
                        case 35:
                            a.preventDefault ? a.preventDefault() : a.returnValue = !1;
                            e = c.options.data.length - c.currentOffset;
                            c.move(e);
                            break;
                        case 36:
                            a.preventDefault ? a.preventDefault() : a.returnValue = !1;
                            c.move(-c.currentOffset);
                            break;
                        case 46:
                            w && (!w.ui && !c.svg.moveDrawing) && w.destroy();
                            break;
                        case 49:
                            l.changeKeyboardChartType(a, c, c.options.chartTypes[0]);
                            break;
                        case 50:
                            l.changeKeyboardChartType(a, c, c.options.chartTypes[1]);
                            break;
                        case 51:
                            l.changeKeyboardChartType(a, c, c.options.chartTypes[2]);
                            break;
                        case 52:
                            l.changeKeyboardChartType(a,
                            c, c.options.chartTypes[3]);
                            break;
                        case 53:
                            l.changeKeyboardChartType(a, c, c.options.chartTypes[4]);
                            break;
                        case 54:
                            l.changeKeyboardChartType(a, c, c.options.chartTypes[5]);
                            break;
                        case 107:
                            a.ctrlKey || (a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0, c.zoomIn());
                            break;
                        case 109:
                            a.ctrlKey || (a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0, c.zoomOut())
                    }
            },changeKeyboardChartType: function(a, b,
            c) {
                if (0 === b.options.period || void 0 === c)
                    return !1;
                a.ctrlKey && (a.preventDefault ? a.preventDefault() : a.returnValue = !1, a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0, b.chartType = c, b.draw(), b.options.events.typeSwitched.call(b, b.chartType))
            },mouseMoveEnable: function(a) {
                return a.options.moveBodyClasses.some(function(a) {
                    return d.hasClass(x.body, a)
                })
            },now: function() {
                return Date.now ? Date.now() : (new Date).getTime()
            },extend: function(a, b) {
                var c = a || {}, e = b || {}, d;
                for (d in e)
                    e.hasOwnProperty(d) && ("object" ===
                    typeof e[d] && null != e[d] && !(e[d] instanceof Array) ? (c[d] = c[d] || {}, l.extend(c[d], e[d])) : void 0 === c[d] && (c[d] = e[d]));
                return c
            },mixin: function(a, b) {
                var c = b || {}, e = {};
                l.extend(l.extend(e, a || {}), c);
                return e
            },inherit: function(a, b) {
                a.prototype = Object.create(b.prototype);
                a.prototype.constructor = a;
                a.superclass = b.prototype;
                b.prototype.constructor === Object.prototype.constructor && (b.prototype.constructor = b)
            },findPosition: function(a, b) {
                var c, e, d;
                d = a.openPosition.toArray();
                for (e = 0; e < a.openPosition.length; e++)
                    for (c in d[e].ui.drawing)
                        if (b ===
                        d[e].ui.drawing[c])
                            return d[e]
            }}, d = {createElement: function(a, b) {
                var c = x.createElement(a);
                b && d.setAttributes(c, b);
                return c
            },createElementNS: function(a, b, c) {
                a = x.createElementNS(a, b);
                c && d.setAttributes(a, c);
                return a
            },setAttributes: function(a, b) {
                for (var c in b)
                    b.hasOwnProperty(c) && ("styles" === c ? d.css(a, b[c]) : a.setAttribute(c, b[c]));
                return this
            },css: function(a, b) {
                for (var c in b)
                    a.style[c] = b[c];
                return this
            },removeAttribute: function(a, b) {
                a.removeAttribute(b);
                return this
            },hasClass: function(a, b) {
                return RegExp("(\\s|^)" +
                b + "(\\s|$)").test(a.className)
            },addClass: function(a, b) {
                d.hasClass(a, b) || (a.className += (a.className ? " " : "") + b);
                return this
            },removeClass: function(a, b) {
                d.hasClass(a, b) && (a.className = a.className.replace(RegExp("(\\s|^)" + b + "(\\s|$)"), " ").replace(/^\s+|\s+$/g, ""));
                return this
            },hasSvgClass: function(a, b) {
                return RegExp("(\\s|^)" + b + "(\\s|$)").test(a.getAttribute("class"))
            },addSvgClass: function(a, b) {
                if (!d.hasSvgClass(a, b)) {
                    var c = a.getAttribute("class");
                    d.setAttributes(a, {"class": c + ((c ? " " : "") + b)})
                }
                return this
            },
            removeSvgClass: function(a, b) {
                if (d.hasSvgClass(a, b)) {
                    var c = a.getAttribute("class"), c = c.replace(RegExp("(\\s|^)" + b + "(\\s|$)"), " ").replace(/^\s+|\s+$/g, "");
                    d.setAttributes(a, {"class": c})
                }
                return this
            },addEvent: function(a, b, c) {
                a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : a["on" + b] = c;
                return this
            },removeEvent: function(a, b, c) {
                a.removeEventListener && a.removeEventListener(b, c, !1);
                a.detachEvent && a.detachEvent("on" + b, c);
                return this
            },text: function(a, b) {
                a.parentNode || l.error("Please supply valid DOM element.");
                d.empty(a);
                a.appendChild(x.createTextNode(b));
                return this
            },empty: function(a, b) {
                for (a.parentNode || l.error("Please supply valid DOM element."); a.firstChild; )
                    a.removeChild(a.firstChild);
                b && a.parentNode && a.parentNode.removeChild(a);
                return this
            },offset: function(a) {
                var b, c = {top: 0,left: 0,width: 0,height: 0}, e = a && a.ownerDocument;
                if (e)
                    return b = e.documentElement, "undefined" !== typeof a.getBoundingClientRect && (c = a.getBoundingClientRect()), a = 9 === e.nodeType ? e.defaultView || e.parentWindow : !1, {top: c.top + (a.pageYOffset ||
                        b.scrollTop) - (b.clientTop || 0),left: c.left + (a.pageXOffset || b.scrollLeft) - (b.clientLeft || 0),width: c.width,height: c.height}
            },isTouch: function() {
                return !!("ontouchstart" in ja || ja.DocumentTouch && x instanceof ja.DocumentTouch)
            },hasCanvas: function() {
                var a = x.createElement("canvas");
                return !(!a.getContext || !a.getContext("2d"))
            },hasSvg: function() {
                return !!x.createElementNS && !!x.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect
            },preventDefault: function(a) {
                a.preventDefault ? a.preventDefault() : a.returnValue =
                !1;
                a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
            }}, u = {estimateEma: function(a, b, c) {
                return 1 <= c ? 0 : c * a + (1 - c) * b
            },estimateSma: function(a, b) {
                var c = 0, e;
                if (a.length >= b)
                    for (e = 0; e < a.length; e++)
                        c += a[e];
                return c / b
            },estimateSmaLiterals: function(a) {
                var b, c = 0, e = a.length;
                for (b = 0; b < e; b++)
                    c += +a[b];
                return c / e
            },estimateSmaObjects: function(a) {
                var b, c = 0;
                for (b = 0; b < a.length; b++)
                    c += +a[b].close;
                return c / a.length
            },estimateSmaCandles: function(a, b, c, e, d) {
                var f = 0, g;
                for (g = c - e; g < c; g++)
                    0 <= g && (f = d ? f + +a[g].close : f + +b[g].value);
                0 <= c && c < a.length && (f = 34 > c ? 0 : f / e);
                return f
            },estimateDev: function(a, b, c) {
                var e = 0, d, f;
                for (d = 0; d < c; d++)
                    f = Math.abs(b - a[d]), e += f;
                return e / c
            },estimateStDev: function(a, b) {
                var c = 0, e, d;
                for (d = 0; d < a.length; d++)
                    e = a[d] - b, c += e * e;
                return c / (a.length - 1)
            },estimateHighLow: function(a, b) {
                a.sort();
                return b ? a[0] : a[a.length - 1]
            },estimateSum: function(a, b) {
                var c = 0, e;
                for (e = 0; e < b; e++)
                    c += a[e];
                return c
            },estimateSumSimple: function(a) {
                var b = 0, c, e = a.length;
                for (c = 0; c < e; c++)
                    b += a[c];
                return b
            },estimateWma: function(a, b) {
                var c = 0, e = 0, d;
                if (a.length !==
                b.length)
                    return 0;
                for (d = 0; d < b.length; d++)
                    c += b[d] * a[d], e += b[d];
                return c / e
            },estimateSequence: function(a, b) {
                var c = [], e;
                if (a <= b)
                    for (e = a; e <= b; e++)
                        c[e - a] = e;
                else
                    for (e = b; e <= a; e++)
                        c[e - b] = a - e + 1;
                return c
            },estimateWmaSupport: function(a, b) {
                var c = 0, e = 0, d;
                for (d = 0; d < b.length; d++)
                    c += b[d] * a[d], e += b[d];
                return c / e
            },estimateWmaLiteralsSupport: function(a) {
                var b = 0, c = 0, e, d = a.length;
                for (e = 0; e < d; e++)
                    b += a[e] * (e + 1), c += e + 1;
                return b / c
            },estimateArraySubstraction: function(a, b, c) {
                var e = [], d;
                if (a.length === b.length) {
                    for (d = 0; d < a.length; d++)
                        e[d] =
                        Math.abs(+a[d][c] - +b[d][c]);
                    return e
                }
                return null
            },estimateReplicate: function(a, b) {
                var c = [], e;
                for (e = 0; e < b; e++)
                    c[e] = a;
                return c
            },meanSupport: function(a, b) {
                var c = +a[0][b], e;
                for (e = 1; e < a.length; e++)
                    c += +a[e][b];
                return c / a.length
            },stdDevSupport: function(a, b) {
                var c, e, d;
                c = u.meanSupport(a, b);
                for (d = e = 0; d < a.length; d++)
                    e += Math.pow(+a[d][b] - c, 2);
                return Math.sqrt(e / (a.length - 1))
            },estimateMad: function(a, b) {
                var c = 0, e, d = a.length;
                for (e = 0; e < d; e++)
                    c += Math.abs(a[e] - b);
                return c / d
            },calculateLineEquation: function(a, b, c, e) {
                var d;
                if (0 === c - a)
                    return {x: a};
                d = (e - b) / (c - a);
                return {slope: d,constantPart: b - d * a,getY: function(c) {
                        return d * (c - a) + b
                    }}
            },calculatePointOfIntersectionOfTwoLines: function(a, b) {
                var c, e;
                if (a.getY && b.getY)
                    c = (b.constantPart - a.constantPart) / (a.slope - b.slope), e = a.getY(c);
                else if (a.getY && b.x || a.x && b.getY)
                    c = a.x || b.x, e = a.getY ? a.getY(c) : b.getY(c);
                return (c || 0 === c) && (e || 0 === e) ? {x: c,y: e} : null
            },transposeMatrix: function(a) {
                var b = a.length, c = a[0].length, e = u.createZeroFilledMatrix(c, b), d, f;
                for (d = 0; d < b; d++)
                    for (f = 0; f < c; f++)
                        e[f][d] =
                        a[d][f];
                return e
            },matrixMultiplication: function(a, b) {
                var c = a.length, e = a[0].length, d = b[0].length, f, g, h, r;
                if (e === b.length) {
                    f = u.createZeroFilledMatrix(c, d);
                    for (g = 0; g < c; g++)
                        for (h = 0; h < d; h++)
                            for (r = 0; r < e; r++)
                                f[g][h] += a[g][r] * b[r][h];
                    return f
                }
            },LDMatrix: function(a) {
                var b = a.length, c = u.createZeroFilledMatrix(b, b), e = u.createZeroFilledMatrix(b, b), d, f, g, h;
                e[0][0] = a[0][0];
                for (d = 0; d < b; d++)
                    c[d][d] = 1;
                for (d = 1; d < b; d++) {
                    for (f = 0; f <= d - 1; f++) {
                        for (g = h = 0; g <= d - 1; g++)
                            h += c[d][g] * c[f][g] * e[g][g];
                        c[d][f] = 1 / e[f][f] * (a[d][f] - h)
                    }
                    for (f =
                    g = 0; f <= d - 1; f++)
                        g += Math.pow(c[d][f], 2) * e[f][f];
                    e[d][d] = a[d][d] - g
                }
                return {l: c,d: e}
            },invertedLMatrix: function(a) {
                var b, c, e, d, f, g;
                if (a.length === a[0].length) {
                    b = a.length;
                    c = u.createZeroFilledMatrix(b, b);
                    for (e = 0; e < b; e++)
                        c[e][e] = 1;
                    for (e = 0; e < b - 1; e++)
                        for (d = e + 1; d < b; d++) {
                            f = -a[d][e] / a[e][e];
                            for (g = 0; g <= e; g++)
                                c[d][g] += f * c[e][g]
                        }
                    return c
                }
            },invertedDiagonalMatrix: function(a) {
                var b, c, e, d = [];
                if (a.length === a[0].length) {
                    b = a.length;
                    for (c = 0; c < b; c++)
                        for (e = 0; e < b; e++)
                            d[c] = d[c] || [], d[c][e] = c === e ? 1 / a[c][e] : a[c][e];
                    return d
                }
            },
            invertedMatrix: function(a) {
                var b;
                b = u.LDMatrix(a);
                a = u.invertedLMatrix(b.l);
                b = u.invertedDiagonalMatrix(b.d);
                return u.matrixMultiplication(u.matrixMultiplication(u.transposeMatrix(a), b), a)
            },convertArrayToMatrix: function(a, b) {
                var c = [], e;
                for (e = 0; e < a.length; e++)
                    c[e] = [+a[e][b]];
                return c
            },betas: function(a, b, c) {
                var e, d = u.createZeroFilledMatrix(b, 2), f = u.createZeroFilledMatrix(a.length, 2), g, h;
                for (h = 0; h < b; h++)
                    d[h][0] = 1, d[h][1] = h + 1;
                g = u.matrixMultiplication(u.transposeMatrix(d), d);
                g = u.invertedMatrix(g);
                for (h = b -
                1; h < a.length; h++)
                    e = a.slice(h - b + 1, h + 1), e = u.convertArrayToMatrix(e, c), e = u.matrixMultiplication(u.transposeMatrix(d), e), e = u.matrixMultiplication(g, e), f[h][0] = e[0][0], f[h][1] = e[1][0];
                return f
            },getRow: function(a, b) {
                var c = u.createZeroFilledMatrix(1, a[0].length), e;
                for (e = 0; e < a[0].length; e++)
                    c[0][e] = a[b][e];
                return c
            },convertMatrixToValue: function(a) {
                return 1 === a.length && 1 === a[0].length ? a[0][0] : 99999
            },convertMatrixToArray: function(a) {
                var b, c = [], e;
                if (1 < a.length && 1 < a[0].length)
                    return null;
                b = Math.max(a.length,
                a[0].length);
                if (1 < a[0].length)
                    for (e = 0; e < b; e++)
                        c[e] = a[0][e];
                else
                    for (e = 0; e < b; e++)
                        c[e] = a[e][0];
                return c
            },forecastingAhead: function(a, b, c, e, d) {
                var f = [];
                a = u.convertMatrixToArray(a);
                var g = 0, h;
                for (h = 0; h < a.length; h++)
                    g += a[h] * Math.pow(b, h);
                f[0] = g;
                f[1] = f[0] + d * c;
                f[2] = f[0] + e * c;
                f[3] = f[0] - e * c;
                f[4] = f[0] - d * c;
                return f
            },createZeroFilledMatrix: function(a, b) {
                var c = [], e, d;
                for (e = 0; e < a; e++)
                    for (d = 0; d < b; d++)
                        c[e] = c[e] || [], c[e][d] = 0;
                return c
            }}, q = {calculateCoordinates: function(a, b, c) {
                a.updateValues();
                b = q.findCandleByTimestamp(b,
                a.mainChart.options, a.params.period);
                return {X: (b.position - a.mainChart.currentOffset) * (a.mainChart.zoomOptions.barWidth + a.mainChart.zoomOptions.barMargin) + a.mainChart.zoomOptions.barWidth / 2 + a.minX,Y: (+a.minValue + (a.heightY + a.minY) / a.ratio - c) * a.ratio + 0.5 | 0,show: b.show}
            },getMousePositionCandleInfo: function(a, b, c, e) {
                var d = l.getZoomOptions(c.options.zoomLevel), f = c.options.data, g = f.length;
                a = c.currentOffset + (a - e.marginLeft) / (d.barWidth + d.barMargin) >> 0;
                var h = +f[g - 1].timestamp, d = e.marginTop, r = e.axisY.min,
                p;
                a >= g ? 0 !== c.options.period ? (g = h + (a + 1 - g) * c.options.period, p = g - c.options.period) : g = h : 0 > a ? (g = f[0].timestamp, p = g - c.options.period) : (g = f[a].timestamp, p = f[a - 1] && f[a - 1].timestamp);
                return {currentCandle: f[a],currentCandleTimestamp: +g,prevCandleTimestamp: +p,price: +r + (e.axisY.heightY - b + d) / +e.axisY.ratio,candleNumber: a}
            },findCandleByTimestamp: function(a, b, c) {
                var e, d = b.data, f = d.length - 1, g = !0;
                e = +a;
                if (c !== b.period)
                    if (d[0].timestamp > e)
                        e = d[0].timestamp, g = !1;
                    else if (d[f].timestamp < e && c < b.period)
                        e = d[f].timestamp;
                    else {
                        a =
                        1;
                        for (f; a <= f; a++)
                            if (e >= d[a - 1].timestamp && e < d[a].timestamp) {
                                e = d[a - 1].timestamp;
                                break
                            }
                    }
                a = d.filter(function(a) {
                    return +a.timestamp === e
                }).pop();
                c = d.indexOf(a);
                void 0 === a && (c = ((e - d[f].timestamp) / b.period >> 0) + f);
                return {position: c,candle: a,timestamp: e,show: g}
            },hideLastDrawing: function() {
                if (w) {
                    var a = w;
                    w = null;
                    a.hide()
                }
            },isInVisibleArea: function(a, b) {
                return a > this.minX && a < this.maxX && b > this.minY && b < this.maxY
            },seedFibonacci: function(a, b, c, e) {
                var k = [], f, g;
                f = 0;
                for (g = b.length; f < g; f++)
                    b = d.createElementNS("http://www.w3.org/2000/svg",
                    c), a && a.appendChild(b), e && d.setAttributes(b, e), k.push(b);
                return k
            }};
        cb.prototype = {iterate: function() {
                var a, b = this.scope, c;
                if (b) {
                    for (a = 0; a < this.animatedObjects.length; a++)
                        this.animationStep(this.animatedObjects[a]), this.animatedObjects[a] && !1 === this.animatedObjects[a].isAnimated && (this.animatedObjects.splice(a, 1), a--);
                    a = 0;
                    for (c = b.indicators.length; a < c; a++)
                        b.indicators[a].draw(!1)
                }
            },animate: function(a) {
                a.isAnimated = !0;
                a.startMs = +new Date;
                a.endMs = a.startMs + a.duration;
                this.animatedObjects.push(a)
            },animationStep: function(a) {
                +new Date >=
                a.endMs ? (a.isAnimated = !1, a.render(!0, this.scope), a.callback && a.callback(this.scope)) : (this.incrementProperties(a), a.render(!1, this.scope))
            },incrementProperties: function(a) {
                var b = (a.endMs - +new Date + 16.6) / 16.6, c;
                if (!(1 >= b))
                    for (c in a)
                        a.target[c] && (a[c] += (a.target[c] - a[c]) / b)
            }};
        ha.init = function() {
        };
        ha.version = "2.0";
        ha.getIndicators = function() {
            return z
        };
        ha.getDrawings = function() {
            return N
        };
        ka.prototype = {constructor: ka,init: function() {
                this.canvas = new fa(this);
                this.canvasGrid = new ba(this, this.options);
                this.svg =
                new ga(this, this.options);
                this.scaleControl = new oa(this);
                this.crossHair = new I(this);
                this.tooltip = new V(this)
            },setExtremes: function(a, b) {
                var c, e;
                c = this.options.axisY.heightY / (b - a);
                e = this.options.axisY.offsetTop / c;
                c = this.options.axisY.offsetBottom / c;
                this.options.axisY.max = b + e;
                this.options.axisY.min = a - c;
                this.options.axisY.range = +this.options.axisY.max - +this.options.axisY.min;
                this.options.axisY.ratio = this.options.axisY.heightY / this.options.axisY.range
            },drawY: function() {
                if (this.options.axisY.showLabels) {
                    var a =
                    this.options.axisY.heightY / (this.zoomOptions.candleWidth * this.zoomOptions.gridSkipX) + 0.5 | 0, b = this.options.axisY.range / a, c = this.options.width - this.options.marginRight - this.options.marginLeft + 6, e = this.options.height - this.options.marginBottom - this.options.marginTop + 4, a = this.options.axisY.showLastLabel ? a + 1 : a, d = 1;
                    for (this.canvas.fillStyle(this.options.colors.labels); d < a; )
                        e -= b * this.options.axisY.ratio, this.canvas.fillText((+this.options.axisY.min + +d * b).toFixed(this.options.precision), c, e), d++
                }
            },render: function() {
                this.$chartLayer =
                d.createElement("div");
                d.addClass(this.$chartLayer, "chartLayer");
                this.$chartLayer.appendChild(this.canvas.$canvasLayer);
                this.$chartLayer.appendChild(this.canvasGrid.$canvasGridLayer);
                this.$chartLayer.appendChild(this.svg.$svgLayer);
                this.isReady = !0
            },bindEvents: function() {
            },unbindEvents: function() {
            },resize: function(a) {
                this.options.containerHeight = a && (+a.height > this.chart.options.minHeight ? +a.height : this.chart.options.minHeight) || this.chart.options.containerHeight;
                this.options.containerWidth = a && (+a.width >
                this.chart.options.minWidth ? +a.width : this.chart.options.minWidth) || this.chart.options.containerWidth;
                d.setAttributes(this.chart.$container, {styles: {width: this.chart.options.containerWidth + "px",height: this.chart.options.containerHeight + "px"}});
                this.renderLayout();
                this.chart.options.events.resized.call(this)
            },renderLayout: function() {
                var a = this.options.containerHeight, b = this.options.containerWidth, c = this.getBottomIndicators().length, e;
                !c && 0 !== this.options.indicatorsHeight && (this.options.indicatorsHeight =
                0);
                if (0 === this.options.indicatorsHeight) {
                    for (e = 0; e < c; e++)
                        a = a - 0.25 * a >> 0;
                    this.options.indicatorsHeight = this.options.containerHeight - a
                } else
                    this.options.containerHeight - this.options.indicatorsHeight < this.options.minHeight ? (a = this.options.minHeight, this.options.indicatorsHeight = this.options.containerHeight - this.options.minHeight) : a = this.options.containerHeight - this.options.indicatorsHeight;
                this.resizeIndicators(b, a, this.options.indicatorsHeight / c + 0.5 | 0);
                this.resizeChart(b, a);
                c && !this.$indicatorSep && this.renderIndicatorSep();
                this.moveIndicatorSep();
                return !0
            },resizeIndicators: function(a, b, c) {
                var e, d = this.indicators.length, f = !0, g;
                for (e = 0; e < d; e++)
                    g = this.indicators[e], g.options.width = a, g.isBottom() ? (g.options.height = c, f ? (f = !1, g.options.axisY.upperMainLineThickness = 1) : g.options.axisY.upperMainLineThickness = 4, g.resizeChartLayer()) : g.options.height = b, g.options.axisY.heightY = g.options.height - g.options.marginBottom - g.options.marginTop
            },resizeChartLayer: function() {
                d.setAttributes(this.$chartLayer, {styles: {width: this.options.width +
                        "px",height: this.options.height + "px"}});
                d.setAttributes(this.canvas.$canvas, {width: this.options.width,height: this.options.height});
                d.setAttributes(this.canvasGrid.$canvasGrid, {width: this.options.width,height: this.options.height});
                d.setAttributes(this.svg.$svg, {width: this.options.width,height: this.options.height});
                d.setAttributes(this.svg.$clipRect, {width: this.options.width - this.options.marginLeft - this.options.marginRight,height: this.options.height - this.options.marginTop - this.options.marginBottom +
                    1});
                this.scaleControl.resize();
                this.canvas.resizeCanvas();
                this.crossHair.updateCachedProperties()
            },renderCanvas: function(a, b) {
                var c = a ? a.type : this.chartType, e = a ? a.source : this.options.data;
                if (0 !== e.length)
                    if (this["render" + c]) {
                        this.canvas.beginPath();
                        this.canvas.save();
                        this.canvas.rect(0, 0, this.options.width - this.options.marginRight - this.options.marginLeft, this.options.axisY.heightY);
                        this.canvas.clip();
                        if (0 === this.options.period)
                            this.renderTickAreaChart(e, a, b ? "new" : null);
                        else
                            this["render" + c](e, a);
                        this.canvas.restore()
                    } else
                        l.error("You have entered invalid chart type: " +
                        this.chartType + ".")
            },renderLineChart: function(a) {
                var b = this.currentOffset + this.maxVisibleItems, c = this.zoomOptions.barWidth / 2 >> 0, e = -this.zoomOptions.candleWidth + c, d = [], f = [], g, h, r, p, m, n, t;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.lineColorUp || this.options.colors.lineColor);
                this.canvas.lineWidth(this.options.lineWidth);
                r = this.currentOffset;
                for (g = 0; r !== b; ) {
                    n = e;
                    e += this.zoomOptions.candleWidth;
                    if (!a[r])
                        break;
                    p = a[r - 1] && +a[r - 1].close;
                    m = +a[r].close;
                    t = h;
                    h = (this.options.axisY.max - m) *
                    this.options.axisY.ratio + 0.5 | 0;
                    0 === g ? this.canvas.moveTo(e, h) : m > p ? (0 !== g && this.canvas.moveTo(n, t), this.canvas.lineTo(e, h)) : m === p ? f.push({mx: n,my: t,lx: e,ly: h}) : m < p && d.push({mx: n,my: t,lx: e,ly: h});
                    r++;
                    g++
                }
                this.canvas.stroke();
                if (r = d.length) {
                    this.canvas.beginPath();
                    for (this.canvas.strokeStyle(this.options.colors.lineColorDown || this.options.colors.lineColor); r--; )
                        this.canvas.line(d[r].mx, d[r].my, d[r].lx, d[r].ly)
                }
                this.canvas.stroke();
                if (r = f.length) {
                    this.canvas.beginPath();
                    for (this.canvas.strokeStyle(this.options.colors.lineColorDraw ||
                    this.options.colors.lineColor); r--; )
                        this.canvas.line(f[r].mx, f[r].my, f[r].lx, f[r].ly);
                    this.canvas.stroke()
                }
                this.currentOffset + this.maxVisibleItems >= a.length && this.options.drawLineCircle && (e = (a.length - this.currentOffset - 1) * (this.zoomOptions.barMargin + this.zoomOptions.barWidth) + c + 0.5 | 0, h = (this.options.axisY.max - +a[a.length - 1].close) * this.options.axisY.ratio + 0.5 | 0, this.renderCircle(this, this.options.colors.lineChartCircle, e, h))
            },renderSimpleLine: function(a, b) {
                var c = this.chart.currentOffset + this.chart.maxVisibleItems,
                e = a.length, d = -this.zoomOptions.candleWidth + this.zoomOptions.barWidth / 2 >> 0, f, g, h;
                this.canvas.beginPath();
                this.canvas.strokeStyle(b.color);
                this.canvas.lineWidth(b.lineWidth || this.options.lineWidth);
                h = this.chart.currentOffset;
                for (g = 0; h !== c - 1; ) {
                    d += this.zoomOptions.candleWidth;
                    if (!a[h])
                        break;
                    a[h].close && (f = (this.options.axisY.max - +a[h].close) * this.options.axisY.ratio + 0.5 | 0, 0 === g ? this.canvas.moveTo(d, f) : this.canvas.lineTo(d, f));
                    h++;
                    g++
                }
                this.canvas.stroke();
                c >= e && this.options.drawLineCircle && (d = (e - this.chart.currentOffset -
                1) * this.zoomOptions.candleWidth + (this.zoomOptions.barWidth / 2 >> 0) + 0.5 | 0, f = (this.options.axisY.max - +a[e - 1].close) * this.options.axisY.ratio + 0.5 | 0, this.renderCircle(this.chart, this.options.colors.lineChartCircle, d, f))
            },renderHorizontalLine: function(a, b) {
                var c;
                this.canvas.beginPath();
                this.canvas.strokeStyle(b.color);
                this.canvas.lineWidth(b.lineWidth || this.options.lineWidth);
                c = this.options.marginTop + (this.options.axisY.max - +a[0].close) * this.options.axisY.ratio + 0.5 | 0;
                this.canvas.line(0, c, this.options.width -
                this.options.marginRight, c);
                this.canvas.stroke();
                this.canvas.restore()
            },renderCircle: function(a, b, c, e) {
                this.canvas.beginPath();
                this.canvas.fillStyle(b);
                this.canvas.arc(c, e, a.options.lineChartCircleRadius);
                this.canvas.fill();
                this.canvas.closePath()
            },renderCandleStick: function(a) {
                var b = this.zoomOptions.barWidth / 2 >> 0, c = this.currentOffset + this.maxVisibleItems - 1, e = -this.zoomOptions.candleWidth, d, f, g, h = [], r = [], p, m, n, t, s, F;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bullStrokeColor);
                this.canvas.fillStyle(this.options.colors.bullFillColor);
                f = this.currentOffset;
                for (p = 0; f !== c; ) {
                    e += this.zoomOptions.candleWidth;
                    d = e + b;
                    g = a[f];
                    if (!g)
                        break;
                    m = +g.open;
                    n = +g.close;
                    t = +g.high;
                    g = +g.low;
                    s = m - n;
                    s = (0 > s ? -s : s) * this.options.axisY.ratio + 1 | 0;
                    F = (this.options.axisY.max - (m > n ? m : n)) * this.options.axisY.ratio + 0.5 | 0;
                    t = (this.options.axisY.max - t) * this.options.axisY.ratio + 0.5 | 0;
                    g = (this.options.axisY.max - g) * this.options.axisY.ratio + 0.5 | 0;
                    n > m ? (this.canvas.line(d, t, d, g), this.canvas.fillRect(e, F, this.zoomOptions.barWidth,
                    s)) : n === m ? r[r.length] = {moveX: e,lineMoveX: d,moveY: F,highPos: t,lowPos: g,num: p} : h[h.length] = {moveX: e,lineMoveX: d,moveY: F,highPos: t,lowPos: g,stickHeight: s,num: p};
                    f++;
                    p++
                }
                this.canvas.stroke();
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bearStrokeColor);
                this.canvas.fillStyle(this.options.colors.bearFillColor);
                for (f = h.length; f--; )
                    g = h[f], this.canvas.line(g.lineMoveX, g.highPos, g.lineMoveX, g.lowPos), this.canvas.fillRect(g.moveX, g.moveY, this.zoomOptions.barWidth, g.stickHeight);
                this.canvas.stroke();
                if (r.length) {
                    this.canvas.beginPath();
                    this.canvas.strokeStyle(this.options.colors.dojiStrokeColor);
                    this.canvas.fillStyle(this.options.colors.dojiFillColor);
                    f = r.length;
                    for (s = 1; f--; )
                        g = r[f], this.canvas.line(g.lineMoveX, g.highPos, g.lineMoveX, g.lowPos), this.canvas.fillRect(g.moveX, g.moveY, this.zoomOptions.barWidth, s);
                    this.canvas.stroke()
                }
            },renderOscillator: function(a, b) {
                var c = this.chart.currentOffset + this.chart.maxVisibleItems, e = -this.zoomOptions.candleWidth, d = [], f, g, h, r, p;
                this.canvas.beginPath();
                this.canvas.fillStyle(b.color[0]);
                for (f = this.chart.currentOffset; f !== c; ) {
                    e += this.zoomOptions.candleWidth;
                    g = a[f];
                    if (!g)
                        break;
                    h = +g.close;
                    r = 0 - h;
                    p = r * this.options.axisY.ratio;
                    h = (this.options.axisY.max - h - r) * this.options.axisY.ratio + 0.5 | 0;
                    g.isGreen ? this.canvas.fillRect(e, h, this.zoomOptions.barWidth, p + 1 | 0 || 1) : d[d.length] = {moveX: e,moveY: h,stickHeight: p};
                    f++
                }
                this.canvas.beginPath();
                this.canvas.fillStyle(b.color[1]);
                for (f = d.length; f--; )
                    g = d[f], this.canvas.fillRect(g.moveX, g.moveY, this.zoomOptions.barWidth, g.stickHeight + 1 | 0 || 1)
            },renderOscillatorExtended: function(a,
            b) {
                var c = this.chart.currentOffset + this.chart.maxVisibleItems - 1, e = -this.zoomOptions.candleWidth, d = [], f, g, h, r, p;
                this.canvas.beginPath();
                this.canvas.fillStyle(b.color[0]);
                for (f = this.chart.currentOffset; f !== c; ) {
                    e += this.zoomOptions.candleWidth;
                    g = a[f];
                    if (!g)
                        break;
                    h = +g.close;
                    r = 0 - h;
                    p = r * this.options.axisY.ratio;
                    h = (this.options.axisY.max - h - r) * this.options.axisY.ratio + 0.5 | 0;
                    g.isGreen ? this.canvas.fillRect(e, h, this.zoomOptions.barWidth, p + 1 | 0 || 1) : d[d.length] = {moveX: e,moveY: h,stickHeight: p};
                    f++
                }
                this.canvas.beginPath();
                this.canvas.fillStyle(b.color[1]);
                for (f = d.length; f--; )
                    g = d[f], this.canvas.fillRect(g.moveX, g.moveY, this.zoomOptions.barWidth, g.stickHeight + 1 | 0 || 1)
            },renderHlLine: function(a) {
                var b = -this.zoomOptions.candleWidth + (this.zoomOptions.barWidth / 2 >> 0), c = [], e, d, f, g, h, r;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bullFillColor);
                e = this.currentOffset;
                for (d = 0; e !== this.currentOffset + this.maxVisibleItems - 1; ) {
                    b += this.zoomOptions.candleWidth;
                    f = a[e];
                    if (!f)
                        break;
                    g = +f.open;
                    h = +f.close;
                    r = +f.high;
                    f =
                    +f.low;
                    r = (this.options.axisY.max - r) * this.options.axisY.ratio + 0.5 | 0;
                    f = (this.options.axisY.max - f) * this.options.axisY.ratio + 0.5 | 0;
                    h > g ? this.canvas.line(b, r, b, f) : c.push({moveX: b,highPos: r,lowPos: f});
                    e++;
                    d++
                }
                this.canvas.stroke();
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bearFillColor);
                for (e = c.length; e--; )
                    f = c[e], this.canvas.line(f.moveX, f.highPos, f.moveX, f.lowPos);
                this.canvas.stroke()
            },renderHeikinAshi: function(a) {
                var b = this.zoomOptions.barWidth / 2 >> 0, c = -this.zoomOptions.candleWidth,
                e = c + b, d = [], f, g, h, r, p, m, n, t;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bullHeikinStrokeColor);
                this.canvas.fillStyle(this.options.colors.bullHeikinFillColor);
                g = Math.max(0, this.currentOffset - 1);
                h = a[g].open;
                r = a[g].close;
                for (g = this.currentOffset; g !== this.chart.currentOffset + this.chart.maxVisibleItems - 1; ) {
                    c += this.zoomOptions.candleWidth;
                    e = c + b;
                    f = a[g];
                    if (!f)
                        break;
                    n = (+f.open + +f.close + +f.high + +f.low) / 4;
                    h = (+r + +h) / 2;
                    p = Math.max(+f.high, h, n);
                    m = Math.min(+f.low, h, n);
                    t = (0 > h - n ? -1 * (h - n) :
                    h - n) * this.options.axisY.ratio;
                    f = (this.options.axisY.max - Math.max(n, h)) * this.options.axisY.ratio + 0.5 | 0;
                    p = (this.options.axisY.max - p) * this.options.axisY.ratio + 0.5 | 0;
                    m = (this.options.axisY.max - m) * this.options.axisY.ratio + 0.5 | 0;
                    n > r ? (this.canvas.line(e, p, e, m), this.canvas.fillRect(c, f, this.zoomOptions.barWidth, t + 1 | 0 || 1)) : d.push({moveX: c,lineMoveX: e,moveY: f,highPos: p,lowPos: m,stickHeight: t});
                    r = n;
                    g++
                }
                this.canvas.stroke();
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bearStrokeColor);
                this.canvas.fillStyle(this.options.colors.bearFillColor);
                for (g = d.length; g--; )
                    f = d[g], this.canvas.line(f.lineMoveX, f.highPos, f.lineMoveX, f.lowPos), this.canvas.fillRect(f.moveX, f.moveY, this.zoomOptions.barWidth, f.stickHeight + 1 | 0 || 1);
                this.canvas.stroke()
            },renderHeikinAshiHlLine: function(a) {
                var b = this.currentOffset + this.maxVisibleItems, c = -this.zoomOptions.candleWidth + (this.zoomOptions.barWidth / 2 >> 0), e = [], d, f, g, h, r, p;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bullHeikinFillColor);
                r = Math.max(0, this.currentOffset - 1);
                d = a[r].open;
                f = a[r].close;
                for (r = this.currentOffset; r !== b; ) {
                    c += this.zoomOptions.candleWidth;
                    h = a[r];
                    if (!h)
                        break;
                    p = (+h.open + +h.close + +h.high + +h.low) / 4;
                    d = (+f + +d) / 2;
                    g = Math.max(+h.high, d, p);
                    h = Math.min(+h.low, d, p);
                    g = (this.options.axisY.max - g) * this.options.axisY.ratio + 0.5 | 0;
                    h = (this.options.axisY.max - h) * this.options.axisY.ratio + 0.5 | 0;
                    p > f ? this.canvas.line(c, g, c, h) : e.push({moveX: c,highPos: g,lowPos: h});
                    f = p;
                    r++
                }
                this.canvas.stroke();
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bearHeikinFillColor);
                for (r = e.length; r--; )
                    h =
                    e[r], this.canvas.line(h.moveX, h.highPos, h.moveX, h.lowPos);
                this.canvas.stroke()
            },renderBarChart: function(a) {
                var b = a[a.length - 1], c = this.currentOffset + this.maxVisibleItems, e = this.zoomOptions.barWidth / 2 >> 0, d = -this.zoomOptions.candleWidth, f = [], g = [], h, r, p, m, n, t, s, F, l;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bullStrokeColor);
                this.canvas.fillStyle(this.options.colors.bullFillColor);
                h = this.currentOffset;
                for (F = 0; h !== c; ) {
                    d += this.zoomOptions.candleWidth;
                    r = a[h];
                    if (!r)
                        break;
                    p = +r.open;
                    m = +r.close;
                    n = +r.high;
                    t = +r.low;
                    s = (0 > p - m ? -1 * (p - m) : p - m) * this.options.axisY.ratio + 1 | 0;
                    l = (this.options.axisY.max - Math.max(m, p)) * this.options.axisY.ratio + 0.5 | 0;
                    n = (this.options.axisY.max - n) * this.options.axisY.ratio + 0.5 | 0;
                    t = (this.options.axisY.max - t) * this.options.axisY.ratio + 0.5 | 0;
                    m > p ? (this.canvas.line(d + e, n, d + e, t), this.canvas.line(d, l + s, d + e, l + s), b !== r && this.canvas.line(d + e, l, d + this.zoomOptions.barWidth, l)) : m === p ? g.push({moveX: d,moveY: l,highPos: n,lowPos: t,num: F}) : f.push({moveX: d,moveY: l,highPos: n,lowPos: t,
                        stickHeight: s,num: F});
                    h++;
                    F++
                }
                this.canvas.stroke();
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bearStrokeColor);
                this.canvas.fillStyle(this.options.colors.bearFillColor);
                for (h = f.length; h--; )
                    r = f[h], this.canvas.line(r.moveX + e, r.highPos, r.moveX + e, r.lowPos), this.canvas.line(r.moveX, r.moveY, r.moveX + e, r.moveY), b !== a[this.currentOffset + f[h].num] && this.canvas.line(r.moveX + e, r.moveY + r.stickHeight, r.moveX + this.zoomOptions.barWidth, r.moveY + r.stickHeight);
                this.canvas.stroke();
                if (0 < g.length) {
                    this.canvas.beginPath();
                    this.canvas.strokeStyle(this.options.colors.dojiStrokeColor);
                    this.canvas.fillStyle(this.options.colors.dojiFillColor);
                    for (h = g.length; h--; )
                        r = g[h], this.canvas.line(r.moveX + e, r.highPos, r.moveX + e, r.lowPos), this.canvas.line(r.moveX, r.moveY, r.moveX + this.zoomOptions.barWidth, r.moveY);
                    this.canvas.stroke()
                }
            },renderHlcChart: function(a) {
                var b = this.currentOffset + this.maxVisibleItems, c = this.zoomOptions.barWidth / 2 >> 0, e = -this.zoomOptions.candleWidth, d = a[a.length - 1], f = [], g = [], h, r, p, m, n, t, s, l, H;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bullStrokeColor);
                this.canvas.fillStyle(this.options.colors.bullFillColor);
                h = this.currentOffset;
                for (r = 0; h !== b; ) {
                    e += this.zoomOptions.candleWidth;
                    p = a[h];
                    if (!p)
                        break;
                    m = +p.open;
                    n = +p.close;
                    t = +p.high;
                    s = +p.low;
                    l = (0 > m - n ? -1 * (m - n) : m - n) * this.options.axisY.ratio + 1 | 0;
                    H = (this.options.axisY.max - Math.max(n, m)) * this.options.axisY.ratio + 0.5 | 0;
                    t = (this.options.axisY.max - t) * this.options.axisY.ratio + 0.5 | 0;
                    s = (this.options.axisY.max - s) * this.options.axisY.ratio + 0.5 | 0;
                    n > m ? (this.canvas.line(e +
                    c, t, e + c, s), d !== p && this.canvas.line(e + c, H, e + this.zoomOptions.barWidth, H)) : n === m ? g.push({moveX: e,moveY: H,highPos: t,lowPos: s,num: r}) : f.push({moveX: e,moveY: H,highPos: t,lowPos: s,stickHeight: l,num: r});
                    h++;
                    r++
                }
                this.canvas.stroke();
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.bearStrokeColor);
                this.canvas.fillStyle(this.options.colors.bearFillColor);
                for (h = f.length; h--; )
                    p = f[h], this.canvas.line(p.moveX + c, p.highPos, p.moveX + c, p.lowPos), d !== a[this.currentOffset + f[h].num] && this.canvas.line(p.moveX +
                    c, p.moveY + p.stickHeight, p.moveX + this.zoomOptions.barWidth, p.moveY + p.stickHeight);
                this.canvas.stroke();
                if (0 < g.length) {
                    this.canvas.beginPath();
                    this.canvas.strokeStyle(this.options.colors.dojiStrokeColor);
                    this.canvas.fillStyle(this.options.colors.dojiFillColor);
                    for (h = g.length; h--; )
                        p = g[h], this.canvas.line(p.moveX + c, p.highPos, p.moveX + c, p.lowPos), this.canvas.line(p.moveX + c, p.moveY, p.moveX + this.zoomOptions.barWidth, p.moveY);
                    this.canvas.stroke()
                }
            },animateLastLine: function(a, b, c, e, d) {
                var f = this, g;
                this.cAnim.animate({duration: this.cAnim.forceOneFrame ?
                    20 : this.animationDuration,x1: b,x2: b,y1: e,y2: e,offset: 0,target: {x2: c,y2: d,offset: this.zoomOptions.barMargin + this.zoomOptions.barWidth},render: function(b) {
                        var c = b ? this.target.x2 : this.x2, e = b ? this.target.y2 : this.y2;
                        b = b ? this.target.offset : this.offset;
                        var d = f.zoomOptions.barWidth / 2 >> 0;
                        f.canvas.save();
                        f.canvas.beginPath();
                        f.canvas.rect(d, 0, f.options.width - f.options.marginRight - f.options.marginLeft - d, f.options.axisY.heightY);
                        f.canvas.clip();
                        f.canvas.clearRect(-d, 0, f.options.width + d, f.options.height);
                        f.renderTickAreaChart(a,
                        null, "increment", b);
                        d = this.x1 - b;
                        c -= b;
                        f.canvas.beginPath();
                        f.canvas.lineWidth(f.options.areaLineWidth);
                        f.canvas.strokeStyle(f.options.colors.areaLineColor);
                        f.canvas.line(d, this.y1, c, e);
                        f.canvas.stroke();
                        f.canvas.moveTo(d, this.y1);
                        f.canvas.lineTo(c, e);
                        f.canvas.lineTo(c, f.options.height - f.options.marginBottom);
                        f.canvas.lineTo(d, f.options.height - f.options.marginBottom);
                        f.canvas.fillStyle(f.options.colors.areaChartFill);
                        f.canvas.fill();
                        f.renderCircle(f.chart, f.options.colors.areaLineColor, c, e);
                        f.canvas.restore()
                    },
                    callback: function() {
                        f.animationInProgress = !1;
                        (g = f.animationQueue.shift()) ? (f.animationDuration = 20 <= f.options.animationDurationDefault - 50 * f.animationQueue.length ? f.options.animationDurationDefault - 50 * f.animationQueue.length : 20, 10 <= f.animationQueue.length && 15 >= f.animationQueue.length ? f.animationDuration = 16.6 : 15 < f.animationQueue.length && f.interruptAnimation(), g.addItemFunction(g.item)) : f.animationDuration = f.options.animationDurationDefault
                    }})
            },renderTickAreaChart: function(a, b, c, e) {
                b = this.zoomOptions.barWidth /
                2 >> 0;
                var d, f = this.currentOffset, g = f + this.maxVisibleItems - 1, h = this.options.data.length, r, p, m, n = this.options.data[this.options.data.length - 1];
                d = -this.zoomOptions.candleWidth + b - (e || 0);
                c && 0 < f && f--;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.areaLineColor);
                this.canvas.lineWidth(this.options.areaLineWidth);
                this.canvas.fillStyle(this.options.colors.areaChartFill);
                for (r = f; r !== g && a[r]; ) {
                    e = d;
                    m = p;
                    d += this.zoomOptions.candleWidth;
                    p = (this.options.axisY.max - +a[r].close) * this.options.axisY.ratio +
                    0.5 | 0;
                    if (a[r] === n && ("new" === c || this.animationInProgress)) {
                        "new" === c && (this.animationInProgress = !0, this.animateLastLine(a, e, d, m, p));
                        d = e;
                        p = m;
                        break
                    }
                    r === f && this.canvas.moveTo(d, p);
                    this.canvas.lineTo(d, p);
                    r++
                }
                this.canvas.stroke();
                this.canvas.lineTo(d, this.options.height - this.options.marginBottom);
                this.canvas.lineTo(b, this.options.height - this.options.marginBottom);
                this.canvas.fill();
                "new" === c ? this.renderCircle(this.chart, this.options.colors.areaLineColor, d, p) : !c && (!this.animationInProgress && f + this.maxVisibleItems >=
                h && this.options.drawLineCircle) && (d = (h - f - 1) * this.zoomOptions.candleWidth + b + 0.5 | 0, p = (this.options.axisY.max - +a[h - 1].close) * this.options.axisY.ratio + 0.5 | 0, this.renderCircle(this.chart, this.options.colors.areaLineColor, d, p))
            },renderAreaChart: function(a) {
                var b = this.zoomOptions.barWidth / 2 >> 0, c = -this.zoomOptions.candleWidth + b, e = this.currentOffset + this.maxVisibleItems - 1, d = this.options.data.length, f, g;
                this.canvas.beginPath();
                this.canvas.strokeStyle(this.options.colors.areaLineColor);
                this.canvas.lineWidth(this.options.areaLineWidth);
                this.canvas.fillStyle(this.options.colors.areaChartFill);
                for (f = this.currentOffset; f !== e && a[f]; )
                    c += this.zoomOptions.candleWidth, g = (this.options.axisY.max - +a[f].close) * this.options.axisY.ratio + 0.5 | 0, f === this.currentOffset && this.canvas.moveTo(c, g), this.canvas.lineTo(c, g), f++;
                this.canvas.stroke();
                this.canvas.lineTo(c, this.options.height - this.options.marginBottom);
                this.canvas.lineTo(b, this.options.height - this.options.marginBottom);
                this.canvas.fill();
                this.currentOffset + this.maxVisibleItems >= d && this.options.drawLineCircle &&
                (c = (d - this.currentOffset - 1) * this.zoomOptions.candleWidth + b + 0.5 | 0, g = (this.options.axisY.max - +a[d - 1].close) * this.options.axisY.ratio + 0.5 | 0, this.renderCircle(this.chart, this.options.colors.areaLineColor, c, g))
            },renderDots: function(a, b) {
                var c = this.chart.currentOffset + this.chart.maxVisibleItems - 1, e = -this.zoomOptions.candleWidth + (this.zoomOptions.barWidth / 2 >> 0), d = this.options.dotsChartCircleRadius - (U.zoomOptions.length - this.zoomOptions.zoomLevel), f, g;
                0 >= d && (d = 1);
                this.canvas.fillStyle(b.color);
                for (f = this.chart.currentOffset; f !==
                c && void 0 !== a[f]; )
                    e += this.zoomOptions.candleWidth, g = (this.options.axisY.max - +a[f].close) * this.options.axisY.ratio + 0.5 | 0, this.canvas.beginPath(), this.canvas.arc(e, g, d, !0), this.canvas.closePath(), this.canvas.fill(), f++
            },renderCloud: function(a, b) {
                var c = this.chart.currentOffset + this.chart.maxVisibleItems, e = this.zoomOptions.barMargin + this.zoomOptions.barWidth, d = null, f = -e + this.zoomOptions.barWidth / 2 >> 0, g = {}, h = {}, r, p, m, n;
                this.canvas.beginPath();
                p = this.chart.currentOffset;
                for (this.canvas.globalAlpha(this.options.indicatorCloudOpacity); p !==
                c - 1; ) {
                    d = f;
                    f += e;
                    if (!a.first[p] || !a.second[p])
                        break;
                    a.first[p].close && a.second[p].close && (g.previous = g.current, g.current = (this.options.axisY.max - +a.first[p].close) * this.options.axisY.ratio + 0.5 | 0, h.previous = h.current, h.current = (this.options.axisY.max - +a.second[p].close) * this.options.axisY.ratio + 0.5 | 0, void 0 === r ? (r = g.current < h.current, this.canvas.moveTo(f, g.current)) : r !== g.current < h.current ? (r = !r, m = u.calculateLineEquation(d, g.previous, f, g.current), n = u.calculateLineEquation(d, h.previous, f, h.current), m =
                    u.calculatePointOfIntersectionOfTwoLines(m, n), this.canvas.moveTo(d, g.previous), this.canvas.lineTo(m.x, m.y), this.canvas.lineTo(d, h.previous), this.canvas.fillStyle(b.color[r ? 1 : 0]), this.canvas.fill(), this.canvas.beginPath(), this.canvas.moveTo(f, g.current), this.canvas.lineTo(m.x, m.y)) : (this.canvas.moveTo(f, g.current), this.canvas.lineTo(d, g.previous), this.canvas.lineTo(d, h.previous)), this.canvas.lineTo(f, h.current));
                    p++
                }
                this.canvas.fillStyle(b.color[r ? 0 : 1]);
                this.canvas.fill()
            },destroy: function() {
                this.unbindEvents();
                this.$parent && d.empty(this.$parent);
                this.$parent = this.$container = null
            }};
        l.inherit(v, ka);
        v.prototype.init = function() {
            v.superclass.init.call(this);
            ea = this;
            this.scrollBar = new na(this);
            this.animate()
        };
        v.prototype.animate = function() {
            this.animationInProgress && this.cAnim.iterate();
            ja.setTimeout(this.animate.bind(this), 1E3 / 60)
        };
        v.prototype.interruptAnimation = function() {
            var a;
            this.animationInProgress = !1;
            this.cAnim.animatedObjects = [];
            if (0 < this.animationQueue.length) {
                this.cAnim.forceOneFrame = !0;
                for (a = 0; a < this.animationQueue.length; a++)
                    this.animationQueue[a].addItemFunction(this.animationQueue[a].item,
                    !0);
                this.animationQueue = [];
                this.cAnim.forceOneFrame = !1
            }
        };
        v.prototype.render = function() {
            this.zoomOptions = l.getZoomOptions(this.options.zoomLevel);
            v.superclass.render.call(this);
            this.$parent = x.getElementById(this.options.selector);
            this.$container = d.createElement("div", {tabindex: "-1",styles: {width: this.options.width + "px",height: this.options.height + "px"}});
            d.addClass(this.$container, "chart-container");
            this.$parent && (this.$container.appendChild(this.$chartLayer), "hide" !== this.options.controls.scrollBar &&
            this.$chartLayer.appendChild(this.scrollBar.$scrollLayer), this.$parent.appendChild(this.$container));
            this.options.period = +this.options.period;
            this.currentOffset = this.options.data.length - this.maxVisibleItems + this.options.initialChartOffset;
            this.options.axisY.heightY = this.options.height - this.options.marginBottom - this.options.marginTop;
            this.setAdditionalOffset();
            this.scrollBar.setSliderWidth();
            this.draw(this.currentOffset, !0);
            this.scrollBar.moveToCandle(this.currentOffset);
            this.bindEvents();
            this.isReady =
            !0;
            this.options.events.rendered.call(this)
        };
        v.prototype.bindEvents = function() {
            v.superclass.bindEvents.call(this);
            d.addEvent(this.$container, "keydown", l.handleKeyEvents)
        };
        v.prototype.draw = function(a, b, c) {
            var e = this.options.data.length + this.options.additionalOffset;
            a = a || this.currentOffset;
            this.currentOffset = 0 > a || this.maxVisibleItems >= e ? 0 : a + this.maxVisibleItems > e ? e - this.maxVisibleItems : a;
            !c && this.animationInProgress && this.interruptAnimation();
            this.setExtremes();
            b && (this.canvasGrid.reset(), this.canvasGrid.drawGrid());
            this.canvas.reset();
            this.drawX(this.maxVisibleItems);
            this.drawY();
            this.renderCanvas(null, c);
            a = 0;
            for (c = this.indicators.length; a < c; a++)
                this.indicators[a].draw(b);
            a = 0;
            for (b = this.drawings.length; a < b; a++)
                this.drawings[a].update();
            this.updateControls()
        };
        v.prototype.updateControls = function() {
            this.options.showOpenPositions && this.openPosition.updateAll();
            this.priceBuy.update(this.options.priceBuy);
            this.priceSell.update(this.options.priceSell);
            this.activeTooltip && this.activeTooltip.update();
            this.activeCrossHair &&
            (this.activeCrossHair.updateCrossHairData(), this.activeCrossHair.priceSnapshot && this.activeCrossHair.priceSnapshot.update());
            this.scaleControl.calcPipsLineHeight()
        };
        v.prototype.setExtremes = function() {
            var a = [], b = [], c, e, d;
            d = l.getMinMax(this, this.options.data, "low", "high");
            b.push(d.max);
            a.push(d.min);
            c = 0;
            for (e = this.indicators.length; c < e; c++)
                if (d = this.indicators[c], "upper" === d.params.type && (d = l.getIndicatorExtremes(d)))
                    b.push(d.max), a.push(d.min);
            b = Math.max.apply(null, b);
            a = Math.min.apply(null, a);
            v.superclass.setExtremes.call(this,
            a, b)
        };
        v.prototype.drawX = function() {
            if (this.options.axisX.showLabels) {
                var a = 0, b = 0, c = (this.zoomOptions.barWidth / 2 + 0.5 >> 0) + this.zoomOptions.candleWidth * this.zoomOptions.gridLabelSkipX, e = this.options.height - this.options.marginBottom - this.options.marginTop + 14, d = 2 * this.zoomOptions.gridLabelSkipX, f = this.zoomOptions.candleWidth * this.zoomOptions.gridLabelSkipX, g = this.options.width - this.options.marginRight - this.options.marginLeft;
                this.canvas.fillStyle(this.options.colors.labels);
                for (this.drawfirstXLabel(); d <
                this.maxVisibleItems; ) {
                    b = d + this.currentOffset;
                    c += f;
                    if (c > g)
                        break;
                    this.options.data[b] ? this.canvas.fillText(l.formatChartDate(this.options.data[b - this.zoomOptions.gridLabelSkipX].timestamp, this.options.data[b].timestamp, this.options.period), c, e) : void 0 === this.options.data[b] && 0 !== this.options.period && (a = 0 === a ? this.options.data[b - this.zoomOptions.gridLabelSkipX] ? this.options.data[b - this.zoomOptions.gridLabelSkipX].timestamp : this.options.data[0].timestamp : +a + +(this.options.period * this.zoomOptions.gridLabelSkipX),
                    this.canvas.fillText(l.formatChartDate(+a, +a + +(this.options.period * this.zoomOptions.gridLabelSkipX), this.options.period), c, e));
                    d += this.zoomOptions.gridLabelSkipX
                }
            }
        };
        v.prototype.drawfirstXLabel = function() {
            var a, b, c;
            a = new Date(+this.options.data[this.currentOffset].timestamp);
            b = 10 > a.getDate.call(a) ? "0" + a.getDate.call(a) : a.getDate.call(a);
            c = a.getMonth.call(a);
            a = a.getFullYear.call(a);
            this.canvas.fillText(b + " " + eb[c] + " " + a, this.zoomOptions.barWidth / 2 >> 0, this.options.height - this.options.marginBottom - this.options.marginTop +
            14)
        };
        v.prototype.move = function(a) {
            isNaN(a) || (0 < a ? this.moveForward(a) : this.moveBackward(a))
        };
        v.prototype.moveForward = function(a) {
            this.currentOffset += a;
            this.draw(this.currentOffset);
            this.scrollBar.moveToCandle(this.currentOffset)
        };
        v.prototype.moveBackward = function(a) {
            this.currentOffset += a;
            this.draw(this.currentOffset);
            this.scrollBar.moveToCandle(this.currentOffset)
        };
        v.prototype.zoomIn = function() {
            return this.zoom(1)
        };
        v.prototype.zoomOut = function() {
            return this.zoom(-1)
        };
        v.prototype.zoom = function(a) {
            var b =
            this.options.data.length + this.options.additionalOffset;
            this.options.zoomLevel = 0 >= this.options.zoomLevel + a ? 0 : this.options.zoomLevel + a >= U.zoomOptions.length - 1 ? U.zoomOptions.length - 1 : this.options.zoomLevel + a;
            a = this.getMaxVisibleItems();
            a >= b && (this.currentOffset = 0);
            this.zoomOptions = l.getZoomOptions(this.options.zoomLevel);
            this.maxVisibleItems = a;
            a = 0;
            for (b = this.indicators.length; a < b; a++)
                this.indicators[a].zoomOptions = this.zoomOptions, this.indicators[a].maxVisibleItems = this.maxVisibleItems;
            this.setAdditionalOffset();
            this.scrollBar.setSliderWidth();
            this.scrollBar.moveToCandle(this.currentOffset);
            this.draw(this.currentOffset, !0);
            if (0 === this.options.zoomLevel)
                return this.options.events.zoomChanged.call(this, -1), -1;
            if (this.options.zoomLevel === U.zoomOptions.length - 1)
                return this.options.events.zoomChanged.call(this, 1), 1;
            this.options.events.zoomChanged.call(this, 0);
            return 0
        };
        v.prototype.switchType = function(a) {
            -1 !== this.options.chartTypes.indexOf(a) ? (this.chartType = a, this.draw(this.currentOffset), this.options.events.typeSwitched.call(this,
            this.chartType)) : l.error("Please supply correct chart type.")
        };
        v.prototype.switchTheme = function(a) {
            this.options.colors = a;
            this.options.showCrossHair && this.svg.$svgG && (d.setAttributes(this.svg.$svgXLine, {stroke: this.options.colors.crossHair}), d.setAttributes(this.svg.$svgYLine, {stroke: this.options.colors.crossHair}), d.setAttributes(this.svg.$svgRectYLabel, {fill: this.options.colors.crossHair}), d.setAttributes(this.svg.$svgRectXLabel, {fill: this.options.colors.crossHair}));
            d.setAttributes(this.svg.$svgCurrentLine,
            {styles: {stroke: this.options.colors.currentLine}});
            d.setAttributes(this.svg.$svgCurrentRect, {styles: {fill: this.options.colors.currentRect}});
            this.canvas.reset();
            this.drawGrid();
            this.renderCanvas()
        };
        v.prototype.updateLastItem = function(a) {
            var b;
            this.animationInProgress ? this.updateLastAnimatedItem(a) : (b = this.options.data[this.options.data.length - 1], this.options.priceBuy = a.buy, this.options.priceSell = a.sell, b.close = a.sell, a.sell > b.high && (b.high = a.sell), a.sell < b.low && (b.low = a.sell), this.currentOffset + this.maxVisibleItems >=
            this.options.data.length ? this.isReady && this.draw() : this.isReady && (this.priceBuy.update(a.buy), this.priceSell.update(a.sell)))
        };
        v.prototype.updateLastAnimatedItem = function(a) {
            var b = this.options.data[this.options.data.length - 1];
            0 < this.animationQueue.length ? b = this.animationQueue[this.animationQueue.length - 1].item : (this.cAnim.animatedObjects[0].target.y2 = (this.options.axisY.max - +a.sell) * this.options.axisY.ratio + 0.5 | 0, this.priceBuy.update(a.buy), this.priceSell.update(a.sell), this.options.priceBuy = a.buy,
            this.options.priceSell = a.sell);
            b.close = a.sell;
            a.sell > b.high && (b.high = a.sell);
            a.sell < b.low && (b.low = a.sell)
        };
        v.prototype.addNewItem = function(a, b) {
            var c = this.scrollBar.$sliderContainer.offsetWidth / this.options.data.length, e, d = !b && 0 === this.options.period;
            if (d && this.animationInProgress)
                this.animationQueue.push({addItemFunction: v.prototype.addNewItem.bind(this),item: a});
            else if (a = a || l.error("The supplied data is not valid."), this.options.data.splice(this.options.data.length, 0, a), this.options.data.length >
            this.options.maxNumberItems ? this.options.data.splice(0, 1) : this.isLastVisible() && this.currentOffset++, this.currentOffset + this.maxVisibleItems <= this.options.data.length && (this.scrollBar.setSliderWidth(), this.scrollBar.moveScroll(this.currentOffset * c)), this.isReady) {
                c = 0;
                for (e = this.indicators.length; c < e; c++)
                    this.indicators[c].update();
                this.draw(null, null, d)
            }
        };
        v.prototype.getMaxVisibleItems = function() {
            var a = l.getZoomOptions(this.options.zoomLevel);
            return ((this.options.width - this.options.marginLeft - this.options.marginRight) /
            a.candleWidth + 1 | 0) + 2
        };
        v.prototype.isLastVisible = function() {
            return this.currentOffset + this.getMaxVisibleItems() - 1 > this.options.data.length
        };
        v.prototype.update = function(a) {
            var b;
            this.options.data = a.data || this.options.data;
            this.options.period = +a.period;
            0 === this.options.period && ("LineChart" !== this.chartType && "AreaChart" !== this.chartType) && (this.chartType = "AreaChart", this.options.events.typeSwitched.call(this, this.chartType));
            this.currentOffset = this.options.data.length - this.maxVisibleItems + this.options.initialChartOffset;
            if (0 === this.options.period)
                a = this.getIndicators(), b = this.getDrawings(), this._indicatorsCached = a, this._drawingsCached = b, this.indicators.forEach(function(a) {
                    a.destroy()
                }), this.drawings.forEach(function(a) {
                    a.destroy()
                });
            else if (0 !== this.options.period && (this._indicatorsCached.length || this._drawingsCached.length))
                this._indicatorsCached.length && this.parseIndicators(this._indicatorsCached), this._drawingsCached.length && this.parseDrawings(this._drawingsCached), this._indicatorsCached = this._drawingsCached =
                [];
            this.indicators.forEach(function(a) {
                a.update()
            });
            this.scrollBar.setSliderWidth();
            this.draw(this.currentOffset, !0);
            this.scrollBar.moveToCandle(this.currentOffset);
            this.options.events.updated.call(this)
        };
        v.prototype.setData = function(a) {
            a || l.error("Please supplied valid data source.");
            this.options.data = a;
            this.indicators.forEach(function(a) {
                a.update()
            });
            this.isReady && this.draw()
        };
        v.prototype.addIndicator = function(a, b) {
            if (!(this.indicators.length > this.options.maxOpenedIndicators || 0 === this.options.period)) {
                this.options.events.indicatorPreInit.call(this);
                var c = z[a], e = z[a].params;
                b && (e = l.extend(b, z[a].params));
                this.indicators.push((new c.constructor(this, e)).render());
                this.options.indicatorsHeight && (c = this.getBottomIndicators().length, c = this.options.indicatorsHeight / c / 2 + 0.5 >> 0, this.options.containerHeight - this.options.indicatorsHeight - c < this.options.minHeight ? this.options.indicatorsHeight = this.options.containerHeight - this.options.minHeight : "bottom" === e.type && (this.options.indicatorsHeight += c));
                this.renderLayout();
                this.options.events.indicatorCreated.call(this,
                this.indicators[this.indicators.length - 1])
            }
        };
        v.prototype.getIndicators = function() {
            var a = [], b, c;
            this._indicatorsCached.length ? this._indicatorsCached.forEach(function(b) {
                a.push(b)
            }) : this.indicators.forEach(function(e) {
                c = {editable: {}};
                c.code = e.params.code;
                for (b in e.params.editable)
                    e.params.editable[b].currentValue ? (c.editable[b] = {}, c.editable[b].currentValue = e.params.editable[b].currentValue) : c.editable[b] = e.params.editable[b];
                e.isBottom() && (c.drawings = e.getDrawingParams(), c.offsetTop = e.options.axisY.offsetTop,
                c.offsetBottom = e.options.axisY.offsetBottom);
                a.push(c)
            });
            return a
        };
        v.prototype.parseIndicators = function(a) {
            var b = this;
            "string" === typeof a && (a = JSON.parse(a));
            a.forEach(function(a) {
                var e = a.code, d = z[e], f = z[e].params;
                a && (f = l.extend(a, z[e].params));
                if (0 !== b.options.period)
                    try {
                        b.indicators.push((new d.constructor(b, f)).render())
                    } catch (g) {
                        b.indicators.push((new d.constructor(b, z[e].params)).render())
                    }
                else
                    b._indicatorsCached.push(f)
            });
            this.renderLayout()
        };
        v.prototype.startDrawing = function(a) {
            0 !== this.options.period &&
            (d.addClass(this.$container, a), this.svg.drawingEnabled = !0, this.svg.currentDrawingId = a)
        };
        v.prototype.stopDrawing = function(a, b) {
            this.svg.drawingSelected = !0;
            this.svg.drawingEnabled = !1;
            d.removeClass(this.$container, a);
            b && (b.chart.drawings.push(b), w = b)
        };
        v.prototype.getAllDrawings = function() {
            var a = [], a = this.drawings;
            this.indicators.forEach(function(b) {
                b.isBottom() && 0 < b.drawings.length && (a = a.concat(b.drawings))
            });
            return a
        };
        v.prototype.getDrawings = function() {
            var a = [];
            this._drawingsCached.length ? this._drawingsCached.forEach(function(b) {
                a.push(b)
            }) :
            this.drawings.length && this.drawings.forEach(function(b) {
                a.push(b.params)
            });
            return a
        };
        v.prototype.parseDrawings = function(a) {
            var b = this;
            "string" === typeof a && (a = JSON.parse(a));
            a.forEach(function(a) {
                a.type && (a.name = N[a.type].params.name, (a.code = a.type) && delete a.type, a.candleTimestamp && (a.timestamp = a.candleTimestamp) && delete a.candleTimestamp, a.startCandleTimestamp && (a.startTimestamp = a.startCandleTimestamp) && delete a.startCandleTimestamp, a.endCandleTimestamp && (a.endTimestamp = a.endCandleTimestamp) && delete a.endCandleTimestamp,
                a.endCandle2Timestamp && (a.endTimestamp2 = a.endCandle2Timestamp) && delete a.endCandle2Timestamp, a.firstCandleTimestamp && (a.firstTimestamp = a.firstCandleTimestamp) && delete a.firstCandleTimestamp, a.secondCandleTimestamp && (a.secondTimestamp = a.secondCandleTimestamp) && delete a.secondCandleTimestamp, a.thirdCandleTimestamp && (a.thirdTimestamp = a.thirdCandleTimestamp) && delete a.thirdCandleTimestamp);
                a = l.extend(a, N[a.code].params);
                a.editable.styles[a.code] && delete a.editable.styles[a.code];
                a.editable.opacity && delete a.editable.opacity;
                0 !== b.options.period ? b.drawings.push((new N[a.code].constructor(b, b.chart.options.marginLeft + 1, b.chart.options.marginTop + 1, a)).parse()) : b._drawingsCached.push(a)
            })
        };
        v.prototype.toggleGrid = function(a) {
            this.options.showGrid = void 0 !== a ? a : !this.options.showGrid;
            for (a = 0; a < this.indicators.length; a++)
                this.indicators[a].options.showGrid = this.options.showGrid;
            this.draw(null, !0);
            this.options.events.gridToggled.call(this, this.options.showGrid);
            return this.options.showGrid
        };
        v.prototype.toggleTooltip = function(a) {
            return this.tooltip.toggleTooltip(a)
        };
        v.prototype.togglePriceSnapshot = function(a) {
            return this.priceSnapshot.togglePriceSnapshot(a)
        };
        v.prototype.toggleCrossHair = function(a) {
            return this.crossHair.toggleCrossHair(a)
        };
        v.prototype.toggleOpenPositions = function(a) {
            return this.openPosition.toggleOpenPositions(a)
        };
        v.prototype.toggleBuyPrice = function(a) {
            return this.priceBuy.toggle(a)
        };
        v.prototype.toggleSellPrice = function(a) {
            return this.priceSell.toggle(a)
        };
        v.prototype.toggleScaleControl = function(a) {
            return this.scaleControl.toggle(a)
        };
        v.prototype.addNewPosition =
        function(a) {
            this.openPosition.addOpenPosition(a)
        };
        v.prototype.updatePosition = function(a) {
            this.openPosition.updateOpenPosition(a)
        };
        v.prototype.removePosition = function(a) {
            this.openPosition.removeOpenPosition(a)
        };
        v.prototype.resizeChart = function(a, b) {
            var c, e, k;
            e = this.chart.isLastVisible();
            c = this.getMaxVisibleItems();
            this.options.width = a;
            this.options.height = b;
            this.options.axisY.heightY = this.chart.options.height - this.chart.options.marginBottom - this.chart.options.marginTop;
            this.resizeChartLayer();
            this.priceBuy.resize();
            this.priceSell.resize();
            this.openPosition.updateCachedProperties();
            this.options.period = +this.options.period;
            k = this.chart.getMaxVisibleItems();
            e ? this.chart.currentOffset += c - k : this.chart.currentOffset + c >= this.chart.options.data.length ? this.chart.currentOffset = this.chart.options.data.length - k : this.currentOffset + k > this.chart.options.data.length && (this.chart.currentOffset -= k - c, this.chart.currentOffset = 0 > this.chart.currentOffset ? 0 : this.chart.currentOffset);
            this.chart.maxVisibleItems = k;
            c = 0;
            for (e = this.indicators.length; c <
            e; c++)
                this.indicators[c].maxVisibleItems = k, this.indicators[c].isBottom() && d.css(this.indicators[c].$indicatorTitle, {width: a - this.options.marginRight - 2 * this.indicators[c].$indicatorTitle.offsetLeft + "px"});
            this.setAdditionalOffset();
            this.scrollBar.setSliderWidth();
            this.scrollBar.moveToCandle(this.currentOffset);
            this.chart.draw(this.currentOffset, !0)
        };
        v.prototype.getBottomIndicators = function() {
            var a = [], b, c = this.indicators.length;
            for (b = 0; b < c; b++)
                this.indicators[b].isBottom() && (a[a.length] = this.indicators[b]);
            return a
        };
        v.prototype.renderIndicatorSep = function() {
            this.$indicatorSep = d.createElement("div");
            d.addClass(this.$indicatorSep, "indicator-separator");
            d.addEvent(this.$indicatorSep, "mousedown", this._indicatorSepMouseDownHandler);
            d.addEvent(this.$indicatorSep, "touchstart", this._indicatorSepMouseDownHandler);
            this.moveIndicatorSep();
            this.$container.appendChild(this.$indicatorSep)
        };
        v.prototype.moveIndicatorSep = function() {
            this.$indicatorSep && d.css(this.$indicatorSep, {left: this.options.marginLeft + "px",top: this.options.height -
                this.options.marginBottom + "px",width: this.options.width - this.options.marginLeft - this.options.marginRight + "px",height: this.options.marginBottom + "px"})
        };
        v.prototype.handleIndicatorSepMouseDownEvent = function(a) {
            this.indicatorSepDragPosition = "mousedown" === a.type ? a.pageY : a.touches[0].pageY;
            d.addClass(x.body, "hide-controls");
            d.addClass(x.body, "indicator-resize");
            d.addEvent(x.body, "mousedown" === a.type ? "mousemove" : "touchmove", this._indicatorSepMouseMoveHandler);
            d.addEvent(x.body, "mousedown" === a.type ? "mouseup" :
            "touchend", this._indicatorSepMouseUpHandler);
            a.preventDefault()
        };
        v.prototype.handleIndicatorSepMouseMoveEvent = function(a) {
            a = this.indicatorSepDragPosition - ("mousemove" === a.type ? a.pageY : a.touches[0].pageY);
            if (this.options.containerHeight - this.options.indicatorsHeight - a < this.options.minHeight || 18 > this.options.indicatorsHeight + a)
                return !1;
            this.options.indicatorsHeight += a;
            this.renderLayout();
            this.indicatorSepDragPosition -= a
        };
        v.prototype.handleIndicatorSepMouseUpEvent = function() {
            d.removeClass(x.body, "hide-controls");
            d.removeClass(x.body, "indicator-resize");
            d.removeEvent(x.body, "mousemove", this._indicatorSepMouseMoveHandler);
            d.removeEvent(x.body, "touchmove", this._indicatorSepMouseMoveHandler);
            d.removeEvent(x.body, "mouseup", this._indicatorSepMouseUpHandler);
            d.removeEvent(x.body, "touchend", this._indicatorSepMouseUpHandler);
            this.chart.options.events.indicatorResized.call(this, this.options.indicatorsHeight)
        };
        v.prototype.setAdditionalOffset = function() {
            this.options.additionalOffset = this.maxVisibleItems - this.zoomOptions.gridLabelSkipX -
            1
        };
        v.prototype.destroy = function() {
            for (; this.indicators.length; )
                this.indicators[0].destroy();
            for (; this.drawings.length; )
                this.drawings[0].destroy();
            this.canvas.destroy();
            this.canvasGrid.destroy();
            this.crossHair.destroy();
            this.tooltip.destroy();
            this.openPosition.destroy();
            this.svg.destroy();
            this.scrollBar.destroy();
            this.$chartLayer = this.activeTooltip = this.activeCrossHair = this.zoomOptions = this.maxVisibleItems = this.isReady = this.crossHairVLines = this.currentOffset = this.chartType = this.chart = this._indicatorsCached =
            this._drawingsCached = this.canvas = this.canvasGrid = this.crossHair = this.priceBuy = this.priceSell = this.drawings = this.indicators = this.scrollBar = this.tooltip = this.svg = this.openPosition = this.$indicatorSep = this.indicatorSepDragPosition = null;
            v.superclass.destroy.call(this);
            this.options.events.destroyed.call(this);
            this.options = null
        };
        fa.prototype = {constructor: fa,translateCanvas: function() {
                this.translate(this.chart.options.marginLeft, this.chart.options.marginTop)
            },resizeCanvas: function() {
                this.translateCanvas()
            },
            reset: function() {
                this.context.clearRect(0, 0, this.chart.options.width, this.chart.options.height)
            },beginPath: function() {
                this.context.beginPath()
            },closePath: function() {
                this.context.closePath()
            },rect: function(a, b, c, e) {
                this.context.rect(a, b, c, e)
            },clearRect: function(a, b, c, e) {
                this.context.clearRect(a, b, c, e)
            },fillRect: function(a, b, c, e) {
                this.context.fillRect(a, b, c, e)
            },strokeRect: function(a, b, c, e) {
                this.context.strokeRect(a, b, c, e)
            },arc: function(a, b, c) {
                this.context.arc(a + 0.5, b + 0.5, c, 0, 2 * Math.PI)
            },line: function(a,
            b, c, e) {
                this.context.moveTo(a + 0.5, b + 0.5);
                this.context.lineTo(c + 0.5, e + 0.5)
            },lineTo: function(a, b) {
                this.context.lineTo(a + 0.5, b + 0.5)
            },lineWidth: function(a) {
                this.context && (this.context.lineWidth = a)
            },moveTo: function(a, b) {
                this.context.moveTo(a + 0.5, b + 0.5)
            },stroke: function() {
                this.context.stroke()
            },fill: function() {
                this.context.fill()
            },fillText: function(a, b, c) {
                this.context.fillText(a, b, c)
            },strokeStyle: function(a) {
                this.context && (this.context.strokeStyle = a)
            },fillStyle: function(a) {
                this.context && (this.context.fillStyle =
                a)
            },globalAlpha: function(a) {
                this.context && (this.context.globalAlpha = a)
            },clip: function() {
                this.context.clip()
            },save: function() {
                this.context.save()
            },restore: function() {
                this.context.restore()
            },translate: function(a, b) {
                this.context.translate(a, b)
            },destroy: function() {
                this.chart = this.$canvas = this.$canvasLayer = this.context = null
            }};
        l.inherit(ba, fa);
        ba.prototype.getMaxVisibleItems = function() {
            var a = l.getZoomOptions(this.chart.options.zoomLevel);
            return ((this.chart.options.width - this.chart.options.marginLeft - this.chart.options.marginRight) /
            a.candleWidth + 1 | 0) + 1
        };
        ba.prototype.drawGrid = function() {
            "" !== this.options.colors.drawableAreaColor && (this.beginPath(), this.fillStyle(this.options.colors.drawableAreaColor), this.fillRect(this.options.marginLeft, this.options.marginTop, this.options.width - this.options.marginLeft - this.options.marginRight, this.options.height - this.options.marginTop - this.options.marginBottom), this.closePath());
            this.options.axisX.showTickLabels && this.drawXTickLabels();
            this.options.axisY.showTickLabels && this.drawYTickLabels();
            this.options.showGrid && this.drawYLines();
            this.options.showGrid && this.drawXLines();
            this.mainLines()
        };
        ba.prototype.mainLines = function() {
            this.options.axisY.showMainLine && (this.beginPath(), this.strokeStyle(this.options.colors.mainAxis), this.line(this.options.width - this.options.marginRight, this.options.marginTop, this.options.width - this.options.marginRight, this.options.height - this.options.marginBottom), this.stroke(), this.closePath());
            this.options.axisX.showMainLine && (this.beginPath(), this.strokeStyle(this.options.colors.mainAxis),
            this.line(this.options.marginLeft, this.options.height - this.options.marginBottom, this.options.width - this.options.marginRight, this.options.height - this.options.marginBottom), this.stroke(), this.closePath());
            if (this.options.showGrid || !this.options.showGrid && this.options.axisY.boldUpperMainLine)
                this.beginPath(), this.save(), this.options.axisY.boldUpperMainLine ? this.strokeStyle(this.options.colors.mainAxis) : this.strokeStyle(this.options.colors.axisY), this.line(this.options.marginLeft, this.options.marginTop,
                this.options.width - this.options.marginRight, this.options.marginTop), this.lineWidth(this.options.axisY.upperMainLineThickness), this.stroke(), this.restore(), this.closePath()
        };
        ba.prototype.drawXLines = function() {
            var a = 0, b;
            for (b = 0; b < this.chart.maxVisibleItems; b++)
                if (0 === b % this.chart.zoomOptions.gridSkipX) {
                    a = b * this.chart.zoomOptions.candleWidth + this.options.marginLeft + 0.5 | 0;
                    if (a + (this.chart.zoomOptions.barWidth / 2 >> 0) >= this.options.width - this.options.marginRight)
                        break;
                    this.beginPath();
                    this.strokeStyle(this.options.colors.axisX);
                    this.line(a + (this.chart.zoomOptions.barWidth / 2 >> 0), this.options.marginTop + 1, a + (this.chart.zoomOptions.barWidth / 2 >> 0), this.options.height - this.options.marginBottom);
                    this.stroke();
                    this.closePath()
                }
        };
        ba.prototype.drawXTickLabels = function() {
            var a = 0, b;
            for (b = 0; b < this.chart.maxVisibleItems; b++)
                if (0 === b % this.chart.zoomOptions.gridSkipX) {
                    a = b * this.chart.zoomOptions.candleWidth + this.options.marginLeft + 0.5 | 0;
                    if (a + (this.chart.zoomOptions.barWidth / 2 >> 0) >= this.options.width - this.options.marginRight)
                        break;
                    this.beginPath();
                    this.strokeStyle(this.options.colors.mainAxis);
                    this.line(a + (this.chart.zoomOptions.barWidth / 2 >> 0), this.options.height - this.options.marginBottom, a + (this.chart.zoomOptions.barWidth / 2 >> 0), this.options.height - this.options.marginBottom + 1);
                    this.stroke();
                    this.closePath()
                }
        };
        ba.prototype.drawYLines = function() {
            var a = this.options.axisY.heightY / (this.chart.zoomOptions.gridSkipX * this.chart.zoomOptions.barWidth + this.chart.zoomOptions.gridSkipX * this.chart.zoomOptions.barMargin) + 0.5 | 0, b = this.options.axisY.range /
            a, c = this.options.axisY.ratio = this.options.axisY.heightY / this.options.axisY.range, e;
            for (e = 1; e <= a - 1; e++)
                this.beginPath(), this.strokeStyle(this.options.colors.axisY), this.line(this.options.marginLeft, this.options.height - (this.options.marginBottom + b * c * e) | 0, this.options.width - this.options.marginRight, this.options.height - (this.options.marginBottom + b * c * e) | 0), this.stroke(), this.closePath()
        };
        ba.prototype.drawYTickLabels = function() {
            var a = this.options.axisY.heightY / (this.chart.zoomOptions.gridSkipX * this.chart.zoomOptions.barWidth +
            this.chart.zoomOptions.gridSkipX * this.chart.zoomOptions.barMargin) + 0.5 | 0, b = this.options.axisY.range / a, c = this.options.axisY.ratio, e;
            for (e = 1; e <= a && (this.options.axisY.showLastLabel || e !== a); e++)
                this.beginPath(), this.strokeStyle(this.options.colors.mainAxis), this.line(this.options.width - this.options.marginRight, this.options.height - (this.options.marginBottom + b * c * e) | 0, this.options.width - this.options.marginRight + 1, this.options.height - (this.options.marginBottom + b * c * e) | 0), this.stroke(), this.closePath()
        };
        ba.prototype.destroy =
        function() {
            this.chart = this.context = this.$canvasGrid = this.$canvasGridLayer = this.options = null
        };
        ga.prototype = {constructor: ga,init: function() {
                this.bindEvents()
            },bindEvents: function() {
                var a = this, b;
                this.options.mouseWheel && (b = "onwheel" in x.createElement("div") ? "wheel" : void 0 !== x.onmousewheel ? "mousewheel" : "DOMMouseScroll", d.addEvent(this.$svg, b, this._mouseWheelHandler));
                d.addEvent(this.$svg, "mousedown", this._mouseDownHandler);
                d.addEvent(this.$svg, "touchstart", this._mouseDownHandler);
                d.addEvent(x, "mouseup",
                this._mouseUpHandler);
                d.addEvent(x, "touchend", this._mouseUpHandler);
                d.addEvent(this.$svg, "mouseover", function() {
                    ea = a.mainChart
                })
            },unbindEvents: function() {
                if (this.mainChart.options.mouseWheel) {
                    var a = "onwheel" in x.createElement("div") ? "wheel" : void 0 !== x.onmousewheel ? "mousewheel" : "DOMMouseScroll";
                    d.removeEvent(this.$svg, a, this._mouseWheelHandler)
                }
                d.removeEvent(this.$svg, "mousedown", this._mouseDownHandler);
                d.removeEvent(this.$svg, "touchstart", this._mouseDownHandler);
                d.removeEvent(x, "mouseup", this._mouseUpHandler);
                d.removeEvent(x, "touchend", this._mouseUpHandler)
            },renderSvgLayer: function() {
                var a = d.createElement("div", {"class": "layer svgLayer unselectable"});
                this.$svg = d.createElementNS("http://www.w3.org/2000/svg", "svg", {width: this.options.width ? this.options.width : "100%",height: this.options.height ? this.options.height : "100%",xmlns: "http://www.w3.org/2000/svg",version: "1.1",baseProfile: "full","class": "unselectable"});
                this.$clipRect = d.createElementNS("http://www.w3.org/2000/svg", "rect", {x: this.options.marginLeft,
                    y: this.options.marginTop,width: this.options.width - this.options.marginLeft - this.options.marginRight,height: this.options.height - this.options.marginTop - this.options.marginBottom + 1});
                this.$clipPath = d.createElementNS("http://www.w3.org/2000/svg", "clipPath", {id: "svgClipPath" + bb});
                this.$svgDefs = d.createElementNS("http://www.w3.org/2000/svg", "defs");
                this.$svgGdrawing = d.createElementNS("http://www.w3.org/2000/svg", "g", {"clip-path": "url(#svgClipPath" + bb + ")"});
                this.$svgGLines = d.createElementNS("http://www.w3.org/2000/svg",
                "g");
                this.$svg.appendChild(this.$svgDefs);
                this.$clipPath.appendChild(this.$clipRect);
                this.$svgDefs.appendChild(this.$clipPath);
                this.$svg.appendChild(this.$svgGdrawing);
                this.$svg.appendChild(this.$svgGLines);
                a.appendChild(this.$svg);
                return a
            },handleMouseWheelEvent: function(a) {
                var b = l.getWheelDelta(a), c = this.mainChart.zoomOptions;
                a.target === this.$svg && (this.mainChart.move(c.gridSkipX * b), a.preventDefault())
            },handleMouseDownEvent: function(a) {
                "touchstart" === a.type ? (this.mouseXposition = a.touches[0].pageX -
                d.offset(this.$svg).left, this.mouseXdragPos = a.touches[0].pageX - d.offset(this.$svg).left, this.mouseYposition = a.touches[0].pageY - d.offset(this.$svg).top, a.preventDefault()) : "mousedown" === a.type && (this.mouseXposition = void 0 !== a.layerX ? a.layerX : a.offsetX, this.mouseXdragPos = void 0 !== a.layerX ? a.layerX : a.offsetX, this.mouseYposition = void 0 !== a.layerY ? a.layerY : a.offsetY);
                a.target === this.chart.scaleControl.scaleRect && this.chart.scaleControl.scaleMouseDown(a);
                q.hideLastDrawing();
                this.mainChart.svg.drawingEnabled ?
                this.chart.drawings.length < this.mainChart.options.maxOpenedDrawings ? (this.addDrawing(this.mainChart.svg.currentDrawingId), w && d.addEvent(this.$svg, "mousedown" === a.type ? "mousemove" : "touchmove", w._drawingMoveHandler)) : (this.mainChart.options.events.maxOpenedDrawings.call(this), this.mainChart.stopDrawing(this.currentDrawingId)) : a.target === this.$svg && (this.mainChart.options.showCrossHair && 0 !== this.mainChart.options.period ? (this.mainChart.activeTooltip && this.mainChart.activeTooltip.$tooltip && this.mainChart.activeTooltip.handleMouseOutEvent(a),
                this.chart.crossHair.renderPriceSnapshot().update(a), this.priceSnapshotEnabled = !0, d.addClass(this.chart.$chartLayer, "moving")) : (d.addClass(this.$svgLayer, U.dragClass), d.addEvent(this.$svg, "mousedown" === a.type ? "mousemove" : "touchmove", this._mouseMoveHandler)))
            },addDrawing: function(a) {
                w = null;
                var b = l.extend({}, N[a].params), b = new N[a].constructor(this.chart, this.mouseXposition, this.mouseYposition, b);
                b.drawing && (this.mainChart.stopDrawing(a, b), this.mainChart.options.events.drawingCreated.call(this))
            },handleMouseUpEvent: function(a) {
                this.mouseXdragPos =
                this.mouseYposition = this.mouseXposition = 0;
                this.drawingSelected = this.moveDrawing = !1;
                !this.mainChart.svg.drawingEnabled && (w && !w.ui && !w.snapped) && (d.removeClass(w.chart.$chartLayer, "moving"), d.removeSvgClass(w.container, "move-drawing"), w.snap(), w.hide());
                d.hasClass(this.$svgLayer, U.scaleClass) && (d.removeClass(this.$svgLayer, U.scaleClass), this.chart.scaleControl.scaleMouseUp());
                d.hasClass(this.$svgLayer, U.dragClass) && (d.removeClass(this.$svgLayer, U.dragClass), d.removeEvent(this.$svg, "mouseup" === a.type ?
                "mousemove" : "touchmove", this._mouseMoveHandler));
                w && d.removeEvent(this.$svg, "mouseup" === a.type ? "mousemove" : "touchmove", w._drawingMoveHandler);
                this.priceSnapshotEnabled && (this.priceSnapshotEnabled = !1, this.chart.crossHair.priceSnapshot.destroy(), this.chart.crossHair.priceSnapshot = null, this.mainChart.options.showTooltip && this.chart.tooltip.handleMouseOverEvent(a), d.removeClass(this.chart.$chartLayer, "moving"));
                "touchend" === a.type && a.preventDefault()
            },handleMouseMoveEvent: function(a) {
                if (l.mouseMoveEnable(this.mainChart))
                    return !1;
                var b, c, e, k;
                "touchmove" === a.type ? b = a.touches[0].pageX - d.offset(this.$svg).left : "mousemove" === a.type && (b = a.layerX || a.offsetX);
                c = b - this.mouseXdragPos;
                e = this.mainChart.zoomOptions.candleWidth;
                k = c / e >> 0;
                1 <= Math.abs(c / e >> 0) && (this.mainChart.move(-k), this.mouseXdragPos = b - (c - k * e));
                a.preventDefault()
            },destroy: function() {
                this.unbindEvents();
                this.$svgCurrentGItem && d.empty(this.$svgCurrentGItem);
                this.chart = this.mainChart = this.$svg = this.$svgG = this.$svgGYlabel = this.$svgGXlabel = this.$svgCurrentGItem = this.$svgGdrawing =
                this.$svgGLines = this.$svgGposition = this.$clipRect = this.$clipPath = this.$svgCurrentLine = this.$svgCurrentRect = this.$svgCurrentText = this.$svgDefs = this.$svgLayer = this.drawingEnabled = this.drawingSelected = this.mouseXdragPos = this.mouseXposition = this.mouseYposition = this.moveDrawing = this.options = this._mouseDownHandler = this._mouseMoveHandler = this._mouseUpHandler = this._mouseWheelHandler = null
            }};
        na.prototype = {constructor: na,bindEvents: function() {
                var a = this;
                d.addEvent(a.$btnLeft, "mousedown", function() {
                    var b = U.zoomOptions[a.chart.options.zoomLevel];
                    a.chart.move(-b.scrollSkipX);
                    a.repeatTimer = setTimeout(function() {
                        a.repeatTimer = setInterval(function() {
                            a.chart.move(-b.scrollSkipX)
                        }, 100)
                    }, 500)
                });
                d.addEvent(a.$btnRight, "mousedown", function() {
                    var b = U.zoomOptions[a.chart.options.zoomLevel];
                    a.chart.move(b.scrollSkipX);
                    a.repeatTimer = setTimeout(function() {
                        a.repeatTimer = setInterval(function() {
                            a.chart.move(b.scrollSkipX)
                        }, 100)
                    }, 500)
                });
                d.addEvent(x, "mouseup", a._handleScrollDocMouseUp);
                d.addEvent(this.$sliderContainer, "mousedown", function(b) {
                    if (b.target !==
                    a.$sliderContainer)
                        return !1;
                    b = b.layerX || b.offsetX;
                    a.chart.move(-(a.chart.currentOffset - (b / (a.$sliderContainer.offsetWidth / (a.chart.options.data.length + a.chart.options.additionalOffset)) >> 0)));
                    a.moveScroll(b)
                });
                d.addEvent(this.$scrollSlider, "mousedown", function(b) {
                    d.addEvent(x, "mousemove", a._mouseMoveHandler);
                    d.addEvent(x, "mouseup", a._mouseUpHandler);
                    a.dragPosition = b.pageX;
                    d.addClass(a.$scrollLayer, "dragging")
                })
            },mouseMoveHandler: function(a) {
                a = a.pageX;
                var b = d.offset(this.$sliderContainer).left, c = this.$sliderContainer.offsetWidth +
                b, e = this.$sliderContainer.offsetWidth / (this.chart.options.data.length + this.chart.options.additionalOffset);
                a <= b ? a = b : a >= c && (a = c);
                b = this.currentPosition + a - this.dragPosition;
                this.currentPosition !== b && this.chart.draw(b / e | 0);
                this.moveScroll(b);
                this.dragPosition = a
            },mouseUpHandler: function() {
                d.removeEvent(x, "mousemove", this._mouseMoveHandler);
                d.removeEvent(x, "mouseup", this._mouseMoveHandler)
            },moveScroll: function(a) {
                var b = this.$sliderContainer.offsetWidth;
                0 >= a ? a = 0 : a >= b - this.sliderWidth && (a = b - this.sliderWidth);
                d.css(this.$scrollSlider, {left: (a + 1 | 0) + "px"});
                this.currentPosition = a
            },moveToCandle: function(a) {
                this.moveScroll(a * (this.$sliderContainer.offsetWidth / (this.chart.options.data.length + this.chart.options.additionalOffset)))
            },handleScrollDocMouseUp: function() {
                this.repeatTimer && clearInterval(this.repeatTimer);
                d.removeClass(this.$scrollLayer, "dragging")
            },setSliderWidth: function() {
                var a = this.$sliderContainer.offsetWidth, b = this.chart.options.data.length + this.chart.options.additionalOffset, c = a / b, e = this.chart.getMaxVisibleItems(),
                a = (e >= b ? a : e * c) >> 0;
                5 >= a && (a = 5);
                this.sliderWidth = a;
                d.css(this.$scrollSlider, {width: a + "px"})
            },destroy: function() {
                d.removeEvent(x, "mouseup", this._handleScrollDocMouseUp);
                d.removeEvent(x, "mousemove", this._mouseMoveHandler);
                d.removeEvent(x, "mouseup", this._mouseUpHandler);
                this.chart = this.repeatTimer = this.currentPosition = this.$scrollLayer = this.$btnLeft = this.$btnRight = this.$sliderContainer = this.$scrollSlider = this.sliderWidth = this.dragPosition = null
            }};
        V.prototype.bindEvents = function() {
            d.addEvent(this.chart.svg.$svg,
            "mouseover", this._tooltipMouseOverHandler)
        };
        V.prototype.handleMouseOverEvent = function() {
            this.chart.options.showTooltip && (!this.$tooltip && this.render(), this.mainChart.activeTooltip = this)
        };
        V.prototype.handleMouseOutEvent = function(a) {
            a.toElement === this.$tooltip.$tooltipOverlay || a.toElement === this.$tooltip || (d.removeEvent(this.chart.svg.$svg, "mousemove", this._tooltipUpdateHandler), this.chart.options.showTooltip ? d.addEvent(this.chart.svg.$svg, "mouseover", this._tooltipMouseOverHandler) : d.removeEvent(this.chart.svg.$svg,
            "mouseover", this._tooltipMouseOverHandler), d.removeEvent(this.chart.svg.$svg, "mouseout", this._tooltipMouseOutHandler), this.$tooltip && (this.$tooltip.parentNode && x.body.removeChild(this.$tooltip), this.$tooltip = null))
        };
        V.prototype.toggleTooltip = function(a) {
            if (void 0 !== a && this.chart.options.showTooltip === a)
                return this.chart.options.showTooltip;
            this.chart.options.showTooltip = void 0 !== a ? a : !this.chart.options.showTooltip;
            this.chart.options.showTooltip ? !this.$tooltip && this.render() : this.uninitialize();
            for (a =
            0; a < this.chart.indicators.length; a++)
                this.chart.indicators[a].options.showTooltip = this.chart.options.showTooltip;
            this.chart.options.events.tooltipToggled.call(this.chart, this.chart.options.showTooltip);
            return this.chart.options.showTooltip
        };
        V.prototype.render = function() {
            this.svgOffset = d.offset(this.chart.svg.$svg.parentElement || this.chart.svg.$svg.parentNode);
            var a = this.getTooltipCandleInfo(this.chart.options.marginLeft), b, c, e = 0;
            this.$tooltip = d.createElement("div");
            this.$tooltip.offsetFromCursor =
            15;
            this.$tooltip.wrapper = d.createElement("div");
            this.$tooltip.$tooltipOverlay = d.createElement("div");
            d.addClass(this.$tooltip.$tooltipOverlay, "tooltip-overlay");
            d.addClass(this.$tooltip.wrapper, "tooltip-wrapper");
            d.addClass(this.$tooltip, "chart_tooltip hidden");
            x.body.appendChild(this.$tooltip);
            this.$tooltip.appendChild(this.$tooltip.wrapper);
            this.$tooltip.appendChild(this.$tooltip.$tooltipOverlay);
            b = 0;
            for (c = a[0].length; b < c; b++, e++)
                this.$tooltip[e] = d.createElement("div"), this.$tooltip.wrapper.appendChild(this.$tooltip[e]),
                this.$tooltip[e].div = d.createElement("div"), this.$tooltip[e].appendChild(this.$tooltip[e].div), d.text(this.$tooltip[e].div, a[0][b][0]), this.$tooltip[e].span = d.createElement("span"), this.$tooltip[e].appendChild(this.$tooltip[e].span), d.text(this.$tooltip[e].span, a[0][b][1]);
            b = 0;
            for (c = a[1].length; b < c; b++, e++)
                this.$tooltip[e] = d.createElement("div"), this.$tooltip.wrapper.appendChild(this.$tooltip[e]), this.$tooltip[e].div = d.createElement("div"), this.$tooltip[e].appendChild(this.$tooltip[e].div), d.text(this.$tooltip[e].div,
                a[1][b][0]), this.$tooltip[e].span = d.createElement("span"), this.$tooltip[e].appendChild(this.$tooltip[e].span), d.text(this.$tooltip[e].span, a[1][b][1]);
            this.tooltipMovingExtremes = {minX: this.chart.options.marginLeft,maxX: this.chart.options.width - this.chart.options.marginRight,minY: this.chart.options.marginTop + this.chart.options.axisY.minOffsetTop,maxY: this.chart.options.height - this.chart.options.marginBottom - this.chart.options.axisY.minOffsetBottom};
            d.addEvent(this.$tooltip.$tooltipOverlay, "mousemove",
            this._tooltipOverlayMouseMoveHandler);
            d.addEvent(this.chart.svg.$svg, "mousemove", this._tooltipUpdateHandler);
            d.addEvent(this.chart.svg.$svg, "mouseout", this._tooltipMouseOutHandler);
            return this
        };
        V.prototype.hideTooltip = function() {
            this.$tooltip && this.chart.options.showTooltip && d.addClass(this.$tooltip, "hidden")
        };
        V.prototype.update = function(a) {
            if (!(!this.chart.crossHair.priceSnapshot && !this.chart.options.showTooltip || !this.$tooltip || this.chart.svg.drawingEnabled || this.mainChart.svg.drawingSelected ||
            l.mouseMoveEnable(this.chart))) {
                var b = x.documentElement.scrollTop || x.body.scrollTop, c = x.documentElement.scrollLeft || x.body.scrollLeft, e, k, f;
                a && (e = a.clientX || a.x, a = a.clientY || a.y, this.mouseXPosition = e + c - this.svgOffset.left, this.mouseYPosition = a + b - this.svgOffset.top);
                this.tooltipXPosition = this.mouseXPosition + this.$tooltip.offsetFromCursor + this.svgOffset.left;
                this.tooltipYPosition = this.mouseYPosition + this.$tooltip.offsetFromCursor + this.svgOffset.top;
                this.mouseYPosition > this.tooltipMovingExtremes.maxY ||
                this.mouseYPosition < this.tooltipMovingExtremes.minY || this.mouseXPosition > this.tooltipMovingExtremes.maxX || this.mouseXPosition < this.tooltipMovingExtremes.minX ? d.addClass(this.$tooltip, "hidden") : (this.updateData(), d.removeClass(this.$tooltip, "hidden"), k = x.documentElement.clientWidth, f = x.documentElement.clientHeight, e = this.$tooltip.offsetWidth, a = this.$tooltip.offsetHeight, this.tooltipXPosition + e - c >= k && (this.tooltipXPosition = k + c - e), this.tooltipYPosition + a - b >= f && (this.tooltipYPosition = f + b - a), d.setAttributes(this.$tooltip,
                {style: "top: " + this.tooltipYPosition + "px; left: " + this.tooltipXPosition + "px;"}))
            }
        };
        V.prototype.updateData = function() {
            var a = this.getTooltipCandleInfo(this.mouseXPosition), b, c, e = 0;
            b = 0;
            for (c = a[0].length; b < c; b++, e++)
                this.$tooltip[e].span.textContent = a[0][b][1];
            b = 0;
            for (c = a[1].length; b < c; b++, e++)
                this.$tooltip[e].span.textContent = a[1][b][1]
        };
        V.prototype.getTooltipCandleInfo = function(a) {
            var b = this.mainChart.options.data.length;
            a = this.mainChart.currentOffset + ((a - this.chart.options.marginLeft) / this.mainChart.zoomOptions.candleWidth >>
            0);
            var c = +this.chart.options.axisY.min + (this.chart.options.axisY.heightY - this.mouseYPosition + this.chart.options.marginTop) / +this.chart.options.axisY.ratio, e, d = [[], []];
            d[0].push([this.chart.options.tooltipLabels.timestamp || "Timestamp", l.formatCrossHairDate(a >= b ? 0 !== this.mainChart.options.period ? +this.mainChart.options.data[b - 1].timestamp + (a + 1 - b) * this.mainChart.options.period : this.mainChart.options.data[b - 1].timestamp : this.mainChart.options.data[a].timestamp, this.chart.options.period)]);
            if (this.chart instanceof
            y)
                d[0].push([this.chart.options.tooltipLabels.value || "Value:", c.toFixed(this.chart.options.precision)]), this.getIndicatorInfo(this.chart, a, d[1]);
            else {
                0 !== this.chart.options.period ? (d[0].push([this.chart.options.tooltipLabels.price || "Price:", c.toFixed(this.chart.options.precision)]), d[0].push([this.chart.options.tooltipLabels.open || "Open:", this.mainChart.options.data[a] && this.mainChart.options.data[a].open ? (+this.mainChart.options.data[a].open).toFixed(this.mainChart.options.precision) : ""]), d[0].push([this.chart.options.tooltipLabels.close ||
                    "Close:", this.mainChart.options.data[a] && this.mainChart.options.data[a].close ? (+this.mainChart.options.data[a].close).toFixed(this.mainChart.options.precision) : ""]), d[0].push([this.chart.options.tooltipLabels.high || "High:", this.mainChart.options.data[a] && this.mainChart.options.data[a].high ? (+this.mainChart.options.data[a].high).toFixed(this.mainChart.options.precision) : ""]), d[0].push([this.chart.options.tooltipLabels.low || "Low:", this.mainChart.options.data[a] && this.mainChart.options.data[a].low ? (+this.mainChart.options.data[a].low).toFixed(this.mainChart.options.precision) :
                    ""])) : (d[0].push([this.chart.options.tooltipLabels.buy || "Buy:", this.mainChart.options.data[a] && this.mainChart.options.data[a].open ? (+this.mainChart.options.data[a].open).toFixed(this.mainChart.options.precision) : ""]), d[0].push([this.chart.options.tooltipLabels.sell || "Sell:", this.mainChart.options.data[a] && this.mainChart.options.data[a].close ? (+this.mainChart.options.data[a].close).toFixed(this.mainChart.options.precision) : ""]));
                b = 0;
                for (c = this.chart.indicators.length; b < c; b++)
                    e = this.chart.indicators[b],
                    e.isUpper() && this.getIndicatorInfo(e, a, d[1])
            }
            return d
        };
        V.prototype.getIndicatorInfo = function(a, b, c) {
            var d, k = a.indicatorData.length, f;
            for (d = 0; d < k; d++)
                f = a.indicatorData[d], null !== f.name && (f.source[b] ? c.push([f.name, f.source[b][f.price] ? (+f.source[b][f.price]).toFixed(this.chart.options.precision) : ""]) : c.push([f.name, 1 === f.source.length ? (+f.source[0][f.price]).toFixed(this.chart.options.precision) : ""]))
        };
        V.prototype.handleOverlayMouseMove = function(a) {
            var b = void 0 !== a.layerY ? a.layerY : a.offsetY;
            this.mouseXPosition +=
            void 0 !== a.layerX ? a.layerX : a.offsetX;
            this.mouseYPosition += b;
            this.update()
        };
        V.prototype.uninitialize = function() {
            this.$tooltip && (d.removeEvent(this.$tooltip.$tooltipOverlay, "mousemove", this._tooltipOverlayMouseMoveHandler), this.$tooltip.parentNode && x.body.removeChild(this.$tooltip), this.$tooltip = null);
            d.removeEvent(this.chart.svg.$svg, "mouseout", this._tooltipMouseOutHandler);
            this.mainChart.activeTooltip === this && (this.mainChart.activeTooltip = null)
        };
        V.prototype.destroy = function() {
            this.uninitialize();
            this.$tooltip = this.mouseXTooltipPosition = this.mouseYTooltipPosition = this.tooltipMovingExtremes = this.chart = this.mainChart = this.svgOffset = null
        };
        l.inherit(I, ga);
        I.prototype.bindEvents = function() {
            d.addEvent(this.chart.svg.$svg, "mouseover", this._mouseOverCrossHandler)
        };
        I.prototype.render = function() {
            this.mainChart.options.showCrossHair && (this.$svgG = d.createElementNS("http://www.w3.org/2000/svg", "g"), d.setAttributes(this.$svgG, {"class": "crossHairG"}), this.chart.svg.$svg.appendChild(this.$svgG), this.renderCrossHairX(),
            this.renderCrossHairY())
        };
        I.prototype.renderCrossHairX = function() {
            this.$svgXLine = d.createElementNS("http://www.w3.org/2000/svg", "line", {"class": "crossXLine","stroke-dasharray": this.chart.options.controls.crossHair.style,stroke: this.chart.options.colors.crossHair,"stroke-width": "1",y1: this.crossHairMoveExtremes.minY,y2: this.crossHairMoveExtremes.maxY + 1,fill: "none","shape-rendering": "crispEdges"});
            this.$svgGXlabel = d.createElementNS("http://www.w3.org/2000/svg", "g");
            this.$svgTextXLabel = d.createElementNS("http://www.w3.org/2000/svg",
            "text");
            this.$svgRectXLabel = d.createElementNS("http://www.w3.org/2000/svg", "rect");
            this.$svgG.appendChild(this.$svgXLine);
            this.mainChart.crossHairVLines.push(this.$svgXLine);
            this.chart.options.controls.crossHair.showTimestampLabel && (this.$svgGXlabel.appendChild(this.$svgRectXLabel), this.$svgGXlabel.appendChild(this.$svgTextXLabel), this.$svgG.appendChild(this.$svgGXlabel), d.setAttributes(this.$svgRectXLabel, {x: -50,width: 100,height: 20,y: this.crossHairMoveExtremes.maxY + 1,fill: this.chart.options.colors.crossHair,
                "stroke-width": "1",rx: "2",ry: "2"}), d.setAttributes(this.$svgTextXLabel, {x: 0,y: this.crossHairMoveExtremes.maxY + 10,dy: 5,"class": "label_text"}))
        };
        I.prototype.renderCrossHairY = function() {
            this.$svgYLine = d.createElementNS("http://www.w3.org/2000/svg", "line", {"class": "crossYLine","stroke-dasharray": this.chart.options.controls.crossHair.style,stroke: this.chart.options.colors.crossHair,"stroke-width": "1",x1: this.crossHairMoveExtremes.minX,x2: this.crossHairMoveExtremes.maxX,fill: "none","shape-rendering": "crispEdges"});
            this.$svgGYlabel = d.createElementNS("http://www.w3.org/2000/svg", "g");
            this.$svgRectYLabel = d.createElementNS("http://www.w3.org/2000/svg", "rect");
            this.$svgTextYLabel = d.createElementNS("http://www.w3.org/2000/svg", "text");
            this.$svgG.appendChild(this.$svgYLine);
            this.chart.options.controls.crossHair.showPriceLabel && (this.$svgGYlabel.appendChild(this.$svgRectYLabel), this.$svgGYlabel.appendChild(this.$svgTextYLabel), this.$svgG.appendChild(this.$svgGYlabel), d.setAttributes(this.$svgGYlabel, {"class": "crossYLabel"}),
            d.setAttributes(this.$svgRectYLabel, {width: this.chart.options.marginRight - 1,y: -10,height: 20,x: this.crossHairMoveExtremes.maxX + 1,fill: this.chart.options.colors.crossHair,"stroke-width": "1",rx: "2",ry: "2"}), d.setAttributes(this.$svgTextYLabel, {x: this.crossHairMoveExtremes.maxX + 25,y: 0,dy: 4,"class": "label_text"}))
        };
        I.prototype.renderPriceSnapshot = function() {
            return this.priceSnapshot = (new W(this.chart)).render()
        };
        I.prototype.toggleCrossHair = function(a) {
            if (void 0 !== a && this.mainChart.options.showCrossHair ===
            a)
                return this.mainChart.options.showCrossHair;
            this.mainChart.options.showCrossHair = void 0 !== a ? a : !this.mainChart.options.showCrossHair;
            for (a = 0; a < this.mainChart.indicators.length; a++)
                this.mainChart.indicators[a].options.showCrossHair = this.mainChart.options.showCrossHair, "bottom" === this.mainChart.indicators[a].params.type && (this.mainChart.indicators[a].options.showCrossHair ? (!this.mainChart.indicators[a].crossHair.$svgG && this.mainChart.indicators[a].crossHair.render(), this.mainChart.indicators[a].crossHair.bindEvents()) :
                (this.mainChart.indicators[a].crossHair.hideCrossHairLines(), this.mainChart.indicators[a].crossHair.unbindEvents()));
            this.mainChart.options.showCrossHair ? (!this.$svgG && this.render(), this.bindEvents()) : (this.hideCrossHairLines(), this.unbindEvents());
            this.chart.options.events.crossHairToggled.call(this.mainChart, this.mainChart.options.showCrossHair)
        };
        I.prototype.handleMouseOverCrossEvent = function() {
            this.mainChart.activeCrossHair = this;
            this.mainChart.options.showCrossHair && (d.addEvent(this.chart.svg.$svg,
            "mousemove", this._mouseMoveCrossHandler), d.addEvent(this.chart.svg.$svg, "mouseout", this._mouseOutCrossHandler), d.addClass(this.chart.svg.$svgLayer, "active-cross"))
        };
        I.prototype.handleMouseMoveCrossEvent = function(a) {
            if (this.mainChart.options.showCrossHair && !this.mainChart.svg.drawingSelected && !this.chart.svg.priceSnapshotEnabled && !this.mainChart.svg.drawingEnabled) {
                var b = this.crossPositionX = void 0 !== a.offsetX ? a.offsetX : a.layerX;
                a = this.crossPositionY = void 0 !== a.offsetY ? a.offsetY : a.layerY;
                var c, d;
                if (b <
                this.crossHairMoveExtremes.minX || b > this.crossHairMoveExtremes.maxX || a < this.crossHairMoveExtremes.minY || a > this.crossHairMoveExtremes.maxY)
                    this.hideCrossHairLines();
                else {
                    this.showCrossHairLines();
                    c = this.getCrossHairCandleInfo();
                    this.$svgTextYLabel.textContent = (+c.price).toFixed(this.chart.options.precision);
                    this.mainChart.crossHair.$svgTextXLabel.textContent = l.formatCrossHairDate(c.timestamp, this.mainChart.options.period);
                    this.mainChart.crossHair.moveYRect(b, a);
                    c = 0;
                    for (d = this.mainChart.crossHairVLines.length; c <
                    d; c++)
                        this.moveYLine(this.mainChart.crossHairVLines[c], b);
                    this.moveXLine(b, a);
                    this.moveXRect(b, a)
                }
            }
        };
        I.prototype.handleMouseOutEvent = function() {
            this.hideCrossHairLines();
            d.removeEvent(this.chart.svg.$svg, "mousemove", this._mouseMoveCrossHandler);
            d.removeEvent(this.chart.svg.$svg, "mouseout", this._mouseOutCrossHandler);
            d.removeClass(this.chart.svg.$svgLayer, "active-cross");
            d.removeClass(this.mainChart.$container, "show-cross")
        };
        I.prototype.moveXLine = function(a, b) {
            d.setAttributes(this.$svgYLine, {y1: b +
                0.5,y2: b + 0.5})
        };
        I.prototype.moveXRect = function(a, b) {
            d.setAttributes(this.$svgGYlabel, {transform: "translate( 0, " + b + ")"})
        };
        I.prototype.moveYLine = function(a, b) {
            d.setAttributes(a, {x1: b + 0.5,x2: b + 0.5})
        };
        I.prototype.moveYRect = function(a) {
            var b = this.mainChart.crossHair.crossHairMoveExtremes.minX + 50;
            a <= b && (a = b);
            d.setAttributes(this.$svgGXlabel, {transform: "translate( " + a + ", 0 )"})
        };
        I.prototype.updateCrossHairData = function() {
            if (this.chart.options.showCrossHair && !(this.crossPositionX <= this.chart.options.marginLeft ||
            this.crossPositionY <= this.chart.options.marginTop)) {
                var a = this.getCrossHairCandleInfo();
                this.$svgTextYLabel.textContent = (+a.price).toFixed(this.chart instanceof y ? this.chart.params.precision : this.chart.options.precision);
                this.mainChart.crossHair.$svgTextXLabel.textContent = l.formatCrossHairDate(a.timestamp, this.mainChart.options.period)
            }
        };
        I.prototype.getCrossHairCandleInfo = function() {
            var a = this.mainChart.options.data.length, b = this.mainChart.chart.currentOffset + (this.crossPositionX - this.chart.options.marginLeft) /
            this.mainChart.zoomOptions.candleWidth >> 0, c = +this.chart.options.axisY.min + (this.chart.options.axisY.heightY - this.crossPositionY + this.chart.options.marginTop) / +this.chart.options.axisY.ratio;
            b >= a ? (a = 0 !== this.mainChart.options.period ? +this.mainChart.options.data[a - 1].timestamp + (b + 1 - a) * this.mainChart.options.period : this.mainChart.options.data[a - 1].timestamp, b = a - this.mainChart.options.period) : (a = this.mainChart.options.data[b].timestamp, b = 0 > b ? a - this.mainChart.options.period : this.mainChart.options.data[b -
            1] && this.mainChart.options.data[b - 1].timestamp);
            return {price: c,timestamp: a,prevTimestamp: b}
        };
        I.prototype.showCrossHairLines = function() {
            d.addClass(this.mainChart.$container, "show-cross")
        };
        I.prototype.hideCrossHairLines = function() {
            d.removeClass(this.mainChart.$container, "show-cross")
        };
        I.prototype.updateCachedProperties = function() {
            this.crossHairMoveExtremes = {minX: this.chart.options.marginLeft,maxX: this.chart.options.width - this.chart.options.marginRight,minY: this.chart.options.marginTop,maxY: this.chart.options.height -
                this.chart.options.marginBottom};
            this.$svgG && (d.setAttributes(this.$svgYLine, {x1: this.crossHairMoveExtremes.minX,x2: this.crossHairMoveExtremes.maxX}), d.setAttributes(this.$svgXLine, {y1: this.crossHairMoveExtremes.minY,y2: this.crossHairMoveExtremes.maxY + 1}), d.setAttributes(this.$svgRectYLabel, {x: this.crossHairMoveExtremes.maxX + 1}), d.setAttributes(this.$svgTextYLabel, {x: this.crossHairMoveExtremes.maxX + 25}), d.setAttributes(this.$svgRectXLabel, {y: this.crossHairMoveExtremes.maxY + 1}), d.setAttributes(this.$svgTextXLabel,
            {y: this.crossHairMoveExtremes.maxY + 10}))
        };
        I.prototype.unbindEvents = function() {
            d.removeEvent(this.chart.svg.$svg, "mouseover", this._mouseOverCrossHandler);
            d.removeEvent(this.chart.svg.$svg, "mouseout", this._mouseOutCrossHandler)
        };
        I.prototype.destroy = function() {
            this.unbindEvents();
            this.$svgG && (this.mainChart.crossHairVLines.splice(this.mainChart.crossHairVLines.indexOf(this.$svgXLine), 1), d.empty(this.$svgG));
            this.mainChart.activeCrossHair === this && (this.mainChart.activeCrossHair = null);
            this.crossPositionX =
            this.crossPositionY = this.svg = this.$svgG = this.$svgYLine = this.$svgXLine = this.$svgTextXLabel = this.$svgGXlabel = this.$svgRectXLabel = this.$svgGYlabel = this.$svgRectYLabel = this.$svgTextYLabel = this.chart = this.mainChart = this.crossHairMoveExtremes = this.priceSnapshot = null
        };
        oa.prototype = {constructor: oa,bindEvents: function() {
            },scaleMouseDown: function(a) {
                this.dragPosition = "mousedown" === a.type ? a.layerY || a.offsetY : a.touches[0].pageY - d.offset(this.chart.svg.$svg).top;
                d.addClass(this.chart.svg.$svgLayer, U.scaleClass);
                d.addEvent(this.scaleRect, "mousemove", this._scaleMouseMove);
                d.addEvent(this.chart.svg.$svg, "mousemove", this._scaleMouseMove);
                d.addEvent(this.scaleRect, "touchmove", this._scaleMouseMove);
                d.addEvent(this.chart.svg.$svg, "touchmove", this._scaleMouseMove)
            },scaleMouseMove: function(a) {
                a = ("mousemove" === a.type ? a.layerY || a.offsetY : a.touches[0].pageY - d.offset(this.chart.svg.$svg).top) - this.dragPosition;
                var b = 0 < a ? 0.2 * this.chart.options.axisY.range : -(0.1 * this.chart.options.axisY.range);
                this.chart.options.axisY.offsetTop +=
                a + b >> 0;
                this.chart.options.axisY.offsetBottom += a + b >> 0;
                this.dragPosition += a;
                this.chart.options.axisY.offsetTop < this.chart.options.axisY.minOffsetTop && (this.chart.options.axisY.offsetTop = this.chart.options.axisY.minOffsetTop);
                this.chart.options.axisY.offsetBottom < this.chart.options.axisY.minOffsetBottom && (this.chart.options.axisY.offsetBottom = this.chart.options.axisY.minOffsetBottom);
                this.chart.draw(this.chart.currentOffset)
            },scaleMouseUp: function() {
                this.dragPosition = null;
                d.removeClass(this.chart.svg.$svgLayer,
                U.scaleClass);
                d.removeEvent(this.scaleRect, "mousemove", this._scaleMouseMove);
                d.removeEvent(this.chart.svg.$svg, "mousemove", this._scaleMouseMove);
                d.removeEvent(this.scaleRect, "touchmove", this._scaleMouseMove);
                d.removeEvent(this.chart.svg.$svg, "touchmove", this._scaleMouseMove);
                this.mainChart.options.events.scaleChanged.call(this)
            },unbindEvents: function() {
            },render: function() {
                this.scaleRect = A.prototype.createRect.call(this, this.chart.svg.$svg, {x: this.chart.options.width - this.chart.options.marginRight,
                    y: 0,width: this.chart.options.marginRight,height: this.chart.options.height,"class": "scale-chart",fill: "transparent"});
                d.css(this.scaleRect, {fill: "rgba(0, 0, 0, 0)"});
                this.renderPipsContainer()
            },renderPipsContainer: function() {
                this.chart instanceof v && this.chart.options.chartScale && (this.pipsContainer = A.prototype.createG.call(this, this.chart.svg.$svg, {transform: "translate( " + (this.chart.options.width - this.chart.options.marginRight - this.chart.options.controls.scaleControl.lineOffsetRight) + ", " + (this.chart.options.marginTop +
                    this.chart.options.controls.scaleControl.lineOffsetTop) + " )","class": "pips-container"}), this.pipsLine = A.prototype.createLine.call(this, this.pipsContainer, {x1: 0,x2: 0,y: 0,"stroke-width": 1,"pointer-events": "none"}), this.pipsBottomLine = A.prototype.createLine.call(this, this.pipsContainer, {x1: -3,x2: 0,"stroke-width": 1,"pointer-events": "none"}), A.prototype.createLine.call(this, this.pipsContainer, {x1: -3,x2: 0,y1: 0,"stroke-width": 1,"pointer-events": "none"}), this.pipsText = A.prototype.createText.call(this, this.pipsContainer,
                {x: -15,y: -5,"text-anchor": "middle","pointer-events": "none",transform: "rotate(-90)","class": "pips-text"}), this.chart.options.axisY.heightY < this.chart.options.controls.scaleControl.maxLineHeight + this.chart.options.controls.scaleControl.lineOffsetTop && d.setAttributes(this.pipsContainer, {visibility: "hidden"}))
            },calcPipsLineHeight: function() {
                if (this.chart.options.chartScale) {
                    var a = 5 === this.chart.options.precision ? 4 : this.chart.options.precision, a = this.chart.options.axisY.range.toFixed(a) * Math.pow(10, a) /
                    this.chart.options.axisY.heightY, b = this.chart.options.controls.scaleControl.maxLineHeight * a, c, e, k;
                    e = 0;
                    for (k = this.pipsArray.length; e < k; e++)
                        if (this.pipsArray[e] > b) {
                            c = this.pipsArray[e - 1];
                            break
                        }
                    a = c / a + 0.5 | 0;
                    d.setAttributes(this.pipsLine, {y2: a});
                    d.setAttributes(this.pipsBottomLine, {y1: a,y2: a});
                    d.setAttributes(this.pipsText, {x: -(a / 2)});
                    this.pipsText.textContent = c
                }
            },resize: function() {
                d.setAttributes(this.scaleRect, {width: this.chart.options.marginRight,height: this.chart.options.height,x: this.chart.options.width -
                    this.chart.options.marginRight,y: 0});
                if (this.chart.options.axisY.heightY < this.chart.options.controls.scaleControl.maxLineHeight + this.chart.options.controls.scaleControl.lineOffsetTop)
                    this.pipsContainer && d.setAttributes(this.pipsContainer, {visibility: "hidden"});
                else {
                    var a = "translate( " + (this.chart.options.width - this.chart.options.marginRight - this.chart.options.controls.scaleControl.lineOffsetRight) + ", " + (this.chart.options.marginTop + this.chart.options.controls.scaleControl.lineOffsetTop) + " )";
                    this.pipsContainer &&
                    d.setAttributes(this.pipsContainer, {transform: a,visibility: "visible"})
                }
            },toggle: function(a) {
                if (void 0 !== a && a === this.chart.options.chartScale)
                    return this.chart.options.chartScale;
                this.chart.options.chartScale = void 0 !== a ? a : !this.chart.options.chartScale;
                this.chart.options.chartScale ? (this.render(), this.calcPipsLineHeight()) : (d.empty(this.pipsContainer), this.chart.svg.$svg.removeChild(this.pipsContainer), this.pipsContainer = null);
                this.chart.options.events.scaleToggled.call(this.chart, this.chart.options.chartScale);
                return this.chart.options.chartScale
            },destroy: function() {
                this.unbindEvents();
                this.pipsContainer && (d.empty(this.pipsContainer), this.chart.svg.$svg.removeChild(this.pipsContainer));
                this.chart.svg.$svg.removeChild(this.scaleRect);
                this.scaleRect = this.pipsContainer = this.pipsLine = this.pipsText = this.pipsBottomLine = null
            }};
        l.inherit(W, V);
        W.prototype.render = function() {
            W.superclass.render.call(this);
            this.$priceSnapshotG = d.createElementNS("http://www.w3.org/2000/svg", "g");
            this.$priceSnapshotLine = d.createElementNS("http://www.w3.org/2000/svg",
            "line", {stroke: "#808080","stroke-width": "1px","pointer-events": "none"});
            this.$priceSnapshotG.appendChild(this.$priceSnapshotLine);
            this.chart.svg.$svg.appendChild(this.$priceSnapshotG);
            return this
        };
        W.prototype.getTooltipCandleInfo = function(a) {
            var b = this.mainChart.options.data.length, c = this.mainChart.currentOffset + ((this.chart.crossHair.crossPositionX - this.chart.options.marginLeft) / this.mainChart.zoomOptions.candleWidth >> 0);
            a = this.mainChart.currentOffset + ((a - this.chart.options.marginLeft) / this.mainChart.zoomOptions.candleWidth >>
            0);
            var d = +this.chart.options.axisY.min + (this.chart.options.axisY.heightY - this.chart.crossHair.crossPositionY + this.chart.options.marginTop) / +this.chart.options.axisY.ratio, k = +this.chart.options.axisY.min + (this.chart.options.axisY.heightY - this.mouseYPosition + this.chart.options.marginTop) / +this.chart.options.axisY.ratio, f = [[], []], g = 5 === this.chart.options.precision ? 4 : this.chart.options.precision;
            f[0].push([this.chart.options.tooltipLabels.timestamp || "Timestamp", l.formatCrossHairDate(a >= b ? 0 !== this.mainChart.options.period ?
                +this.mainChart.options.data[b - 1].timestamp + (a + 1 - b) * this.mainChart.options.period : this.mainChart.options.data[b - 1].timestamp : this.mainChart.options.data[a].timestamp, this.chart)]);
            f[0].push([this.chart.options.tooltipLabels.difference || "Difference:", this.chart instanceof y ? (d - k).toFixed(g) : +Math.abs(d - k).toFixed(g) * Math.pow(10, g) + 0.5 | 0]);
            f[0].push([this.chart.options.tooltipLabels.periods || "Periods:", Math.abs(c - a)]);
            f[0].push([this.chart.options.tooltipLabels.price || "Price:", k.toFixed(this.chart.options.precision)]);
            return f
        };
        W.prototype.update = function(a) {
            W.superclass.update.call(this, a);
            d.hasClass(this.$tooltip, "hidden") ? d.setAttributes(this.$priceSnapshotLine, {visibility: "hidden"}) : d.setAttributes(this.$priceSnapshotLine, {x1: this.chart.crossHair.crossPositionX,y1: this.chart.crossHair.crossPositionY,x2: this.mouseXPosition,y2: this.mouseYPosition,visibility: "visible"})
        };
        W.prototype.handleMouseOutEvent = function(a) {
            a.toElement === this.$tooltip.$tooltipOverlay || a.toElement === this.$tooltip || (this.chart.svg.priceSnapshotEnabled =
            !1, this.chart.crossHair.priceSnapshot = null, this.destroy())
        };
        W.prototype.togglePriceSnapshot = function(a) {
            if (void 0 !== a && this.chart.options.showPriceSnapshot === a)
                return this.chart.options.showPriceSnapshot;
            this.chart.options.showPriceSnapshot = void 0 !== a ? a : !this.chart.options.showPriceSnapshot;
            this.chart.options.events.priceSnapshotToggled.call(this.chart, this.chart.options.showPriceSnapshot);
            return this.chart.options.showPriceSnapshot
        };
        W.prototype.uninitialize = function() {
            W.superclass.uninitialize.call(this);
            this.$priceSnapshotG && (d.empty(this.$priceSnapshotG), this.chart.svg.$svg.removeChild(this.$priceSnapshotG), this.$priceSnapshotG = null);
            d.removeEvent(this.chart.svg.$svg, "mousemove", this._tooltipUpdateHandler);
            d.removeEvent(this.chart.svg.$svg, "mouseout", this._tooltipMouseOutHandler)
        };
        l.inherit(D, ka);
        D.prototype.render = function() {
            "bottom" === this.params.type ? D.superclass.render.call(this) : this.canvas = this.chart.canvas;
            for (var a = 0, b = this.indicatorData.length; a < b; a++)
                this.options.tooltipLabels[this.indicatorData[a].name] =
                this.indicatorData[a].name;
            return this
        };
        D.prototype.draw = function() {
            var a, b = this.indicatorData.length;
            "upper" === this.params.type && (this.options = l.mixin(this.chart.options, this.options), this.options.drawLineCircle = !1);
            for (a = 0; a < b; a++)
                this.renderCanvas(this.indicatorData[a])
        };
        D.prototype.update = function(a) {
            this.params = l.extend(a, this.params);
            this.indicatorData = [];
            this.calcData(this.chart.options.data);
            a && (this.chart.draw(), this.chart.options.events.indicatorUpdated.call(this));
            this.isBottom() && this.updateTitle()
        };
        D.prototype.setProperties = function() {
            this.data = this.chart.options.data;
            this.indicatorData = [];
            this.options = "bottom" === this.params.type ? {height: 300,marginTop: 0,marginBottom: 1,drawLineCircle: !1,tooltipLabels: ["Price:", "Timestamp:"],precision: this.params.precision,axisY: {heightY: 300,offsetTop: this.params.offsetTop || 6,minOffsetTop: 6,offsetBottom: this.params.offsetBottom || 5,minOffsetBottom: 5,showLastLabel: !1,showTickLabels: !0,showLabels: !0},axisX: {showTickLabels: !1,showMainLine: !1,showLabels: !1},controls: {crossHair: {showTimestampLabel: !1,
                        showPriceLabel: !0,color: "#e17575",style: this.chart.options.controls.crossHair.style,textColor: "#fff"}}} : {drawLineCircle: !1};
            this.options = l.extend(this.options, this.chart.options)
        };
        D.prototype.isBottom = function() {
            return this instanceof y
        };
        D.prototype.isUpper = function() {
            return this instanceof D && !this.isBottom()
        };
        D.prototype.getPartialTitle = function() {
            var a = this.params.name, b = [], c;
            for (c in this.params.editable)
                "styles" !== c && b.push(this.params.editable[c].currentValue);
            b.length && (a += " ( " + b.join(", ") +
            " )");
            return a
        };
        D.prototype.getTitle = function() {
            var a = this.getPartialTitle(), b = [], c, d = this.indicatorData.length, k;
            for (c = 0; c < d; c++)
                if ("HorizontalLine" === this.indicatorData[c].type) {
                    if ("Overbought" === this.indicatorData[c].name || "Oversold" === this.indicatorData[c].name)
                        b.push(this.indicatorData[c].source[0] ? this.indicatorData[c].source[0][this.indicatorData[c].price] : "-")
                } else
                    k = this.indicatorData[c].source[this.indicatorData[c].source.length - 1] ? this.indicatorData[c].source[this.indicatorData[c].source.length -
                    1][this.indicatorData[c].price].toFixed(this.params.precision) : null, b.push(isNaN(k) || void 0 === k || null === k ? "-" : k);
            b.length && (a += " " + b.join(", "));
            return a
        };
        D.prototype.destroy = function() {
            var a = this;
            this.chart.indicators = this.chart.indicators.filter(function(b) {
                return b !== a
            });
            this.options.events.indicatorDeleted.call(this);
            this.canvas = this.currentOffset = this.data = this.indicatorData = this.maxVisibleItems = this.options = this.params = this.zoomOptions = null;
            this.isUpper() && (this.chart = null)
        };
        l.inherit(y, D);
        y.prototype.render = function() {
            y.superclass.render.call(this);
            d.setAttributes(this.$chartLayer, {styles: {width: this.options.width + "px",height: this.options.height + "px"}});
            this.$indicatorTitle = d.createElement("div");
            this.$indicatorClose = d.createElement("div");
            this.$chartLayer.appendChild(this.$indicatorTitle);
            this.$chartLayer.appendChild(this.$indicatorClose);
            d.addClass(this.$indicatorTitle, "indicator-title");
            this.updateTitle();
            d.addClass(this.$indicatorClose, "btn-close-indicator");
            this.chart.$container.appendChild(this.$chartLayer);
            this.params.drawings && 0 < this.params.drawings.length && this.chart.parseDrawings.call(this, this.params.drawings);
            this.bindEvents();
            return this
        };
        y.prototype.bindEvents = function() {
            d.addEvent(this.$indicatorClose, "click", this._closeButtonMouseUpEvent);
            d.addEvent(this.$indicatorClose, "touchend", this._closeButtonMouseUpEvent);
            d.addEvent(this.svg.$svg, "dblclick", this._indicatorEdit)
        };
        y.prototype.draw = function(a) {
            var b;
            this.setExtremes();
            a && (this.canvasGrid.reset(), this.canvasGrid.drawGrid());
            this.canvas.reset();
            this.drawY();
            a = 0;
            for (b = this.drawings.length; a < b; a++)
                this.drawings[a].update();
            y.superclass.draw.call(this)
        };
        y.prototype.setExtremes = function() {
            var a;
            a = l.getIndicatorExtremes(this);
            y.superclass.setExtremes.call(this, a.min, a.max)
        };
        y.prototype.resize = function() {
            y.superclass.resizeChartLayer.call(this)
        };
        y.prototype.unbindEvents = function() {
            d.removeEvent(this.svg.$svg, "dblclick", this._indicatorEdit);
            d.removeEvent(this.$indicatorClose, "touchend", this._closeButtonMouseUpEvent);
            d.removeEvent(this.$indicatorClose,
            "click", this._closeButtonMouseUpEvent)
        };
        y.prototype.getDrawingParams = function() {
            var a = [];
            this.drawings.forEach(function(b) {
                a.push(b.params)
            });
            return a
        };
        y.prototype.updateTitle = function() {
            d.text(this.$indicatorTitle, this.getTitle())
        };
        y.prototype.destroy = function() {
            var a = this, b = this.chart.getAllDrawings(), c = this.options.height;
            this.unbindEvents();
            b.forEach(function(b) {
                ("vline" === b.params.code || "fibonacci-timezones" === b.params.code) && b.removeExtensionLine(a);
                -1 !== a.drawings.indexOf(b) && b.destroy()
            });
            this.canvas.destroy();
            this.canvasGrid.destroy();
            this.crossHair.destroy();
            this.tooltip.destroy();
            this.scaleControl.destroy();
            this.svg.destroy();
            d.empty(this.$indicatorTitle, !0);
            d.empty(this.$indicatorClose, !0);
            this.chart.$container.removeChild(this.$chartLayer);
            y.superclass.destroy.call(this);
            this.chart.getBottomIndicators().length ? this.chart.options.indicatorsHeight = 18 < this.chart.options.indicatorsHeight - c ? this.chart.options.indicatorsHeight - c : 18 : (this.chart.options.indicatorsHeight = 0, d.removeEvent(this.chart.$indicatorSep,
            "mousedown", this.chart._indicatorSepMouseDownHandler), d.empty(this.chart.$indicatorSep, !0), this.chart.$indicatorSep = null);
            this.chart.renderLayout();
            this.chart = this.indicatorId = this.canvas = this.canvasGrid = this.svg = this.$chartLayer = this.drawings = this.crossHair = this.tooltip = this.isReady = this.scaleControl = this.$indicatorTitle = this.$indicatorClose = null
        };
        l.inherit(pa, y);
        pa.prototype.calcData = function(a) {
            var b = [], c = [], d, k, f, g, h, r, p, m = 0, n, t, s = [], l;
            for (l in this.params.editable.styles)
                s.push(this.params.editable.styles[l].color);
            try {
                for (t = 0; t < a.length; t++)
                    d = u.estimateSmaCandles(a, c, t, 5, !0), k = u.estimateSmaCandles(a, c, t, 34, !0), g = d - k, r = {value: g,date: +a[t].date}, c.push(r), p = u.estimateSmaCandles(a, c, t, 5, !1), f = g - p, n = f >= m ? !0 : !1, h = {isGreen: n,close: !f ? Number.MIN_VALUE : f,timestamp: a[t].timestamp}, b.push(h), m = f
            } catch (H) {
                b = [], h = {close: null}, b.push(h), this.chart.options.events.indicatorError.call(this.chart, this, H)
            }
            this.indicatorData.push({source: b,price: "close",name: this.params.names[0],label: this.code,color: s,type: this.params.chartType[0]})
        };
        l.inherit(qa, y);
        qa.prototype.calcData = function(a) {
            var b = [], c = [], d = [], k = [], f = [], g = [], h = [], r = [], p = [], m = [], n, t = this.params.editable.period.currentValue, s = a.length, l = this.params.editable["di-period"].currentValue, H, K, q;
            q = [];
            var v = [], w = [];
            try {
                for (n = 1; n < t + 1; n++)
                    b[n] = Math.max(a[n].high - a[n].low, Math.max(Math.abs(a[n].high - a[n - 1].close), Math.abs(a[n].low - a[n - 1].close))), c[n] = a[n].high - a[n - 1].high > a[n - 1].low - a[n].low ? Math.max(a[n].high - a[n - 1].high, 0) : 0, d[n] = a[n - 1].low - a[n].low > a[n].high - a[n - 1].high ? Math.max(a[n -
                    1].low - a[n].low, 0) : 0, K = {close: NaN,timestamp: n}, q.push(K), K = {close: NaN,timestamp: n}, v.push(K), K = {close: NaN,timestamp: n}, w.push(K);
                H = b.slice(1, t + 1);
                k[t] = u.estimateSumSimple(H);
                H = c.slice(1, t + 1);
                f[t] = u.estimateSumSimple(H);
                H = d.slice(1, t + 1);
                g[t] = u.estimateSumSimple(H);
                h[t] = 100 * f[t] / k[t];
                r[t] = 100 * g[t] / k[t];
                p[t] = 100 * (Math.abs(h[t] - r[t]) / (h[t] + r[t]));
                for (n = t + 1; n < t + l; n++)
                    b[n] = Math.max(a[n].high - a[n].low, Math.max(Math.abs(a[n].high - a[n - 1].close), Math.abs(a[n].low - a[n - 1].close))), c[n] = a[n].high - a[n - 1].high >
                    a[n - 1].low - a[n].low ? Math.max(a[n].high - a[n - 1].high, 0) : 0, d[n] = a[n - 1].low - a[n].low > a[n].high - a[n - 1].high ? Math.max(a[n - 1].low - a[n].low, 0) : 0, k[n] = k[n - 1] * (1 - 1 / +t) + b[n], f[n] = f[n - 1] * (1 - 1 / +t) + c[n], g[n] = g[n - 1] * (1 - 1 / +t) + d[n], h[n] = 100 * f[n] / k[n], r[n] = 100 * g[n] / k[n], p[n] = 100 * (Math.abs(h[n] - r[n]) / (h[n] + r[n])), K = {close: NaN,timestamp: n}, q.push(K), K = {close: NaN,timestamp: n}, v.push(K), K = {close: NaN,timestamp: n}, w.push(K);
                m[t + l - 1] = u.estimateSmaLiterals(p.slice(t, t + l));
                K = {close: m[t + l - 1],timestamp: n};
                q.push(K);
                K = {close: h[t +
                    l - 1],timestamp: n};
                v.push(K);
                K = {close: r[t + l - 1],timestamp: n};
                w.push(K);
                for (n = t + l; n < s; n++)
                    b[n] = Math.max(a[n].high - a[n].low, Math.max(Math.abs(a[n].high - a[n - 1].close), Math.abs(a[n].low - a[n - 1].close))), c[n] = a[n].high - a[n - 1].high > a[n - 1].low - a[n].low ? Math.max(a[n].high - a[n - 1].high, 0) : 0, d[n] = a[n - 1].low - a[n].low > a[n].high - a[n - 1].high ? Math.max(a[n - 1].low - a[n].low, 0) : 0, k[n] = k[n - 1] * (1 - 1 / +t) + b[n], f[n] = f[n - 1] * (1 - 1 / +t) + c[n], g[n] = g[n - 1] * (1 - 1 / +t) + d[n], h[n] = 100 * f[n] / k[n], r[n] = 100 * g[n] / k[n], p[n] = 100 * (Math.abs(h[n] - r[n]) /
                    (h[n] + r[n])), m[n] = m[n - 1] * (1 - 1 / +t) + p[n] / +l, K = {close: m[n],timestamp: n}, q.push(K), K = {close: h[n],timestamp: n}, v.push(K), K = {close: r[n],timestamp: n}, w.push(K)
            } catch (z) {
                q = [], K = {close: null}, q.push(K), v = [], K = {close: null}, v.push(K), w = [], K = {close: null}, w.push(K), this.chart.options.events.indicatorError.call(this.chart, this, z)
            }
            a = this.params.names[0];
            q = {source: q,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(q);
            a = this.params.names[1];
            q = {source: v,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(q);
            a = this.params.names[2];
            q = {source: w,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(q)
        };
        l.inherit(ra,
        D);
        ra.prototype.calcData = function(a) {
            var b, c = [];
            b = [];
            var d = [], k = [], f, g, h, r, p = a.length, m = +this.params.editable.jawPeriod.currentValue, n = +this.params.editable.teethPeriod.currentValue, t = +this.params.editable.lipsPeriod.currentValue, s = +this.params.editable.jawShift.currentValue, l = +this.params.editable.teethShift.currentValue, H = +this.params.editable.lipsShift.currentValue;
            try {
                for (r = 0; r < p; r++)
                    c[r] = (+a[r].high + +a[r].low) / 2, r < m + s - 1 && b.push({close: null,timestamp: +a[r].timestamp}), r < n + l - 1 && d.push({close: null,
                        timestamp: +a[r].timestamp}), r < t + H - 1 && k.push({close: null,timestamp: +a[r].timestamp});
                for (r = 0; r < p; r++)
                    r >= m + s - 1 && (f = c.slice(r - m - s + 1, r - s + 1), b.push({close: u.estimateSmaLiterals(f),timestamp: +a[r].timestamp})), r >= n + l - 1 && (g = c.slice(r - n - l + 1, r - l + 1), d.push({close: u.estimateSmaLiterals(g),timestamp: +a[r].timestamp})), r >= t + H - 1 && (h = c.slice(r - t - H + 1, r - H + 1), k.push({close: u.estimateSmaLiterals(h),timestamp: +a[r].timestamp}))
            } catch (q) {
                b = [], a = {close: null}, b.push(a), d = [], a = {close: null}, d.push(a), k = [], a = {close: null},
                k.push(a), this.chart.options.events.indicatorError.call(this.chart, this, q)
            }
            a = this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: d,price: "close",name: a,label: this.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b);
            a = this.params.names[2];
            b = {source: k,price: "close",name: a,label: this.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(b)
        };
        l.inherit(sa, y);
        sa.prototype.calcData = function(a) {
            var b, c = [], d = [], k = [], f = [], g = [], h = this.params.editable.period.currentValue, r = [], p, m = a.length;
            try {
                b = {close: null,timestamp: +a[0].timestamp};
                c.push(b);
                for (p = 1; p < h; p++)
                    d[p] = +a[p].high - +a[p].low, k[p] = Math.abs(+a[p].high - +a[p - 1].close),
                    f[p] = Math.abs(+a[p].low - +a[p - 1].close), g[p] = Math.max(d[p], Math.max(k[p], f[p])), b = {close: null,timestamp: +a[p].timestamp}, c.push(b);
                for (p = h; p < m; p++)
                    d[p] = +a[p].high - +a[p].low, k[p] = Math.abs(+a[p].high - +a[p - 1].close), f[p] = Math.abs(+a[p].low - +a[p - 1].close), g[p] = Math.max(d[p], Math.max(k[p], f[p])), r = g.slice(p - h + 1, p + 1), b = {close: u.estimateSmaLiterals(r),timestamp: +a[p].timestamp}, c.push(b)
            } catch (n) {
                c = [], b = {close: null}, c.push(b), this.chart.options.events.indicatorError.call(this.chart, this, n)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(ta, y);
        ta.prototype.calcData = function(a) {
            var b = [], c = [], d, k, f, g, h, r, p = 0, m, n, t, s = [];
            for (t in this.params.editable.styles)
                s.push(this.params.editable.styles[t].color);
            try {
                for (n = 0; n < a.length; n++)
                    d = u.estimateSmaCandles(a, c, n, 5, !0), k = u.estimateSmaCandles(a, c, n, 34, !0), f = d - k, g = 34 > n ? null : f, r = {value: g,
                        date: a[n].date}, c.push(r), m = f >= p ? !0 : !1, h = {isGreen: m,name: "AwesomeOsc",close: f,timestamp: +a[n].timestamp}, b.push(h), p = f
            } catch (l) {
                b = [], h = {close: null}, b.push(h), this.chart.options.events.indicatorError.call(this.chart, this, l)
            }
            this.indicatorData.push({source: b,price: "close",name: this.params.names[0],label: this.code,color: s,type: this.params.chartType[0]})
        };
        l.inherit(ua, D);
        ua.prototype.calcData = function(a) {
            var b;
            b = [];
            var c = [], d = [], k, f, g, h, r, p, m = +this.params.editable.period.currentValue, n, t = [], s, l, H, q = this.params.editable.price.currentValue,
            v = this.params.editable.deviation.currentValue;
            try {
                for (h = 0; h < a.length; h++) {
                    n = 0;
                    t = [];
                    for (r = h - m; r < h; r++)
                        0 <= r && (n += Number(a[r][q]), t.push(a[r][q]));
                    p = h - m;
                    0 <= p && p < a.length ? h < m ? (k = {close: null,timestamp: +a[h].timestamp}, b.push(k), c.push(k), d.push(k)) : (n /= m, s = u.estimateStDev(t, n), s = Math.sqrt(s), H = n + s * v, l = n - s * v, k = {close: H,timestamp: +a[h].timestamp}, f = {close: n,timestamp: +a[h].timestamp}, g = {close: l,timestamp: a[h].timestamp}, b.push(k), c.push(f), d.push(g)) : (k = {close: null,timestamp: +a[h].timestamp}, b.push(k), c.push(k),
                    d.push(k))
                }
            } catch (w) {
                b = [], k = {close: null}, b.push(k), c = [], k = {close: null}, c.push(k), d = [], k = {close: null}, d.push(k), this.chart.options.events.indicatorError.call(this.chart, this, w)
            }
            a = this.params.names[0];
            b = {source: b,price: "close",label: this.params.code,name: a,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: "close",label: this.params.code,name: a,color: this.params.editable.styles[a].color,
                lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b);
            a = this.params.names[2];
            b = {source: d,price: "close",label: this.params.code,name: a,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(b)
        };
        l.inherit(va, y);
        va.prototype.calcData = function(a) {
            var b;
            b = [];
            var c = [], d = [], k = [], f = [], g = [], h = [], r = [], p = this.params.editable.period.currentValue, m = a.length, n, t;
            try {
                for (t =
                0; t < p - 1; t++)
                    f[t] = (+a[t].high + +a[t].low + +a[t].close) / 3, n = {close: null,timestamp: a[t].timestamp}, b.push(n);
                for (t = p - 1; t < m; t++)
                    f[t] = (+a[t].high + +a[t].low + +a[t].close) / 3, h = f.slice(t - p + 1, t + 1), g[t] = u.estimateSmaLiterals(h), r[t] = u.estimateMad(h, g[t]), k[t] = (f[t] - g[t]) / (0.015 * r[t]), n = {close: k[t],timestamp: a[t].timestamp}, b.push(n)
            } catch (s) {
                b = [], n = {close: null}, b.push(n), this.chart.options.events.indicatorError.call(this.chart, this, s)
            }
            c.push({close: this.params.editable.overBought.currentValue});
            d.push({close: this.params.editable.overSold.currentValue});
            a = this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b);
            a = this.params.names[2];
            b = {source: d,price: "close",
                name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(b)
        };
        l.inherit(wa, y);
        wa.prototype.calcData = function(a) {
            var b = a.length, c;
            c = [];
            var d, k = [], f = [], g = [], h = [], r = [], p = [], m, n = this.params.editable.shortRocPeriod.currentValue, t = this.params.editable.longRocPeriod.currentValue, s = this.params.editable.wmaPeriod.currentValue, l = this.params.price, H = 0;
            try {
                p = u.estimateSequence(1, s);
                H = Math.max(n,
                t);
                for (m = 0; m < H; m++)
                    d = {close: null,timestamp: +a[m].timestamp}, c.push(d);
                for (m = H; m < H + s - 1; m++)
                    k[m] = 100 * (+a[m][l] / +a[m - n][l] - 1), f[m] = 100 * (+a[m][l] / +a[m - t][l] - 1), g[m] = k[m] + f[m], d = {close: null,timestamp: +a[m].timestamp}, c.push(d);
                for (m = H + s - 1; m < b; m++)
                    k[m] = 100 * (+a[m][l] / +a[m - n][l] - 1), f[m] = 100 * (+a[m][l] / +a[m - t][l] - 1), g[m] = k[m] + f[m], r = g.slice(m - s + 1, m + 1), h[m] = u.estimateWmaSupport(r, p), d = {close: !h[m] ? Number.MIN_VALUE : h[m],timestamp: +a[m].timestamp}, c.push(d)
            } catch (q) {
                c = [], d = {close: null}, c.push(d), this.chart.options.events.indicatorError.call(this.chart,
                this, q)
            }
            b = this.params.names[0];
            c = {source: c,price: "close",name: b,label: this.params.code,color: this.params.editable.styles[b].color,lineWidth: this.params.editable.styles[b].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(c);
            c = [];
            d = {close: 0,timestamp: +a[0].timestamp};
            c.push(d);
            b = this.params.names[1];
            c = {source: c,price: "close",name: b,label: this.params.code,color: this.params.editable.styles["Horizontal line"].color,lineWidth: this.params.editable.styles["Horizontal line"].lineWidth,type: this.params.chartType[1] ||
                "HorizontalLine"};
            this.indicatorData.push(c)
        };
        l.inherit(xa, y);
        xa.prototype.calcData = function(a) {
            var b = [], c, d = [], k = [], f, g = a.length, h = this.params.editable.period.currentValue, r = this.params.price, p, m = [];
            for (p in this.params.editable.styles)
                m.push(this.params.editable.styles[p].color);
            try {
                for (f = 0; f < g; f++)
                    k[f] = +a[f].close - +a[f].open, f < h && (c = {isGreen: !0,close: null,timestamp: +a[f].timestamp}, b.push(c));
                for (f = h; f < g; f++)
                    d[f] = u.estimateSmaLiterals(k.slice(f - h, f + 1)), c = d[f] >= d[f - 1] ? {isGreen: !0,close: d[f],timestamp: +a[f].timestamp} :
                    {isGreen: !1,close: d[f],timestamp: +a[f].timestamp}, b.push(c)
            } catch (n) {
                b = [], c = {close: null}, b.push(c), this.chart.options.events.indicatorError.call(this.chart, this, n)
            }
            this.indicatorData.push({source: b,price: r,name: this.params.names[0],label: this.params.code,color: m,type: this.params.chartType[0]})
        };
        l.inherit(ya, y);
        ya.prototype.calcData = function(a) {
            var b = [], c = +this.params.editable.period.currentValue, d = +this.params.offset, k = 0, f = 0, g, h, r = 0, p, m, n, t;
            try {
                for (n = 0; n < a.length; n++) {
                    h = g = 0;
                    for (t = n - c; t < n; t++)
                        0 < t &&
                        (f = a[t - 1].low - a[t].low, f = 0 < f ? f : 0, k = a[t].high - a[t - 1].high, k = 0 < k ? k : 0, g += k, h += f);
                    m = n - d;
                    0 <= m && m < a.length && (n < c ? p = {close: null,timestamp: n} : (g /= c, h /= c, r = (r = g / (g + h)) ? r : 0, p = {close: !r ? Number.MIN_VALUE : r,timestamp: n}), b.push(p))
                }
            } catch (s) {
                b = [], p = {close: null}, b.push(p), this.chart.options.events.indicatorError.call(this.chart, this, s)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,
                type: this.params.chartType[0]})
        };
        l.inherit(za, y);
        za.prototype.calcData = function(a) {
            var b;
            b = [];
            var c = [], d = [], k, f = this.params.editable.period.currentValue, g, h, r, p, m = 0, n = 0, t = 0, s, l, H, u, q, v = 0, w = 0, z = 0;
            try {
                for (g = 0; g < a.length; g++)
                    h = r = p = s = l = H = u = q = 0, 0 < g && (h = Math.max(+a[g].high, +a[g - 1].close) - Math.min(+a[g].low, +a[g - 1].close), +a[g].high - +a[g - 1].high > +a[g - 1].low - +a[g].low && (r = Math.max(a[g].high - a[g - 1].high, 0)), +a[g - 1].low - +a[g].low > +a[g].high - +a[g - 1].high && (p = Math.max(a[g - 1].low - a[g].low, 0)), w += r, z += p, v += h),
                    0 === g - f ? (m = v, n = w, t = z) : 0 < g - f && (m = m - m / f + h, n = n - n / f + r, t = t - t / f + p), s = 100 * (n / (0 === m ? 1 : m)), l = 100 * (t / (0 === m ? 1 : m)), H = Math.abs(s - l), u = s + l, q = 100 * (H / (0 === u ? 1 : u)), k = {close: q,timestamp: +a[g].timestamp}, b.push(k), k = {close: s,timestamp: +a[g].timestamp}, c.push(k), k = {close: l,timestamp: +a[g].timestamp}, d.push(k)
            } catch (y) {
                b = [], k = {close: null}, b.push(k), c = [], k = {close: null}, c.push(k), d = [], k = {close: null}, d.push(k), this.chart.options.events.indicatorError.call(this.chart, this, y)
            }
            a = this.params.names[0];
            b = {source: b,price: "close",
                name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: "close",name: this.params.names[1],label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b);
            a = this.params.names[2];
            b = {source: d,price: "close",name: this.params.names[2],
                label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(b)
        };
        l.inherit(Aa, y);
        Aa.prototype.calcData = function(a) {
            var b = [], c = this.params.editable.period.currentValue, d = (c / 2 >> 0) + 1, k, f, g, h, r, p = a.length;
            try {
                for (f = 0; f < p; f++) {
                    k = 0;
                    for (g = f - d; g < f; g++)
                        0 <= g && (k += +a[g][this.params.price]);
                    r = f - d;
                    0 <= r && r < a.length && (f < c ? h = {close: null,timestamp: +a[f].timestamp} : (k = a[f][this.params.price] - k / d, h = {close: k,
                        timestamp: +a[f].timestamp}), b.push(h))
                }
            } catch (m) {
                b = [], h = {close: null}, b.push(h), this.chart.options.events.indicatorError.call(this.chart, this, m)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: "SimpleLine"})
        };
        l.inherit(Ba, y);
        Ba.prototype.calcData = function(a) {
            var b;
            b = [];
            var c = [], d = this.params.editable.period.currentValue, k = this.params.offset, f = 2 / (d +
            1), g, h = 0, r, p, m, n, t, l;
            try {
                for (t = 0; t < a.length; t++) {
                    n = m = g = 0;
                    for (l = t - d; l < t; l++)
                        0 <= l && (g += Number(a[l].close));
                    p = t - k;
                    0 <= p && p < a.length && (t < d ? (r = {close: null,timestamp: +a[t].timestamp}, b.push(r)) : (g = 0 === h ? g / d : (a[t].close - h) * f + h, m = Number(a[t].high) - g, n = Number(a[t].low) - g, h = g, r = {close: m,timestamp: +a[t].timestamp}, b.push(r), r = {close: n,timestamp: +a[t].timestamp}), c.push(r))
                }
            } catch (F) {
                b = [], r = {close: null}, b.push(r), c = [], r = {close: null}, c.push(r), this.chart.options.events.indicatorError.call(this.chart, this, F)
            }
            a =
            this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: this.params.price,name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b)
        };
        l.inherit(Ca, D);
        Ca.prototype.calcData =
        function(a) {
            var b = [], c = this.params.editable.price.currentValue, d = +this.params.offset, k, f = 2 / (+this.params.editable.period.currentValue + 1), g, h = 0, r, p = 0, m = a.length;
            try {
                for (k = 0; k < m; k++)
                    0 <= p && p < m && (h = g = 0 === h ? +a[k][c] : (+a[k][c] - h) * f + h, r = {close: g,timestamp: +a[p].timestamp}, b.push(r)), g = 0, p = k - d
            } catch (n) {
                b = [], r = {close: null}, b.push(r), this.chart.options.events.indicatorError.call(this.chart, this, n)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,
                lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Da, D);
        Da.prototype.calcData = function(a) {
            var b;
            b = [];
            var c = [], d = this.params.editable.period.currentValue, k = this.params.offset, f = this.params.editable.price.currentValue, g, h, r = 0, p = 0, m = 0, n = 0, l = 2 / (d + 1), s, F, u = a.length, q = this.params.editable.deviation.currentValue;
            try {
                for (s = 0; s < u; s++) {
                    g = 0;
                    for (F = s - d; F < s; F++)
                        0 <= F && (g += Number(a[F][f]));
                    r = s - k;
                    0 <= r && r < u && (s < d ? (h = {close: null,timestamp: +a[s].timestamp}, b.push(h), h = {close: null,
                        timestamp: +a[s].timestamp}) : (n = g = 0 === n ? g / d : (a[s][f] - n) * l + n, p = g * (1 + q / 100), m = g * (1 - q / 100), h = {close: p,timestamp: +a[s].timestamp}, b.push(h), h = {close: m,timestamp: +a[s].timestamp}), c.push(h))
                }
            } catch (v) {
                b = [], h = {close: null}, b.push(h), c = [], h = {close: null}, c.push(h), this.chart.options.events.indicatorError.call(this.chart, this, v)
            }
            a = this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: "SimpleLine"};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: "SimpleLine"};
            this.indicatorData.push(b)
        };
        l.inherit(ia, D);
        ia.prototype.calcData = function(a) {
            var b = this.params.editable.period.currentValue, c, d = [], k = [], f = [], g = [], h = [], r = [], p = [], m, n = [], l, s;
            try {
                c = 0 === b % 2 ? Math.floor(b / 2) - 1 : Math.floor(b / 2);
                for (m = 0; m < b - 1; m++)
                    r[m] = +a[m].high, p[m] = +a[m].low, d[m] = {up: 0,down: 0};
                for (m = 0; m < c; m++)
                    l = {close: null}, n.push(l);
                for (m = b - 1; m < a.length; m++)
                    r[m] = +a[m].high, p[m] = +a[m].low, d[m] = {up: 0,down: 0}, k = r.slice(m - b + 1, m - c), f = r.slice(m - c + 1, m + 1), g = p.slice(m - b + 1, m - c), h = p.slice(m - c + 1, m + 1), +a[m - c].high > Math.max.apply(null, k) && +a[m - c].high > Math.max.apply(null, f) ? d[m - c].up = 1 : d[m - c].up = 0, +a[m - c].low < Math.min.apply(null, g) && +a[m - c].low < Math.min.apply(null, h) ? d[m - c].down = 1 : d[m - c].down = 0, 1 === d[m - c].down && 1 === d[m - c].up && (d[m - c].down = 0, d[m - c].up = 0), s = d[m - c].up ? +a[m - c].high : d[m - c].down ? +a[m - c].low :
                    null, l = {high: "",low: "",open: "",close: s,timestamp: +a[m - c].timestamp}, n.push(l)
            } catch (F) {
                n = [], l = {close: null}, n.push(l), this.chart.options.events.indicatorError.call(this.chart, this, F)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: n,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        ia.prototype.destroy = function() {
            ia.superclass.destroy.call(this)
        };
        l.inherit(Ea, y);
        Ea.prototype.calcData =
        function(a) {
            var b = [], c = [], d, k = [], f = [], g = [], h = [], r = [], p = [], m, n, l, s, F = this.params.editable.Kperiod.currentValue, H = this.params.editable.Dperiod.currentValue, q = a.length;
            try {
                for (s = 0; s < F - 1; s++)
                    k[s] = +a[s].high, f[s] = +a[s].low, m = {close: null,timestamp: +a[s].timestamp}, g.push(m), h.push(m);
                for (s = F - 1; s < F + H - 2; s++)
                    k[s] = +a[s].high, f[s] = +a[s].low, n = Math.max.apply(null, k.slice(s - F + 1, s + 1)), l = Math.min.apply(null, f.slice(s - F + 1, s + 1)), b[s] = 100 * ((+a[s].close - l) / (n - l)), m = {close: b[s],timestamp: +a[s].timestamp}, g.push(m), m =
                    {close: null,timestamp: +a[s].timestamp}, h.push(m);
                for (s = F + H - 2; s < q; s++)
                    k[s] = +a[s].high, f[s] = +a[s].low, n = Math.max.apply(null, k.slice(s - F + 1, s + 1)), l = Math.min.apply(null, f.slice(s - F + 1, s + 1)), b[s] = 100 * ((+a[s].close - l) / (n - l)), d = b.slice(s - H + 1, s + 1), c[s] = u.estimateSmaLiterals(d), m = {close: b[s],timestamp: +a[s].timestamp}, g.push(m), m = {close: c[s],timestamp: +a[s].timestamp}, h.push(m);
                m = {close: this.params.editable.overBought.currentValue};
                r.push(m);
                m = {close: this.params.editable.overSold.currentValue};
                p.push(m)
            } catch (v) {
                g =
                [], m = {close: null}, g.push(m), h = [], m = {close: null}, h.push(m), r = [], m = {close: null}, r.push(m), p = [], m = {close: null}, p.push(m), this.chart.options.events.indicatorError.call(this.chart, this, v)
            }
            a = this.params.names[0];
            g = {source: g,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(g);
            a = this.params.names[1];
            g = {source: h,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,
                lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(g);
            a = this.params.names[2];
            g = {source: r,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(g);
            a = this.params.names[3];
            g = {source: p,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,
                type: this.params.chartType[3]};
            this.indicatorData.push(g)
        };
        l.inherit(Fa, y);
        Fa.prototype.calcData = function(a) {
            var b = [], c = [], d = [], k = [], f = [], g = [], h, r = [], p = [], m = [], n, l = a.length, s, F, H = this.params.editable.jawPeriod.currentValue, q = this.params.editable.jawShift.currentValue, v = this.params.editable.teethPeriod.currentValue, w = this.params.editable.teethShift.currentValue, z = this.params.editable.lipsPeriod.currentValue, y = this.params.editable.lipsShift.currentValue, x = {}, D, E = [];
            try {
                for (D in this.params.editable.styles)
                    E.push(this.params.editable.styles[D].color);
                for (n = 0; n < l; n++)
                    ;
                for (n = 0; n < l; n++)
                    k[n] = (+a[n].high + +a[n].low) / 2;
                for (n = H + q - 1; n < l; n++)
                    h = k.slice(n - H - q + 1, n - q + 1), f[n] = u.estimateSmaLiterals(h);
                for (n = v + w - 1; n < l; n++)
                    h = k.slice(n - v - w + 1, n - w + 1), g[n] = u.estimateSmaLiterals(h);
                for (n = z + y - 1; n < l; n++)
                    h = k.slice(n - z - y + 1, n - y + 1), m[n] = u.estimateSmaLiterals(h);
                s = Math.max(H + q - 1, v + w - 1);
                F = Math.max(v + w - 1, z + y - 1);
                for (n = 0; n < l; n++)
                    n >= s ? (r[n] = Math.abs(f[n] - g[n]), x = {close: r[n],isGreen: r[n - 1] && r[n - 1] >= r[n] ? !1 : !0,timestamp: +a[n].timestamp}) : x = {close: null,isGreen: !0,timestamp: +a[n].timestamp},
                    b.push(x), n >= F ? (p[n] = -Math.abs(g[n] - m[n]), x = {close: p[n],isGreen: p[n - 1] && p[n - 1] >= p[n] ? !1 : !0,timestamp: +a[n].timestamp}) : x = {close: null,isGreen: !0,timestamp: +a[n].timestamp}, c.push(x);
                x = {close: 0,timestamp: +a[0].timestamp};
                d.push(x)
            } catch (A) {
                b = [], x = {close: null}, b.push(x), c = [], x = {close: null}, c.push(x), d = [], x = {close: null}, d.push(x), this.chart.options.events.indicatorError.call(this.chart, this, A)
            }
            a = {source: b,price: "close",name: this.params.names[0],label: this.code,color: E,type: this.params.chartType[0]};
            this.indicatorData.push(a);
            a = {source: c,price: "close",name: this.params.names[1],label: this.code,color: E,type: this.params.chartType[1]};
            this.indicatorData.push(a);
            a = {source: d,price: "close",name: this.params.names[2],label: this.code,color: E[2],lineWidth: E[2].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(a)
        };
        l.inherit(Ga, D);
        Ga.prototype.calcData = function(a) {
            var b = [], c = [], d = [], k, f, g = this.params.editable.tsPeriod.currentValue, h = this.params.editable.ksPeriod.currentValue, r = this.params.editable.ssBPeriod.currentValue,
            p, m, n, l;
            n = [];
            var s = h < this.chart.options.ichimokuCloudMaxDistance ? h : this.chart.options.ichimokuCloudMaxDistance;
            l = [];
            var F = [], u = [], q = [], v = [];
            for (m = 0; m < s; m++)
                n.push({close: null});
            a = a.concat(n);
            n = a.length;
            try {
                if (h > g) {
                    for (m = 0; m < n; m++)
                        b[m] = +a[m].high, c[m] = +a[m].low, m < g - 1 && l.push({close: null,timestamp: +a[m].timestamp}), m < h - 1 && F.push({close: null,timestamp: +a[m].timestamp}), m < 2 * h - 1 && q.push({close: null,timestamp: +a[m].timestamp}), m < h + r - 1 && v.push({close: null,timestamp: +a[m].timestamp});
                    for (m = 0; m < g - 1; m++)
                        d[m] =
                        {};
                    for (m = g - 1; m < h - 1; m++)
                        k = Math.max.apply(null, b.slice(m - g + 1, m + 1)), f = Math.min.apply(null, c.slice(m - g + 1, m + 1)), d[m] = {}, d[m].TenkanSen = (k + f) / 2, p = {high: "",low: "",open: "",close: d[m].TenkanSen,timestamp: +a[m].timestamp}, l.push(p);
                    for (m = h - 1; m < n; m++)
                        d[m] = {}, k = Math.max.apply(null, b.slice(m - g + 1, m + 1)), f = Math.min.apply(null, c.slice(m - g + 1, m + 1)), d[m].TenkanSen = (k + f) / 2, p = {high: "",low: "",open: "",close: d[m].TenkanSen,timestamp: +a[m].timestamp}, l.push(p), k = Math.max.apply(null, b.slice(m - h + 1, m + 1)), f = Math.min.apply(null,
                        c.slice(m - h + 1, m + 1)), d[m].KijunSen = (k + f) / 2, p = {high: "",low: "",open: "",close: d[m].KijunSen,timestamp: +a[m].timestamp}, F.push(p);
                    for (m = h; m < n; m++)
                        d[m - h].ChikouSpan = a[m].close ? +a[m].close : null, p = {high: "",low: "",open: "",close: d[m - h].ChikouSpan,timestamp: +a[m - h].timestamp}, u.push(p);
                    for (m = 2 * h - 1; m < n; m++)
                        d[m].SenkouSpanA = (d[m - h].KijunSen + d[m - h].TenkanSen) / 2, p = {high: "",low: "",open: "",close: d[m].SenkouSpanA,timestamp: +a[m].timestamp}, q.push(p);
                    for (m = h + r - 1; m < n; m++)
                        k = Math.max.apply(null, b.slice(m - h - r + 1, m - h + 1)),
                        f = Math.min.apply(null, c.slice(m - h - r + 1, m - h + 1)), d[m].SenkouSpanB = (k + f) / 2, p = {high: "",low: "",open: "",close: d[m].SenkouSpanB,timestamp: +a[m].timestamp}, v.push(p)
                }
            } catch (w) {
                l = [], p = {close: null}, l.push(p), F = [], p = {close: null}, F.push(p), u = [], p = {close: null}, u.push(p), q = [], p = {close: null}, q.push(p), v = [], p = {close: null}, v.push(p), this.chart.options.events.indicatorError.call(this.chart, this, w)
            }
            a = this.params.names[0];
            l = {source: l,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,
                lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(l);
            a = this.params.names[1];
            l = {source: F,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(l);
            a = this.params.names[2];
            l = {source: u,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,
                type: this.params.chartType[2]};
            this.indicatorData.push(l);
            a = [this.params.names[3], this.params.names[4]];
            l = {source: {first: q,second: v},price: "close",name: null,label: this.params.code,color: [this.params.editable.styles[a[0]].color, this.params.editable.styles[a[1]].color],lineWidth: [this.params.editable.styles[a[0]].lineWidth, this.params.editable.styles[a[1]].lineWidth],type: this.params.chartType[3]};
            this.indicatorData.push(l);
            a = this.params.names[3];
            l = {source: q,price: "close",name: a,label: this.params.code,
                color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[4]};
            this.indicatorData.push(l);
            a = this.params.names[4];
            l = {source: v,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[5]};
            this.indicatorData.push(l)
        };
        l.inherit(Ha, D);
        Ha.prototype.calcData = function(a) {
            var b, c = [], d = a.length, k = [], f = [], g = [], h = [], r = [], p = [], m = [], n, l, s, F, q =
            0, v = this.params.price, w = this.params.editable.period.currentValue, x = this.params.editable.fastSmoothing.currentValue, z = this.params.editable.slowSmoothing.currentValue;
            try {
                s = 2 / (+x + 1);
                F = 2 / (+z + 1);
                p[w - 1] = +a[w - 1][v];
                for (q = 0; q < w; q++)
                    b = {close: null,timestamp: +a[q].timestamp}, c.push(b);
                for (q = w; q < d; q++)
                    k[q] = +a[q].close - +a[q - w].close, m = a.slice(q - w + 1, q), n = a.slice(q - w, q - 1), l = u.estimateArraySubstraction(m, n, v), f[q] = u.estimateSumSimple(l), 0 >= f[q] && (f[q] = Math.pow(10, -3)), g[q] = Math.abs(k[q] / f[q]), h[q] = g[q] * (s - F) + F,
                    r[q] = Math.pow(h[q], 2), p[q] = r[q] * +a[q][v] + (1 - r[q]) * p[q - 1], b = {close: p[q],timestamp: +a[q].timestamp}, c.push(b)
            } catch (y) {
                c = [], b = {close: null}, c.push(b), this.chart.options.events.indicatorError.call(this.chart, this, y)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Ia, y);
        Ia.prototype.calcData = function(a) {
            var b, c;
            b = [];
            var d = [], k = [], f = a.length, g = this.params.editable.period.currentValue, h = this.params.editable.price.currentValue, r = [], p = [], m = [], n = [], l = [], s;
            try {
                for (s = 0; s < g; s++)
                    1 <= s && (r[s] = +a[s][h] - +a[s - 1][h]), c = {close: null,timestamp: +a[s].timestamp}, b.push(c);
                for (s = g; s < f; s++)
                    r[s] = Math.abs(+a[s][h] - +a[s - 1][h]), p[s] = +a[s][h] - +a[s - g][h], l = r.slice(s - g + 1, s), m[s] = u.estimateSumSimple(l), n[s] = 100 * (p[s] / m[s]), c = {close: n[s],timestamp: +a[s].timestamp}, b.push(c);
                d.push({close: this.params.line1});
                k.push({close: this.params.line2})
            } catch (F) {
                b =
                [], c = {close: null}, b.push(c), d = [], c = {close: null}, d.push(c), k = [], c = {close: null}, k.push(c), this.chart.options.events.indicatorError.call(this.chart, this, F)
            }
            a = this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: d,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,
                lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b);
            a = this.params.names[2];
            b = {source: k,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(b)
        };
        l.inherit(Ja, D);
        Ja.prototype.calcData = function(a) {
            var b = this.params.editable.period.currentValue, c = [], d, k, f, g = [];
            try {
                f = u.betas(a, b, this.params.price);
                for (k = 0; k <
                b; k++)
                    d = {close: null}, c.push(d);
                for (k = b - 1; k < a.length - 1; k++)
                    g[k] = f[k][0] + f[k][1] * b, d = {high: "",low: "",open: "",close: g[k],timestamp: +a[k].timestamp}, c.push(d)
            } catch (h) {
                c = [], d = {close: null}, c.push(d), this.chart.options.events.indicatorError.call(this.chart, this, h)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Ka, D);
        Ka.prototype.calcData = function(a) {
            var b = this.params.editable.period.currentValue, c = [], d, k, f;
            try {
                f = u.betas(a, b, this.params.price);
                for (k = 0; k < b; k++)
                    d = {close: null}, c.push(d);
                for (k = b - 1; k < a.length - 1; k++)
                    d = {high: "",low: "",open: "",close: f[k][0],timestamp: +a[k].timestamp}, c.push(d)
            } catch (g) {
                c = [], d = {close: null}, c.push(d), this.chart.options.events.indicatorError.call(this.chart, this, g)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,
                lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(La, y);
        La.prototype.calcData = function(a) {
            var b = [], c = [], d, k, f, g = this.params.editable.period.currentValue, h = u.createZeroFilledMatrix(g, 2), r, p, m, n, l, s = 0, F = 0, q = [], v;
            try {
                for (k = 0; k < g; k++)
                    h[k][0] = 1, h[k][1] = k + 1;
                p = u.matrixMultiplication(u.transposeMatrix(h), h);
                m = u.invertedMatrix(p);
                for (k = 0; k < g; k++)
                    v = {close: null}, q.push(v);
                for (k = g - 1; k < a.length - 1; k++) {
                    d = a.slice(k - g + 1, k + 1);
                    r = u.convertArrayToMatrix(d, this.params.price);
                    n = u.matrixMultiplication(u.transposeMatrix(h), r);
                    l = u.matrixMultiplication(m, n);
                    for (f = 0; f < g; f++)
                        c[f] = {}, c[f][this.params.price] = +d[f][this.params.price] - (l[0][0] + l[1][0] * h[f][1]);
                    F = Math.pow(u.stdDevSupport(c, this.params.price), 2) * (c.length - 1);
                    s = Math.pow(u.stdDevSupport(d, this.params.price), 2) * (d.length - 1);
                    b[k] = 1 - F / s;
                    v = {high: "",low: "",open: "",close: b[k],timestamp: +a[k].timestamp};
                    q.push(v)
                }
            } catch (w) {
                q = [], v = {close: null}, q.push(v), this.chart.options.events.indicatorError.call(this.chart, this, w)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: q,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Ma, y);
        Ma.prototype.calcData = function(a) {
            var b = this.params.editable.period.currentValue, c = [], d, k, f;
            try {
                f = u.betas(a, b, this.params.price);
                for (k = 0; k < b; k++)
                    d = {close: null}, c.push(d);
                for (k = b - 1; k < a.length - 1; k++)
                    d = {high: "",low: "",open: "",close: f[k][1],timestamp: +a[k].timestamp}, c.push(d)
            } catch (g) {
                c =
                [], d = {close: null}, c.push(d), this.chart.options.events.indicatorError.call(this.chart, this, g)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Na, y);
        Na.prototype.calcData = function(a) {
            var b = a.length, c, d, k = this.params.editable.shortTerm.currentValue || 12, f = this.params.editable.longTerm.currentValue || 26, g = this.params.editable.macdLength.currentValue ||
            9, h = [], r = [], p = [], m = [];
            d = [];
            var n, l = [];
            for (n in this.params.editable.styles)
                ("Value Up" === n || "Value Down" === n) && l.push(this.params.editable.styles[n].color);
            try {
                if (b >= f + g - 1) {
                    for (c = 0; c < f - 1; c++)
                        p[c] = {close: null,timestamp: +a[c].timestamp}, m[c] = {close: null,timestamp: +a[c].timestamp}, d[c] = {close: null,isGreen: !0,timestamp: +a[c].timestamp};
                    h[k - 1] = u.estimateSmaObjects(a.slice(0, k));
                    for (c = k; c < f; c++)
                        h[c] = u.estimateEma(+a[c].close, h[c - 1], 2 / (1 + k));
                    r[f - 1] = u.estimateSmaObjects(a.slice(0, f));
                    p[f - 1] = {close: +h[f - 1] -
                        +r[f - 1],timestamp: +a[f - 1].timestamp};
                    m[f - 1] = {close: null,timestamp: +a[f - 1].timestamp};
                    d[f - 1] = {close: null,isGreen: !0,timestamp: +a[f - 1].timestamp};
                    for (c = f; c < f + g - 1; c++)
                        h[c] = u.estimateEma(+a[c].close, h[c - 1], 2 / (1 + k)), r[c] = u.estimateEma(+a[c].close, r[c - 1], 2 / (1 + f)), p[c] = {close: +h[c] - +r[c],timestamp: +a[c].timestamp}, m[c] = {close: null,timestamp: +a[c].timestamp}, d[c] = {close: null,isGreen: !0,timestamp: +a[c].timestamp};
                    m[f + g - 2] = {close: u.estimateSmaObjects(p.slice(f - 1, f + g - 1)),timestamp: +a[f + g - 2].timestamp};
                    d[f + g -
                    2] = {close: p[f + g - 2].close - m[f + g - 2].close,isGreen: 0 < m[f + g - 2].close - p[f + g - 2].close ? !0 : !1,timestamp: +a[f + g - 2].timestamp};
                    for (c = f + g - 1; c < b; c++)
                        h[c] = u.estimateEma(+a[c].close, h[c - 1], 2 / (1 + k)), r[c] = u.estimateEma(+a[c].close, r[c - 1], 2 / (1 + f)), p[c] = {close: -+r[c] + +h[c],timestamp: +a[c].timestamp}, m[c] = {close: u.estimateEma(p[c].close, m[c - 1].close, 2 / (1 + g)),timestamp: +a[c].timestamp}, d[c] = {close: +p[c].close - +m[c].close,isGreen: d[c - 1] && d[c - 1].close >= +p[c].close - +m[c].close ? !1 : !0,timestamp: +a[c].timestamp}
                }
            } catch (s) {
                d =
                [], a = {close: null}, d.push(a), m = [], a = {close: null}, m.push(a), p = [], a = {close: null}, p.push(a), this.chart.options.events.indicatorError.call(this.chart, this, s)
            }
            d = {source: d,price: "close",name: this.params.names[0],label: this.params.code,color: l,type: this.params.chartType[0]};
            this.indicatorData.push(d);
            d = this.params.names[1];
            d = {source: m,price: "close",name: d,label: this.params.code,color: this.params.editable.styles[d].color,lineWidth: this.params.editable.styles[d].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(d);
            d = this.params.names[2];
            d = {source: p,price: "close",name: d,label: this.params.code,color: this.params.editable.styles[d].color,lineWidth: this.params.editable.styles[d].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(d)
        };
        l.inherit(Oa, y);
        Oa.prototype.calcData = function(a) {
            var b = [], c = +this.params.editable.period.currentValue, d = 0, k, f, g = a.length;
            try {
                for (k = 0; k < g; k++)
                    0 <= k - c && (d = 100 * +a[k][this.params.price] / +a[k - c][this.params.price]), f = k < c ? {close: null,timestamp: +a[k].timestamp} : {close: d,timestamp: +a[k].timestamp},
                    b.push(f)
            } catch (h) {
                b = [], f = {close: null}, b.push(f), this.chart.options.events.indicatorError.call(this.chart, this, h)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Pa, D);
        Pa.prototype.calcData = function(a) {
            var b = this.params.editable.degree.currentValue, c = this.params.editable.period.currentValue, d = this.params.editable.sdMultiplier1.currentValue,
            k = this.params.editable.sdMultiplier2.currentValue, f = [], g = [], h = [], r = [], p = [], m = [], n, l, s, F, q, v, w, x, z = a.length, y = [], D = [], E = [], A = [], G = [], C, B, J, I;
            a = a.slice(a.length - c, a.length);
            n = u.createZeroFilledMatrix(a.length, b + 1);
            try {
                if (4 < b)
                    return;
                for (B = 0; B < z - c; B++)
                    C = {close: null}, y.push(C), D.push(C), E.push(C), A.push(C), G.push(C);
                for (B = 0; B < a.length; B++)
                    for (J = 0; J < b + 1; J++)
                        n[B][J] = Math.pow(B + 1, J);
                s = u.matrixMultiplication(u.transposeMatrix(n), n);
                F = u.invertedMatrix(s);
                l = u.convertArrayToMatrix(a, this.params.price);
                q = u.matrixMultiplication(u.transposeMatrix(n),
                l);
                v = u.matrixMultiplication(F, q);
                for (I = 0; I < a.length; I++)
                    w = u.getRow(n, I), f[I] = u.convertMatrixToValue(u.matrixMultiplication(u.transposeMatrix(v), u.transposeMatrix(w))), C = {high: "",low: "",open: "",close: f[I],timestamp: +a[I].timestamp}, y.push(C), g[I] = {}, g[I][this.params.price] = +a[I][this.params.price] - f[I];
                x = u.stdDevSupport(g, this.params.price);
                for (B = 0; B < a.length; B++)
                    h[B] = f[B] + k * x, r[B] = f[B] + d * x, p[B] = f[B] - d * x, m[B] = f[B] - k * x, C = {high: "",low: "",open: "",close: r[B],timestamp: +a[B].timestamp}, D.push(C), C = {high: "",
                        low: "",open: "",close: p[B],timestamp: +a[B].timestamp}, E.push(C), C = {high: "",low: "",open: "",close: h[B],timestamp: +a[B].timestamp}, A.push(C), C = {high: "",low: "",open: "",close: m[B],timestamp: +a[B].timestamp}, G.push(C)
            } catch (L) {
                y = [], C = {close: null}, y.push(C), D = [], C = {close: null}, D.push(C), E = [], C = {close: null}, E.push(C), A = [], C = {close: null}, A.push(C), G = [], C = {close: null}, G.push(C), this.chart.options.events.indicatorError.call(this.chart, this, L)
            }
            a = this.params.names[0];
            y = {source: y,price: "close",name: a,label: this.params.code,
                color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(y);
            a = this.params.names[1];
            y = {source: D,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(y);
            a = this.params.names[2];
            y = {source: E,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,
                lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(y);
            a = this.params.names[3];
            y = {source: A,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[3]};
            this.indicatorData.push(y);
            a = this.params.names[4];
            y = {source: G,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,
                type: this.params.chartType[4]};
            this.indicatorData.push(y)
        };
        l.inherit(Qa, y);
        Qa.prototype.calcData = function(a) {
            var b = [], c = +this.params.editable.period.currentValue, d, k, f;
            try {
                for (f = 0; f < a.length; f++)
                    d = 0, f < c ? k = {close: null,timestamp: +a[f].timestamp} : (d = 100 * ((a[f][this.params.price] - a[f - c][this.params.price]) / a[f - c][this.params.price]), k = {close: d,timestamp: +a[f].timestamp}), b.push(k)
            } catch (g) {
                b = [], k = {close: null}, b.push(k), this.chart.options.events.indicatorError.call(this.chart, this, g)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Ra, y);
        Ra.prototype.calcData = function(a) {
            var b;
            b = [];
            var c = [], d = [], k = {}, f = 0, g = this.params.editable.period.currentValue, h = this.params.editable.price.currentValue, r = 0, p = 0, m = 0, n = 0, l = 0, s = 0, F = 0, q = 0, u = 0;
            try {
                for (f = 0; f < a.length; f++)
                    0 < f && (l = +a[f][h] - +a[f - 1][h], s = 0 > l ? Math.abs(l) : 0, F = 0 <= l ? l : 0), f < g ?
                    (0 < l ? m += l : n += Math.abs(l), k = {close: null,timestamp: +a[f].timestamp}) : (f === g ? (q = m / g, u = n / g) : (q = (q * (g - 1) + s) / g, u = (u * (g - 1) + F) / g), p = q / u, r = 0 === q ? 100 : 100 / (1 + p), k = {close: r,timestamp: +a[f].timestamp}), b.push(k)
            } catch (v) {
                b = [], k = {close: null}, b.push(k), this.chart.options.events.indicatorError.call(this.chart, this, v)
            }
            k = {close: this.params.editable.overBought.currentValue,timestamp: +a[0].timestamp};
            c.push(k);
            k = {close: this.params.editable.overSold.currentValue,timestamp: +a[0].timestamp};
            d.push(k);
            a = this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b);
            a = this.params.names[2];
            b = {source: d,price: "close",name: a,label: this.params.code,
                color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(b)
        };
        l.inherit(Sa, y);
        Sa.prototype.calcData = function(a) {
            var b = [], c = [], d = +this.params.editable.period.currentValue, k = [], f = [], g, h, r = a.length, l = [], m = [], n = [], t = [];
            try {
                for (h = 0; 3 > h; h++)
                    l[h] = +a[h].close - +a[h].open, m[h] = +a[h].high - +a[h].low, g = {close: null,timestamp: +a[h].timestamp}, b.push(g), g = {close: null,timestamp: +a[h].timestamp}, c.push(g);
                for (h = 3; h < d + 2; h++)
                    l[h] =
                    +a[h].close - +a[h].open, m[h] = +a[h].high - +a[h].low, k[h] = (l[h] + 2 * l[h - 1] + 2 * l[h - 2] + l[h - 3]) / 6, f[h] = (m[h] + 2 * m[h - 1] + 2 * m[h - 2] + m[h - 3]) / 6, g = {close: null,timestamp: +a[h].timestamp}, b.push(g), g = {close: null,timestamp: +a[h].timestamp}, c.push(g);
                for (h = d + 2; h < d + 5; h++)
                    l[h] = +a[h].close - +a[h].open, m[h] = +a[h].high - +a[h].low, k[h] = (l[h] + 2 * l[h - 1] + 2 * l[h - 2] + l[h - 3]) / 6, f[h] = (m[h] + 2 * m[h - 1] + 2 * m[h - 2] + m[h - 3]) / 6, n[h] = u.estimateSumSimple(k.slice(h - d, h + 1)) / u.estimateSumSimple(f.slice(h - d, h + 1)), g = {close: n[h],timestamp: +a[h].timestamp},
                    b.push(g), g = {close: null,timestamp: +a[h].timestamp}, c.push(g);
                for (h = d + 5; h < r; h++)
                    l[h] = +a[h].close - +a[h].open, m[h] = +a[h].high - +a[h].low, k[h] = (l[h] + 2 * l[h - 1] + 2 * l[h - 2] + l[h - 3]) / 6, f[h] = (m[h] + 2 * m[h - 1] + 2 * m[h - 2] + m[h - 3]) / 6, n[h] = u.estimateSumSimple(k.slice(h - d + 1, h + 1)) / u.estimateSumSimple(f.slice(h - d + 1, h + 1)), t[h] = (n[h] + 2 * n[h - 1] + 2 * n[h - 2] + n[h - 3]) / 6, g = {close: n[h],timestamp: +a[h].timestamp}, b.push(g), g = {close: t[h],timestamp: +a[h].timestamp}, c.push(g)
            } catch (s) {
                b = [], g = {close: null}, b.push(g), c = [], g = {close: null}, c.push(g),
                this.chart.options.events.indicatorError.call(this.chart, this, s)
            }
            a = this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b)
        };
        l.inherit(Ta, D);
        Ta.prototype.calcData = function(a) {
            var b, c = [], d = this.params.editable.step.currentValue, k = this.params.editable.maximum.currentValue, f = [], g = [], h = [], r = [], l = [], m = [], n = [], t = [], s = [], q;
            try {
                for (q = 0; q < a.length; q++)
                    n[q] = +a[q].high, t[q] = +a[q].low;
                m[3] = 1;
                r[4] = 0.02;
                s = t.slice(0, 5);
                f[4] = Math.min.apply(null, s);
                s = n.slice(0, 5);
                g[4] = Math.max.apply(null, s);
                h[4] = g[4] - f[4];
                l[4] = r[4] * h[4];
                1 === m[3] && (t[4] > f[4] ? m[4] = 1 : m[4] = -1);
                -1 === m[3] && (n[4] < f[4] ? m[4] = -1 : m[4] = 1);
                for (q = 0; 5 > q; q++)
                    c.push({close: null});
                for (q =
                5; q < a.length; q++)
                    s = t.slice(q - 4, q + 1), f[q] = Math.min.apply(null, s), s = n.slice(q - 4, q + 1), g[q] = Math.max.apply(null, s), m[q - 1] === m[q - 2] ? 1 === m[q - 1] ? f[q - 1] + l[q - 1] < Math.min(t[q - 1], t[q - 2]) ? f[q] = f[q - 1] + l[q - 1] : f[q] = Math.min(t[q - 1], t[q - 2]) : f[q - 1] + l[q - 1] > Math.max(n[q - 1], n[q - 2]) ? f[q] = f[q - 1] + l[q - 1] : f[q] = Math.max(n[q - 1], n[q - 2]) : f[q] = g[q - 1], 1 === m[q - 1] ? n[q] > g[q - 1] ? g[q] = n[q] : g[q] = g[q - 1] : t[q] < g[q - 1] ? g[q] = t[q] : g[q] = g[q - 1], h[q] = g[q] - f[q], 1 === m[q - 1] && (t[q] > f[q] ? m[q] = 1 : m[q] = -1), -1 === m[q - 1] && (n[q] < f[q] ? m[q] = -1 : m[q] = 1), m[q] ===
                    m[q - 1] ? 1 === m[q] ? g[q] > g[q - 1] ? r[q] === k ? r[q] = r[q - 1] : r[q] = r[q - 1] + d : r[q] = r[q - 1] : g[q] < g[q - 1] ? r[q] === k ? r[q] = r[q - 1] : r[q] = r[q - 1] + d : r[q] = r[q - 1] : r[q] = d, l[q] = r[q] * h[q], b = {high: "",low: "",open: "",close: f[q],timestamp: +a[q].timestamp}, c.push(b)
            } catch (u) {
                c = [], b = {close: null}, c.push(b), this.chart.options.events.indicatorError.call(this.chart, this, u)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,type: this.params.chartType[0]})
        };
        l.inherit(Ua, y);
        Ua.prototype.calcData = function(a) {
            var b, c = this.params.editable.period.currentValue, d = [], k, f;
            try {
                for (b = 0; b < c - 1; b++)
                    f = {close: null,timestamp: +a[b].timestamp}, d.push(f);
                for (b = c - 1; b < a.length; b++)
                    k = a.slice(b - c + 1, b + 1), f = {close: u.stdDevSupport(k, this.params.price),timestamp: +a[b].timestamp}, d.push(f)
            } catch (g) {
                d = [], f = {close: null}, d.push(f), this.chart.options.events.indicatorError.call(this.chart, this, g)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: d,price: "close",name: this.params.names[0],
                label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Va, D);
        Va.prototype.calcData = function(a) {
            var b = [], c = +this.params.editable.period.currentValue, d = +this.params.offset, k, f, g, h, l;
            try {
                for (l = 0; l < a.length; l++) {
                    k = 0;
                    for (h = l - c; h < l; h++)
                        0 <= h && (k += Number(a[h][this.params.editable.price.currentValue]));
                    g = l - d;
                    0 <= g && g < a.length && (l < c ? f = {high: null,low: null,open: null,close: null,timestamp: +a[g].timestamp} : (k /=
                    c, f = {high: "",low: "",open: "",close: k,timestamp: +a[g].timestamp}), b.push(f))
                }
            } catch (p) {
                b = [], f = {close: null}, b.push(f), this.chart.options.events.indicatorError.call(this.chart, this, p)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Wa, D);
        Wa.prototype.calcData = function(a) {
            var b;
            b = [];
            var c = [], d = +this.params.editable.period.currentValue,
            k = +this.params.offset, f = this.params.editable.deviation.currentValue, g, h, l, p, m, n, q;
            try {
                for (n = 0; n < a.length; n++) {
                    g = 0;
                    for (q = n - d; q < n; q++)
                        0 <= q && (g += +a[q][this.params.editable.price.currentValue]);
                    l = n - k;
                    0 <= l && l < a.length && (n < d ? (h = {close: null,timestamp: +a[n].timestamp}, b.push(h), h = {close: null,timestamp: +a[n].timestamp}) : (g /= d, p = g * (1 + f / 100), m = g * (1 - f / 100), h = {high: "",low: "",open: "",close: p,timestamp: +a[n].timestamp}, b.push(h), h = {high: "",low: "",open: "",close: m,timestamp: +a[n].timestamp}), c.push(h))
                }
            } catch (s) {
                b =
                [], h = {close: null}, b.push(h), c = [], h = {close: null}, c.push(h), this.chart.options.events.indicatorError.call(this.chart, this, s)
            }
            a = this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: "SimpleLine"};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: "close",name: a,label: this.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,
                type: "SimpleLine"};
            this.indicatorData.push(b)
        };
        l.inherit(Xa, y);
        Xa.prototype.calcData = function(a) {
            var b, c, d = [], k = [], f = [], g = [], h = [], l = a.length, p = [], m = [], n = [], q = [], s, v, w = this.params.editable.slowKPeriod.currentValue, y = this.params.editable.Dperiod.currentValue, x = this.params.editable.Kperiod.currentValue, z = [], B = [], C = [], D = [], E = [], A;
            try {
                if (l >= x + y - 1) {
                    for (s = 0; s < l; s++)
                        g[s] = +a[s].high, h[s] = +a[s].low, s < x - 1 && (A = {close: null,timestamp: +a[s].timestamp}, p.push(A), m.push(A));
                    w === y ? (v = Math.min(w, y), E = 1 === v ? u.estimateReplicate(1,
                    w + y - 1) : u.estimateSequence(1, v).concat(u.estimateSequence(v - 1, 1))) : (v = Math.min(w, y), z = u.estimateSequence(1, v - 1), B = u.estimateReplicate(v, w + y - 1 - 2 * v + 2), C = u.estimateSequence(v - 1, 1), E = z.concat(B, C));
                    for (s = x - 1; s < x + w - 2; s++)
                        b = Math.max.apply(null, g.slice(s - x + 1, s + 1)), c = Math.min.apply(null, h.slice(s - x + 1, s + 1)), d[s] = 100 * (+a[s].close - c) / (b - c), A = {close: null,timestamp: +a[s].timestamp}, p.push(A), m.push(A);
                    for (s = x + w - 2; s < x + w + y - 3; s++)
                        b = Math.max.apply(null, g.slice(s - x + 1, s + 1)), c = Math.min.apply(null, h.slice(s - x + 1, s + 1)),
                        d[s] = 100 * (+a[s].close - c) / (b - c), D = d.slice(s - w + 1, s + 1), k[s] = u.estimateSmaLiterals(D), A = {close: k[s],timestamp: +a[s].timestamp}, p.push(A), A = {close: null,timestamp: +a[s].timestamp}, m.push(A);
                    for (s = x + w + y - 3; s < l; s++)
                        b = Math.max.apply(null, g.slice(s - x + 1, s + 1)), c = Math.min.apply(null, h.slice(s - x + 1, s + 1)), d[s] = 100 * (+a[s].close - c) / (b - c), D = d.slice(s - w + 1, s + 1), k[s] = u.estimateSmaLiterals(D), A = {close: k[s],timestamp: +a[s].timestamp}, p.push(A), D = d.slice(s - w - y + 2, s + 1), f[s] = u.estimateWma(D, E), A = {close: f[s],timestamp: +a[s].timestamp},
                        m.push(A)
                }
            } catch (G) {
                p = [], A = {close: null}, p.push(A), m = [], A = {close: null}, m.push(A), this.chart.options.events.indicatorError.call(this.chart, this, G)
            }
            A = {close: this.params.editable.overBought.currentValue};
            n.push(A);
            A = {close: this.params.editable.overSold.currentValue};
            q.push(A);
            a = this.params.names[0];
            p = {source: p,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]};
            this.indicatorData.push(p);
            a = this.params.names[1];
            p = {source: m,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(p);
            a = this.params.names[2];
            p = {source: n,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(p);
            a = this.params.names[3];
            p = {source: q,price: "close",
                name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[3]};
            this.indicatorData.push(p)
        };
        l.inherit(Ya, D);
        Ya.prototype.calcData = function(a) {
            var b = [], c = [], d = [], k = [], f, g = [], h = this.params.editable.period.currentValue, l = this.params.editable.price.currentValue, p = a.length, m;
            try {
                1 === h ? c[0] = 1 : c = Array.prototype.concat(u.estimateSequence(1, h), u.estimateSequence(h - 1, 1));
                for (f = 0; f < p; f++)
                    g[f] = a[f][l], f < c.length - 1 && (m =
                    {close: null,timestamp: +a[f].timestamp}, b.push(m));
                for (f = c.length - 1; f < g.length; f++)
                    d = g.slice(f - c.length + 1, f + 1), k[f] = u.estimateWmaSupport(d, c), m = {close: k[f],timestamp: +a[f].timestamp}, b.push(m)
            } catch (n) {
                b = [], m = {close: null}, b.push(m), this.chart.options.events.indicatorError.call(this.chart, this, n)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit(Za, D);
        Za.prototype.calcData = function(a) {
            var b = [], c = [], d = [], k = [], f = [], g, h, l, p, m, n = a.length, q = this.params.editable.period.currentValue, s = this.params.editable.price.currentValue;
            try {
                for (l = 0; l < n; l++)
                    c[l] = +a[l][s], l < q - 1 && (m = {close: null,timestamp: +a[l].timestamp}, b.push(m));
                for (l = 0; l < q; l++)
                    d[l] = l + 1;
                for (l = q - 1; l < c.length; l++) {
                    f = c.slice(l - q + 1, l + 1);
                    for (p = h = g = 0; p < q; p++)
                        g += d[p] * f[p], h += d[p], k[l] = g / h;
                    m = {close: k[l],timestamp: +a[l].timestamp};
                    b.push(m)
                }
            } catch (u) {
                b = [], m = {close: null}, b.push(m), this.chart.options.events.indicatorError.call(this.chart,
                this, u)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,price: "close",name: this.params.names[0],label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        l.inherit($a, y);
        $a.prototype.calcData = function(a) {
            var b;
            b = [];
            var c = [], d = [], k, f, g, h = this.params.editable.period.currentValue, l, p, m;
            try {
                for (f = 0; f < a.length; f++) {
                    p = 0;
                    m = Number.MAX_VALUE;
                    for (g = f - h + 1; g <= f; g++)
                        0 <= g && +a[g].high > p && (p = +a[g].high), 0 <= g && +a[g].low <
                        m && (m = +a[g].low);
                    f < h ? k = {close: null,timestamp: +a[f].timestamp} : (l = -100 * ((p - +a[f].close) / (p - m)), k = {close: !l ? Number.MIN_VALUE : l,timestamp: +a[f].timestamp});
                    b.push(k)
                }
            } catch (n) {
                b = [], k = {close: null}, b.push(k), this.chart.options.events.indicatorError.call(this.chart, this, n)
            }
            c.push({close: this.params.overBought});
            d.push({close: this.params.overSold});
            a = this.params.names[0];
            b = {source: b,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,
                type: this.params.chartType[0]};
            this.indicatorData.push(b);
            a = this.params.names[1];
            b = {source: c,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[1]};
            this.indicatorData.push(b);
            a = this.params.names[2];
            b = {source: d,price: "close",name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[2]};
            this.indicatorData.push(b)
        };
        l.inherit(ab, D);
        ab.prototype.calcData = function(a) {
            var b = [], c = this.params.editable.period.currentValue, d = 0, k = 0, f = 0, g = {}, h, l;
            try {
                for (h = 0; h < a.length; h++) {
                    d = 0;
                    for (l = h - c; l < h; l++)
                        0 <= l && (d += +a[l][this.params.price]);
                    h < c ? g = {close: null,timestamp: +a[h].timestamp} : (f = k = 0 === f ? d / c : (f * (c - 1) + +a[h][this.params.price]) / c, g = {close: k,timestamp: +a[h].timestamp});
                    b.push(g)
                }
            } catch (p) {
                b = [], g = {close: null}, b.push(g), this.chart.options.events.indicatorError.call(this.chart, this, p)
            }
            a = this.params.names[0];
            this.indicatorData.push({source: b,
                price: this.params.price,name: a,label: this.params.code,color: this.params.editable.styles[a].color,lineWidth: this.params.editable.styles[a].lineWidth,type: this.params.chartType[0]})
        };
        z.accdec = {params: {code: "accdec",name: "Accelerator Oscillator",type: "bottom",category: "oscillators",names: ["AccDec"],chartType: ["Oscillator"],precision: 4,editable: {styles: {"Value Up": {color: "#1ba767"},"Value Down": {color: "#e24439"}}}},constructor: pa};
        z.all = {params: {code: "all",name: "Alligator",type: "upper",category: "other",
                colors: ["#a359be", "#e8e231", "#79bfd7"],names: ["Alligator Jaws", "Alligator Teeth", "Alligator Lips"],chartType: ["SimpleLine", "SimpleLine", "SimpleLine"],editable: {jawPeriod: {defaultValue: 13,currentValue: 13,minValue: 1,maxValue: 250},jawShift: {defaultValue: 8,currentValue: 8,minValue: 1,maxValue: 250},teethPeriod: {defaultValue: 8,currentValue: 8,minValue: 1,maxValue: 250},teethShift: {defaultValue: 5,currentValue: 5,minValue: 1,maxValue: 250},lipsPeriod: {defaultValue: 5,currentValue: 5,minValue: 1,maxValue: 250},lipsShift: {defaultValue: 3,
                        currentValue: 3,minValue: 1,maxValue: 250},styles: {"Alligator Jaws": {color: "#a359be",lineWidth: 1},"Alligator Teeth": {color: "#e8e231",lineWidth: 1},"Alligator Lips": {color: "#79bfd7",lineWidth: 1}}}},constructor: ra};
        z.adx = {params: {code: "adx",name: "Average Directional Index",type: "bottom",category: "trend",price: "close",period: 14,period2: 14,offset: 0,names: ["ADX", "DI+", "DI-"],chartType: ["SimpleLine", "SimpleLine", "SimpleLine"],precision: 2,editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 200},
                    "di-period": {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 200},styles: {ADX: {color: "#79bfd7",lineWidth: 1},"DI+": {color: "#e34e43",lineWidth: 1},"DI-": {color: "#3e8d4f",lineWidth: 1}}}},constructor: qa};
        z.atr = {params: {code: "atr",name: "Average True Range",type: "bottom",category: "volatility",price: "close",names: ["ATR"],chartType: ["SimpleLine"],precision: 5,editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},styles: {ATR: {color: "#79bfd7",lineWidth: 1}}}},constructor: sa};
        z.awesome =
        {params: {code: "awesome",name: "Awesome Oscillator",type: "bottom",category: "oscillators",colors: [["#1ba767", "#e24439"]],names: ["Awesome Osc"],chartType: ["Oscillator"],precision: 4,editable: {styles: {"Value Up": {color: "#1ba767"},"Value Down": {color: "#e24439"}}}},constructor: ta};
        z.boll = {params: {code: "boll",name: "Bollinger Bands",type: "upper",category: "most-popular volatility",price: "close",colors: ["#a359be", "#e8e231", "#79bfd7"],names: ["Upper Line", "Middle Line", "Lower Line"],chartType: ["SimpleLine", "SimpleLine",
                    "SimpleLine"],editable: {period: {defaultValue: 20,currentValue: 20,minValue: 2,maxValue: 400},deviation: {defaultValue: 2,currentValue: 2,minValue: 1,maxValue: 100},price: {defaultValue: "close",currentValue: "close",possibleValues: ["open", "close", "high", "low"]},styles: {"Upper Line": {color: "#a359be",lineWidth: 1},"Middle Line": {color: "#e8e231",lineWidth: 1},"Lower Line": {color: "#79bfd7",lineWidth: 1}}}},constructor: ua};
        z.cci = {params: {code: "cci",name: "Commodity Channel Index",type: "bottom",category: "trend",price: "close",
                names: ["CCI", "Overbought", "Oversold"],chartType: ["SimpleLine", "HorizontalLine", "HorizontalLine"],precision: 2,editable: {period: {defaultValue: 5,currentValue: 5,minValue: 2,maxValue: 400},overBought: {defaultValue: 100,currentValue: 100,minValue: 1,maxValue: 400},overSold: {defaultValue: -100,currentValue: -100,minValue: -200,maxValue: 400},styles: {CCI: {color: "#e34e43",lineWidth: 1},Overbought: {color: "#666666",lineWidth: 1},Oversold: {color: "#666666",lineWidth: 1}}}},constructor: va};
        z.ccurve = {params: {code: "ccurve",name: "Coppock Curve",
                type: "bottom",category: "oscillators",price: "close",colors: ["#e34e43"],names: ["Coppock Curve Main", null],chartType: ["SimpleLine", "HorizontalLine"],precision: 4,editable: {shortRocPeriod: {defaultValue: 11,currentValue: 11,minValue: 1,maxValue: 130},longRocPeriod: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 130},wmaPeriod: {defaultValue: 10,currentValue: 10,minValue: 1,maxValue: 130},styles: {"Coppock Curve Main": {color: "#e34e43",lineWidth: 1},"Horizontal line": {color: "#666666",lineWidth: 1}}}},constructor: wa};
        z.cqstick = {params: {code: "cqstick",name: "Chande's QStick",type: "bottom",category: "oscillators",price: "close",colors: [["#1ba767", "#e24439"]],names: ["Chande's QStick Main"],chartType: ["Oscillator"],precision: 4,editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},styles: {"Value Up": {color: "#1ba767"},"Value Down": {color: "#e24439"}}}},constructor: xa};
        z.demarker = {params: {code: "demarker",name: "DeMarker",type: "bottom",category: "oscillators",price: "close",offset: 0,names: ["DeMarker"],chartType: ["SimpleLine"],
                precision: 3,editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},styles: {DeMarker: {color: "#e34e43",lineWidth: 1}}}},constructor: ya};
        z.dpo = {params: {code: "dpo",name: "Detrended Price Osc",type: "bottom",category: "oscillators",period: 14,price: "close",colors: ["#e34e43"],names: ["DPO"],chartType: ["SimpleLine"],precision: 4,editable: {period: {defaultValue: 21,currentValue: 21,minValue: 1,maxValue: 400},styles: {DPO: {color: "#e34e43",lineWidth: 1}}}},constructor: Aa};
        z.dmi = {params: {code: "dmi",name: "Directional Movement Index",
                type: "bottom",category: "trend",price: "close",colors: ["#e34e43", "#e8e231", "#79bfd7"],names: ["DMI", "DI+", "DI-"],chartType: ["SimpleLine", "SimpleLine", "SimpleLine"],precision: 2,editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},styles: {DMI: {color: "#e34e43",lineWidth: 1},"DI+": {color: "#e8e231",lineWidth: 1},"DI-": {color: "#79bfd7",lineWidth: 1}}}},constructor: za};
        z.elder = {params: {code: "elder",name: "Elder Ray",type: "bottom",category: "oscillators",price: "close",offset: 0,names: ["Bull power",
                    "Bear power"],chartType: ["SimpleLine", "SimpleLine"],precision: 4,editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},styles: {"Bull power": {color: "#327bb4",lineWidth: 1},"Bear power": {color: "#e8e231",lineWidth: 1}}}},constructor: Ba};
        z.ema = {params: {code: "ema",name: "EMA",type: "upper",category: "most-popular trend",price: "close",offset: 0,names: ["EMA"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},price: {defaultValue: "close",currentValue: "close",
                        possibleValues: ["open", "close", "high", "low"]},styles: {EMA: {color: "#327bb4",lineWidth: 1}}}},constructor: Ca};
        z.emae = {params: {code: "emae",name: "Ema Envelope",type: "upper",category: "volatility",offset: 0,names: ["Upper band", "Lower band"],chartType: ["SimpleLine", "SimpleLine"],editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},price: {defaultValue: "close",currentValue: "close",possibleValues: ["open", "close", "high", "low"]},deviation: {defaultValue: 2,currentValue: 2,minValue: 0,maxValue: 10},
                    styles: {"Upper band": {color: "#327bb4",lineWidth: 1},"Lower band": {color: "#327bb4",lineWidth: 1}}}},constructor: Da};
        z.fso = {params: {code: "fso",name: "Fast Stochastic Oscillator",type: "bottom",category: "oscillators",price: "close",offset: 10,slowKPeriod: 3,names: ["Fast K", "Fast D", "Overbought", "Oversold"],chartType: ["SimpleLine", "SimpleLine", "HorizontalLine", "HorizontalLine"],precision: 2,editable: {Dperiod: {defaultValue: 3,currentValue: 3,minValue: 1,maxValue: 200},Kperiod: {defaultValue: 15,currentValue: 15,minValue: 1,
                        maxValue: 200},overBought: {defaultValue: 80,currentValue: 80,minValue: 1,maxValue: 200},overSold: {defaultValue: 20,currentValue: 20,minValue: 1,maxValue: 200},styles: {"Fast K": {color: "#79bfd7",lineWidth: 1},"Fast D": {color: "#e34e43",lineWidth: 1},Overbought: {color: "#666666",lineWidth: 1},Oversold: {color: "#666666",lineWidth: 1}}}},constructor: Ea};
        z.fractals = {params: {code: "fractals",name: "Fractals",type: "upper",category: "other",price: "close",names: ["Fractals"],chartType: ["Dots"],editable: {period: {defaultValue: 5,
                        currentValue: 5,minValue: 3,maxValue: 400},styles: {Fractals: {color: "#c7c11e",lineWidth: 1}}}},constructor: ia};
        z.gat = {params: {code: "gat",name: "Gator Oscillator",type: "bottom",category: "oscillators",period: 10,price: "close",price1: "high",price2: "low",names: ["H1", "H2", null],chartType: ["Oscillator", "Oscillator", "HorizontalLine"],precision: 4,editable: {jawPeriod: {defaultValue: 13,currentValue: 13,minValue: 1,maxValue: 400},jawShift: {defaultValue: 8,currentValue: 8,minValue: 1,maxValue: 400},teethPeriod: {defaultValue: 8,
                        currentValue: 8,minValue: 1,maxValue: 400},teethShift: {defaultValue: 5,currentValue: 5,minValue: 1,maxValue: 400},lipsPeriod: {defaultValue: 5,currentValue: 5,minValue: 1,maxValue: 400},lipsShift: {defaultValue: 3,currentValue: 3,minValue: 1,maxValue: 400},styles: {"Value Up": {color: "#1ba767"},"Value Down": {color: "#e24439"},"Horizontal line": {color: "#666666",lineWidth: 1}}}},constructor: Fa};
        z.ichi = {params: {code: "ichi",name: "Ichimoku Kinko Hyo",type: "upper",category: "other",price: "close",names: ["Tenkan-Sen", "Kijun-Sen",
                    "Chikou Span", "Senkou Span A", "Senkou Span B"],chartType: "SimpleLine SimpleLine SimpleLine Cloud SimpleLine SimpleLine".split(" "),editable: {tsPeriod: {defaultValue: 9,currentValue: 9,minValue: 1,maxValue: 400},ksPeriod: {defaultValue: 26,currentValue: 26,minValue: 1,maxValue: 400},ssBPeriod: {defaultValue: 52,currentValue: 52,minValue: 1,maxValue: 400},styles: {"Tenkan-Sen": {color: "#6d3880",lineWidth: 1},"Kijun-Sen": {color: "#979310",lineWidth: 1},"Chikou Span": {color: "#50b065",lineWidth: 1},"Senkou Span A": {color: "#be4138",
                            lineWidth: 1},"Senkou Span B": {color: "#66a0b4",lineWidth: 1}}}},constructor: Ga};
        z.kama = {params: {code: "kama",name: "Kaufman's Adaptive MA",type: "upper",category: "trend",price: "close",names: ["Kaufman's Adaptive MA Main"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 20,currentValue: 20,minValue: 3,maxValue: 400},slowSmoothing: {defaultValue: 30,currentValue: 30,minValue: 1,maxValue: 400},fastSmoothing: {defaultValue: 2,currentValue: 2,minValue: 1,maxValue: 400},styles: {"Kaufman's Adaptive MA Main": {color: "#79bfd7",
                            lineWidth: 1}}}},constructor: Ha};
        z.ker = {params: {code: "ker",name: "Kaufman's Efficiency Ratio",type: "bottom",category: "oscillators",period: 20,line1: 30,line2: -30,colors: ["#e34e43", "#666666", "#666666"],names: ["Kaufman's Efficiency Ratio Main", "Kaufman's Efficiency Ratio Over", "Kaufman's Efficiency Ratio Under"],chartType: ["SimpleLine", "HorizontalLine", "HorizontalLine"],precision: 3,editable: {period: {defaultValue: 20,currentValue: 20,minValue: 3,maxValue: 400},price: {defaultValue: "close",currentValue: "close",
                        possibleValues: ["open", "close", "high", "low"]},styles: {"Kaufman's Efficiency Ratio Main": {color: "#e34e43",lineWidth: 1},"Kaufman's Efficiency Ratio Over": {color: "#666666",lineWidth: 1},"Kaufman's Efficiency Ratio Under": {color: "#666666",lineWidth: 1}}}},constructor: Ia};
        z.lrf = {params: {code: "lrf",name: "Linear Regression Forecast",type: "upper",category: "volatility",price: "close",names: ["Forecast"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 15,currentValue: 15,minValue: 2,maxValue: 400},styles: {Forecast: {color: "#f6cf85",
                            lineWidth: 1}}}},constructor: Ja};
        z.lri = {params: {code: "lri",name: "Linear Regression Intercept",type: "upper",category: "volatility",price: "close",names: ["Intercept"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 15,currentValue: 15,minValue: 2,maxValue: 400},styles: {Intercept: {color: "#ae64ca",lineWidth: 1}}}},constructor: Ka};
        z.lrr = {params: {code: "lrr",name: "Linear Regression RSquared",type: "bottom",category: "oscillators",price: "close",names: ["RSquared"],chartType: ["SimpleLine"],precision: 2,editable: {period: {defaultValue: 15,
                        currentValue: 15,minValue: 8,maxValue: 200},styles: {RSquared: {color: "#fffb7a",lineWidth: 1}}}},constructor: La};
        z.lrs = {params: {code: "lrs",name: "Linear Regression Slope",type: "bottom",category: "oscillators",price: "close",names: ["Slope"],chartType: ["SimpleLine"],precision: 5,editable: {period: {defaultValue: 15,currentValue: 15,minValue: 2,maxValue: 400},styles: {Slope: {color: "#66a0b4",lineWidth: 1}}}},constructor: Ma};
        z.macd = {params: {code: "macd",name: "MACD",type: "bottom",category: "most-popular oscillators",names: ["MACD Hist",
                    "MACD Signal", "MACD Main"],chartType: ["Oscillator", "SimpleLine", "SimpleLine"],precision: 5,editable: {shortTerm: {defaultValue: 12,currentValue: 12,minValue: 2,maxValue: 130},longTerm: {defaultValue: 26,currentValue: 26,minValue: 3,maxValue: 130},macdLength: {defaultValue: 9,currentValue: 9,minValue: 1,maxValue: 130},styles: {"MACD Signal": {color: "#e8e231",lineWidth: 1},"MACD Main": {color: "#79bfd7",lineWidth: 1},"Value Up": {color: "#1ba767"},"Value Down": {color: "#e24439"}}}},constructor: Na};
        z.mom = {params: {code: "mom",
                name: "Momentum",type: "bottom",category: "oscillators",price: "close",names: ["Momentum"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 12,currentValue: 12,minValue: 1,maxValue: 100},styles: {Momentum: {color: "#e34e43",lineWidth: 1}}},precision: 2},constructor: Oa};
        z.sar = {params: {code: "sar",name: "Parabolic SAR",type: "upper",category: "trend",price: "close",priceHigh: "high",priceLow: "low",names: ["SAR"],chartType: ["Dots"],editable: {step: {defaultValue: 0.02,currentValue: 0.02,minValue: 0.02,maxValue: 10},maximum: {defaultValue: 0.2,
                        currentValue: 0.2,minValue: 0,maxValue: 20},styles: {SAR: {color: "#79bfd7"}}}},constructor: Ta};
        z.prc = {params: {code: "prc",name: "Polynomial Regression Channels",type: "upper",category: "volatility",price: "close",names: ["PRC", "SQH", "SQL", "SQH2", "SQL2"],chartType: ["SimpleLine", "SimpleLine", "SimpleLine", "SimpleLine", "SimpleLine"],editable: {degree: {defaultValue: 3,currentValue: 3,minValue: 1,maxValue: 4},period: {defaultValue: 120,currentValue: 120,minValue: 8,maxValue: 400},sdMultiplier1: {defaultValue: 1.62,currentValue: 1.62,
                        minValue: 0.1,maxValue: 4},sdMultiplier2: {defaultValue: 2,currentValue: 2,minValue: 0.1,maxValue: 4},styles: {PRC: {color: "#c7c11e",lineWidth: 1},SQH: {color: "#50b065",lineWidth: 1},SQL: {color: "#50b065",lineWidth: 1},SQH2: {color: "#ae64ca",lineWidth: 1},SQL2: {color: "#ae64ca",lineWidth: 1}}}},constructor: Pa};
        z.roc = {params: {code: "roc",name: "Rate Of Change",type: "bottom",category: "oscillators",price: "close",names: ["ROC"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 12,currentValue: 12,minValue: 1,maxValue: 400},
                    styles: {ROC: {color: "#e34e43",lineWidth: 1}}},precision: 2},constructor: Qa};
        z.rsi = {params: {code: "rsi",name: "Relative Strength Index",type: "bottom",category: "most-popular oscillators",price: "close",names: ["RSI", "Overbought", "Oversold"],chartType: ["SimpleLine", "HorizontalLine", "HorizontalLine"],editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},overBought: {defaultValue: 70,currentValue: 70,minValue: 0,maxValue: 100},overSold: {defaultValue: 30,currentValue: 30,minValue: 0,maxValue: 100},
                    price: {defaultValue: "close",currentValue: "close",possibleValues: ["open", "close", "high", "low"]},styles: {RSI: {color: "#e34e43",lineWidth: 1},Overbought: {color: "#666666",lineWidth: 1},Oversold: {color: "#666666",lineWidth: 1}}},precision: 2},constructor: Ra};
        z.rvi = {params: {code: "rvi",name: "Relative Vigor Index",type: "bottom",category: "oscillators",offset: 0,price: "close",names: ["RVI SMA", "RVI Signal"],chartType: ["SimpleLine", "SimpleLine"],editable: {period: {defaultValue: 10,currentValue: 10,minValue: 1,maxValue: 400},
                    styles: {"RVI SMA": {color: "#3e8d4f",lineWidth: 1},"RVI Signal": {color: "#e34e43",lineWidth: 1}}},precision: 3},constructor: Sa};
        z.sso = {params: {code: "sso",name: "Slow Stochastic Oscillator",type: "bottom",category: "oscillators",price: "close",names: ["Slow K", "Slow D", "Overbought", "Oversold"],chartType: ["SimpleLine", "SimpleLine", "HorizontalLine", "HorizontalLine"],precision: 2,editable: {slowKPeriod: {defaultValue: 3,currentValue: 3,minValue: 1,maxValue: 130},Dperiod: {defaultValue: 3,currentValue: 3,minValue: 1,maxValue: 130},
                    Kperiod: {defaultValue: 15,currentValue: 15,minValue: 1,maxValue: 130},overSold: {defaultValue: 20,currentValue: 20,minValue: 0,maxValue: 100},overBought: {defaultValue: 80,currentValue: 80,minValue: 0,maxValue: 100},styles: {"Slow K": {color: "#79bfd7",lineWidth: 1},"Slow D": {color: "#e34e43",lineWidth: 1},Overbought: {color: "#666666",lineWidth: 1},Oversold: {color: "#666666",lineWidth: 1}}}},constructor: Xa};
        z.sma = {params: {code: "sma",name: "Simple Moving Average",type: "upper",category: "most-popular trend",offset: 0,names: ["SMA"],
                chartType: ["SimpleLine"],editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},price: {defaultValue: "close",currentValue: "close",possibleValues: ["open", "close", "high", "low"]},styles: {SMA: {color: "#79bfd7",lineWidth: 1}}}},constructor: Va};
        z.smae = {params: {code: "smae",name: "Sma Envelope",type: "upper",category: "volatility",priceUpper: "close",priceBottom: "close",offset: 0,names: ["Upper band", "Lower band"],chartType: ["SimpleLine", "SimpleLine"],editable: {period: {defaultValue: 14,currentValue: 14,
                        minValue: 1,maxValue: 400},price: {defaultValue: "close",currentValue: "close",possibleValues: ["open", "close", "high", "low"]},deviation: {defaultValue: 2,currentValue: 2,minValue: 0,maxValue: 10},styles: {"Upper band": {color: "#79bfd7",lineWidth: 1},"Lower band": {color: "#79bfd7",lineWidth: 1}}}},constructor: Wa};
        z.sd = {params: {code: "sd",name: "Standard Deviation",type: "bottom",category: "trend",price: "close",names: ["SD"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 10,currentValue: 10,minValue: 10,maxValue: 400},
                    styles: {SD: {color: "#327bb4",lineWidth: 1}}},precision: 4},constructor: Ua};
        z.tma = {params: {code: "tma",name: "Tiangular Moving Average",type: "upper",category: "trend",price: "close",shift: 0,names: ["Triangular Moving Average Main"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},price: {defaultValue: "close",currentValue: "close",possibleValues: ["open", "close", "high", "low"]},styles: {"Triangular Moving Average Main": {color: "#79bfd7",lineWidth: 1}}}},constructor: Ya};
        z.wma = {params: {code: "wma",name: "Weighted Moving Average",type: "upper",category: "trend",shift: 0,names: ["Weighted Moving Average Main"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 14,currentValue: 14,minValue: 1,maxValue: 400},price: {defaultValue: "close",currentValue: "close",possibleValues: ["open", "close", "high", "low"]},styles: {"Weighted Moving Average Main": {color: "#79bfd7",lineWidth: 1}}}},constructor: Za};
        z.wpr = {params: {code: "wpr",name: "Williams Percent Range",type: "bottom",category: "oscillators",
                price: "close",overBought: -30,overSold: -80,names: ["WPR", "Overbought", "Oversold"],chartType: ["SimpleLine", "HorizontalLine", "HorizontalLine"],editable: {period: {defaultValue: 5,currentValue: 5,minValue: 1,maxValue: 400},styles: {WPR: {color: "#e34e43",lineWidth: 1},Overbought: {color: "#666666",lineWidth: 1},Oversold: {color: "#666666",lineWidth: 1}}},precision: 2},constructor: $a};
        z.ws = {params: {code: "ws",name: "Wilders Smoothing",type: "upper",category: "trend",price: "close",names: ["WS"],chartType: ["SimpleLine"],editable: {period: {defaultValue: 14,
                        currentValue: 14,minValue: 1,maxValue: 400},styles: {WS: {color: "#ad9058",lineWidth: 1}}}},constructor: ab};
        A.prototype = {constructor: A,bindEvents: function() {
                d.addEvent(this.container, "mousedown", this._drawingMouseDownHandler);
                d.addEvent(this.container, "touchstart", this._drawingMouseDownHandler);
                d.addEvent(this.container, "mouseover", this._mouseOverDrawingsHandler);
                d.addEvent(this.container, "contextmenu", this._contextmenu)
            },updateValues: function() {
                this.minX = this.chart.options.marginLeft;
                this.maxX = this.chart.options.width -
                this.chart.options.marginRight;
                this.minY = this.chart.options.marginTop;
                this.maxY = this.chart.options.height - this.chart.options.marginBottom;
                this.heightY = this.chart.options.axisY.heightY;
                this.minValue = this.chart.options.axisY.min;
                this.maxValue = this.chart.options.axisY.max;
                this.ratio = +this.chart.options.axisY.ratio
            },createLine: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "line");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createRect: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg",
                "rect");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createText: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "text");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createCircle: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "circle");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createForeignObject: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },
            createClipPath: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createPath: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "path");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createG: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "g");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createEllipse: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg",
                "ellipse");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createTspan: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "tspan");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },createImage: function(a, b) {
                var c = d.createElementNS("http://www.w3.org/2000/svg", "image");
                a && a.appendChild(c);
                b && d.setAttributes(c, b);
                return c
            },snap: function() {
                this.snapped = !0;
                this.mainChart.options.events.drawingChanged.call(this.mainChart, this)
            },updateStyles: function(a) {
                this.params = l.extend(a,
                this.params);
                this.changeStyles(a);
                this.mainChart.options.events.drawingChanged.call(this.mainChart, this)
            },handleContextmenu: function(a) {
                this.mainChart.options.events.drawingEdit.call(this.mainChart, this);
                a.stopPropagation();
                a.preventDefault()
            },handleDrawingMouseDownEvent: function(a) {
                "touchstart" === a.type ? (this.chart.svg.mouseXposition = a.touches[0].pageX - d.offset(this.chart.svg.$svg).left, this.chart.svg.mouseXdragPos = a.touches[0].pageX - d.offset(this.chart.svg.$svg).left, this.chart.svg.mouseYposition =
                a.touches[0].pageY - d.offset(this.chart.svg.$svg).top, a.preventDefault()) : "mousedown" === a.type && (this.chart.svg.mouseXposition = void 0 !== a.layerX ? a.layerX : a.offsetX, this.chart.svg.mouseXdragPos = void 0 !== a.layerX ? a.layerX : a.offsetX, this.chart.svg.mouseYposition = void 0 !== a.layerY ? a.layerY : a.offsetY);
                this !== w && q.hideLastDrawing();
                this instanceof B ? w = l.findPosition(this.mainChart, a.target) : (w = this, d.addEvent(a.target.ownerSVGElement, "mousedown" === a.type ? "mousemove" : "touchmove", this._drawingMoveHandler));
                this.target = a.target;
                w.show(a.target);
                this.mainChart.svg.drawingSelected = !0;
                this.chart.crossHair.hideCrossHairLines();
                this.chart.tooltip.hideTooltip();
                a.stopPropagation();
                a.preventDefault()
            },handleDrawingMoveEvent: function(a) {
                var b, c;
                if (l.mouseMoveEnable(this.chart))
                    return !1;
                "touchmove" === a.type ? (b = a.touches[0].pageX - d.offset(this.chart.svg.$svg).left, c = a.touches[0].pageY - d.offset(this.chart.svg.$svg).top) : "mousemove" === a.type && (b = void 0 !== a.layerX ? a.layerX : a.offsetX, c = void 0 !== a.layerY ? a.layerY :
                a.offsetY);
                if (b !== this.chart.svg.mouseXposition || c !== this.chart.svg.mouseYposition)
                    this.mainChart.svg.moveDrawing = !0, d.addClass(this.chart.$chartLayer, "moving"), d.addSvgClass(this.container, "move-drawing"), this.snapped = !1, this.move(b, c);
                a.stopPropagation();
                a.preventDefault()
            },handleMouseOverDrawingEvent: function(a) {
                var b = this instanceof L ? a.target.parentNode : this.container;
                this.mainChart.svg.moveDrawing || this.show(a.target);
                d.removeEvent(b, "mouseover", this._mouseOverDrawingsHandler);
                d.addEvent(b,
                "mouseout", this._mouseOutDrawingHandler)
            },handleMouseOutDrawingEvent: function(a) {
                a = this instanceof L ? a.target.parentNode : this.container;
                this.mainChart.svg.moveDrawing || this.hide();
                d.removeEvent(a, "mouseout", this._mouseOutDrawingHandler);
                d.addEvent(a, "mouseover", this._mouseOverDrawingsHandler)
            },show: function(a) {
                this.target = a;
                d.addSvgClass(a, "active")
            },hide: function() {
                d.removeSvgClass(this.target, "active")
            },unbindEvents: function() {
                d.removeEvent(this.chart.svg.$svg, "mousemove", this._drawingMoveHandler);
                d.removeEvent(this.chart.svg.$svg, "touchmove", this._drawingMoveHandler);
                this.container && (d.removeEvent(this.container, "mousedown", this._drawingMouseDownHandler), d.removeEvent(this.container, "touchstart", this._drawingMouseDownHandler), d.removeEvent(this.container, "mouseover", this._mouseOverDrawingsHandler), d.removeEvent(this.container, "mouseout", this._mouseOutDrawingHandler), d.removeEvent(this.container, "contextmenu", this._contextmenu));
                this._drawingMoveHandler = this._drawingMouseDownHandler = this._contextmenu =
                this._mouseOverDrawingsHandler = this._mouseOutDrawingHandler = null
            },destroy: function() {
                var a = this;
                this.unbindEvents();
                this.container && d.empty(this.container, !0);
                this.extensionLines && this.extensionLines.forEach(function(b) {
                    a.destroyExtensionLine(b)
                });
                this.snapped = this.params = this.minX = this.maxX = this.minY = this.maxY = this.extensionLines = this.heightY = this.minValue = this.maxValue = this.options = this.target = this.ratio = this.drawing = this.container = this.initialised = null;
                this.coeff && (this.coeff = null);
                this.chart.drawings =
                this.chart.drawings.filter(function(b) {
                    return b !== a
                });
                w = null;
                this.chart.options.events.drawingDeleted.call(this.mainChart, this);
                this.chart = this.mainChart = null
            }};
        l.inherit(T, A);
        T.prototype.render = function() {
            var a = this.params.editable.styles[this.params.name];
            this.container = this.createG(this.chart.svg.$svgGdrawing, {"class": this.params.code});
            this.labelContainer = this.createG(this.chart.svg.$svgGLines, {"class": this.params.code,transform: "translate(" + this.maxX + "," + this.lineYPosition + ")"});
            this.drawing.textRect =
            this.createRect(this.labelContainer, {"class": "label-rect",x: 1,y: -10,width: this.chart.options.marginRight - 1,height: 20,"shape-rendering": "inherit",fill: a.color,"pointer-events": "none",rx: "2",ry: "2"});
            this.drawing.text = this.createText(this.labelContainer, {"class": "label_text",x: 25,y: 0,dy: 4});
            this.drawing.text.textContent = this.params.price;
            this.mainChart.options.textColors[a.color] && (this.drawing.text.style.fill = this.mainChart.options.textColors[a.color]);
            this.drawing.line = this.createLine(this.container,
            {x1: this.minX,y1: this.lineYPosition,x2: this.maxX,y2: this.lineYPosition,"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color,"pointer-events": "none","shape-rendering": "crispEdges"});
            this.drawing.hoverLine = this.createLine(this.container, {"class": "hover-line cursor-ns-resize",x1: this.minX,y1: this.lineYPosition,x2: this.maxX,y2: this.lineYPosition,"stroke-width": "13"});
            this.drawing.centerRect = this.createRect(this.container, {"class": "center-rect",x: (this.maxX + this.minX) / 2 - 4.5,y: this.lineYPosition -
                4,width: 8,height: 8,"stroke-width": "1","pointer-events": "none"})
        };
        T.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            d.setAttributes(this.drawing.line, {x1: this.minX,y1: this.lineYPosition,x2: this.maxX,y2: this.lineYPosition});
            d.setAttributes(this.drawing.hoverLine, {x1: this.minX,y1: this.lineYPosition,x2: this.maxX,y2: this.lineYPosition});
            d.setAttributes(this.drawing.centerRect, {x: (this.maxX + this.minX) / 2 - 4.5,y: this.lineYPosition - 4});
            d.setAttributes(this.labelContainer, {transform: "translate( " +
                this.maxX + ", " + this.lineYPosition + ")"});
            this.drawing.text.textContent = this.params.price
        };
        T.prototype.changeStyles = function(a) {
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.textRect, {fill: a.color});
            d.setAttributes(this.drawing.line, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color});
            this.mainChart.options.textColors[a.color] && (this.drawing.text.style.fill = this.mainChart.options.textColors[a.color])
        };
        T.prototype.update = function() {
            this.updateValues();
            this.lineYPosition =
            (+this.minValue + (this.heightY + this.minY) / this.ratio - this.params.price) * this.ratio + 0.5 | 0;
            this.params.price < this.minValue || this.params.price > this.maxValue ? (d.setAttributes(this.container, {display: "none"}), d.setAttributes(this.labelContainer, {display: "none"})) : (d.setAttributes(this.container, {display: "inline"}), d.setAttributes(this.labelContainer, {display: "inline"}), this.updateSvgCoordinates())
        };
        T.prototype.move = function(a, b) {
            this.updateValues();
            if (b < this.maxY && b > this.minY) {
                this.lineYPosition = b;
                var c =
                q.getMousePositionCandleInfo(a, b, this.mainChart, this.chart.options);
                this.params.price = (+c.price).toFixed(this.chart.options.precision);
                this.updateSvgCoordinates()
            }
        };
        T.prototype.snap = function() {
            this.updateSvgCoordinates();
            A.prototype.snap.call(this)
        };
        T.prototype.show = function(a) {
            T.superclass.show.call(this, a || this.drawing.hoverLine);
            d.setAttributes(this.drawing.centerRect, {visibility: "visible"})
        };
        T.prototype.hide = function() {
            T.superclass.hide.call(this);
            this !== w && d.setAttributes(this.drawing.centerRect,
            {visibility: "hidden"})
        };
        T.prototype.parse = function() {
            this.snapped = !0;
            w = null;
            this.update();
            this.hide();
            return this
        };
        T.prototype.destroy = function() {
            T.superclass.destroy.call(this);
            d.empty(this.labelContainer, !0);
            this.labelContainer = this.lineYPosition = null
        };
        l.inherit(L, A);
        L.prototype.render = function() {
            var a = this.mainChart.indicators, b = a.length, c;
            c = this.params.editable.styles[this.params.name];
            this.container = this.createG(this.chart.svg.$svgGdrawing, {"class": this.params.code});
            this.labelContainer = this.createG(this.chart.svg.$svgGLines,
            {"class": this.params.code});
            this.drawing.textRect = this.createRect(this.labelContainer, {"class": "label-rect",x: -50,y: 0,width: 100,height: 20,"shape-rendering": "inherit",fill: c.color,"pointer-events": "none",ry: "2",rx: "2"});
            this.drawing.text = this.createText(this.labelContainer, {"class": "label_text",x: 0,y: 9.1,dy: 5});
            this.drawing.text.textContent = l.formatCrossHairDate(this.params.timestamp, this.mainChart.options.period);
            this.mainChart.options.textColors[c.color] && (this.drawing.text.style.fill = this.mainChart.options.textColors[c.color]);
            this.drawing.line = this.createLine(this.container, {"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,"pointer-events": "none","shape-rendering": "crispEdges"});
            this.drawing.hoverLine = this.createLine(this.container, {"class": "hover-line cursor-ew-resize","stroke-width": "13"});
            this.drawing.centerRect = this.createRect(this.container, {"class": "center-rect",width: 8,height: 8,"stroke-width": "1","pointer-events": "none",visibility: "visible"});
            for (c = 0; c < b; c++)
                a[c].isBottom() && this.addExtensionLine(a[c]);
            this.updateSvgCoordinates()
        };
        L.prototype.addExtensionLine = function(a) {
            var b = {};
            b.chart = a;
            b.drawing = {};
            b.container = this.createG(a.svg.$svgGdrawing, {"class": this.params.code});
            b.drawing.line = this.createLine(b.container, {"stroke-width": this.drawing.line.getAttribute("stroke-width"),"stroke-dasharray": this.drawing.line.getAttribute("stroke-dasharray"),stroke: this.drawing.line.getAttribute("stroke"),"pointer-events": "none","shape-rendering": "crispEdges"});
            b.drawing.hoverLine = this.createLine(b.container,
            {"class": "hover-line cursor-ew-resize","stroke-width": "13"});
            b.drawing.centerRect = this.createRect(b.container, {"class": "center-rect",width: 8,height: 8,"stroke-width": "1","pointer-events": "none",visibility: "visible"});
            this !== w && d.setAttributes(b.drawing.centerRect, {visibility: "hidden"});
            d.addEvent(b.drawing.hoverLine, "mousedown", this._drawingMouseDownHandler);
            d.addEvent(b.drawing.hoverLine, "touchstart", this._drawingMouseDownHandler);
            d.addEvent(b.drawing.hoverLine, "mouseover", this._mouseOverDrawingsHandler);
            d.addEvent(b.container, "contextmenu", this._contextmenu);
            this.extensionLines.push(b)
        };
        L.prototype.removeExtensionLine = function(a) {
            var b;
            for (b = 0; b < this.extensionLines.length; b++)
                this.extensionLines[b].chart === a && (this.destroyExtensionLine(this.extensionLines[b]), this.extensionLines.splice(this.extensionLines.indexOf(this.extensionLines[b]), 1))
        };
        L.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            var a = this.xPosition, b, c = this.extensionLines.length;
            d.setAttributes(this.drawing.line, {x1: a,
                y1: this.minY + 1,x2: a,y2: this.maxY});
            d.setAttributes(this.drawing.hoverLine, {x1: a,y1: this.minY + 1,x2: a,y2: this.maxY});
            d.setAttributes(this.drawing.centerRect, {x: a - 4.5,y: (this.maxY + this.minY) / 2 - 3.5});
            if (0 < c)
                for (b = 0; b < c; b++)
                    d.setAttributes(this.extensionLines[b].drawing.line, {x1: a,y1: this.extensionLines[b].chart.options.marginTop + 1,x2: a,y2: this.extensionLines[b].chart.options.height - this.extensionLines[b].chart.options.marginBottom}), d.setAttributes(this.extensionLines[b].drawing.hoverLine, {x1: a,y1: this.extensionLines[b].chart.options.marginTop +
                        1,x2: a,y2: this.extensionLines[b].chart.options.height - this.extensionLines[b].chart.options.marginBottom}), d.setAttributes(this.extensionLines[b].drawing.centerRect, {x: a - 4,y: (this.extensionLines[b].chart.options.height - this.extensionLines[b].chart.options.marginBottom + this.extensionLines[b].chart.options.marginTop) / 2 - 3.5});
            a <= this.minX + 50 && (a = this.minX + 50);
            d.setAttributes(this.labelContainer, {transform: "translate(" + a + "," + (this.maxY + 1) + ")"})
        };
        L.prototype.changeStyles = function(a) {
            a = this.params.editable.styles[a.name];
            var b = this;
            d.setAttributes(this.drawing.textRect, {fill: a.color});
            d.setAttributes(this.drawing.line, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color});
            this.mainChart.options.textColors[a.color] && (this.drawing.text.style.fill = this.mainChart.options.textColors[a.color]);
            this.extensionLines.forEach(function(a) {
                d.setAttributes(a.drawing.line, {"stroke-width": b.drawing.line.getAttribute("stroke-width"),"stroke-dasharray": b.drawing.line.getAttribute("stroke-dasharray"),stroke: b.drawing.line.getAttribute("stroke")})
            })
        };
        L.prototype.update = function() {
            var a, b, c = this.extensionLines.length;
            this.updateValues();
            b = q.findCandleByTimestamp(this.params.timestamp, this.mainChart.options, this.params.period);
            a = (b.position - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            if (!0 === b.show && a > this.minX && a < this.maxX) {
                this.xPosition = a;
                d.setAttributes(this.container, {display: "inline"});
                d.setAttributes(this.labelContainer, {display: "inline"});
                for (a = 0; a < c; a++)
                    d.setAttributes(this.extensionLines[a].container,
                    {display: "inline"});
                this.drawing.text.textContent = l.formatCrossHairDate(b.timestamp, this.mainChart.options.period);
                this.updateSvgCoordinates()
            } else {
                d.setAttributes(this.container, {display: "none"});
                d.setAttributes(this.labelContainer, {display: "none"});
                for (a = 0; a < c; a++)
                    d.setAttributes(this.extensionLines[a].container, {display: "none"})
            }
        };
        L.prototype.move = function(a, b) {
            this.updateValues();
            var c, d;
            c = q.getMousePositionCandleInfo(a, b, this.mainChart, this.chart.options);
            d = (c.candleNumber - this.mainChart.currentOffset) *
            this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            d > this.minX && d < this.maxX && (this.xPosition = d, this.drawing.text.textContent = l.formatCrossHairDate(c.currentCandleTimestamp, this.mainChart.options.period), this.params.timestamp = c.currentCandleTimestamp, this.updateSvgCoordinates())
        };
        L.prototype.snap = function() {
            this.params.period = this.mainChart.options.period;
            this.updateSvgCoordinates();
            A.prototype.snap.call(this)
        };
        L.prototype.show = function(a) {
            L.superclass.show.call(this,
            a || this.drawing.hoverLine);
            var b = this.extensionLines.length;
            for (a = 0; a < b; a++)
                d.addSvgClass(this.extensionLines[a].drawing.hoverLine, "active");
            if (this === w) {
                for (a = 0; a < b; a++)
                    d.setAttributes(this.extensionLines[a].drawing.centerRect, {visibility: "visible"});
                d.setAttributes(this.drawing.centerRect, {visibility: "visible"})
            } else
                d.setAttributes(this.target.nextSibling, {visibility: "visible"})
        };
        L.prototype.hide = function() {
            L.superclass.hide.call(this);
            var a, b = this.extensionLines.length;
            for (a = 0; a < b; a++)
                d.removeSvgClass(this.extensionLines[a].drawing.hoverLine,
                "active");
            if (this !== w) {
                for (a = 0; a < b; a++)
                    d.setAttributes(this.extensionLines[a].drawing.centerRect, {visibility: "hidden"});
                d.setAttributes(this.drawing.centerRect, {visibility: "hidden"})
            }
        };
        L.prototype.parse = function() {
            this.snapped = !0;
            w = null;
            this.update();
            this.hide();
            return this
        };
        L.prototype.destroyExtensionLine = function(a) {
            a.chart.svg.$svgGdrawing && (d.empty(a.container), a.chart.svg.$svgGdrawing.removeChild(a.container), d.removeEvent(a.drawing.hoverLine, "mousedown", this._drawingMouseDownHandler), d.removeEvent(a.drawing.hoverLine,
            "touchstart", this._drawingMouseDownHandler), d.removeEvent(a.chart.svg.$svg, "mousemove", this._drawingMoveHandler), d.removeEvent(a.chart.svg.$svg, "touchmove", this._drawingMoveHandler), d.removeEvent(a.drawing.hoverLine, "mouseover", this._mouseOverDrawingsHandler), d.removeEvent(a.drawing.hoverLine, "mouseout", this._mouseOutDrawingHandler), a.chart = null)
        };
        L.prototype.destroy = function() {
            L.superclass.destroy.call(this);
            d.empty(this.labelContainer, !0);
            this.labelContainer = this.xPosition = null
        };
        l.inherit(G, A);
        G.prototype.render = function(a, b) {
            var c = this.params.editable.styles[this.params.name];
            this.container = this.createG(this.chart.svg.$svgGdrawing, {"class": this.params.code});
            this.drawing = {};
            this.drawing.line = this.createLine(this.container, {"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,"pointer-events": "none"});
            this.drawing.hoverLine = this.createLine(this.container, {"class": "hover-line cursor-move","stroke-width": 13,"stroke-linecap": "round"});
            this.drawing.startCircle = this.createCircle(this.container,
            {cx: a,cy: b,r: 4,"pointer-events": "none"});
            this.drawing.startHoverCircle = this.createCircle(this.container, {"class": "hover-circle",cx: a,cy: b,r: 8});
            this.drawing.endCircle = this.createCircle(this.container, {cx: a,cy: b,r: 4,"pointer-events": "none"});
            this.drawing.endHoverCircle = this.createCircle(this.container, {"class": "hover-circle",cx: a,cy: b,r: 8})
        };
        G.prototype.bindEvents = function() {
            G.superclass.bindEvents.call(this);
            this.chart instanceof D || (d.addEvent(this.drawing.startHoverCircle, "dblclick", this._mouseDoubleClick),
            d.addEvent(this.drawing.endHoverCircle, "dblclick", this._mouseDoubleClick))
        };
        G.prototype.handleMouseDoubleClickEvent = function(a) {
            this.updateValues();
            var b, c;
            b = q.getMousePositionCandleInfo(+a.target.getAttribute("cx"), +a.target.getAttribute("cy"), this.mainChart, this.chart.options);
            c = b.price.toFixed(this.chart.options.precision);
            b = b.currentCandle;
            void 0 !== b && (Math.abs(b.high - c) > Math.abs(b.low - c) ? c = b.low : c = b.high, c = (+this.minValue + (this.heightY + this.minY) / this.ratio - c) * this.ratio + 0.5 | 0, d.setAttributes(a.target,
            {cy: c}), this instanceof J || this.snap())
        };
        G.prototype.updateSvgCoordinates = function() {
            var a = +this.drawing.startHoverCircle.getAttribute("cx"), b = +this.drawing.endHoverCircle.getAttribute("cx"), c = +this.drawing.startHoverCircle.getAttribute("cy"), e = +this.drawing.endHoverCircle.getAttribute("cy");
            c === e && (c += 0.5, e += 0.5);
            d.setAttributes(this.drawing.startCircle, {cx: a,cy: c});
            d.setAttributes(this.drawing.endCircle, {cx: b,cy: e});
            d.setAttributes(this.drawing.line, {x1: a,y1: c,x2: b,y2: e});
            d.setAttributes(this.drawing.hoverLine,
            {x1: a,y1: c,x2: b,y2: e})
        };
        G.prototype.move = function(a, b) {
            var c = a - this.chart.svg.mouseXposition, e = b - this.chart.svg.mouseYposition;
            this.updateValues();
            q.isInVisibleArea.call(this, a, b) && (this.target === this.drawing.hoverLine ? (d.setAttributes(this.drawing.startHoverCircle, {cx: +this.drawing.startHoverCircle.getAttribute("cx") + c,cy: +this.drawing.startHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.endHoverCircle, {cx: +this.drawing.endHoverCircle.getAttribute("cx") + c,cy: +this.drawing.endHoverCircle.getAttribute("cy") +
                e})) : d.setAttributes(this.target, {cx: +this.target.getAttribute("cx") + c,cy: +this.target.getAttribute("cy") + e}), this.updateSvgCoordinates(), this.chart.svg.mouseXposition = a, this.chart.svg.mouseYposition = b)
        };
        G.prototype.snap = function() {
            this.updateValues();
            var a, b;
            a = q.getMousePositionCandleInfo(+this.drawing.startHoverCircle.getAttribute("cx"), +this.drawing.startHoverCircle.getAttribute("cy"), this.mainChart, this.chart.options);
            b = q.getMousePositionCandleInfo(+this.drawing.endHoverCircle.getAttribute("cx"),
            +this.drawing.endHoverCircle.getAttribute("cy"), this.mainChart, this.chart.options);
            this.params.startTimestamp = a.currentCandleTimestamp;
            this.params.endTimestamp = b.currentCandleTimestamp;
            this.params.period = this.mainChart.options.period;
            this.params.startPrice = (+a.price).toFixed(this.chart.options.precision);
            this.params.endPrice = (+b.price).toFixed(this.chart.options.precision);
            a = (a.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 +
            this.minX;
            b = (b.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            d.setAttributes(this.drawing.startHoverCircle, {cx: a});
            d.setAttributes(this.drawing.endHoverCircle, {cx: b});
            this.initialised || (this.initialised = !0);
            !(this instanceof J) && !(this instanceof M) && (this.updateSvgCoordinates(), A.prototype.snap.call(this))
        };
        G.prototype.snapdate = function() {
            var a, b, c;
            this.target === this.drawing.endHoverCircle ? (b = this.drawing.startHoverCircle,
            c = this.params.startTimestamp, a = this.params.startPrice) : this.target === this.drawing.startHoverCircle && (b = this.drawing.endHoverCircle, c = this.params.endTimestamp, a = this.params.endPrice);
            !this.initialised || void 0 === b ? this.updateSvgCoordinates() : (a = q.calculateCoordinates(this, c, a), d.setAttributes(b, {cx: a.X,cy: a.Y}), this instanceof J || this.updateSvgCoordinates())
        };
        G.prototype.changeStyles = function(a) {
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.line, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,
                stroke: a.color})
        };
        G.prototype.update = function() {
            if (this.snapped) {
                var a, b;
                a = q.calculateCoordinates(this, this.params.startTimestamp, this.params.startPrice);
                b = q.calculateCoordinates(this, this.params.endTimestamp, this.params.endPrice);
                d.setAttributes(this.drawing.startHoverCircle, {cx: a.X,cy: a.Y});
                d.setAttributes(this.drawing.endHoverCircle, {cx: b.X,cy: b.Y});
                !1 === a.show && !1 === b.show ? d.setAttributes(this.container, {display: "none"}) : d.setAttributes(this.container, {display: "inline"});
                this instanceof J || this.updateSvgCoordinates()
            } else
                this.snapdate()
        };
        G.prototype.show = function(a) {
            G.superclass.show.call(this, a || this.drawing.hoverLine);
            this === w && (d.setAttributes(this.drawing.endCircle, {visibility: "visible"}), d.setAttributes(this.drawing.startCircle, {visibility: "visible"}));
            this.target === this.drawing.startHoverCircle ? d.setAttributes(this.drawing.startCircle, {visibility: "visible"}) : this.target === this.drawing.endHoverCircle && d.setAttributes(this.drawing.endCircle, {visibility: "visible"})
        };
        G.prototype.hide = function() {
            G.superclass.hide.call(this);
            this !==
            w && (d.setAttributes(this.drawing.endCircle, {visibility: "hidden"}), d.setAttributes(this.drawing.startCircle, {visibility: "hidden"}))
        };
        G.prototype.parse = function() {
            this.initialised = this.snapped = !0;
            w = null;
            this.hide();
            this.update();
            return this
        };
        G.prototype.destroy = function() {
            this.chart instanceof D || (d.removeEvent(this.drawing.startHoverCircle, "dblclick", this._mouseDoubleClick), d.removeEvent(this.drawing.endHoverCircle, "dblclick", this._mouseDoubleClick));
            this._mouseDoubleClick = null;
            G.superclass.destroy.call(this)
        };
        l.inherit(aa, G);
        aa.prototype.render = function(a, b) {
            aa.superclass.render.call(this, a, b);
            var c = this.params.editable.styles[this.params.name];
            this.drawing.fibonacciArcs = q.seedFibonacci(this.container, this.coeff, "path", {"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,fill: "none","pointer-events": "none"})
        };
        aa.prototype.changeStyles = function(a) {
            aa.superclass.changeStyles.call(this, a);
            var b = this.coeff.length, c = this.params.editable.styles[a.name];
            for (a = 0; a < b; a++)
                d.setAttributes(this.drawing.fibonacciArcs[a],
                {"stroke-width": c.lineWidth,stroke: c.color,"stroke-dasharray": c.dashArray})
        };
        aa.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            aa.superclass.updateSvgCoordinates.call(this);
            var a = +this.drawing.line.getAttribute("x1"), b = +this.drawing.line.getAttribute("y1"), c = +this.drawing.line.getAttribute("x2"), e = +this.drawing.line.getAttribute("y2"), a = Math.sqrt(Math.abs((c - a) * (c - a) + (b - e) * (b - e))), k = 0, f, g;
            for (f = this.coeff.length; k < f; k++)
                g = a * this.coeff[k] * (b < e ? -1 : 1), d.setAttributes(this.drawing.fibonacciArcs[k],
                {d: "M " + (c - g) + "," + e + " a" + g + "," + g + " 0 1,1 " + 2 * g + ",0 "})
        };
        l.inherit(ma, aa);
        ma.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            G.prototype.updateSvgCoordinates.call(this);
            var a = +this.drawing.line.getAttribute("x1"), b = +this.drawing.line.getAttribute("y1"), c = +this.drawing.line.getAttribute("x2"), e = +this.drawing.line.getAttribute("y2"), a = Math.sqrt(Math.abs((c - a) * (c - a) + (b - e) * (b - e))), k = 0, f, g;
            for (f = this.coeff.length; k < f; k++)
                g = a * this.coeff[k] * (b < e ? -1 : 1), d.setAttributes(this.drawing.fibonacciArcs[k],
                {d: "M " + (c - g) + "," + e + " a" + g + " " + g + " ,0 1,1 " + g + "," + g + " a" + g + " " + g + " ,0 ,0 ,1 " + -g + " ," + -g})
        };
        l.inherit(ca, G);
        ca.prototype.render = function(a, b) {
            ca.superclass.render.call(this, a, b);
            var c = this.params.editable.styles[this.params.name];
            this.drawing.fibonacciLines = q.seedFibonacci(this.container, this.coeff, "line", {"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,"pointer-events": "none"});
            this.drawing.fibonacciLabels = q.seedFibonacci(this.container, this.coeff, "text", {fill: c.color,style: "font-size: 11px;",
                "pointer-events": "none"})
        };
        ca.prototype.changeStyles = function(a) {
            ca.superclass.changeStyles.call(this, a);
            a = this.params.editable.styles[a.name];
            var b = this.coeff.length, c;
            for (c = 0; c < b; c++)
                d.setAttributes(this.drawing.fibonacciLines[c], {"stroke-width": a.lineWidth,stroke: a.color,"stroke-dasharray": a.dashArray}), d.setAttributes(this.drawing.fibonacciLabels[c], {fill: a.color})
        };
        ca.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            ca.superclass.updateSvgCoordinates.call(this);
            var a = +this.drawing.line.getAttribute("x1"),
            b = +this.drawing.line.getAttribute("y1"), c = +this.drawing.line.getAttribute("x2"), e = +this.drawing.line.getAttribute("y2"), k = b > e ? this.minY : this.maxY, f, g = 0, h, l;
            b === e && e++;
            for (h = this.coeff.length; g < h; g++)
                f = b < e ? this.maxY : this.minY, l = e - (e - b) * this.coeff[g], f = a + (b - f) / (b - l) * (c - a), d.setAttributes(this.drawing.fibonacciLines[g], {x1: a,y1: b,x2: f,y2: k}), d.setAttributes(this.drawing.fibonacciLabels[g], {x: c,y: l + 5.5}), this.drawing.fibonacciLabels[g].textContent = (+this.minValue + (this.heightY - e + this.minY) / this.ratio).toFixed(this.chart.options.precision) +
                " (" + (100 * this.coeff[g]).toFixed(2) + "%)"
        };
        l.inherit(da, G);
        da.prototype.render = function(a, b) {
            da.superclass.render.call(this, a, b);
            var c = this.params.editable.styles[this.params.name];
            this.drawing.fibonacciLines = q.seedFibonacci(this.container, this.coeff, "line", {"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,"pointer-events": "none","shape-rendering": "crispEdges"});
            this.drawing.fibonacciLabels = q.seedFibonacci(this.container, this.coeff, "text", {fill: c.color,style: "font-size: 11px;",
                "pointer-events": "none"})
        };
        da.prototype.changeStyles = function(a) {
            da.superclass.changeStyles.call(this, a);
            a = this.params.editable.styles[a.name];
            var b = this.coeff.length, c;
            for (c = 0; c < b; c++)
                d.setAttributes(this.drawing.fibonacciLines[c], {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color}), d.setAttributes(this.drawing.fibonacciLabels[c], {fill: a.color})
        };
        da.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            da.superclass.updateSvgCoordinates.call(this);
            var a = +this.drawing.line.getAttribute("x1"),
            b = +this.drawing.line.getAttribute("y1"), c = +this.drawing.line.getAttribute("x2"), e = +this.drawing.line.getAttribute("y2"), k = a < c ? a : c, a = k + 2 * Math.abs(a - c), f, g;
            f = 0;
            for (g = this.coeff.length; f < g; f++)
                c = e - (e - b) * this.coeff[f], d.setAttributes(this.drawing.fibonacciLines[f], {x1: k,y1: c,x2: a,y2: c}), d.setAttributes(this.drawing.fibonacciLabels[f], {x: k,y: c - 1}), this.drawing.fibonacciLabels[f].textContent = (+this.minValue + (this.heightY - c + this.minY) / this.ratio).toFixed(this.chart.options.precision) + " (" + (100 * this.coeff[f]).toFixed(2) +
                "%)"
        };
        l.inherit(Y, G);
        Y.prototype.render = function(a, b) {
            var c = this.mainChart.indicators, d = c.length, k;
            k = this.params.editable.styles[this.params.name];
            Y.superclass.render.call(this, a, b);
            this.drawing.fibonacciLines = q.seedFibonacci(this.container, this.coeff, "line", {"stroke-width": k.lineWidth,"stroke-dasharray": k.dashArray,stroke: k.color,"pointer-events": "none","shape-rendering": "crispEdges"});
            this.drawing.fibonacciLabels = q.seedFibonacci(this.container, this.coeff, "text", {fill: k.color,style: "font-size: 11px;",
                "pointer-events": "none"});
            this.chart instanceof D && this.addExtensionLine(this.mainChart);
            for (k = 0; k < d; k++)
                c[k] !== this.chart && c[k].isBottom() && this.addExtensionLine(c[k]);
            this.updateSvgCoordinates()
        };
        Y.prototype.addExtensionLine = function(a) {
            var b = {};
            b.chart = a;
            b.drawing = {};
            b.container = this.createG(a.svg.$svgGdrawing, {"class": this.params.code});
            b.drawing.fibonacciLines = q.seedFibonacci(b.container, this.coeff, "line", {"stroke-width": this.drawing.line.getAttribute("stroke-width"),"stroke-dasharray": this.drawing.line.getAttribute("stroke-dasharray"),
                stroke: this.drawing.line.getAttribute("stroke"),"pointer-events": "none","shape-rendering": "crispEdges"});
            this.extensionLines.push(b)
        };
        Y.prototype.changeStyles = function(a) {
            Y.superclass.changeStyles.call(this, a);
            var b = this.coeff.length, c;
            a = this.params.editable.styles[a.name];
            var e = this;
            for (c = 0; c < b; c++)
                d.setAttributes(this.drawing.fibonacciLines[c], {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color}), d.setAttributes(this.drawing.fibonacciLabels[c], {fill: a.color});
            this.extensionLines.forEach(function(a) {
                for (c =
                0; c < b; c++)
                    d.setAttributes(a.drawing.fibonacciLines[c], {"stroke-width": e.drawing.line.getAttribute("stroke-width"),"stroke-dasharray": e.drawing.line.getAttribute("stroke-dasharray"),stroke: e.drawing.line.getAttribute("stroke")})
            })
        };
        Y.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            Y.superclass.updateSvgCoordinates.call(this);
            var a = +this.drawing.line.getAttribute("x1"), b = +this.drawing.line.getAttribute("x2"), c = +this.drawing.line.getAttribute("y2"), e, k, f = this.coeff.length, g = this;
            for (k =
            0; k < f; k++)
                e = a + (b - a) * this.coeff[k], d.setAttributes(this.drawing.fibonacciLines[k], {x1: e,y1: this.minY + 1,x2: e,y2: this.maxY}), d.setAttributes(this.drawing.fibonacciLabels[k], {x: e + 5.5,y: c + 0.5});
            this.extensionLines.forEach(function(c) {
                for (k = 0; k < f; k++)
                    e = a + (b - a) * g.coeff[k], d.setAttributes(c.drawing.fibonacciLines[k], {x1: e,y1: c.chart.options.marginTop + 1,x2: e,y2: c.chart.options.height - c.chart.options.marginBottom})
            })
        };
        Y.prototype.removeExtensionLine = function(a) {
            var b;
            for (b = 0; b < this.extensionLines.length; b++)
                this.extensionLines[b].chart ===
                a && (this.destroyExtensionLine(this.extensionLines[b]), this.extensionLines.splice(this.extensionLines.indexOf(this.extensionLines[b]), 1))
        };
        Y.prototype.destroyExtensionLine = function(a) {
            a.chart !== this.chart && a.chart.svg.$svgGdrawing && (d.empty(a.container), a.chart.svg.$svgGdrawing.removeChild(a.container), a.chart = null)
        };
        l.inherit(P, A);
        P.prototype.render = function(a, b) {
            this.startingPoint = {X: a,Y: b};
            var c = this.params.editable.styles[this.params.name];
            this.container = this.createG(this.chart.svg.$svgGdrawing,
            {"class": this.params.code});
            this.drawing = {};
            this.drawing.rect = this.createRect(this.container, {x: a,y: b,width: 1,height: 1,"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,fill: c.fill,"fill-opacity": c.opacity.currentValue,"pointer-events": "none","shape-rendering": "crispEdges"});
            this.drawing.rectHover = this.createRect(this.container, {"class": "hover-rect cursor-move",fill: "none","shape-rendering": "crispEdges","stroke-width": "15"});
            this.drawing.centerTopHoverCircle = this.createCircle(this.container,
            {"class": "hover-circle cursor-n-resize",r: 8});
            this.drawing.centerRightHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-w-resize",r: 8});
            this.drawing.centerBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-s-resize",r: 8});
            this.drawing.centerLeftHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-e-resize",r: 8});
            this.drawing.leftTopHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-nw-resize",r: 8});
            this.drawing.rightTopHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-ne-resize",r: 8});
            this.drawing.leftBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-sw-resize",r: 8});
            this.drawing.rightBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-se-resize",r: 8});
            this.drawing.circleContainer = this.createG(this.container);
            this.drawing.centerTopCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",
                visibility: "inherit"});
            this.drawing.centerRightCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.centerBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.centerLeftCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.leftTopCircle = this.createCircle(this.drawing.circleContainer,
            {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.rightTopCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.leftBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.rightBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            !(this instanceof E) && this.bindEvents() && this.updateSvgCoordinates()
        };
        P.prototype.setStartingPoint = function(a) {
            a === this.drawing.leftTopHoverCircle || a === this.drawing.centerLeftHoverCircle || a === this.drawing.centerTopHoverCircle ? (this.startingPoint.X = (this.drawing.rect.getAttribute("x") >> 0) + (this.drawing.rect.getAttribute("width") >> 0), this.startingPoint.Y = (this.drawing.rect.getAttribute("y") >> 0) + (this.drawing.rect.getAttribute("height") >> 0)) : a === this.drawing.rightTopHoverCircle ? (this.startingPoint.X =
            this.drawing.rect.getAttribute("x") >> 0, this.startingPoint.Y = (this.drawing.rect.getAttribute("y") >> 0) + (this.drawing.rect.getAttribute("height") >> 0)) : a === this.drawing.rightBottomHoverCircle || a === this.drawing.centerRightHoverCircle || a === this.drawing.centerBottomHoverCircle ? (this.startingPoint.X = this.drawing.rect.getAttribute("x") >> 0, this.startingPoint.Y = this.drawing.rect.getAttribute("y") >> 0) : a === this.drawing.leftBottomHoverCircle && (this.startingPoint.X = (this.drawing.rect.getAttribute("x") >> 0) + (this.drawing.rect.getAttribute("width") >>
            0), this.startingPoint.Y = this.drawing.rect.getAttribute("y") >> 0);
            this.positioned = !0
        };
        P.prototype.updateSvgCoordinates = function() {
            var a, b, c, e;
            a = +this.drawing.rect.getAttribute("x");
            b = +this.drawing.rect.getAttribute("y");
            c = +this.drawing.rect.getAttribute("width");
            e = +this.drawing.rect.getAttribute("height");
            d.setAttributes(this.drawing.rectHover, {x: a,y: b,width: c,height: e});
            d.setAttributes(this.drawing.leftTopCircle, {cx: a,cy: b});
            d.setAttributes(this.drawing.leftTopHoverCircle, {cx: a,cy: b});
            d.setAttributes(this.drawing.centerTopCircle,
            {cx: a + c / 2,cy: b});
            d.setAttributes(this.drawing.centerTopHoverCircle, {cx: a + c / 2,cy: b});
            d.setAttributes(this.drawing.rightTopCircle, {cx: a + c,cy: b});
            d.setAttributes(this.drawing.rightTopHoverCircle, {cx: a + c,cy: b});
            d.setAttributes(this.drawing.centerRightCircle, {cx: a + c,cy: b + e / 2});
            d.setAttributes(this.drawing.centerRightHoverCircle, {cx: a + c,cy: b + e / 2});
            d.setAttributes(this.drawing.rightBottomCircle, {cx: a + c,cy: b + e});
            d.setAttributes(this.drawing.rightBottomHoverCircle, {cx: a + c,cy: b + e});
            d.setAttributes(this.drawing.centerBottomCircle,
            {cx: a + c / 2,cy: b + e});
            d.setAttributes(this.drawing.centerBottomHoverCircle, {cx: a + c / 2,cy: b + e});
            d.setAttributes(this.drawing.leftBottomCircle, {cx: a,cy: b + e});
            d.setAttributes(this.drawing.leftBottomHoverCircle, {cx: a,cy: b + e});
            d.setAttributes(this.drawing.centerLeftCircle, {cx: a,cy: b + e / 2});
            d.setAttributes(this.drawing.centerLeftHoverCircle, {cx: a,cy: b + e / 2})
        };
        P.prototype.show = function(a) {
            P.superclass.show.call(this, a || this.drawing.rectHover);
            var b;
            this === w && d.setAttributes(this.drawing.circleContainer, {visibility: "visible"});
            if (d.hasSvgClass(this.target, "hover-circle"))
                for (b in this.drawing)
                    this.drawing[b] === this.target && (a = b.toString().indexOf("Hover"), a = b.toString().substring(0, a) + "Circle", d.setAttributes(this.drawing[a], {visibility: "visible"}))
        };
        P.prototype.hide = function() {
            P.superclass.hide.call(this);
            var a;
            this !== w && d.setAttributes(this.drawing.circleContainer, {visibility: "hidden"});
            for (a = 0; a < this.drawing.circleContainer.childNodes.length; a++)
                "visible" === this.drawing.circleContainer.childNodes[a].getAttribute("visibility") &&
                d.setAttributes(this.drawing.circleContainer.childNodes[a], {visibility: "inherit"});
            this !== w && this.params.startTimestamp === this.params.endTimestamp && P.prototype.destroy.call(this)
        };
        P.prototype.move = function(a, b) {
            var c = this.chart.svg.mouseXposition - a, e = this.chart.svg.mouseYposition - b, k;
            this.updateValues();
            this.positioned || P.prototype.setStartingPoint.call(this, this.target);
            k = this.target;
            q.isInVisibleArea.call(this, a, b) && (this.target === this.drawing.rectHover ? d.setAttributes(this.drawing.rect, {x: +this.drawing.rect.getAttribute("x") -
                c,y: +this.drawing.rect.getAttribute("y") - e}) : this.target !== this.drawing.centerLeftHoverCircle && this.target !== this.drawing.centerBottomHoverCircle && this.target !== this.drawing.centerRightHoverCircle && this.target !== this.drawing.centerTopHoverCircle ? this.startingPoint.X < a && this.startingPoint.Y < b ? (d.setAttributes(this.drawing.rect, {x: this.startingPoint.X,y: this.startingPoint.Y,width: Math.abs(this.startingPoint.X - a),height: Math.abs(this.startingPoint.Y - b)}), this.target = this.drawing.rightBottomHoverCircle) :
            this.startingPoint.X < a && this.startingPoint.Y > b ? (d.setAttributes(this.drawing.rect, {x: this.startingPoint.X,y: b,width: Math.abs(this.startingPoint.X - a),height: Math.abs(this.startingPoint.Y - b)}), this.target = this.drawing.rightTopHoverCircle) : this.startingPoint.X > a && this.startingPoint.Y > b ? (d.setAttributes(this.drawing.rect, {x: a,y: b,width: Math.abs(this.startingPoint.X - a),height: Math.abs(this.startingPoint.Y - b)}), this.target = this.drawing.leftTopHoverCircle) : this.startingPoint.X > a && this.startingPoint.Y < b &&
            (d.setAttributes(this.drawing.rect, {x: a,y: this.startingPoint.Y,width: Math.abs(this.startingPoint.X - a),height: Math.abs(this.startingPoint.Y - b)}), this.target = this.drawing.leftBottomHoverCircle) : this.target === this.drawing.centerRightHoverCircle || this.target === this.drawing.centerLeftHoverCircle ? this.startingPoint.X < a ? (d.setAttributes(this.drawing.rect, {x: this.startingPoint.X,width: Math.abs(this.startingPoint.X - a)}), this.target = this.drawing.centerRightHoverCircle) : this.startingPoint.X > a && (d.setAttributes(this.drawing.rect,
            {x: a,width: Math.abs(this.startingPoint.X - a)}), this.target = this.drawing.centerLeftHoverCircle) : this.startingPoint.Y < b ? (d.setAttributes(this.drawing.rect, {y: this.startingPoint.Y,height: Math.abs(this.startingPoint.Y - b)}), this.target = this.drawing.centerBottomHoverCircle) : this.startingPoint.Y > b && (d.setAttributes(this.drawing.rect, {y: b,height: Math.abs(this.startingPoint.Y - b)}), this.target = this.drawing.centerTopHoverCircle), this.target !== k && (d.removeSvgClass(k, "active"), P.prototype.show.call(this, this.target)),
            this.updateSvgCoordinates(), this.chart.svg.mouseXposition = a, this.chart.svg.mouseYposition = b)
        };
        P.prototype.snap = function() {
            this.updateValues();
            var a, b;
            a = q.getMousePositionCandleInfo(+this.drawing.rect.getAttribute("x"), +this.drawing.rect.getAttribute("y"), this.mainChart, this.chart.options);
            b = q.getMousePositionCandleInfo(+this.drawing.rect.getAttribute("x") + +this.drawing.rect.getAttribute("width"), +this.drawing.rect.getAttribute("y") + +this.drawing.rect.getAttribute("height"), this.mainChart, this.chart.options);
            this.params.startTimestamp = a.currentCandleTimestamp;
            this.params.endTimestamp = b.currentCandleTimestamp;
            this.params.period = this.mainChart.options.period;
            this.params.startPrice = (+a.price).toFixed(this.chart.options.precision);
            this.params.endPrice = (+b.price).toFixed(this.chart.options.precision);
            a = (a.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            d.setAttributes(this.drawing.rect, {x: a,width: (b.candleNumber - this.mainChart.currentOffset) *
                this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX - a});
            this.positioned = !1;
            this.updateSvgCoordinates();
            A.prototype.snap.call(this)
        };
        P.prototype.changeStyles = function(a) {
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.rect, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color,fill: a.fill,"fill-opacity": a.opacity.currentValue})
        };
        P.prototype.update = function() {
            if (this.snapped) {
                var a, b;
                a = q.calculateCoordinates(this, this.params.startTimestamp,
                this.params.startPrice);
                b = q.calculateCoordinates(this, this.params.endTimestamp, this.params.endPrice);
                d.setAttributes(this.drawing.rect, {x: a.X,y: a.Y,width: b.X - a.X,height: b.Y - a.Y,visibility: "visible"});
                !1 === a.show && !1 === b.show ? d.setAttributes(this.container, {display: "none"}) : d.setAttributes(this.container, {display: "inline"})
            }
            this.updateSvgCoordinates()
        };
        P.prototype.parse = function() {
            this.snapped = !0;
            w = null;
            this.update();
            this.hide();
            return this
        };
        P.prototype.destroy = function() {
            this.positioned = this.startingPoint =
            null;
            P.superclass.destroy.call(this)
        };
        l.inherit(O, A);
        O.prototype.render = function(a, b) {
            var c = this.params.editable.styles[this.params.name];
            this.container = this.container || this.createG(this.chart.svg.$svgGdrawing, {"class": this.params.code});
            this.drawing = this.drawing || {};
            this.drawing.path = this.createPath(this.container, {x: a,y: b,width: 1,height: 1,d: "M " + a + "," + b,"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,fill: c.fill,"fill-opacity": c.opacity.currentValue,"pointer-events": "none",
                "shape-rendering": "crispEdges"});
            this.drawing.hoverPath = this.createPath(this.container, {d: "M " + a + "," + b,"stroke-linecap": "square","class": "hover-rect cursor-move",fill: "none","stroke-width": "15"});
            this.drawing.centerTopHoverCircle = this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.centerRightHoverCircle = this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.centerBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.centerLeftHoverCircle =
            this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.leftTopHoverCircle = this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.rightTopHoverCircle = this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.leftBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.rightBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.circleContainer = this.createG(this.container);
            this.drawing.centerTopCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.centerRightCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.centerBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.centerLeftCircle = this.createCircle(this.drawing.circleContainer,
            {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.leftTopCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.rightTopCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.leftBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.rightBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            !(this instanceof E) && this.bindEvents() && this.updateSvgCoordinates()
        };
        O.prototype.updateSvgCoordinates = function() {
            var a, b, c, e;
            a = +this.drawing.path.getAttribute("x");
            b = +this.drawing.path.getAttribute("y");
            c = +this.drawing.path.getAttribute("width");
            e = +this.drawing.path.getAttribute("height");
            this instanceof Z || (d.setAttributes(this.drawing.path, {d: "M " + a +
                "," + b + " h " + c + " v " + e + " h " + -c + " v " + -e}), d.setAttributes(this.drawing.hoverPath, {d: "M " + a + "," + b + " h " + c + " v " + e + " h " + -c + " v " + -e}));
            d.setAttributes(this.drawing.leftTopCircle, {cx: a,cy: b});
            d.setAttributes(this.drawing.leftTopHoverCircle, {cx: a,cy: b});
            d.setAttributes(this.drawing.centerTopCircle, {cx: a + c / 2,cy: b});
            d.setAttributes(this.drawing.centerTopHoverCircle, {cx: a + c / 2,cy: b});
            d.setAttributes(this.drawing.rightTopCircle, {cx: a + c,cy: b});
            d.setAttributes(this.drawing.rightTopHoverCircle, {cx: a + c,cy: b});
            d.setAttributes(this.drawing.centerRightCircle, {cx: a + c,cy: b + e / 2});
            d.setAttributes(this.drawing.centerRightHoverCircle, {cx: a + c,cy: b + e / 2});
            d.setAttributes(this.drawing.rightBottomCircle, {cx: a + c,cy: b + e});
            d.setAttributes(this.drawing.rightBottomHoverCircle, {cx: a + c,cy: b + e});
            d.setAttributes(this.drawing.centerBottomCircle, {cx: a + c / 2,cy: b + e});
            d.setAttributes(this.drawing.centerBottomHoverCircle, {cx: a + c / 2,cy: b + e});
            d.setAttributes(this.drawing.leftBottomCircle, {cx: a,cy: b + e});
            d.setAttributes(this.drawing.leftBottomHoverCircle,
            {cx: a,cy: b + e});
            d.setAttributes(this.drawing.centerLeftCircle, {cx: a,cy: b + e / 2});
            d.setAttributes(this.drawing.centerLeftHoverCircle, {cx: a,cy: b + e / 2})
        };
        O.prototype.show = function(a) {
            O.superclass.show.call(this, a || this.drawing.hoverPath);
            var b;
            this === w && d.setAttributes(this.drawing.circleContainer, {visibility: "visible"});
            if (d.hasSvgClass(this.target, "hover-circle"))
                for (b in this.drawing)
                    this.drawing[b] === this.target && (a = b.toString().indexOf("Hover"), a = b.toString().substring(0, a) + "Circle", d.setAttributes(this.drawing[a],
                    {visibility: "visible"}))
        };
        O.prototype.hide = function() {
            O.superclass.hide.call(this);
            var a;
            this !== w && d.setAttributes(this.drawing.circleContainer, {visibility: "hidden"});
            for (a = 0; a < this.drawing.circleContainer.childNodes.length; a++)
                "visible" === this.drawing.circleContainer.childNodes[a].getAttribute("visibility") && d.setAttributes(this.drawing.circleContainer.childNodes[a], {visibility: "inherit"});
            this !== w && this.params.startTimestamp === this.params.endTimestamp && O.prototype.destroy.call(this)
        };
        O.prototype.move =
        function(a, b) {
            var c = this.chart.svg.mouseXposition - a, e = this.chart.svg.mouseYposition - b;
            this.updateValues();
            q.isInVisibleArea.call(this, a, b) && (this.target === this.drawing.hoverPath ? d.setAttributes(this.drawing.path, {x: +this.drawing.path.getAttribute("x") - c,y: +this.drawing.path.getAttribute("y") - e}) : (this.target !== this.drawing.centerLeftHoverCircle && this.target !== this.drawing.centerRightHoverCircle && (this.target === this.drawing.leftTopHoverCircle || this.target === this.drawing.centerTopHoverCircle || this.target ===
            this.drawing.rightTopHoverCircle ? d.setAttributes(this.drawing.path, {y: +this.drawing.path.getAttribute("y") - e,height: +this.drawing.path.getAttribute("height") + e}) : (this.target === this.drawing.leftBottomHoverCircle || this.target === this.drawing.centerBottomHoverCircle || this.target === this.drawing.rightBottomHoverCircle) && d.setAttributes(this.drawing.path, {height: +this.drawing.path.getAttribute("height") - e})), this.target !== this.drawing.centerTopHoverCircle && this.target !== this.drawing.centerBottomHoverCircle &&
            (this.target === this.drawing.leftTopHoverCircle || this.target === this.drawing.centerLeftHoverCircle || this.target === this.drawing.leftBottomHoverCircle ? d.setAttributes(this.drawing.path, {x: +this.drawing.path.getAttribute("x") - c,width: +this.drawing.path.getAttribute("width") + c}) : (this.target === this.drawing.rightTopHoverCircle || this.target === this.drawing.centerRightHoverCircle || this.target === this.drawing.rightBottomHoverCircle) && d.setAttributes(this.drawing.path, {width: +this.drawing.path.getAttribute("width") -
                c}))), this.updateSvgCoordinates(), this.chart.svg.mouseXposition = a, this.chart.svg.mouseYposition = b)
        };
        O.prototype.snap = function() {
            this.updateValues();
            var a, b;
            a = q.getMousePositionCandleInfo(+this.drawing.path.getAttribute("x"), +this.drawing.path.getAttribute("y"), this.mainChart, this.chart.options);
            b = q.getMousePositionCandleInfo(+this.drawing.path.getAttribute("x") + +this.drawing.path.getAttribute("width"), +this.drawing.path.getAttribute("y") + +this.drawing.path.getAttribute("height"), this.mainChart,
            this.chart.options);
            this.params.startTimestamp = a.currentCandleTimestamp;
            this.params.endTimestamp = b.currentCandleTimestamp;
            this.params.period = this.mainChart.options.period;
            this.params.startPrice = (+a.price).toFixed(this.chart.options.precision);
            this.params.endPrice = (+b.price).toFixed(this.chart.options.precision);
            a = (a.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            d.setAttributes(this.drawing.path, {x: a,width: (b.candleNumber -
                this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX - a});
            this.positioned = !1;
            this.updateSvgCoordinates();
            A.prototype.snap.call(this)
        };
        O.prototype.changeStyles = function(a) {
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.path, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color,fill: a.fill,"fill-opacity": a.opacity.currentValue})
        };
        O.prototype.update = function() {
            if (this.snapped) {
                var a, b;
                a = q.calculateCoordinates(this,
                this.params.startTimestamp, this.params.startPrice);
                b = q.calculateCoordinates(this, this.params.endTimestamp, this.params.endPrice);
                d.setAttributes(this.drawing.path, {x: a.X,y: a.Y,width: b.X - a.X,height: b.Y - a.Y,visibility: "visible"});
                !1 === a.show && !1 === b.show ? d.setAttributes(this.container, {display: "none"}) : d.setAttributes(this.container, {display: "inline"})
            }
            this.updateSvgCoordinates()
        };
        O.prototype.parse = function() {
            this.snapped = !0;
            w = null;
            this.update();
            this.hide();
            return this
        };
        O.prototype.destroy = function() {
            this.positioned =
            null;
            O.superclass.destroy.call(this)
        };
        l.inherit(C, O);
        C.prototype.render = function(a, b) {
            C.superclass.render.call(this, a, b);
            var c = this.params.editable.font["Label Font"];
            this.clipPath = this.createClipPath(this.chart.svg.$svgDefs, {id: "labelClipPath" + la});
            this.clipRect = this.createRect(this.clipPath, {fill: "rgba(0,0,0,0)",stroke: "rgba(0,0,0,0)","shape-rendering": "crispEdges","pointer-events": "none"});
            this.drawing.textContainer = this.createRect(this.container, {"class": "text-container","shape-rendering": "crispEdges"});
            this.drawing.text = this.createText(this.container, {"class": "text","clip-path": "url(#labelClipPath" + la + ")",fill: c.color,"font-size": c.fontSize,"font-family": "arial","text-decoration": c.fontStyles.underline,"font-weight": c.fontStyles.bold,"font-style": c.fontStyles.italic,"pointer-events": "none"});
            this.drawing.text.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
            this.bindEvents();
            this.updateSvgCoordinates()
        };
        C.prototype.bindEvents = function() {
            C.superclass.bindEvents.call(this);
            d.addEvent(this.drawing.textContainer, "dblclick", this._mouseDoubleClick)
        };
        C.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            var a, b, c, e;
            C.superclass.updateSvgCoordinates.call(this);
            a = +this.drawing.rect.getAttribute("x");
            b = +this.drawing.rect.getAttribute("y");
            c = +this.drawing.rect.getAttribute("width");
            e = +this.drawing.rect.getAttribute("height");
            0 > c - 16 || 0 > e - 16 ? (d.setAttributes(this.drawing.textContainer, {x: a + 8,y: b + 8,width: 1,height: 1}), d.setAttributes(this.clipRect, {x: a + 8,y: b + 8,width: 1,
                height: 1})) : (d.setAttributes(this.drawing.textContainer, {x: a + 8,y: b + 8,width: c - 16,height: e - 16}), d.setAttributes(this.clipRect, {x: a + 8,y: b + 8,width: c - 16,height: e - 16}));
            d.setAttributes(this.drawing.text, {x: a + 8,y: b + 8});
            for (b = 0; b < this.drawing.text.childNodes.length; b++)
                d.setAttributes(this.drawing.text.childNodes[b], {x: a + 8,dy: +this.params.editable.font["Label Font"].fontSize + 4});
            this.editing && this.areaContainerCoordinatesCheck()
        };
        C.prototype.handleMouseDoubleClickEvent = function(a) {
            this.createTextArea();
            a.stopPropagation();
            a.preventDefault()
        };
        C.prototype.editText = function() {
            "block" === this.area_container.style.display && (this.input.focus(), this.editing = !0, d.setAttributes(this.area_container, {"class": "area_container editable"}), d.setAttributes(this.drawing.textContainer, {"class": "text-container cursor-text"}), d.setAttributes(this.drawing.text, {display: "none"}))
        };
        C.prototype.createTextArea = function() {
            this.editing || (this.area_container = d.createElement("div"), this.chart.$chartLayer.appendChild(this.area_container), this.input =
            d.createElement("textarea"), this.input.value = this.params.text, d.setAttributes(this.input, {"class": "input-area",maxlength: "100","white-space": "pre"}), this.area_container.style.display = "block", this.input.style.fontSize = this.drawing.text.getAttribute("font-size") + "px", this.input.style.textDecoration = this.drawing.text.getAttribute("text-decoration"), this.input.style.fontWeight = this.drawing.text.getAttribute("font-weight"), this.input.style.fontStyle = this.drawing.text.getAttribute("font-style"), this.input.style.color =
            this.drawing.text.getAttribute("fill"), d.addEvent(this.input, "keydown", this._inputKeyDown), this.areaContainerCoordinatesCheck(), this.area_container.appendChild(this.input), this.editText(), C.superclass.hide.call(this))
        };
        C.prototype.areaContainerCoordinatesCheck = function() {
            var a = +this.drawing.rect.getAttribute("x") + 8, b = +this.drawing.rect.getAttribute("y") + 8, c = +this.drawing.rect.getAttribute("width") - 16, d = +this.drawing.rect.getAttribute("height") - 16, c = a + c < this.maxX ? c : this.maxX - a, d = b + d < this.maxY ? d : this.maxY -
            b;
            this.area_container.style.top = b + "px";
            this.area_container.style.left = a + "px";
            this.area_container.style.width = c + "px";
            this.area_container.style.height = d + "px"
        };
        C.prototype.inputKeyDown = function() {
            setTimeout(this._inputKeyUp, 1)
        };
        C.prototype.inputKeyUp = function() {
            this.input.value.length > this.params.maxTextLength && (this.input.value = this.params.text);
            this.params.text = this.input.value;
            this.areaContainerCoordinatesCheck()
        };
        C.prototype.splitText = function(a) {
            var b, c;
            this.drawing.text.textContent = null;
            a = a.split("\n");
            for (b = 0; b < a.length; b++)
                c = this.createTspan(this.drawing.text), c.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"), d.setAttributes(c, {fill: "inherit",x: +this.drawing.text.getAttribute("x"),dy: +this.params.editable.font["Label Font"].fontSize + 4,style: "inherit","pointer-events": "none"}), c.textContent = 0 === a[b].length ? " " : a[b];
            d.setAttributes(this.drawing.text, {display: "block"})
        };
        C.prototype.applyLineBreaks = function() {
            var a, b, c, e, k;
            this.input.wrap ? d.setAttributes(this.input, {wrap: "off"}) :
            (d.setAttributes(this.input, {wrap: "off"}), a = this.input.cloneNode(!0), a.value = this.input.value, this.input.parentNode.replaceChild(a, this.input), this.input = a);
            this.params.text = this.input.value;
            this.input.value = "";
            a = this.input.scrollWidth;
            b = -1;
            for (c = 0; c < this.params.text.length; c++) {
                e = this.params.text.charAt(c);
                if (" " === e || "-" === e || "+" === e)
                    b = c;
                this.input.value += e;
                if (this.input.scrollWidth > a) {
                    k = "";
                    if (0 <= b) {
                        for (b += 1; b < c; b++)
                            k += this.params.text.charAt(b);
                        b = -1
                    }
                    k += e;
                    this.input.value = this.input.value.substr(0,
                    this.input.value.length - k.length);
                    this.input.value += "\n" + k
                }
            }
            a = this.input.value;
            this.input.value = this.params.text;
            d.setAttributes(this.input, {wrap: ""});
            return a
        };
        C.prototype.destroyEditingWindow = function() {
            this.editing = !1;
            d.setAttributes(this.drawing.textContainer, {"class": "text-container"});
            this.area_container && (this.area_container.removeChild(this.input), this.chart.$chartLayer.removeChild(this.area_container));
            d.removeEvent(this.input, "keydown", this._inputKeyDown);
            this.area_container = this.input =
            null;
            this.mainChart.$container.focus()
        };
        C.prototype.move = function(a, b) {
            this.target === this.drawing.textContainer && (this.target = this.drawing.rectHover);
            this.editing && (this.splitText(this.applyLineBreaks()), this.destroyEditingWindow());
            this.moved = !0;
            C.superclass.move.call(this, a, b)
        };
        C.prototype.snap = function() {
            this.updateValues();
            var a;
            a = q.getMousePositionCandleInfo(+this.drawing.rect.getAttribute("x"), +this.drawing.rect.getAttribute("y"), this.mainChart, this.chart.options);
            this.params.startTimestamp =
            a.currentCandleTimestamp;
            this.params.period = this.mainChart.options.period;
            this.params.width = +this.drawing.rect.getAttribute("width");
            this.params.height = +this.drawing.rect.getAttribute("height");
            this.params.startPrice = (+a.price).toFixed(this.chart.options.precision);
            d.setAttributes(this.drawing.rect, {x: (a.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX});
            this.positioned = !1;
            this.snapped = !0;
            this.moved && this.initialised &&
            (this.createTextArea(), this.splitText(this.applyLineBreaks()), this.destroyEditingWindow(), this.moved = !1);
            !this.initialised && (0 < +this.drawing.rect.getAttribute("width") - 16 && 0 < +this.drawing.rect.getAttribute("height") - 16) && (this.createTextArea(), this.initialised = !0);
            this.updateSvgCoordinates();
            this.editing || A.prototype.snap.call(this)
        };
        C.prototype.changeStyles = function(a) {
            C.superclass.changeStyles.call(this, a);
            a = a.editable.font["Label Font"];
            d.setAttributes(this.drawing.text, {fill: a.color,"font-size": a.fontSize,
                "text-decoration": a.fontStyles.underline,"font-weight": a.fontStyles.bold,"font-style": a.fontStyles.italic});
            this.editing && (this.input.style.fontSize = this.drawing.text.getAttribute("font-size") + "px", this.input.style.textDecoration = this.drawing.text.getAttribute("text-decoration"), this.input.style.fontWeight = this.drawing.text.getAttribute("font-weight"), this.input.style.fontStyle = this.drawing.text.getAttribute("font-style"), this.input.style.color = this.drawing.text.getAttribute("fill"));
            this.updateSvgCoordinates()
        };
        C.prototype.update = function() {
            if (this.snapped) {
                var a;
                a = q.calculateCoordinates(this, this.params.startTimestamp, this.params.startPrice);
                d.setAttributes(this.drawing.rect, {x: a.X,y: a.Y,width: this.params.width,height: this.params.height,visibility: "visible"});
                !1 === a.show ? (d.setAttributes(this.container, {display: "none"}), d.setAttributes(this.drawing.text, {display: "none"})) : d.setAttributes(this.container, {display: "inline"});
                a.show && !this.editing && d.setAttributes(this.drawing.text, {display: "block"});
                this !==
                w && this.hide()
            }
            this.updateSvgCoordinates()
        };
        C.prototype.show = function(a) {
            a === this.drawing.textContainer && (a = this.drawing.rectHover);
            C.superclass.show.call(this, a || this.drawing.rectHover);
            d.setAttributes(this.drawing.rect, {visibility: "visible"})
        };
        C.prototype.hide = function() {
            C.superclass.hide.call(this);
            this !== w && ("none" === this.drawing.rect.getAttribute("fill") && d.setAttributes(this.drawing.rect, {visibility: "hidden"}), this.editing && (this.splitText(this.applyLineBreaks()), this.destroyEditingWindow(),
            this.updateSvgCoordinates(), A.prototype.snap.call(this)), 0 === this.params.text.length && this.destroy())
        };
        C.prototype.parse = function() {
            this.initialised = this.snapped = !0;
            w = null;
            this.update();
            this.createTextArea();
            this.splitText(this.applyLineBreaks());
            this.destroyEditingWindow();
            this.hide();
            return this
        };
        C.prototype.destroy = function() {
            this.area_container && this.destroyEditingWindow();
            d.removeEvent(this.drawing.textContainer, "dblclick", this._mouseDoubleClick);
            this._mouseDoubleClick = null;
            d.empty(this.clipRect,
            !0);
            d.empty(this.clipPath, !0);
            this.clipPath = this.clipRect = this.area_container = this.input = this.moved = this.editing = null;
            C.superclass.destroy.call(this)
        };
        l.inherit(E, O);
        E.prototype.render = function(a, b) {
            E.superclass.render.call(this, a, b);
            var c = this.params.editable.font["Label Font"];
            this.clipPath = this.createClipPath(this.chart.svg.$svgDefs, {id: "labelClipPath" + la});
            this.clipRect = this.createRect(this.clipPath, {fill: "rgba(0,0,0,0)",stroke: "rgba(0,0,0,0)","shape-rendering": "crispEdges","pointer-events": "none"});
            this.drawing.textContainer = this.createRect(this.container, {"class": "text-container","shape-rendering": "crispEdges"});
            this.drawing.text = this.createText(this.container, {"class": "text","clip-path": "url(#labelClipPath" + la + ")",fill: c.color,"font-size": c.fontSize,"font-family": "arial","text-decoration": c.fontStyles.underline,"font-weight": c.fontStyles.bold,"font-style": c.fontStyles.italic,"pointer-events": "none"});
            this.drawing.text.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
            this.bindEvents();
            this.updateSvgCoordinates()
        };
        E.prototype.bindEvents = function() {
            E.superclass.bindEvents.call(this);
            d.addEvent(this.drawing.textContainer, "dblclick", this._mouseDoubleClick)
        };
        E.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            var a, b, c, e, k;
            E.superclass.updateSvgCoordinates.call(this);
            a = +this.drawing.path.getAttribute("x");
            b = +this.drawing.path.getAttribute("y");
            c = +this.drawing.path.getAttribute("width");
            e = +this.drawing.path.getAttribute("height");
            k = {x: null,y: null,width: null,
                height: null};
            k.x = 0 > c ? a + 8 + c : a + 8;
            k.width = -16 < c && 16 > c ? 1 : Math.abs(c) - 16;
            k.y = 0 > e ? b + 8 + e : b + 8;
            k.height = -16 < e && 16 > e ? 1 : Math.abs(e) - 16;
            d.setAttributes(this.drawing.textContainer, k);
            d.setAttributes(this.clipRect, k);
            d.setAttributes(this.drawing.text, {x: k.x,y: k.y});
            for (a = 0; a < this.drawing.text.childNodes.length; a++)
                d.setAttributes(this.drawing.text.childNodes[a], {x: k.x,dy: +this.params.editable.font["Label Font"].fontSize + 4});
            this.editing && this.areaContainerCoordinatesCheck()
        };
        E.prototype.handleMouseDoubleClickEvent =
        function(a) {
            this.createTextArea();
            a.stopPropagation();
            a.preventDefault()
        };
        E.prototype.editText = function() {
            "block" === this.area_container.style.display && (this.input.focus(), this.editing = !0, d.setAttributes(this.area_container, {"class": "area_container editable"}), d.setAttributes(this.drawing.textContainer, {"class": "text-container cursor-text"}), d.setAttributes(this.drawing.text, {display: "none"}))
        };
        E.prototype.createTextArea = function() {
            this.editing || (this.area_container = d.createElement("div"), this.chart.$chartLayer.appendChild(this.area_container),
            this.input = d.createElement("textarea"), this.input.value = this.params.text, d.setAttributes(this.input, {"class": "input-area",maxlength: "100","white-space": "pre"}), this.area_container.style.display = "block", this.input.style.fontSize = this.drawing.text.getAttribute("font-size") + "px", this.input.style.textDecoration = this.drawing.text.getAttribute("text-decoration"), this.input.style.fontWeight = this.drawing.text.getAttribute("font-weight"), this.input.style.fontStyle = this.drawing.text.getAttribute("font-style"),
            this.input.style.color = this.drawing.text.getAttribute("fill"), d.addEvent(this.input, "keydown", this._inputKeyDown), this.areaContainerCoordinatesCheck(), this.area_container.appendChild(this.input), this.editText(), E.superclass.hide.call(this))
        };
        E.prototype.areaContainerCoordinatesCheck = function() {
            var a = +this.drawing.path.getAttribute("x") + 8, b = +this.drawing.path.getAttribute("y") + 8, c = Math.abs(+this.drawing.path.getAttribute("width")) - 16, d = Math.abs(+this.drawing.path.getAttribute("height")) - 16;
            0 > +this.drawing.path.getAttribute("width") &&
            (a -= c + 16);
            0 > +this.drawing.path.getAttribute("height") && (b -= d + 16);
            c = a + c < this.maxX ? c : this.maxX - a;
            d = b + d < this.maxY ? d : this.maxY - b;
            this.area_container.style.top = b + "px";
            this.area_container.style.left = a + "px";
            this.area_container.style.width = c + "px";
            this.area_container.style.height = d + "px"
        };
        E.prototype.inputKeyDown = function() {
            setTimeout(this._inputKeyUp, 1)
        };
        E.prototype.inputKeyUp = function() {
            this.input.value.length > this.maxTextLength && (this.input.value = this.params.text);
            this.params.text = this.input.value;
            this.areaContainerCoordinatesCheck()
        };
        E.prototype.splitText = function(a) {
            var b, c;
            this.drawing.text.textContent = null;
            a = a.split("\n");
            for (b = 0; b < a.length; b++)
                c = this.createTspan(this.drawing.text), c.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"), d.setAttributes(c, {fill: "inherit",x: +this.drawing.text.getAttribute("x"),dy: +this.params.editable.font["Label Font"].fontSize + 4,style: "inherit","pointer-events": "none"}), c.textContent = 0 === a[b].length ? " " : a[b];
            d.setAttributes(this.drawing.text, {display: "block"})
        };
        E.prototype.applyLineBreaks =
        function() {
            var a, b, c, e, k;
            this.input.wrap ? d.setAttributes(this.input, {wrap: "off"}) : (d.setAttributes(this.input, {wrap: "off"}), a = this.input.cloneNode(!0), a.value = this.input.value, this.input.parentNode.replaceChild(a, this.input), this.input = a);
            this.params.text = this.input.value;
            this.input.value = "";
            a = this.input.scrollWidth;
            b = -1;
            for (c = 0; c < this.params.text.length; c++) {
                e = this.params.text.charAt(c);
                if (" " === e || "-" === e || "+" === e)
                    b = c;
                this.input.value += e;
                if (this.input.scrollWidth > a) {
                    k = "";
                    if (0 <= b) {
                        for (b += 1; b < c; b++)
                            k +=
                            this.params.text.charAt(b);
                        b = -1
                    }
                    k += e;
                    this.input.value = this.input.value.substr(0, this.input.value.length - k.length);
                    this.input.value += "\n" + k
                }
            }
            a = this.input.value;
            this.input.value = this.params.text;
            d.setAttributes(this.input, {wrap: ""});
            return a
        };
        E.prototype.destroyEditingWindow = function() {
            this.editing = !1;
            d.setAttributes(this.drawing.textContainer, {"class": "text-container"});
            this.area_container && (this.area_container.removeChild(this.input), this.chart.$chartLayer.removeChild(this.area_container));
            d.removeEvent(this.input,
            "keydown", this._inputKeyDown);
            this.area_container = this.input = null;
            this.mainChart.$container.focus()
        };
        E.prototype.move = function(a, b) {
            this.target === this.drawing.textContainer && (this.target = this.drawing.hoverPath);
            this.editing && (this.splitText(this.applyLineBreaks()), this.destroyEditingWindow());
            this.moved = !0;
            E.superclass.move.call(this, a, b)
        };
        E.prototype.snap = function() {
            this.updateValues();
            var a;
            a = q.getMousePositionCandleInfo(+this.drawing.path.getAttribute("x"), +this.drawing.path.getAttribute("y"),
            this.mainChart, this.chart.options);
            this.params.startTimestamp = a.currentCandleTimestamp;
            this.params.period = this.mainChart.options.period;
            this.params.width = +this.drawing.path.getAttribute("width");
            this.params.height = +this.drawing.path.getAttribute("height");
            this.params.startPrice = (+a.price).toFixed(this.chart.options.precision);
            d.setAttributes(this.drawing.path, {x: (a.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX});
            this.positioned =
            !1;
            this.snapped = !0;
            this.moved && this.initialised && (this.createTextArea(), this.splitText(this.applyLineBreaks()), this.destroyEditingWindow(), this.moved = !1);
            !this.initialised && (0 < +this.drawing.path.getAttribute("width") - 16 && 0 < +this.drawing.path.getAttribute("height") - 16) && (this.createTextArea(), this.initialised = !0);
            this.updateSvgCoordinates();
            this.editing || A.prototype.snap.call(this)
        };
        E.prototype.changeStyles = function(a) {
            E.superclass.changeStyles.call(this, a);
            a = a.editable.font["Label Font"];
            d.setAttributes(this.drawing.text,
            {fill: a.color,"font-size": a.fontSize,"text-decoration": a.fontStyles.underline,"font-weight": a.fontStyles.bold,"font-style": a.fontStyles.italic});
            this.editing && (this.input.style.fontSize = this.drawing.text.getAttribute("font-size") + "px", this.input.style.textDecoration = this.drawing.text.getAttribute("text-decoration"), this.input.style.fontWeight = this.drawing.text.getAttribute("font-weight"), this.input.style.fontStyle = this.drawing.text.getAttribute("font-style"), this.input.style.color = this.drawing.text.getAttribute("fill"));
            this.updateSvgCoordinates()
        };
        E.prototype.update = function() {
            if (this.snapped) {
                var a;
                a = q.calculateCoordinates(this, this.params.startTimestamp, this.params.startPrice);
                d.setAttributes(this.drawing.path, {x: a.X,y: a.Y,width: this.params.width,height: this.params.height,visibility: "visible"});
                !1 === a.show ? (d.setAttributes(this.container, {display: "none"}), d.setAttributes(this.drawing.text, {display: "none"})) : d.setAttributes(this.container, {display: "inline"});
                a.show && !this.editing && d.setAttributes(this.drawing.text,
                {display: "block"});
                this !== w && this.hide()
            }
            this.updateSvgCoordinates()
        };
        E.prototype.show = function(a) {
            a === this.drawing.textContainer && (a = this.drawing.hoverPath);
            E.superclass.show.call(this, a || this.drawing.hoverPath);
            d.setAttributes(this.drawing.path, {visibility: "visible"})
        };
        E.prototype.hide = function() {
            E.superclass.hide.call(this);
            this !== w && ("none" === this.drawing.path.getAttribute("fill") && d.setAttributes(this.drawing.path, {visibility: "hidden"}), this.editing && (this.splitText(this.applyLineBreaks()), this.destroyEditingWindow(),
            this.updateSvgCoordinates(), A.prototype.snap.call(this)), 0 === this.params.text.length && this.destroy())
        };
        E.prototype.parse = function() {
            this.initialised = this.snapped = !0;
            w = null;
            this.update();
            this.createTextArea();
            this.splitText(this.applyLineBreaks());
            this.destroyEditingWindow();
            this.hide();
            return this
        };
        E.prototype.destroy = function() {
            this.area_container && this.destroyEditingWindow();
            d.removeEvent(this.drawing.textContainer, "dblclick", this._mouseDoubleClick);
            this._mouseDoubleClick = null;
            d.empty(this.clipRect,
            !0);
            d.empty(this.clipPath, !0);
            this.clipPath = this.clipRect = this.area_container = this.input = this.moved = this.editing = null;
            E.superclass.destroy.call(this)
        };
        l.inherit(X, G);
        X.prototype.render = function(a, b) {
            X.superclass.render.call(this, a, b);
            this.drawing.text = this.createText(this.container, {style: "font-size: 11px;",fill: this.params.editable.styles[this.params.name].color,"pointer-events": "none"})
        };
        X.prototype.show = function(a) {
            X.superclass.show.call(this, a || this.drawing.hoverLine);
            d.setAttributes(this.drawing.text,
            {visibility: "visible"})
        };
        X.prototype.hide = function() {
            X.superclass.hide.call(this);
            this !== w && d.setAttributes(this.drawing.text, {visibility: "hidden"})
        };
        X.prototype.changeStyles = function(a) {
            X.superclass.changeStyles.call(this, a);
            d.setAttributes(this.drawing.text, {fill: this.params.editable.styles[a.name].color})
        };
        X.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            X.superclass.updateSvgCoordinates.call(this);
            var a = 180 / Math.PI, b, c, e, k, f, g;
            b = +this.drawing.startCircle.getAttribute("cx");
            c = +this.drawing.startCircle.getAttribute("cy");
            e = +this.drawing.endCircle.getAttribute("cx");
            k = +this.drawing.endCircle.getAttribute("cy");
            c !== k ? (g = c > k ? this.minY : this.maxY, f = b + (c - g) / (c - k) * (e - b)) : (g = k, f = b < e ? this.maxX : 0);
            d.setAttributes(this.drawing.line, {x1: b,y1: c,x2: f,y2: g});
            d.setAttributes(this.drawing.hoverLine, {x1: b,y1: c,x2: f,y2: g});
            d.setAttributes(this.drawing.text, {x: e - 45,y: k});
            a = Math.atan2(c - k, e - b) * a + 0.5 | 0;
            b = Math.abs((e - b) / this.mainChart.zoomOptions.candleWidth) + 0.5 | 0;
            this.drawing.text.textContent = b + " / " + a + String.fromCharCode(176)
        };
        l.inherit(S,
        A);
        S.prototype.render = function(a, b) {
            this.startingPoint = {X: a,Y: b};
            var c = this.params.editable.styles[this.params.name];
            this.container = this.createG(this.chart.svg.$svgGdrawing, {"class": this.params.code});
            this.drawing = {};
            this.drawing.ellipse = this.createEllipseOld(this.container, {cx: a,cy: b,rx: 1,ry: 1,"stroke-width": c.lineWidth,stroke: c.color,"stroke-dasharray": c.dashArray,fill: c.fill,"fill-opacity": c.opacity.currentValue,"pointer-events": "none"});
            this.drawing.ellipseHover = this.createEllipseOld(this.container,
            {"class": "hover-ellipse cursor-move",fill: "none","stroke-width": "16"});
            this.drawing.centerTopHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-n-resize",r: 8});
            this.drawing.centerRightHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-w-resize",r: 8});
            this.drawing.centerBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-s-resize",r: 8});
            this.drawing.centerLeftHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-e-resize",
                r: 8});
            this.drawing.leftTopHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-nw-resize",r: 8});
            this.drawing.rightTopHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-ne-resize",r: 8});
            this.drawing.leftBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-sw-resize",r: 8});
            this.drawing.rightBottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle cursor-se-resize",r: 8});
            this.drawing.circleContainer = this.createG(this.container);
            this.drawing.centerTopCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.centerRightCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.centerBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.centerLeftCircle = this.createCircle(this.drawing.circleContainer,
            {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.leftTopCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.rightTopCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.leftBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.drawing.rightBottomCircle = this.createCircle(this.drawing.circleContainer, {"class": "circle",r: 4,"pointer-events": "none",visibility: "inherit"});
            this.bindEvents();
            this.updateSvgCoordinates()
        };
        S.prototype.bindEvents = function() {
            d.addEvent(this.container, "mousedown", this._drawingMouseDownHandler);
            d.addEvent(this.container, "touchstart", this._drawingMouseDownHandler);
            d.addEvent(this.container, "mouseover", this._mouseOverDrawingsHandler);
            d.addEvent(this.container, "contextmenu", this._contextmenu)
        };
        S.prototype.setStartingPoint =
        function(a) {
            a === this.drawing.leftTopHoverCircle || a === this.drawing.centerLeftHoverCircle || a === this.drawing.centerTopHoverCircle ? (this.startingPoint.X = (this.drawing.ellipse.getAttribute("cx") >> 0) + (this.drawing.ellipse.getAttribute("rx") >> 0), this.startingPoint.Y = (this.drawing.ellipse.getAttribute("cy") >> 0) + (this.drawing.ellipse.getAttribute("ry") >> 0)) : a === this.drawing.rightTopHoverCircle ? (this.startingPoint.X = (this.drawing.ellipse.getAttribute("cx") >> 0) - (this.drawing.ellipse.getAttribute("rx") >> 0), this.startingPoint.Y =
            (this.drawing.ellipse.getAttribute("cy") >> 0) + (this.drawing.ellipse.getAttribute("ry") >> 0)) : a === this.drawing.rightBottomHoverCircle || a === this.drawing.centerRightHoverCircle || a === this.drawing.centerBottomHoverCircle ? (this.startingPoint.X = (this.drawing.ellipse.getAttribute("cx") >> 0) - (this.drawing.ellipse.getAttribute("rx") >> 0), this.startingPoint.Y = (this.drawing.ellipse.getAttribute("cy") >> 0) - (this.drawing.ellipse.getAttribute("ry") >> 0)) : a === this.drawing.leftBottomHoverCircle && (this.startingPoint.X = (this.drawing.ellipse.getAttribute("cx") >>
            0) + (this.drawing.ellipse.getAttribute("rx") >> 0), this.startingPoint.Y = (this.drawing.ellipse.getAttribute("cy") >> 0) - (this.drawing.ellipse.getAttribute("ry") >> 0));
            this.positioned = !0
        };
        S.prototype.updateSvgCoordinates = function() {
            var a = +this.drawing.ellipse.getAttribute("cx"), b = +this.drawing.ellipse.getAttribute("cy"), c = +this.drawing.ellipse.getAttribute("rx"), e = +this.drawing.ellipse.getAttribute("ry");
            d.setAttributes(this.drawing.ellipseHover, {cx: a,cy: b,rx: c,ry: e});
            d.setAttributes(this.drawing.leftTopCircle,
            {cx: a - c,cy: b - e});
            d.setAttributes(this.drawing.leftTopHoverCircle, {cx: a - c,cy: b - e});
            d.setAttributes(this.drawing.centerTopCircle, {cx: a,cy: b - e});
            d.setAttributes(this.drawing.centerTopHoverCircle, {cx: a,cy: b - e});
            d.setAttributes(this.drawing.rightTopCircle, {cx: a + c,cy: b - e});
            d.setAttributes(this.drawing.rightTopHoverCircle, {cx: a + c,cy: b - e});
            d.setAttributes(this.drawing.centerRightCircle, {cx: a + c,cy: b});
            d.setAttributes(this.drawing.centerRightHoverCircle, {cx: a + c,cy: b});
            d.setAttributes(this.drawing.rightBottomCircle,
            {cx: a + c,cy: b + e});
            d.setAttributes(this.drawing.rightBottomHoverCircle, {cx: a + c,cy: b + e});
            d.setAttributes(this.drawing.centerBottomCircle, {cx: a,cy: b + e});
            d.setAttributes(this.drawing.centerBottomHoverCircle, {cx: a,cy: b + e});
            d.setAttributes(this.drawing.leftBottomCircle, {cx: a - c,cy: b + e});
            d.setAttributes(this.drawing.leftBottomHoverCircle, {cx: a - c,cy: b + e});
            d.setAttributes(this.drawing.centerLeftCircle, {cx: a - c,cy: b});
            d.setAttributes(this.drawing.centerLeftHoverCircle, {cx: a - c,cy: b})
        };
        S.prototype.show = function(a) {
            S.superclass.show.call(this,
            a || this.drawing.ellipseHover);
            var b;
            this === w && d.setAttributes(this.drawing.circleContainer, {visibility: "visible"});
            if (d.hasSvgClass(this.target, "hover-circle"))
                for (b in this.drawing)
                    this.drawing[b] === this.target && (a = b.toString().indexOf("Hover"), a = b.toString().substring(0, a) + "Circle", d.setAttributes(this.drawing[a], {visibility: "visible"}))
        };
        S.prototype.hide = function() {
            S.superclass.hide.call(this);
            var a;
            this !== w && d.setAttributes(this.drawing.circleContainer, {visibility: "hidden"});
            for (a = 0; a < this.drawing.circleContainer.childNodes.length; a++)
                "visible" ===
                this.drawing.circleContainer.childNodes[a].getAttribute("visibility") && d.setAttributes(this.drawing.circleContainer.childNodes[a], {visibility: "inherit"});
            this !== w && this.params.startTimestamp === this.params.endTimestamp && this.destroy()
        };
        S.prototype.move = function(a, b) {
            var c = this.chart.svg.mouseXposition - a, e = this.chart.svg.mouseYposition - b, k, f, g;
            this.updateValues();
            this.positioned || this.setStartingPoint(this.target);
            g = this.target;
            k = Math.abs((this.startingPoint.X - a) / 2) + 0.5 | 0;
            f = Math.abs((this.startingPoint.Y -
            b) / 2) + 0.5 | 0;
            q.isInVisibleArea.call(this, a, b) && (this.target === this.drawing.ellipseHover ? d.setAttributes(this.drawing.ellipse, {cx: +this.drawing.ellipse.getAttribute("cx") - c,cy: +this.drawing.ellipse.getAttribute("cy") - e}) : this.target !== this.drawing.centerLeftHoverCircle && this.target !== this.drawing.centerBottomHoverCircle && this.target !== this.drawing.centerRightHoverCircle && this.target !== this.drawing.centerTopHoverCircle ? this.startingPoint.X < a && this.startingPoint.Y < b ? (d.setAttributes(this.drawing.ellipse,
            {cx: this.startingPoint.X + k,cy: this.startingPoint.Y + f,rx: k,ry: f}), this.target = this.drawing.rightBottomHoverCircle) : this.startingPoint.X < a && this.startingPoint.Y > b ? (d.setAttributes(this.drawing.ellipse, {cx: this.startingPoint.X + k,cy: this.startingPoint.Y - f,rx: k,ry: f}), this.target = this.drawing.rightTopHoverCircle) : this.startingPoint.X > a && this.startingPoint.Y > b ? (d.setAttributes(this.drawing.ellipse, {cx: this.startingPoint.X - k,cy: this.startingPoint.Y - f,rx: k,ry: f}), this.target = this.drawing.leftTopHoverCircle) :
            this.startingPoint.X > a && this.startingPoint.Y < b && (d.setAttributes(this.drawing.ellipse, {cx: this.startingPoint.X - k,cy: this.startingPoint.Y + f,rx: k,ry: f}), this.target = this.drawing.leftBottomHoverCircle) : this.target === this.drawing.centerRightHoverCircle || this.target === this.drawing.centerLeftHoverCircle ? this.startingPoint.X < a ? (d.setAttributes(this.drawing.ellipse, {cx: this.startingPoint.X + k,rx: k}), this.target = this.drawing.centerRightHoverCircle) : (d.setAttributes(this.drawing.ellipse, {cx: this.startingPoint.X -
                k,rx: k}), this.target = this.drawing.centerLeftHoverCircle) : this.startingPoint.Y < b ? (d.setAttributes(this.drawing.ellipse, {cy: this.startingPoint.Y + f,ry: f}), this.target = this.drawing.centerBottomHoverCircle) : (d.setAttributes(this.drawing.ellipse, {cy: this.startingPoint.Y - f,ry: f}), this.target = this.drawing.centerTopHoverCircle), this.target !== g && (d.removeSvgClass(g, "active"), this.show(this.target)), this.updateSvgCoordinates(), this.chart.svg.mouseXposition = a, this.chart.svg.mouseYposition = b)
        };
        S.prototype.snap =
        function() {
            this.updateValues();
            var a, b;
            a = q.getMousePositionCandleInfo(+this.drawing.ellipse.getAttribute("cx") - +this.drawing.ellipse.getAttribute("rx"), +this.drawing.ellipse.getAttribute("cy") - +this.drawing.ellipse.getAttribute("ry"), this.mainChart, this.chart.options);
            b = q.getMousePositionCandleInfo(+this.drawing.ellipse.getAttribute("cx") + +this.drawing.ellipse.getAttribute("rx"), +this.drawing.ellipse.getAttribute("cy") + +this.drawing.ellipse.getAttribute("ry"), this.mainChart, this.chart.options);
            this.params.startTimestamp = a.currentCandleTimestamp;
            this.params.endTimestamp = b.currentCandleTimestamp;
            this.params.period = this.mainChart.options.period;
            this.params.startPrice = (+a.price).toFixed(this.chart.options.precision);
            this.params.endPrice = (+b.price).toFixed(this.chart.options.precision);
            a = (a.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            b = (Math.abs(a - ((b.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth +
            this.mainChart.zoomOptions.barWidth / 2 + this.minX)) + 0.5 | 0) / 2;
            d.setAttributes(this.drawing.ellipse, {cx: a + b,rx: b});
            this.positioned = !1;
            this.updateSvgCoordinates();
            A.prototype.snap.call(this)
        };
        S.prototype.changeStyles = function(a) {
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.ellipse, {"stroke-width": a.lineWidth,stroke: a.color,"stroke-dasharray": a.dashArray,fill: a.fill,"fill-opacity": a.opacity.currentValue})
        };
        S.prototype.update = function() {
            if (this.snapped) {
                var a, b, c, e;
                a = q.calculateCoordinates(this,
                this.params.startTimestamp, this.params.startPrice);
                b = q.calculateCoordinates(this, this.params.endTimestamp, this.params.endPrice);
                c = (Math.abs(a.X - b.X) + 0.5 | 0) / 2;
                e = (Math.abs(a.Y - b.Y) + 0.5 | 0) / 2;
                d.setAttributes(this.drawing.ellipse, {cx: a.X + c,cy: a.Y + e,rx: c,ry: e,visibility: "visible"});
                !1 === a.show && !1 === b.show ? d.setAttributes(this.container, {display: "none"}) : d.setAttributes(this.container, {display: "inline"})
            }
            this.updateSvgCoordinates()
        };
        S.prototype.parse = function() {
            this.snapped = !0;
            w = null;
            this.update();
            this.hide();
            return this
        };
        S.prototype.destroy = function() {
            this.chart.svg.$svgGdrawing && (d.empty(this.container), this.chart.svg.$svgGdrawing.removeChild(this.container));
            d.removeEvent(this.container, "mousedown", this._drawingMouseDownHandler);
            d.removeEvent(this.container, "touchstart", this._drawingMouseDownHandler);
            d.removeEvent(this.container, "mouseover", this._mouseOverDrawingsHandler);
            d.removeEvent(this.container, "mouseout", this._mouseOutDrawingHandler);
            this.positioned = this.container = this.drawing = this.startingPoint =
            null;
            S.superclass.destroy.call(this)
        };
        l.inherit(Z, O);
        Z.prototype.render = function(a, b) {
            var c = this.params.editable.styles[this.params.name];
            this.container = this.createG(this.chart.svg.$svgGdrawing, {"class": this.params.code});
            this.drawing = {};
            this.drawing.ellipse = this.createEllipse(this.container, {cx: a,cy: b,rx: 1,ry: 1,"stroke-width": c.lineWidth,stroke: c.color,"stroke-dasharray": c.dashArray,fill: c.fill,"fill-opacity": c.opacity.currentValue,"pointer-events": "none"});
            this.drawing.ellipseHover = this.createEllipse(this.container,
            {"class": "hover-ellipse cursor-move",fill: "none","stroke-width": "16"});
            Z.superclass.render.call(this, a, b)
        };
        Z.prototype.updateSvgCoordinates = function() {
            Z.superclass.updateSvgCoordinates.call(this);
            var a, b, c, e;
            a = +this.drawing.path.getAttribute("x");
            b = +this.drawing.path.getAttribute("y");
            c = +this.drawing.path.getAttribute("width");
            e = +this.drawing.path.getAttribute("height");
            d.setAttributes(this.drawing.ellipse, {cx: a + c / 2,cy: b + e / 2,rx: Math.abs(c / 2),ry: Math.abs(e / 2)});
            d.setAttributes(this.drawing.ellipseHover,
            {cx: a + c / 2,cy: b + e / 2,rx: Math.abs(c / 2),ry: Math.abs(e / 2)})
        };
        Z.prototype.move = function(a, b) {
            var c = this.chart.svg.mouseXposition - a, e = this.chart.svg.mouseYposition - b;
            q.isInVisibleArea.call(this, a, b) && this.target === this.drawing.ellipseHover && d.setAttributes(this.drawing.path, {x: +this.drawing.path.getAttribute("x") - c,y: +this.drawing.path.getAttribute("y") - e});
            Z.superclass.move.call(this, a, b)
        };
        Z.prototype.changeStyles = function(a) {
            Z.superclass.changeStyles.call(this, a);
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.ellipse, {"stroke-width": a.lineWidth,stroke: a.color,"stroke-dasharray": a.dashArray,fill: a.fill,"fill-opacity": a.opacity.currentValue})
        };
        l.inherit(Q, A);
        Q.prototype.render = function(a, b) {
            var c = this.params.editable.styles[this.params.name];
            this.container = this.createG(this.chart.svg.$svgGdrawing, {"class": this.params.code});
            this.drawing = {};
            this.drawing.path = this.createPath(this.container, {d: "M " + a + "," + b + " L" + (a + 100) + "," + b + " L" + a + "," + b + " Z","stroke-dasharray": c.dashArray,"stroke-width": c.lineWidth,
                stroke: c.color,fill: c.fill,"fill-opacity": c.opacity.currentValue,"pointer-events": "none"});
            this.drawing.hoverPath = this.createPath(this.container, {"class": "hover-path cursor-move",d: "M " + a + "," + b + " L" + (a + 100) + "," + b + " L" + a + "," + b + " Z","stroke-width": 13,"stroke-linecap": "round",fill: "none"});
            this.drawing.firstCircle = this.createCircle(this.container, {cx: a,cy: b,r: 4,"pointer-events": "none"});
            this.drawing.firstHoverCircle = this.createCircle(this.container, {"class": "hover-circle",cx: a,cy: b,r: 8});
            this.drawing.secondCircle =
            this.createCircle(this.container, {cx: a + 100,cy: b,r: 4,"pointer-events": "none"});
            this.drawing.secondHoverCircle = this.createCircle(this.container, {"class": "hover-circle",cx: a + 100,cy: b,r: 8});
            this.drawing.thirdCircle = this.createCircle(this.container, {cx: a,cy: b,r: 4,"pointer-events": "none"});
            this.drawing.thirdHoverCircle = this.createCircle(this.container, {"class": "hover-circle",cx: a,cy: b,r: 8});
            this.bindEvents()
        };
        Q.prototype.bindEvents = function() {
            Q.superclass.bindEvents.call(this);
            this.chart instanceof D ||
            (d.addEvent(this.drawing.firstHoverCircle, "dblclick", this._mouseDoubleClick), d.addEvent(this.drawing.secondHoverCircle, "dblclick", this._mouseDoubleClick), d.addEvent(this.drawing.thirdHoverCircle, "dblclick", this._mouseDoubleClick))
        };
        Q.prototype.handleMouseDoubleClickEvent = function(a) {
            this.updateValues();
            var b, c;
            b = q.getMousePositionCandleInfo(+a.target.getAttribute("cx"), +a.target.getAttribute("cy"), this.mainChart, this.chart.options);
            c = b.price.toFixed(this.chart.options.precision);
            b = b.currentCandle;
            void 0 !== b && (Math.abs(b.high - c) > Math.abs(b.low - c) ? c = b.low : c = b.high, c = (+this.minValue + (this.heightY + this.minY) / this.ratio - c) * this.ratio + 0.5 | 0, d.setAttributes(a.target, {cy: c}), this.snap())
        };
        Q.prototype.updateSvgCoordinates = function() {
            var a = +this.drawing.firstHoverCircle.getAttribute("cx"), b = +this.drawing.secondHoverCircle.getAttribute("cx"), c = +this.drawing.thirdHoverCircle.getAttribute("cx"), e = +this.drawing.firstHoverCircle.getAttribute("cy"), k = +this.drawing.secondHoverCircle.getAttribute("cy"), f = +this.drawing.thirdHoverCircle.getAttribute("cy");
            e === k ? (e += 0.5, k += 0.5) : e === f ? (e += 0.5, f += 0.5) : f === k && (f += 0.5, k += 0.5);
            d.setAttributes(this.drawing.firstCircle, {cx: a,cy: e});
            d.setAttributes(this.drawing.secondCircle, {cx: b,cy: k});
            d.setAttributes(this.drawing.thirdCircle, {cx: c,cy: f});
            d.setAttributes(this.drawing.path, {d: "M " + a + "," + e + " L" + b + "," + k + " L" + c + "," + f + " Z"});
            d.setAttributes(this.drawing.hoverPath, {d: "M " + a + "," + e + " L" + b + "," + k + " L" + c + "," + f + " Z"})
        };
        Q.prototype.move = function(a, b) {
            var c = a - this.chart.svg.mouseXposition, e = b - this.chart.svg.mouseYposition;
            this.updateValues();
            q.isInVisibleArea.call(this, a, b) && (this.target === this.drawing.hoverPath ? (d.setAttributes(this.drawing.firstHoverCircle, {cx: +this.drawing.firstHoverCircle.getAttribute("cx") + c,cy: +this.drawing.firstHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.secondHoverCircle, {cx: +this.drawing.secondHoverCircle.getAttribute("cx") + c,cy: +this.drawing.secondHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.thirdHoverCircle, {cx: +this.drawing.thirdHoverCircle.getAttribute("cx") +
                c,cy: +this.drawing.thirdHoverCircle.getAttribute("cy") + e})) : d.setAttributes(this.target, {cx: a,cy: b}), this.updateSvgCoordinates(), this.chart.svg.mouseXposition = a, this.chart.svg.mouseYposition = b)
        };
        Q.prototype.snap = function() {
            this.updateValues();
            var a, b, c;
            a = q.getMousePositionCandleInfo(+this.drawing.firstHoverCircle.getAttribute("cx"), +this.drawing.firstHoverCircle.getAttribute("cy"), this.mainChart, this.chart.options);
            b = q.getMousePositionCandleInfo(+this.drawing.secondHoverCircle.getAttribute("cx"),
            +this.drawing.secondHoverCircle.getAttribute("cy"), this.mainChart, this.chart.options);
            c = q.getMousePositionCandleInfo(+this.drawing.thirdHoverCircle.getAttribute("cx"), +this.drawing.thirdHoverCircle.getAttribute("cy"), this.mainChart, this.chart.options);
            this.params.firstTimestamp = a.currentCandleTimestamp;
            this.params.secondTimestamp = b.currentCandleTimestamp;
            this.params.thirdTimestamp = c.currentCandleTimestamp;
            this.params.period = this.mainChart.options.period;
            this.params.firstPrice = (+a.price).toFixed(this.chart.options.precision);
            this.params.secondPrice = (+b.price).toFixed(this.chart.options.precision);
            this.params.thirdPrice = (+c.price).toFixed(this.chart.options.precision);
            a = (a.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            b = (b.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            c = (c.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth +
            this.mainChart.zoomOptions.barWidth / 2 + this.minX;
            d.setAttributes(this.drawing.firstHoverCircle, {cx: a});
            d.setAttributes(this.drawing.secondHoverCircle, {cx: b});
            d.setAttributes(this.drawing.thirdHoverCircle, {cx: c});
            this.initialised || (this.initialised = !0);
            this.updateSvgCoordinates();
            A.prototype.snap.call(this)
        };
        Q.prototype.snapdate = function() {
            var a, b, c, e, k, f;
            this.target === this.drawing.firstHoverCircle ? (b = this.drawing.secondHoverCircle, c = this.drawing.thirdHoverCircle, e = this.params.secondTimestamp, k = this.params.thirdTimestamp,
            a = this.params.secondPrice, f = this.params.thirdPrice) : this.target === this.drawing.secondHoverCircle ? (b = this.drawing.firstHoverCircle, c = this.drawing.thirdHoverCircle, e = this.params.firstTimestamp, k = this.params.thirdTimestamp, a = this.params.firstPrice, f = this.params.thirdPrice) : this.target === this.drawing.thirdHoverCircle && (b = this.drawing.firstHoverCircle, c = this.drawing.secondHoverCircle, e = this.params.firstTimestamp, k = this.params.secondTimestamp, a = this.params.firstPrice, f = this.params.secondPrice);
            if (this.initialised &&
            !(void 0 === b || void 0 === c))
                a = q.calculateCoordinates(this, e, a), k = q.calculateCoordinates(this, k, f), d.setAttributes(b, {cx: a.X,cy: a.Y}), d.setAttributes(c, {cx: k.X,cy: k.Y});
            this.updateSvgCoordinates()
        };
        Q.prototype.changeStyles = function(a) {
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.path, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color,fill: a.fill,"fill-opacity": a.opacity.currentValue})
        };
        Q.prototype.update = function() {
            if (this.snapped) {
                var a, b, c;
                a = q.calculateCoordinates(this,
                this.params.firstTimestamp, this.params.firstPrice);
                b = q.calculateCoordinates(this, this.params.secondTimestamp, this.params.secondPrice);
                c = q.calculateCoordinates(this, this.params.thirdTimestamp, this.params.thirdPrice);
                d.setAttributes(this.drawing.firstHoverCircle, {cx: a.X,cy: a.Y});
                d.setAttributes(this.drawing.secondHoverCircle, {cx: b.X,cy: b.Y});
                d.setAttributes(this.drawing.thirdHoverCircle, {cx: c.X,cy: c.Y});
                !1 === a.show && !1 === b.show && !1 === c.show ? d.setAttributes(this.container, {display: "none"}) : d.setAttributes(this.container,
                {display: "inline"});
                this.updateSvgCoordinates()
            } else
                this.snapdate()
        };
        Q.prototype.show = function(a) {
            Q.superclass.show.call(this, a || this.drawing.hoverPath);
            this === w && (d.setAttributes(this.drawing.firstCircle, {visibility: "visible"}), d.setAttributes(this.drawing.secondCircle, {visibility: "visible"}), d.setAttributes(this.drawing.thirdCircle, {visibility: "visible"}));
            this.target === this.drawing.firstHoverCircle ? d.setAttributes(this.drawing.firstCircle, {visibility: "visible"}) : this.target === this.drawing.secondHoverCircle ?
            d.setAttributes(this.drawing.secondCircle, {visibility: "visible"}) : this.target === this.drawing.thirdHoverCircle && d.setAttributes(this.drawing.thirdCircle, {visibility: "visible"})
        };
        Q.prototype.hide = function() {
            Q.superclass.hide.call(this);
            this !== w && (d.setAttributes(this.drawing.firstCircle, {visibility: "hidden"}), d.setAttributes(this.drawing.secondCircle, {visibility: "hidden"}), d.setAttributes(this.drawing.thirdCircle, {visibility: "hidden"}))
        };
        Q.prototype.parse = function() {
            this.initialised = this.snapped = !0;
            w = null;
            this.update();
            this.hide();
            return this
        };
        Q.prototype.destroy = function() {
            this.chart instanceof D || (d.removeEvent(this.drawing.firstHoverCircle, "dblclick", this._mouseDoubleClick), d.removeEvent(this.drawing.secondHoverCircle, "dblclick", this._mouseDoubleClick), d.removeEvent(this.drawing.thirdHoverCircle, "dblclick", this._mouseDoubleClick));
            G.superclass.destroy.call(this)
        };
        l.inherit(J, G);
        J.prototype.render = function(a, b) {
            var c = 13 * (this.chart.options.height / 100), d = this.params.editable.styles[this.params.name];
            J.superclass.render.call(this, a, b);
            this.drawing.topLine = this.createLine(this.container, {"stroke-width": d.lineWidth,"stroke-dasharray": d.dashArray,stroke: d.color,"pointer-events": "none"});
            this.drawing.bottomLine = this.createLine(this.container, {"stroke-width": d.lineWidth,"stroke-dasharray": d.dashArray,stroke: d.color,"pointer-events": "none"});
            this.drawing.connectingLine = this.createLine(this.container, {x1: a,y1: b - c,x2: a,y2: b + c,"stroke-dasharray": d.dashArray,"stroke-width": d.lineWidth,stroke: d.color,"pointer-events": "none"});
            this.drawing.topCircle = this.createCircle(this.container, {"class": "circle",cx: a,cy: b - c,r: 4,"pointer-events": "none"});
            this.drawing.topHoverCircle = this.createCircle(this.container, {"class": "hover-circle",cx: a,cy: b - c,r: 8});
            this.drawing.bottomCircle = this.createCircle(this.container, {"class": "circle",cx: a,cy: b + c,r: 4,"pointer-events": "none"});
            this.drawing.bottomHoverCircle = this.createCircle(this.container, {"class": "hover-circle",cx: a,cy: b + c,r: 8})
        };
        J.prototype.handleMouseDoubleClickEvent = function(a) {
            var b;
            b = +this.drawing.endHoverCircle.getAttribute("cy");
            J.superclass.handleMouseDoubleClickEvent.call(this, a);
            b = +this.drawing.endHoverCircle.getAttribute("cy") - b;
            a = +this.drawing.bottomHoverCircle.getAttribute("cy") + b;
            b = +this.drawing.topHoverCircle.getAttribute("cy") + b;
            d.setAttributes(this.drawing.topHoverCircle, {cy: b});
            d.setAttributes(this.drawing.bottomHoverCircle, {cy: a});
            this.snap()
        };
        J.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            var a, b, c, e, k, f, g, h, l, p, m, n, q, s;
            J.superclass.updateSvgCoordinates.call(this);
            a = +this.drawing.startHoverCircle.getAttribute("cx");
            b = +this.drawing.startHoverCircle.getAttribute("cy");
            c = +this.drawing.endHoverCircle.getAttribute("cx");
            e = +this.drawing.endHoverCircle.getAttribute("cy");
            g = this.drawing.topHoverCircle.getAttribute("cx") >> 0;
            p = this.drawing.topHoverCircle.getAttribute("cy") >> 0;
            m = this.drawing.bottomHoverCircle.getAttribute("cx") >> 0;
            n = this.drawing.bottomHoverCircle.getAttribute("cy") >> 0;
            f = h = l = b > e ? this.minY : this.maxY;
            b !== e ? (s = b < e ? this.maxY : this.minY, k = a + (b - s) / (b - e) * (c - a),
            q = a - (c - g) + (b - (e - p) - s) / (b - e) * (c - a), s = a - (c - m) + (b + (n - e) - s) / (b - e) * (c - a)) : (s = a < c ? q = k = this.maxX : q = k = 0, f = e, h = e - (e - p), l = e - (e - n));
            a === c && (m += 0.5, g += 0.5, q += 0.5, s += 0.5);
            n === p && (n += 0.5, p += 0.5);
            m === g && (m += 0.5, g += 0.5);
            d.setAttributes(this.drawing.line, {x1: a,y1: b,x2: k,y2: f});
            d.setAttributes(this.drawing.hoverLine, {x1: a,y1: b,x2: k,y2: f});
            d.setAttributes(this.drawing.topCircle, {cx: +this.drawing.topHoverCircle.getAttribute("cx"),cy: +this.drawing.topHoverCircle.getAttribute("cy")});
            d.setAttributes(this.drawing.topLine,
            {x1: g,y1: p,x2: q,y2: h});
            d.setAttributes(this.drawing.bottomCircle, {cx: this.drawing.bottomHoverCircle.getAttribute("cx"),cy: this.drawing.bottomHoverCircle.getAttribute("cy")});
            d.setAttributes(this.drawing.bottomLine, {x1: m,y1: n,x2: s,y2: l});
            d.setAttributes(this.drawing.connectingLine, {x1: g,y1: p,x2: m,y2: n})
        };
        J.prototype.show = function(a) {
            J.superclass.show.call(this, a || this.drawing.hoverLine);
            this === w && (d.setAttributes(this.drawing.topCircle, {visibility: "visible"}), d.setAttributes(this.drawing.bottomCircle,
            {visibility: "visible"}));
            this.target === this.drawing.topHoverCircle ? d.setAttributes(this.drawing.topCircle, {visibility: "visible"}) : this.target === this.drawing.bottomHoverCircle && d.setAttributes(this.drawing.bottomCircle, {visibility: "visible"})
        };
        J.prototype.hide = function() {
            J.superclass.hide.call(this);
            this !== w && (d.setAttributes(this.drawing.topCircle, {visibility: "hidden"}), d.setAttributes(this.drawing.bottomCircle, {visibility: "hidden"}))
        };
        J.prototype.move = function(a, b) {
            this.updateValues();
            var c = a - this.chart.svg.mouseXposition,
            e = b - this.chart.svg.mouseYposition;
            q.isInVisibleArea.call(this, a, b) && (this.target === this.drawing.topHoverCircle ? (d.setAttributes(this.drawing.topHoverCircle, {cx: +this.drawing.topHoverCircle.getAttribute("cx") + c,cy: +this.drawing.topHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.endHoverCircle, {cx: +this.drawing.endHoverCircle.getAttribute("cx") + c / 2,cy: +this.drawing.endHoverCircle.getAttribute("cy") + e / 2})) : this.target === this.drawing.bottomHoverCircle ? (d.setAttributes(this.drawing.bottomHoverCircle,
            {cx: +this.drawing.bottomHoverCircle.getAttribute("cx") + c,cy: +this.drawing.bottomHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.endHoverCircle, {cx: +this.drawing.endHoverCircle.getAttribute("cx") + c / 2,cy: +this.drawing.endHoverCircle.getAttribute("cy") + e / 2})) : this.target === this.drawing.endHoverCircle ? (d.setAttributes(this.drawing.endHoverCircle, {cx: +this.drawing.endHoverCircle.getAttribute("cx") + c,cy: +this.drawing.endHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.topHoverCircle,
            {cx: +this.drawing.topHoverCircle.getAttribute("cx") + c,cy: +this.drawing.topHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.bottomHoverCircle, {cx: +this.drawing.bottomHoverCircle.getAttribute("cx") + c,cy: +this.drawing.bottomHoverCircle.getAttribute("cy") + e})) : this.target === this.drawing.startHoverCircle ? d.setAttributes(this.drawing.startHoverCircle, {cx: +this.drawing.startHoverCircle.getAttribute("cx") + c,cy: +this.drawing.startHoverCircle.getAttribute("cy") + e}) : this.target === this.drawing.hoverLine &&
            (d.setAttributes(this.drawing.topHoverCircle, {cx: +this.drawing.topHoverCircle.getAttribute("cx") + c,cy: +this.drawing.topHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.bottomHoverCircle, {cx: +this.drawing.bottomHoverCircle.getAttribute("cx") + c,cy: +this.drawing.bottomHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.startHoverCircle, {cx: +this.drawing.startHoverCircle.getAttribute("cx") + c,cy: +this.drawing.startHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.endHoverCircle,
            {cx: +this.drawing.endHoverCircle.getAttribute("cx") + c,cy: +this.drawing.endHoverCircle.getAttribute("cy") + e})), this.updateSvgCoordinates(), this.chart.svg.mouseXposition = a, this.chart.svg.mouseYposition = b)
        };
        J.prototype.snapdate = function() {
            var a, b, c, e;
            a = +this.drawing.endHoverCircle.getAttribute("cy");
            b = +this.drawing.endHoverCircle.getAttribute("cx");
            J.superclass.snapdate.call(this);
            c = +this.drawing.endHoverCircle.getAttribute("cy") - a;
            a = +this.drawing.endHoverCircle.getAttribute("cx") - b;
            b = +this.drawing.bottomHoverCircle.getAttribute("cy") +
            c;
            e = +this.drawing.topHoverCircle.getAttribute("cy") + c;
            c = +this.drawing.bottomHoverCircle.getAttribute("cx") + a;
            a = +this.drawing.topHoverCircle.getAttribute("cx") + a;
            d.setAttributes(this.drawing.topHoverCircle, {cx: a,cy: e});
            d.setAttributes(this.drawing.bottomHoverCircle, {cx: c,cy: b});
            this.updateSvgCoordinates()
        };
        J.prototype.snap = function() {
            var a, b, c;
            b = +this.drawing.endHoverCircle.getAttribute("cx");
            J.superclass.snap.call(this);
            c = q.getMousePositionCandleInfo(+this.drawing.topHoverCircle.getAttribute("cx"),
            +this.drawing.topHoverCircle.getAttribute("cy"), this.mainChart, this.chart.options);
            a = q.getMousePositionCandleInfo(+this.drawing.bottomHoverCircle.getAttribute("cx"), +this.drawing.bottomHoverCircle.getAttribute("cy"), this.mainChart, this.chart.options);
            this.params.topPrice = (+c.price).toFixed(this.chart.options.precision);
            this.params.bottomPrice = (+a.price).toFixed(this.chart.options.precision);
            a = +this.drawing.endHoverCircle.getAttribute("cx") - b;
            b = +this.drawing.bottomHoverCircle.getAttribute("cx") + a;
            a = +this.drawing.topHoverCircle.getAttribute("cx") + a;
            d.setAttributes(this.drawing.topHoverCircle, {cx: a});
            d.setAttributes(this.drawing.bottomHoverCircle, {cx: b});
            this.params.distance = (+this.drawing.endHoverCircle.getAttribute("cx") - +this.drawing.topHoverCircle.getAttribute("cx")) / this.mainChart.zoomOptions.candleWidth;
            this.updateSvgCoordinates();
            A.prototype.snap.call(this)
        };
        J.prototype.changeStyles = function(a) {
            J.superclass.changeStyles.call(this, a);
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.topLine,
            {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color});
            d.setAttributes(this.drawing.bottomLine, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color});
            d.setAttributes(this.drawing.connectingLine, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color})
        };
        J.prototype.update = function() {
            if (this.snapped) {
                var a, b, c;
                J.superclass.update.call(this);
                c = this.params.distance * this.mainChart.zoomOptions.candleWidth;
                a = q.calculateCoordinates(this, this.params.endTimestamp,
                this.params.topPrice);
                b = q.calculateCoordinates(this, this.params.endTimestamp, this.params.bottomPrice);
                d.setAttributes(this.drawing.topHoverCircle, {cx: a.X - c,cy: a.Y});
                d.setAttributes(this.drawing.bottomHoverCircle, {cx: b.X + c,cy: b.Y});
                this.updateSvgCoordinates()
            } else
                this.snapdate()
        };
        l.inherit(M, G);
        M.prototype.render = function(a, b) {
            M.superclass.render.call(this, a, b);
            var c = this.params.editable.styles[this.params.name];
            d.setAttributes(this.drawing.line, {"stroke-dasharray": this.mainChart.options.controls.crossHair.style});
            this.container.insertBefore(this.drawing.line2 = this.createLine(null, {"stroke-width": c.lineWidth,stroke: c.color,"stroke-dasharray": c.dashArray,"pointer-events": "none"}), this.drawing.startCircle);
            this.container.insertBefore(this.drawing.hoverLine2 = this.createLine(null, {"class": "hover-line cursor-move","stroke-width": 13,"stroke-linecap": "round"}), this.drawing.startCircle);
            this.drawing.endCircle2 = this.createCircle(this.container, {r: 4,"pointer-events": "none",visibility: "hidden"});
            this.drawing.endHoverCircle2 =
            this.createCircle(this.container, {"class": "hover-circle",r: 8});
            this.drawing.fibonacciLines = q.seedFibonacci(this.container, this.coeff, "line", {"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,"pointer-events": "none","shape-rendering": "crispEdges"});
            this.drawing.fibonacciLabels = q.seedFibonacci(this.container, this.coeff, "text", {fill: c.color,style: "font-size: 11px;","pointer-events": "none"});
            this.chart instanceof D || this.bindEvents()
        };
        M.prototype.bindEvents = function() {
            d.addEvent(this.drawing.endHoverCircle2,
            "dblclick", this._mouseDoubleClick)
        };
        M.prototype.show = function(a) {
            A.prototype.show.call(this, a || this.drawing.hoverLine);
            this === w && (d.setAttributes(this.drawing.startCircle, {visibility: "visible"}), d.setAttributes(this.drawing.endCircle, {visibility: "visible"}), d.setAttributes(this.drawing.endCircle2, {visibility: "visible"}));
            if (this.target === this.drawing.startHoverCircle)
                d.setAttributes(this.drawing.startCircle, {visibility: "visible"});
            else if (this.target === this.drawing.endHoverCircle)
                d.setAttributes(this.drawing.endCircle,
                {visibility: "visible"});
            else if (this.target === this.drawing.endHoverCircle2)
                d.setAttributes(this.drawing.endCircle2, {visibility: "visible"});
            else if (this.target === this.drawing.hoverLine || this.target === this.drawing.hoverLine2)
                d.addSvgClass(this.drawing.hoverLine, "active"), d.addSvgClass(this.drawing.hoverLine2, "active")
        };
        M.prototype.hide = function() {
            M.superclass.hide.call(this);
            this !== w && d.setAttributes(this.drawing.endCircle2, {visibility: "hidden"});
            if (this.target === this.drawing.hoverLine || this.target ===
            this.drawing.hoverLine2)
                d.removeSvgClass(this.drawing.hoverLine, "active"), d.removeSvgClass(this.drawing.hoverLine2, "active")
        };
        M.prototype.updateSvgCoordinates = function() {
            this.updateValues();
            var a, b, c, e, k, f, g, h;
            M.superclass.updateSvgCoordinates.call(this);
            if (this.initialised) {
                a = +this.drawing.startHoverCircle.getAttribute("cx");
                b = +this.drawing.startHoverCircle.getAttribute("cy");
                c = +this.drawing.endHoverCircle.getAttribute("cx");
                e = +this.drawing.endHoverCircle.getAttribute("cy");
                k = +this.drawing.endHoverCircle2.getAttribute("cx");
                f = +this.drawing.endHoverCircle2.getAttribute("cy");
                g = a < c ? a : c;
                a = g + 2 * Math.abs(a - k);
                d.setAttributes(this.drawing.endCircle2, {cx: k,cy: f});
                d.setAttributes(this.drawing.line2, {x1: c,y1: e,x2: k,y2: f});
                d.setAttributes(this.drawing.hoverLine2, {x1: c,y1: e,x2: k,y2: f});
                k = 0;
                for (h = this.coeff.length; k < h; k++)
                    c = this.coeff[k] * (e - b) + f, d.setAttributes(this.drawing.fibonacciLines[k], {x1: g,y1: c,x2: a,y2: c}), d.setAttributes(this.drawing.fibonacciLabels[k], {x: g,y: c - 1}), this.drawing.fibonacciLabels[k].textContent = (+this.minValue +
                    (this.heightY - c + this.minY) / this.ratio).toFixed(this.chart.options.precision) + " (" + (100 * this.coeff[k]).toFixed(2) + "%)"
            }
        };
        M.prototype.move = function(a, b) {
            this.updateValues();
            var c = a - this.chart.svg.mouseXposition, e = b - this.chart.svg.mouseYposition;
            q.isInVisibleArea.call(this, a, b) && (this.target === this.drawing.hoverLine || this.target === this.drawing.hoverLine2 ? (d.setAttributes(this.drawing.endHoverCircle, {cx: +this.drawing.endHoverCircle.getAttribute("cx") + c,cy: +this.drawing.endHoverCircle.getAttribute("cy") +
                e}), d.setAttributes(this.drawing.startHoverCircle, {cx: +this.drawing.startHoverCircle.getAttribute("cx") + c,cy: +this.drawing.startHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.endHoverCircle2, {cx: +this.drawing.endHoverCircle2.getAttribute("cx") + c,cy: +this.drawing.endHoverCircle2.getAttribute("cy") + e})) : d.setAttributes(this.target, {cx: +this.target.getAttribute("cx") + c,cy: +this.target.getAttribute("cy") + e}), this.chart.svg.mouseXposition = a, this.chart.svg.mouseYposition = b);
            this.updateSvgCoordinates()
        };
        M.prototype.snapdate = function() {
            var a, b, c, e, k, f;
            this.target === this.drawing.endHoverCircle2 ? (b = this.drawing.startHoverCircle, c = this.drawing.endHoverCircle, e = this.params.startTimestamp, k = this.params.endTimestamp, a = this.params.startPrice, f = this.params.endPrice) : this.target === this.drawing.startHoverCircle ? (b = this.drawing.endHoverCircle, c = this.drawing.endHoverCircle2, e = this.params.endTimestamp, k = this.params.endTimestamp2, a = this.params.endPrice, f = this.params.endPrice2) : this.target === this.drawing.endHoverCircle &&
            (b = this.drawing.startHoverCircle, c = this.drawing.endHoverCircle2, e = this.params.startTimestamp, k = this.params.endTimestamp2, a = this.params.startPrice, f = this.params.endPrice2);
            if (this.initialised && !(void 0 === b || void 0 === c))
                a = q.calculateCoordinates(this, e, a), k = q.calculateCoordinates(this, k, f), d.setAttributes(b, {cx: a.X,cy: a.Y}), d.setAttributes(c, {cx: k.X,cy: k.Y});
            this.updateSvgCoordinates()
        };
        M.prototype.snap = function() {
            this.updateValues();
            var a;
            this.initialised || (d.setAttributes(this.drawing.endCircle2, {visibility: "visible"}),
            d.setAttributes(this.drawing.endHoverCircle2, {cx: +this.drawing.endHoverCircle.getAttribute("cx"),cy: +this.drawing.endHoverCircle.getAttribute("cy")}));
            M.superclass.snap.call(this);
            a = q.getMousePositionCandleInfo(+this.drawing.endHoverCircle2.getAttribute("cx"), +this.drawing.endHoverCircle2.getAttribute("cy"), this.mainChart, this.chart.options);
            this.params.endTimestamp2 = a.currentCandleTimestamp;
            this.params.endPrice2 = (+a.price).toFixed(this.chart.options.precision);
            d.setAttributes(this.drawing.endHoverCircle2,
            {cx: (a.candleNumber - this.mainChart.currentOffset) * this.mainChart.zoomOptions.candleWidth + this.mainChart.zoomOptions.barWidth / 2 + this.minX});
            this.updateSvgCoordinates();
            A.prototype.snap.call(this)
        };
        M.prototype.changeStyles = function(a) {
            M.superclass.changeStyles.call(this, a);
            a = this.params.editable.styles[a.name];
            var b = this.coeff.length, c;
            d.setAttributes(this.drawing.line2, {"stroke-width": a.lineWidth,stroke: a.color,"stroke-dasharray": a.dashArray});
            for (c = 0; c < b; c++)
                d.setAttributes(this.drawing.fibonacciLines[c],
                {"stroke-width": a.lineWidth,stroke: a.color,"stroke-dasharray": a.dashArray}), d.setAttributes(this.drawing.fibonacciLabels[c], {fill: a.color})
        };
        M.prototype.update = function() {
            if (this.snapped) {
                var a, b, c;
                a = q.calculateCoordinates(this, this.params.startTimestamp, this.params.startPrice);
                b = q.calculateCoordinates(this, this.params.endTimestamp, this.params.endPrice);
                c = q.calculateCoordinates(this, this.params.endTimestamp2, this.params.endPrice2);
                d.setAttributes(this.drawing.startHoverCircle, {cx: a.X,cy: a.Y});
                d.setAttributes(this.drawing.endHoverCircle,
                {cx: b.X,cy: b.Y});
                d.setAttributes(this.drawing.endHoverCircle2, {cx: c.X,cy: c.Y});
                !1 === a.show || !1 === b.show || !1 === c.show ? d.setAttributes(this.container, {display: "none"}) : d.setAttributes(this.container, {display: "inline"});
                this.updateSvgCoordinates()
            } else
                this.snapdate()
        };
        M.prototype.destroy = function() {
            d.removeEvent(this.drawing.endHoverCircle2, "dblclick", this._mouseDoubleClick);
            M.superclass.destroy.call(this)
        };
        l.inherit(R, G);
        R.prototype.render = function(a, b) {
            R.superclass.render.call(this, a, b);
            this.params.distance =
            this.params.distance || 5 * (this.chart.options.height / 100);
            var c = this.params.editable.styles[this.params.name];
            this.drawing.line2 = this.createLine(this.container, {"stroke-width": c.lineWidth,"stroke-dasharray": c.dashArray,stroke: c.color,"pointer-events": "none"});
            this.drawing.middleCircle = this.createCircle(this.container, {r: 4,"pointer-events": "none"});
            this.drawing.middleHoverCircle = this.createCircle(this.container, {"class": "hover-circle",r: 8})
        };
        R.prototype.updateSvgCoordinates = function() {
            R.superclass.updateSvgCoordinates.call(this);
            var a = +this.drawing.startHoverCircle.getAttribute("cx"), b = +this.drawing.startHoverCircle.getAttribute("cy"), c = +this.drawing.endHoverCircle.getAttribute("cx"), e = +this.drawing.endHoverCircle.getAttribute("cy");
            d.setAttributes(this.drawing.line2, {x1: a,y1: b + this.params.distance,x2: c,y2: e + this.params.distance});
            d.setAttributes(this.drawing.middleCircle, {cx: (a + c) / 2,cy: (b + e) / 2 + this.params.distance});
            d.setAttributes(this.drawing.middleHoverCircle, {cx: (a + c) / 2,cy: (b + e) / 2 + this.params.distance})
        };
        R.prototype.move =
        function(a, b) {
            var c = a - this.chart.svg.mouseXposition, e = b - this.chart.svg.mouseYposition;
            q.isInVisibleArea.call(this, a, b) && (this.target === this.drawing.hoverLine ? (d.setAttributes(this.drawing.startHoverCircle, {cx: +this.drawing.startHoverCircle.getAttribute("cx") + c,cy: +this.drawing.startHoverCircle.getAttribute("cy") + e}), d.setAttributes(this.drawing.endHoverCircle, {cx: +this.drawing.endHoverCircle.getAttribute("cx") + c,cy: +this.drawing.endHoverCircle.getAttribute("cy") + e})) : this.target === this.drawing.middleHoverCircle ?
            this.params.distance += e : d.setAttributes(this.target, {cx: +this.target.getAttribute("cx") + c,cy: +this.target.getAttribute("cy") + e}), this.updateSvgCoordinates(), this.updateMiddleCirclePrice(+this.drawing.middleHoverCircle.getAttribute("cy")), this.chart.svg.mouseXposition = a, this.chart.svg.mouseYposition = b)
        };
        R.prototype.snap = function() {
            R.superclass.snap.call(this);
            this.updateMiddleCirclePrice((+this.drawing.startHoverCircle.getAttribute("cy") + +this.drawing.endHoverCircle.getAttribute("cy")) / 2 + this.params.distance)
        };
        R.prototype.changeStyles = function(a) {
            R.superclass.changeStyles.call(this, a);
            a = this.params.editable.styles[a.name];
            d.setAttributes(this.drawing.line2, {"stroke-width": a.lineWidth,"stroke-dasharray": a.dashArray,stroke: a.color})
        };
        R.prototype.update = function() {
            R.superclass.update.call(this);
            this.params.middleCirclePrice || this.updateMiddleCirclePrice((+this.drawing.startHoverCircle.getAttribute("cy") + +this.drawing.endHoverCircle.getAttribute("cy")) / 2 + this.params.distance);
            this.params.distance = (this.chart.options.marginTop +
            (this.chart.options.axisY.max - this.params.middleCirclePrice) * this.chart.options.axisY.ratio + 0.5 | 0) - (+this.drawing.startHoverCircle.getAttribute("cy") + +this.drawing.endHoverCircle.getAttribute("cy")) / 2;
            this.updateSvgCoordinates()
        };
        R.prototype.show = function(a) {
            R.superclass.show.call(this, a || this.drawing.hoverLine);
            (this === w || a === this.drawing.middleHoverCircle) && d.setAttributes(this.drawing.middleCircle, {visibility: "visible"})
        };
        R.prototype.hide = function() {
            R.superclass.hide.call(this);
            this !== w && d.setAttributes(this.drawing.middleCircle,
            {visibility: "hidden"})
        };
        R.prototype.updateMiddleCirclePrice = function(a) {
            this.params.middleCirclePrice = +(this.chart.options.axisY.min + (this.chart.options.axisY.heightY - a + this.chart.options.marginTop) / +this.chart.options.axisY.ratio).toFixed(this.chart.options.precision)
        };
        N.hline = {params: {code: "hline",name: "Horizontal Line",editable: {styles: {"Horizontal Line": {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: T};
        N.vline = {params: {code: "vline",name: "Vertical Line",editable: {styles: {"Vertical Line": {color: "#808080",
                            lineWidth: 1,dashArray: "0"}}}},constructor: L};
        N["trend-line"] = {params: {code: "trend-line",name: "Trend Line",editable: {styles: {"Trend Line": {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: G};
        N["fibonacci-arc"] = {params: {code: "fibonacci-arc",name: "Fibonacci Arc",editable: {styles: {"Fibonacci Arc": {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: aa};
        N["fibonacci-circles"] = {params: {code: "fibonacci-circles",name: "Fibonacci Circles",editable: {styles: {"Fibonacci Circles": {color: "#808080",
                            lineWidth: 1,dashArray: "0"}}}},constructor: ma};
        N["fibonacci-expansion"] = {params: {code: "fibonacci-expansion",name: "Fibonacci Expansion",editable: {styles: {"Fibonacci Expansion": {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: M};
        N["fibonacci-fan"] = {params: {code: "fibonacci-fan",name: "Fibonacci Fan",editable: {styles: {"Fibonacci Fan": {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: ca};
        N["fibonacci-retracement"] = {params: {code: "fibonacci-retracement",name: "Fibonacci Retracement",editable: {styles: {"Fibonacci Retracement": {color: "#808080",
                            lineWidth: 1,dashArray: "0"}}}},constructor: da};
        N["fibonacci-timezones"] = {params: {code: "fibonacci-timezones",name: "Fibonacci Timezones",editable: {styles: {"Fibonacci Timezones": {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: Y};
        N.ray = {params: {code: "ray",name: "Ray",editable: {styles: {Ray: {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: X};
        N["text-label"] = {params: {code: "text-label",name: "Text Label",editable: {font: {"Label Font": {fontSize: 12,fontStyles: {underline: "none",bold: "none",
                                italic: "none"},color: "#808080"}},styles: {"Text Label": {color: "#808080",lineWidth: 1,dashArray: "0",fill: "none",opacity: {defaultValue: 0.2,currentValue: 0.2}}}}},constructor: E};
        N.rectangle = {params: {code: "rectangle",name: "Rectangle",editable: {styles: {Rectangle: {color: "#808080",lineWidth: 1,dashArray: "0",fill: "none",opacity: {defaultValue: 0.2,currentValue: 0.2}}}}},constructor: O};
        N.ellipse = {params: {code: "ellipse",name: "Ellipse",editable: {styles: {Ellipse: {color: "#808080",lineWidth: 1,dashArray: "0",fill: "none",
                            opacity: {defaultValue: 0.2,currentValue: 0.2}}}}},constructor: Z};
        N.triangle = {params: {code: "triangle",name: "Triangle",editable: {styles: {Triangle: {color: "#808080",lineWidth: 1,dashArray: "0",fill: "none",opacity: {defaultValue: 0.2,currentValue: 0.2}}}}},constructor: Q};
        N.pitchfork = {params: {code: "pitchfork",name: "Andrew's Pitchfork",editable: {styles: {"Andrew's Pitchfork": {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: J};
        N["parallel-channel"] = {params: {code: "parallel-channel",name: "Parallel Channel",
                editable: {styles: {"Parallel Channel": {color: "#808080",lineWidth: 1,dashArray: "0"}}}},constructor: R};
        l.inherit(B, A);
        B.prototype.length = 0;
        B.prototype.splice = [].splice;
        B.prototype.indexOf = [].indexOf;
        B.prototype.size = function() {
            return this.length
        };
        B.prototype.get = function(a) {
            return !a ? this.toArray() : 0 > a ? this[0] : this[a]
        };
        B.prototype.toArray = function() {
            return Array.prototype.slice.call(this)
        };
        B.prototype.each = function(a) {
            this.toArray().forEach(function(b, c) {
                a.call(this, this[c], c, this.toArray())
            }.bind(this));
            return this
        };
        B.prototype.addOpenPosition = function(a) {
            var b = +a.averagePrice.toFixed(this.chart.options.precision), c = this;
            this[this.length] = {code: a.id || a.instrument.code,price: b,ppl: a.ppl,quantity: a.quantity,_quantity: a._quantity,direction: a.direction,ui: {},hide: function() {
                    c.hide(this)
                },show: function() {
                    c.show(this)
                },update: function() {
                    c.update(this)
                },destroy: function() {
                    c.destroyOpenPosition(this)
                }};
            this.chart.options.showOpenPositions && (this.parse(this[this.length]), this.update(this[this.length]), this.chart.options.events.positionCreated.call(this,
            this.get(this.length)));
            this.length++
        };
        B.prototype.updateOpenPosition = function(a) {
            var b;
            for (b = 0; b < this.length; b++)
                if (this[b].code === (a.id || a.instrument.code))
                    this[b].price = +a.averagePrice.toFixed(this.chart.options.precision), this[b].ppl = a.ppl, this[b].quantity = a.quantity, this[b]._quantity = a._quantity, this.chart.options.showOpenPositions && (this.seedTextFields(this[b]), this[b].direction !== a.direction && (d.removeSvgClass(this[b].ui.drawing.container, this[b].direction), d.addSvgClass(this[b].ui.drawing.container,
                    a.direction)), this.update(this[b])), this[b].direction = a.direction
        };
        B.prototype.removeOpenPosition = function(a) {
            var b;
            for (b = 0; b < this.length; b++)
                this[b].code === a && (this.destroyOpenPosition(this[b]), this.splice(this.indexOf(this[b]), 1))
        };
        B.prototype.parse = function(a) {
            this.updateValues();
            a.ui.drawing = {};
            a.ui.drawing.type = "position";
            a.ui.drawing.container = this.createG(this.chart.svg.$svgGposition, {"class": a.ui.drawing.type + " " + a.direction});
            a.ui.drawing.positionLine = this.createLine(a.ui.drawing.container,
            {"class": "position-line","stroke-width": "1","pointer-events": "none","stroke-dasharray": "2, 3","shape-rendering": "crispEdges",visibility: "inherit",x2: this.maxX});
            a.ui.drawing.positionHoverLine = this.createLine(a.ui.drawing.container, {"class": "hover-line","stroke-width": "13",visibility: "inherit",x2: this.maxX});
            a.ui.drawing.positionSeparationLine = this.createLine(a.ui.drawing.container, {"class": "separation-line",visibility: "hidden","stroke-width": "3","pointer-events": "none",y1: -10,y2: 9});
            a.ui.drawing.positionValueRect =
            this.createRect(a.ui.drawing.container, {"class": "value-rect",x: 0,y: -10,height: 19,"stroke-width": "1",rx: "2",ry: "2"});
            a.ui.drawing.positionValueText = this.createText(a.ui.drawing.container, {"class": "value-text","pointer-events": "none",y: 0,dy: 3});
            a.ui.drawing.positionInfoContainer = this.createG(a.ui.drawing.container, {visibility: "hidden","class": "info-container"});
            a.ui.drawing.positionPriceContainer = this.createG(a.ui.drawing.container, {visibility: "hidden",transform: "translate( " + this.maxX + ")"});
            a.ui.drawing.positionQuantityRect =
            this.createRect(a.ui.drawing.positionInfoContainer, {"class": "quantity-rect",y: -10,height: 19,"stroke-width": "1",rx: "2",ry: "2"});
            a.ui.drawing.positionQuantityText = this.createText(a.ui.drawing.positionInfoContainer, {"class": "quantity-text","pointer-events": "none",y: 0,dy: 3});
            a.ui.drawing.positionCloseRect = this.createRect(a.ui.drawing.positionInfoContainer, {"class": "close-rect",y: -10,width: 19,height: 19,rx: "2",ry: "2"});
            a.ui.drawing.positionCloseIcon = this.createImage(a.ui.drawing.positionInfoContainer, {"class": "close-icon",
                y: -10,width: 19,height: 19});
            a.ui.drawing.positionPriceRect = this.createRect(a.ui.drawing.positionPriceContainer, {"class": "price-rect",x: 1,y: -10,width: this.chart.options.marginRight - 1,height: 19,"stroke-width": "1",rx: "2",ry: "2"});
            a.ui.drawing.positionPriceText = this.createText(a.ui.drawing.positionPriceContainer, {"class": "price-text","pointer-events": "none",x: 25,y: 0,dy: 3});
            a.ui.drawing.positionCloseIcon.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.chart.options.staticUrl + "chartposition_close_normal.png");
            this.seedTextFields(a);
            this.bindEvents(a);
            this.chart.svg.drawingEnabled = !1
        };
        B.prototype.bindEvents = function(a) {
            d.addEvent(a.ui.drawing.container, "mousedown", this._drawingMouseDownHandler);
            d.addEvent(a.ui.drawing.container, "mouseover", this._mouseOverPositionHandler);
            d.addEvent(a.ui.drawing.container, "dblclick", this._mouseDoubleClick);
            d.addEvent(a.ui.drawing.positionCloseIcon, "mouseup", this._mouseUp)
        };
        B.prototype.seedTextFields = function(a) {
            a.ui.drawing.positionValueText.textContent = a.ppl;
            a.ui.drawing.positionQuantityText.textContent =
            a.quantity;
            a.ui.drawing.positionPriceText.textContent = a.price.toFixed(this.chart.options.precision)
        };
        B.prototype.handleMouseOverPositionEvent = function(a) {
            var b = l.findPosition(this.chart, a.target);
            void 0 !== b && (a.target === b.ui.drawing.positionCloseIcon && (d.addSvgClass(b.ui.drawing.positionCloseRect, "active"), b.ui.drawing.positionCloseIcon.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.chart.options.staticUrl + "chartposition_close_over.png")), this.show(b, a.target), this.chart.svg.drawingSelected =
            !0, d.removeEvent(b.ui.drawing.container, "mouseover", this._mouseOverPositionHandler), d.addEvent(b.ui.drawing.container, "mouseout", this._mouseOutPositionHandler));
            a.stopPropagation();
            a.preventDefault()
        };
        B.prototype.handleMouseOutPositionEvent = function(a) {
            var b = l.findPosition(this.chart, a.target);
            void 0 !== b && (a.target === b.ui.drawing.positionCloseIcon && (d.removeSvgClass(b.ui.drawing.positionCloseRect, "active"), b.ui.drawing.positionCloseIcon.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.chart.options.staticUrl +
            "chartposition_close_normal.png")), this.hide(b), this.chart.svg.drawingSelected = !1, d.removeEvent(b.ui.drawing.container, "mouseout", this._mouseOutPositionHandler), d.addEvent(b.ui.drawing.container, "mouseover", this._mouseOverPositionHandler));
            a.stopPropagation();
            a.preventDefault()
        };
        B.prototype.handleMouseDoubleClickEvent = function(a) {
            a = l.findPosition(this.chart, a.target);
            void 0 !== a && this.chart.options.events.positionOpened.call(this, a)
        };
        B.prototype.handleMouseUpEvent = function(a) {
            a = l.findPosition(this.chart,
            a.target);
            void 0 !== a && this.chart.options.events.positionClosed.call(this, a)
        };
        B.prototype.show = function(a) {
            d.addSvgClass(a.ui.drawing.container, "active");
            d.setAttributes(a.ui.drawing.positionSeparationLine, {visibility: "inherit"});
            d.setAttributes(a.ui.drawing.positionInfoContainer, {visibility: "inherit"});
            d.setAttributes(a.ui.drawing.positionPriceContainer, {visibility: "inherit"})
        };
        B.prototype.hide = function(a) {
            a !== w && (d.removeSvgClass(a.ui.drawing.container, "active"), d.setAttributes(a.ui.drawing.positionSeparationLine,
            {visibility: "hidden"}), d.setAttributes(a.ui.drawing.positionInfoContainer, {visibility: "hidden"}), d.setAttributes(a.ui.drawing.positionPriceContainer, {visibility: "hidden"}))
        };
        B.prototype.update = function(a) {
            this.updateValues();
            var b = this.chart.options.marginTop + (this.chart.options.axisY.max - a.price) * this.chart.options.axisY.ratio + 0.5 | 0, c = "translate( " + this.minX + ", " + b + ")", e = d.offset(a.ui.drawing.positionValueText).width + 20, k = d.offset(a.ui.drawing.positionQuantityText).width + 20;
            b < this.minY + this.chart.options.axisY.minOffsetTop +
            10 || b > this.maxY - this.chart.options.axisY.minOffsetBottom ? (d.setAttributes(a.ui.drawing.container, {visibility: "hidden"}), this.hide(a)) : (d.setAttributes(a.ui.drawing.container, {visibility: "visible",transform: c}), d.setAttributes(a.ui.drawing.positionValueRect, {width: e}), d.setAttributes(a.ui.drawing.positionValueText, {x: e / 2 + 0.5}), d.setAttributes(a.ui.drawing.positionQuantityRect, {x: e + 1,width: k}), d.setAttributes(a.ui.drawing.positionQuantityText, {x: e + k / 2}), d.setAttributes(a.ui.drawing.positionSeparationLine,
            {x1: e + 0.5,x2: e + 0.5}), d.setAttributes(a.ui.drawing.positionCloseRect, {x: e + k + 2}), d.setAttributes(a.ui.drawing.positionCloseIcon, {x: e + k + 2}))
        };
        B.prototype.updateAll = function() {
            this.each(this.update)
        };
        B.prototype.updateCachedProperties = function() {
            var a = this;
            this.updateValues();
            this.each(function(b) {
                a.chart.svg.$svgGposition && a.chart.options.showOpenPositions && (d.setAttributes(b.ui.drawing.positionLine, {x2: a.maxX}), d.setAttributes(b.ui.drawing.positionHoverLine, {x2: a.maxX}), d.setAttributes(b.ui.drawing.positionPriceContainer,
                {transform: "translate( " + a.maxX + ")"}), a.update(b))
            })
        };
        B.prototype.renderOpenPosition = function() {
            this.chart.svg.$svgGposition = d.createElementNS("http://www.w3.org/2000/svg", "g");
            this.chart.svg.$svg.appendChild(this.chart.svg.$svgGposition)
        };
        B.prototype.toggleOpenPositions = function(a) {
            if (void 0 !== a && this.chart.options.showOpenPositions === a)
                return this.chart.options.showOpenPositions;
            this.chart.options.showOpenPositions = void 0 !== a ? a : !this.chart.options.showOpenPositions;
            this.chart.options.showOpenPositions ?
            (this.each(this.parse), this.updateCachedProperties()) : this.each(this.destroyOpenPosition);
            this.chart.options.events.openPositionsToggled.call(this.chart, this.chart.options.showOpenPositions);
            return this.chart.options.showOpenPositions
        };
        B.prototype.destroyOpenPosition = function(a) {
            this.chart.svg.$svg && (this.chart.svg.$svgGposition && a.ui.drawing && a.ui.drawing.container) && (d.empty(a.ui.drawing.container), this.chart.svg.$svgGposition.removeChild(a.ui.drawing.container), d.removeEvent(a.ui.drawing.container,
            "mouseover", this._mouseOverPositionHandler), d.removeEvent(a.ui.drawing.container, "mouseout", this._mouseOutPositionHandler), d.removeEvent(a.ui.drawing.container, "dblclick", this._mouseDoubleClick), d.removeEvent(a.ui.drawing.positionCloseRect, "mouseup", this._mouseUp));
            w === a && (w = null);
            a.ui = {}
        };
        B.prototype.destroy = function() {
            this.each(this.destroyOpenPosition);
            B.superclass.destroy.call(this)
        };
        l.inherit($, A);
        $.prototype.render = function() {
            this.$svgCurrentGItem = d.createElementNS("http://www.w3.org/2000/svg",
            "g", {visibility: "hidden","class": "current-" + this.options.type.toLowerCase() + "-price"});
            this.chart.svg.$svg.insertBefore(this.$svgCurrentGItem, this.chart.crossHair.$svgG);
            this.$svgCurrentLine = this.createLine(this.$svgCurrentGItem, {"shape-rendering": "crispEdges",x1: this.chart.options.marginLeft,y1: 0.6,x2: this.chart.options.width - this.chart.options.marginRight + 1,y2: 0.6});
            this.$svgCurrentRect = this.createRect(this.$svgCurrentGItem, {x: this.chart.options.width - this.chart.options.marginRight + 1,y: -10,width: this.chart.options.marginRight -
                1,height: 20,fill: this.chart.options.colors.currentRect,"stroke-width": "1",rx: "2",ry: "2"});
            this.$svgCurrentText = this.createText(this.$svgCurrentGItem, {x: this.chart.options.width - this.chart.options.marginRight + 25,y: 0,dy: 4,"class": "svgCurrentText"});
            d.css(this.$svgCurrentLine, {stroke: this.chart.options.colors.currentLine,"stroke-width": "1px","pointer-events": "none"});
            d.css(this.$svgCurrentRect, {"pointer-events": "none"})
        };
        $.prototype.update = function(a) {
            if (this.chart.options["show" + this.options.type + "Price"]) {
                a =
                a || this.chart.options["price" + this.options.type];
                var b = this.chart.options.marginTop + (this.chart.options.axisY.max - a) * this.chart.options.axisY.ratio + 0.5 | 0;
                b < this.chart.options.marginTop || b > this.chart.options.height - this.chart.options.marginBottom || !this.chart.options["show" + this.options.type + "Price"] ? d.setAttributes(this.$svgCurrentGItem, {visibility: "hidden"}) : d.setAttributes(this.$svgCurrentGItem, {visibility: "visible",transform: "translate( 0, " + b + ")"});
                this.$svgCurrentText.textContent = (+a).toFixed(this.chart.options.precision)
            }
        };
        $.prototype.resize = function() {
            d.setAttributes(this.$svgCurrentLine, {x1: this.chart.options.marginLeft,x2: this.chart.options.width - this.chart.options.marginRight + 1});
            d.setAttributes(this.$svgCurrentText, {x: this.chart.options.width - this.chart.options.marginRight + 25});
            d.css(this.$svgCurrentText, {"pointer-events": "none"});
            d.setAttributes(this.$svgCurrentRect, {x: this.chart.options.width - this.chart.options.marginRight + 1,width: this.chart.options.marginRight - 1,height: 20,rx: "2",ry: "2",styles: {stroke: "none",
                    "pointer-events": "none"}})
        };
        $.prototype.toggle = function(a) {
            if (void 0 !== a && this.chart.options["show" + this.options.type + "Price"] === a)
                return this.chart.options["show" + this.options.type + "Price"];
            this.chart.options["show" + this.options.type + "Price"] = void 0 !== a ? a : !this.chart.options["show" + this.options.type + "Price"];
            this.chart.options["show" + this.options.type + "Price"] ? this.update() : this.hide();
            this.chart.options.events["price" + this.options.type + "Toggled"].call(this.chart, this.chart.options["show" + this.options.type +
            "Price"]);
            return this.chart.options["show" + this.options.type + "Price"]
        };
        $.prototype.hide = function() {
            d.setAttributes(this.$svgCurrentGItem, {visibility: "hidden"})
        };
        $.prototype.show = function() {
            d.setAttributes(this.$svgCurrentGItem, {visibility: "visible"})
        };
        $.prototype.destroy = function() {
            $.superclass.destroy.call(this);
            this.$svgCurrentGItem = this.$svgCurrentLine = this.$svgCurrentText = this.$svgCurrentRect = null
        };
        d.hasCanvas() && d.hasSvg() && (ha.init(), this.TraderChart = ha)
    })(window)
});
//@ sourceMappingURL=trader.charts.js.map